"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import type { Email, DetectedFields, InteractionType } from "./data";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCcw, Send, Sparkles } from "lucide-react";

type Filter = "All" | "Detected" | "Undetected" | "Low Confidence";

const interactionTypes: InteractionType[] = [
  "New Request",
  "Follow-up",
  "Quote Sent",
];

const HighlightedBody = ({
  body,
  fields,
}: {
  body: string;
  fields: DetectedFields;
}) => {
  const parts = useMemo(() => {
    const highlights = [
      fields.originCity,
      fields.originState,
      fields.destinationCity,
      fields.destinationState,
      fields.equipment,
      fields.weight,
      fields.targetPrice,
      fields.pickupDate,
      fields.deliveryDate,
    ].filter(Boolean);
    const regex = new RegExp(`(${highlights.join("|")})`, "gi");
    return body.split(regex);
  }, [body, fields]);

  return (
    <p className="whitespace-pre-wrap">
      {parts.map((part, i) =>
        [
          fields.originCity,
          fields.originState,
          fields.destinationCity,
          fields.destinationState,
          fields.equipment,
          fields.weight,
          fields.targetPrice,
          fields.pickupDate,
          fields.deliveryDate,
        ].includes(part) ? (
          <span
            key={i}
            className="underline decoration-wavy decoration-teal-500/50"
          >
            {part}
          </span>
        ) : (
          part
        )
      )}
    </p>
  );
};

