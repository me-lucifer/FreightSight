
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight } from "lucide-react";


const systemFields = [
    { id: "customer", label: "Customer Name" },
    { id: "interactionType", label: "Interaction Type" },
    { id: "originCity", label: "Origin City" },
    { id: "originState", label: "Origin State" },
    { id: "destinationCity", label: "Destination City" },
    { id: "destinationState", label: "Destination State" },
    { id: "equipment", label: "Equipment Type" },
    { id: "weight", label: "Weight / Quantity" },
    { id: "targetPrice", label: "Target Price / Rate" },
    { id: "pickupDate", label: "Pickup Date" },
    { id: "deliveryDate", label: "Delivery Date" },
    { id: "messageId", label: "Email ID" },
    { id: "confidence", label: "Confidence Score" },
];


export default function FieldMappingPage() {
    const { toast } = useToast();

    const handleSave = () => {
        toast({
            title: "Mapping Saved",
            description: "Your field mapping configuration has been updated.",
        });
    }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Field Mapping</CardTitle>
          <CardDescription>
            Customize how data is mapped from emails to your destination fields.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-x-4 gap-y-2">
            {/* Headers */}
            <Label className="font-semibold text-foreground">System Field</Label>
            <div></div>
            <Label className="font-semibold text-foreground">Destination Field</Label>

            {/* Rows */}
            {systemFields.map((field) => (
                <React.Fragment key={field.id}>
                    <div className="flex h-10 items-center rounded-md border bg-muted px-3 text-sm">
                        {field.label}
                    </div>
                    <ArrowRight className="size-4 text-muted-foreground" />
                    <Input defaultValue={`external_${field.id}`} />
                </React.Fragment>
            ))}

          </div>
        </CardContent>
        <CardFooter>
            <Button onClick={handleSave}>Save Mapping</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
