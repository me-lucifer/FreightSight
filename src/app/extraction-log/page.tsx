
"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronUp,
  FileText,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Slider } from "@/components/ui/slider";
import { mockLogs as initialLogs, type LogEntry } from "./data";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

type SortKey = keyof LogEntry | null;

export default function ExtractionLogPage() {
  const router = useRouter();
  const [logs, setLogs] = useState<LogEntry[]>(initialLogs);
  const [recentlyLogged, setRecentlyLogged] = useState<LogEntry | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [interactionFilters, setInteractionFilters] = useState<string[]>([]);
  const [confidenceRange, setConfidenceRange] = useState([0, 100]);
  const [sortKey, setSortKey] = useState<SortKey>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);

  useEffect(() => {
    const storedLog = localStorage.getItem("latestLog");
    if (storedLog) {
      const parsedLog: LogEntry = JSON.parse(storedLog);
      setRecentlyLogged(parsedLog);
      if (!logs.find((log) => log.messageId === parsedLog.messageId)) {
        setLogs((prevLogs) => [parsedLog, ...prevLogs]);
      }
      localStorage.removeItem("latestLog");
    }
  }, []);

  const handleInteractionFilterChange = (type: string) => {
    setInteractionFilters((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
  };

  const filteredAndSortedLogs = useMemo(() => {
    let filtered = logs
      .filter((log) => {
        const searchTermLower = searchTerm.toLowerCase();
        return (
          log.customer.toLowerCase().includes(searchTermLower) ||
          log.originCity.toLowerCase().includes(searchTermLower) ||
          log.destinationCity.toLowerCase().includes(searchTermLower) ||
          log.equipment.toLowerCase().includes(searchTermLower) ||
          log.messageId.toLowerCase().includes(searchTermLower)
        );
      })
      .filter(
        (log) =>
          interactionFilters.length === 0 ||
          interactionFilters.includes(log.interactionType)
      )
      .filter(
        (log) =>
          log.confidence >= confidenceRange[0] &&
          log.confidence <= confidenceRange[1]
      );

    if (sortKey) {
      filtered.sort((a, b) => {
        const aValue = a[sortKey];
        const bValue = b[sortKey];

        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;
        
        let comparison = 0;
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          comparison = aValue.localeCompare(bValue);
        } else if (typeof aValue === 'number' && typeof bValue === 'number') {
          comparison = aValue - bValue;
        }

        return sortDirection === "asc" ? comparison : -comparison;
      });
    }

    return filtered;
  }, [logs, searchTerm, interactionFilters, confidenceRange, sortKey, sortDirection]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };
  
  const handleEditField = (field: keyof LogEntry, value: string) => {
    if (!selectedLog) return;
    const updatedLog = { ...selectedLog, [field]: value };
    setSelectedLog(updatedLog);
    
    // Also update the main logs array
    setLogs(logs.map(log => log.messageId === selectedLog.messageId ? updatedLog : log));
  };
  
  const toggleVerified = () => {
    if (!selectedLog) return;
    const newStatus = selectedLog.status === "Verified" ? "Logged" : "Verified";
    handleEditField('status', newStatus);
  };

  const renderSortIcon = (key: SortKey) => {
    if (sortKey !== key) return null;
    return sortDirection === "asc" ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      {recentlyLogged && (
        <Card className="bg-teal-50 border-teal-200">
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle>Recently Logged Extraction</CardTitle>
              <CardDescription>
                This entry was just logged from the Inbox Inspector.
              </CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setRecentlyLogged(null)}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm md:grid-cols-4">
              <p>
                <strong>Customer:</strong> {recentlyLogged.customer}
              </p>
              <p>
                <strong>Interaction:</strong> {recentlyLogged.interactionType}
              </p>
              <p>
                <strong>Origin:</strong> {recentlyLogged.originCity},{" "}
                {recentlyLogged.originState}
              </p>
              <p>
                <strong>Destination:</strong> {recentlyLogged.destinationCity},{" "}
                {recentlyLogged.destinationState}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Extraction Log</CardTitle>
          <CardDescription>
            Browse, search, and verify all data extractions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full md:w-auto">
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    Interaction
                    {interactionFilters.length > 0 && (
                      <Badge variant="secondary" className="ml-2 rounded-sm">
                        {interactionFilters.length}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Interaction Type</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {["New Request", "Follow-up", "Quote Sent"].map((type) => (
                    <DropdownMenuCheckboxItem
                      key={type}
                      checked={interactionFilters.includes(type)}
                      onCheckedChange={() => handleInteractionFilterChange(type)}
                    >
                      {type}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full md:w-auto">
                    Confidence: {confidenceRange[0]}-{confidenceRange[1]}%
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 p-4">
                  <Slider
                    value={confidenceRange}
                    onValueChange={setConfidenceRange}
                    max={100}
                    step={1}
                  />
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("timestamp")}>
                    <div className="flex items-center">Logged At {renderSortIcon("timestamp")}</div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("interactionType")}>
                     <div className="flex items-center">Interaction {renderSortIcon("interactionType")}</div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("customer")}>
                     <div className="flex items-center">Customer {renderSortIcon("customer")}</div>
                  </TableHead>
                  <TableHead>Origin</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Equipment</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("confidence")}>
                     <div className="flex items-center">Confidence {renderSortIcon("confidence")}</div>
                  </TableHead>
                   <TableHead className="cursor-pointer" onClick={() => handleSort("status")}>
                     <div className="flex items-center">Status {renderSortIcon("status")}</div>
                   </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedLogs.length > 0 ? (
                  filteredAndSortedLogs.map((log) => (
                    <TableRow key={log.messageId} onClick={() => setSelectedLog(log)} className="cursor-pointer">
                      <TableCell>
                        {new Date(log.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell>{log.interactionType}</TableCell>
                      <TableCell>{log.customer}</TableCell>
                      <TableCell>
                        {log.originCity}, {log.originState}
                      </TableCell>
                      <TableCell>
                        {log.destinationCity}, {log.destinationState}
                      </TableCell>
                      <TableCell>{log.equipment}</TableCell>
                      <TableCell>{log.targetPrice}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            log.confidence > 90 ? "default" : log.confidence > 70 ? "secondary" : "destructive"
                          }
                          className="font-mono"
                        >
                          {log.confidence}%
                        </Badge>
                      </TableCell>
                       <TableCell>
                         <Badge variant={log.status === "Verified" ? "default" : "outline"}>
                           {log.status}
                         </Badge>
                       </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center">
                      No results found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <Sheet open={!!selectedLog} onOpenChange={(open) => !open && setSelectedLog(null)}>
        <SheetContent className="w-full sm:max-w-md p-0">
          {selectedLog && (
            <div className="flex flex-col h-full">
              <SheetHeader className="p-6">
                <SheetTitle>Log Details</SheetTitle>
              </SheetHeader>
              <div className="flex-1 overflow-y-auto px-6 py-2 space-y-4">
                 
                 <DetailSection title="Summary">
                    <DetailRow label="Customer" value={selectedLog.customer} onChange={(val) => handleEditField('customer', val)} />
                    <DetailRow label="Interaction" value={selectedLog.interactionType} onChange={(val) => handleEditField('interactionType', val)} />
                 </DetailSection>

                <Separator />

                 <DetailSection title="Lane">
                    <DetailRow label="Origin" value={`${selectedLog.originCity}, ${selectedLog.originState}`} onChange={(val) => {
                        const parts = val.split(', ');
                        handleEditField('originCity', parts[0] || '');
                        handleEditField('originState', parts[1] || '');
                    }} />
                    <DetailRow label="Destination" value={`${selectedLog.destinationCity}, ${selectedLog.destinationState}`}  onChange={(val) => {
                        const parts = val.split(', ');
                        handleEditField('destinationCity', parts[0] || '');
                        handleEditField('destinationState', parts[1] || '');
                    }}/>
                 </DetailSection>

                <Separator />

                <DetailSection title="Shipment">
                   <DetailRow label="Equipment" value={selectedLog.equipment} onChange={(val) => handleEditField('equipment', val)} />
                   <DetailRow label="Weight" value={selectedLog.weight} onChange={(val) => handleEditField('weight', val)} />
                </DetailSection>

                <Separator />

                <DetailSection title="Pricing & Dates">
                    <DetailRow label="Target Price" value={selectedLog.targetPrice} onChange={(val) => handleEditField('targetPrice', val)} />
                    <DetailRow label="Pickup Date" value={selectedLog.pickupDate} onChange={(val) => handleEditField('pickupDate', val)} />
                    <DetailRow label="Delivery Date" value={selectedLog.deliveryDate} onChange={(val) => handleEditField('deliveryDate', val)} />
                </DetailSection>
                 
                 <Separator />

                <DetailSection title="Source">
                    <DetailRow label="Email ID" value={selectedLog.messageId} />
                     <div className="flex items-center justify-between">
                         <span className="text-sm font-medium text-muted-foreground">Confidence</span>
                         <Badge variant={selectedLog.confidence > 90 ? "default" : selectedLog.confidence > 70 ? "secondary" : "destructive"}>{selectedLog.confidence}%</Badge>
                     </div>
                </DetailSection>


              </div>
              <div className="p-6 border-t bg-background space-y-2">
                 <Button onClick={toggleVerified} className="w-full">
                     {selectedLog.status === 'Verified' ? 'Unmark Verified' : 'Mark Verified'}
                 </Button>
                <Button variant="secondary" className="w-full" onClick={() => router.push(`/inbox-inspector?emailId=${selectedLog.messageId}`)}>
                  <FileText className="mr-2 h-4 w-4" />
                  View Source Email
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function DetailSection({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <div>
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <div className="space-y-2">
                {children}
            </div>
        </div>
    )
}

function DetailRow({ label, value, onChange }: { label: string, value: string, onChange?: (value: string) => void }) {
    const [isEditing, setIsEditing] = useState(false);
    const [currentValue, setCurrentValue] = useState(value);
    
    useEffect(() => {
        setCurrentValue(value);
    }, [value]);

    const handleSave = () => {
        if(onChange) {
            onChange(currentValue);
        }
        setIsEditing(false);
    }
    
    return (
        <div className="flex items-center justify-between group">
            <span className="text-sm font-medium text-muted-foreground">{label}</span>
            {isEditing && onChange ? (
                <div className="flex items-center gap-2">
                    <Input value={currentValue} onChange={e => setCurrentValue(e.target.value)} className="h-8 text-sm" />
                    <Button size="sm" onClick={handleSave}>Save</Button>
                </div>
            ) : (
                <span className="text-sm">{value}</span>
            )}
            {onChange && !isEditing && <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100" onClick={() => setIsEditing(true)}>Edit</Button>}
        </div>
    )
}