export function InboxInspectorClient({
  emails: allEmails,
  detectedFields: allDetectedFields,
}: {
  emails: Email[];
  detectedFields: Record<string, DetectedFields>;
}) {
  const router = useRouter();
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(allEmails[0]);
  const [activeFilter, setActiveFilter] = useState<Filter>("All");
  const [detectedFields, setDetectedFields] = useState(allDetectedFields);

  const filteredEmails = useMemo(() => {
    if (activeFilter === "Detected") {
      return allEmails.filter((e) => detectedFields[e.id]?.confidence >= 80);
    }
    if (activeFilter === "Undetected") {
        return allEmails.filter((e) => !detectedFields[e.id] || detectedFields[e.id]?.confidence < 50);
    }
    if (activeFilter === "Low Confidence") {
        return allEmails.filter((e) => detectedFields[e.id]?.confidence < 80 && detectedFields[e.id]?.confidence >= 50);
    }
    return allEmails;
  }, [activeFilter, allEmails, detectedFields]);

  const currentFields = selectedEmail ? detectedFields[selectedEmail.id] : null;

  const handleFieldChange = (field: keyof DetectedFields, value: string) => {
    if (!selectedEmail) return;
    const newFields = { ...detectedFields };
    (newFields[selectedEmail.id] as any)[field] = value;
    setDetectedFields(newFields);
  };

  const handleReclassify = () => {
    if (!currentFields) return;
    const currentIndex = interactionTypes.indexOf(currentFields.interactionType);
    const nextIndex = (currentIndex + 1) % interactionTypes.length;
    handleFieldChange("interactionType", interactionTypes[nextIndex]);
  };

  const handleLogToSystem = () => {
    if (!currentFields) return;
    // In a real app, this would use global state or an API call.
    // For this mock, we'll use localStorage and navigate.
    const logEntry = {
      ...currentFields,
      timestamp: new Date().toISOString(),
      source: selectedEmail?.sender,
      status: "Logged",
    };
    localStorage.setItem("latestLog", JSON.stringify(logEntry));
    router.push("/extraction-log");
  };

  return (
    <div className="grid h-[calc(100vh-8rem)] grid-cols-10 gap-6">
      {/* Left Pane: Email List */}
      <div className="col-span-10 flex flex-col gap-4 lg:col-span-2">
        <h2 className="text-xl font-semibold">Inbox</h2>
        <div className="flex flex-wrap gap-2">
          {(["All", "Detected", "Undetected", "Low Confidence"] as Filter[]).map(
            (filter) => (
              <Button
                key={filter}
                variant={activeFilter === filter ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter(filter)}
                className="rounded-full"
              >
                {filter}
              </Button>
            )
          )}
        </div>
        <Card className="flex-1 overflow-hidden">
          <CardContent className="h-full overflow-y-auto p-0">
            <div className="flex flex-col">
              {filteredEmails.map((email) => (
                <button
                  key={email.id}
                  onClick={() => setSelectedEmail(email)}
                  className={cn(
                    "border-b p-4 text-left hover:bg-muted/50",
                    selectedEmail?.id === email.id && "bg-muted"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <span className="font-semibold">{email.sender}</span>
                    <Badge
                      variant={
                        email.status === "New Request"
                          ? "default"
                          : email.status === "Follow-up"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {email.status}
                    </Badge>
                  </div>
                  <p className="truncate text-sm font-medium">{email.subject}</p>
                  <p className="truncate text-sm text-muted-foreground">
                    {email.snippet}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {email.receivedAt}
                  </p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Middle Pane: Email Preview */}
      <Card className="col-span-10 lg:col-span-5">
        {selectedEmail && currentFields ? (
          <div className="flex h-full flex-col">
            <CardHeader>
              <CardTitle>{selectedEmail.subject}</CardTitle>
              <div className="text-sm text-muted-foreground">
                <p>
                  <span className="font-medium">From:</span> {selectedEmail.from}
                </p>
                <p>
                  <span className="font-medium">To:</span> {selectedEmail.to}
                </p>
                <p>
                  <span className="font-medium">Date:</span> {selectedEmail.date}
                </p>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden">
              <Tabs defaultValue="formatted" className="flex h-full flex-col">
                <TabsList>
                  <TabsTrigger value="formatted">Formatted</TabsTrigger>
                  <TabsTrigger value="raw">Raw Text</TabsTrigger>
                </TabsList>
                <TabsContent
                  value="formatted"
                  className="mt-4 flex-1 overflow-y-auto"
                >
                  <HighlightedBody
                    body={selectedEmail.body}
                    fields={currentFields}
                  />
                </TabsContent>
                <TabsContent
                  value="raw"
                  className="mt-4 flex-1 overflow-y-auto"
                >
                  <p className="whitespace-pre-wrap">{selectedEmail.body}</p>
                </TabsContent>
              </Tabs>
            </CardContent>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-muted-foreground">Select an email to preview</p>
          </div>
        )}
      </Card>

      {/* Right Pane: Detected Fields */}
      <Card className="col-span-10 lg:col-span-3">
        <CardHeader>
          <CardTitle>Detected Fields</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentFields ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="customer">Customer</Label>
                <Input
                  id="customer"
                  value={currentFields.customer}
                  onChange={(e) => handleFieldChange("customer", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Interaction Type</Label>
                <Select
                  value={currentFields.interactionType}
                  onValueChange={(value) =>
                    handleFieldChange("interactionType", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {interactionTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <p className="font-medium">Lane</p>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Origin City"
                  value={currentFields.originCity}
                  onChange={(e) => handleFieldChange("originCity", e.target.value)}
                />
                <Input
                  placeholder="Origin State"
                  value={currentFields.originState}
                  onChange={(e) => handleFieldChange("originState", e.target.value)}
                />
                <Input
                  placeholder="Dest. City"
                  value={currentFields.destinationCity}
                  onChange={(e) => handleFieldChange("destinationCity", e.target.value)}
                />
                <Input
                  placeholder="Dest. State"
                  value={currentFields.destinationState}
                  onChange={(e) => handleFieldChange("destinationState", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="equipment">Equipment</Label>
                <Input
                  id="equipment"
                  value={currentFields.equipment}
                  onChange={(e) => handleFieldChange("equipment", e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight/Qty</Label>
                  <Input
                    id="weight"
                    value={currentFields.weight}
                    onChange={(e) => handleFieldChange("weight", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rate">Target Price</Label>
                  <Input
                    id="rate"
                    value={currentFields.targetPrice}
                    onChange={(e) => handleFieldChange("targetPrice", e.target.value)}
                  />
                </div>
              </div>
               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <Label htmlFor="pickup">Pickup Date</Label>
                   <Input id="pickup" value={currentFields.pickupDate} onChange={e => handleFieldChange('pickupDate', e.target.value)}/>
                 </div>
                 <div className="space-y-2">
                   <Label htmlFor="delivery">Delivery Date</Label>
                   <Input id="delivery" value={currentFields.deliveryDate} onChange={e => handleFieldChange('deliveryDate', e.target.value)}/>
                 </div>
               </div>
              <p className="text-sm text-muted-foreground">
                ID: {currentFields.messageId}
              </p>
              <div className="flex items-center gap-2">
                <Label>Confidence:</Label>
                <Badge>{currentFields.confidence}%</Badge>
              </div>
              <div className="mt-6 flex flex-col gap-2">
                <Button onClick={handleReclassify}>
                  <RefreshCcw className="mr-2 h-4 w-4" /> Reclassify
                </Button>
                <Button variant="outline">
                  <Sparkles className="mr-2 h-4 w-4" /> Re-extract
                </Button>
                <Button variant="secondary" onClick={handleLogToSystem}>
                  <Send className="mr-2 h-4 w-4" /> Log to System
                </Button>
              </div>
            </>
          ) : (
            <div className="flex h-64 items-center justify-center rounded-md border border-dashed">
                <p className="text-muted-foreground">
                    No fields detected.
                </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
