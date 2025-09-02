
"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { mockLogs, type LogEntry } from '../extraction-log/data';
import { FileText, Check, Trash2, CornerUpLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

// Filter logs for the review queue: low confidence or missing critical fields
const getReviewItems = () => mockLogs.filter(log => 
    log.confidence < 80 || 
    log.status === 'Error' ||
    !log.originCity || 
    !log.destinationCity || 
    !log.equipment
).slice(0, 5); // Take first 5 for demo purposes

export default function ReviewQueuePage() {
    const { toast } = useToast();
    const router = useRouter();
    const [reviewItems, setReviewItems] = useState<LogEntry[]>([]);
    const [selectedItem, setSelectedItem] = useState<LogEntry | null>(null);

    useEffect(() => {
        setReviewItems(getReviewItems());
    }, []);

    const handleSelectItem = (item: LogEntry) => {
        setSelectedItem(item);
    };
    
    const handleUpdateItem = (updatedItem: LogEntry) => {
        setSelectedItem(updatedItem);
        setReviewItems(items => items.map(item => item.messageId === updatedItem.messageId ? updatedItem : item));
    }

    const handleAccept = () => {
        if (!selectedItem) return;
        setReviewItems(items => items.filter(item => item.messageId !== selectedItem.messageId));
        setSelectedItem(null);
        toast({ title: "Item Accepted", description: `${selectedItem.messageId} has been logged.` });
    };

    const handleDiscard = () => {
        if (!selectedItem) return;
        setReviewItems(items => items.filter(item => item.messageId !== selectedItem.messageId));
        setSelectedItem(null);
        toast({ title: "Item Discarded", description: `${selectedItem.messageId} has been removed.` });
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Review Queue</CardTitle>
                    <CardDescription>
                        Items with low confidence or missing fields that require manual review.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {reviewItems.length > 0 ? (
                        <ul className="space-y-4">
                            {reviewItems.map(item => (
                                <li key={item.messageId}>
                                    <button onClick={() => handleSelectItem(item)} className="w-full text-left">
                                        <Card className="hover:bg-muted/50 transition-colors">
                                            <CardContent className="p-4 grid grid-cols-12 gap-4 items-center">
                                                <div className="col-span-3">
                                                    <p className="font-semibold">{item.customer}</p>
                                                    <p className="text-sm text-muted-foreground">{item.interactionType}</p>
                                                </div>
                                                <div className="col-span-5">
                                                    <p className="truncate">{item.originCity} to {item.destinationCity}</p>
                                                     <p className="text-sm text-muted-foreground">{item.equipment}</p>
                                                </div>
                                                <div className="col-span-2">
                                                    <Badge variant={item.confidence > 70 ? "secondary" : "destructive"}>
                                                        {item.confidence}% Confidence
                                                    </Badge>
                                                </div>
                                                <div className="col-span-2 flex justify-end">
                                                     <Badge variant="outline">{item.status === "Error" ? "Error" : "Needs Review"}</Badge>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                         <div className="flex h-96 items-center justify-center rounded-md border border-dashed">
                            <p className="text-muted-foreground">The review queue is empty.</p>
                         </div>
                    )}
                </CardContent>
            </Card>

            <Sheet open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
                <SheetContent className="w-full sm:max-w-md p-0">
                    {selectedItem && (
                        <div className="flex flex-col h-full">
                            <SheetHeader className="p-6">
                                <SheetTitle>Review Item</SheetTitle>
                            </SheetHeader>
                            <div className="flex-1 overflow-y-auto px-6 py-2 space-y-4">
                               <EditableDetailSection title="Summary" item={selectedItem} setItem={handleUpdateItem} fields={['customer', 'interactionType']} />
                               <Separator />
                               <EditableDetailSection title="Lane" item={selectedItem} setItem={handleUpdateItem} fields={['originCity', 'originState', 'destinationCity', 'destinationState']} />
                               <Separator />
                               <EditableDetailSection title="Shipment" item={selectedItem} setItem={handleUpdateItem} fields={['equipment', 'weight']} />
                               <Separator />
                               <EditableDetailSection title="Pricing & Dates" item={selectedItem} setItem={handleUpdateItem} fields={['targetPrice', 'pickupDate', 'deliveryDate']} />
                               <Separator />
                                <div className="space-y-2">
                                    <h3 className="text-lg font-semibold">Source</h3>
                                     <div className="flex items-center justify-between text-sm">
                                         <span className="font-medium text-muted-foreground">Email ID</span>
                                         <span>{selectedItem.messageId}</span>
                                     </div>
                                      <div className="flex items-center justify-between text-sm">
                                         <span className="font-medium text-muted-foreground">Confidence</span>
                                         <Badge variant={selectedItem.confidence > 70 ? "secondary" : "destructive"}>{selectedItem.confidence}%</Badge>
                                     </div>
                                </div>
                            </div>
                             <div className="p-6 border-t bg-background grid grid-cols-2 gap-2">
                                <Button onClick={handleAccept} className="w-full"><Check className="mr-2 h-4 w-4" /> Accept and Log</Button>
                                <Button onClick={handleDiscard} variant="destructive" className="w-full"><Trash2 className="mr-2 h-4 w-4" /> Discard</Button>
                                <Button variant="secondary" className="w-full col-span-2" onClick={() => router.push(`/inbox-inspector?emailId=${selectedItem.messageId}`)}>
                                  <CornerUpLeft className="mr-2 h-4 w-4" />
                                  Route to Inbox Inspector
                                </Button>
                             </div>
                        </div>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    );
}

function EditableDetailSection({ title, item, setItem, fields }: { title: string; item: LogEntry; setItem: (item: LogEntry) => void; fields: (keyof LogEntry)[] }) {
    const handleChange = (field: keyof LogEntry, value: string) => {
        setItem({ ...item, [field]: value });
    };

    const toTitleCase = (str: string) => str.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
    
    return (
        <div>
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <div className="space-y-3">
                {fields.map(field => (
                    <div key={field} className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor={field} className="text-right text-muted-foreground">{toTitleCase(field)}</Label>
                        <Input 
                            id={field}
                            value={item[field] as string || ''}
                            onChange={(e) => handleChange(field, e.target.value)}
                            className="col-span-2 h-8"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

function Label({ htmlFor, className, children }: { htmlFor: string, className?: string, children: React.ReactNode }) {
    return <label htmlFor={htmlFor} className={className}>{children}</label>;
}
