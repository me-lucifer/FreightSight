
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, Table, UploadCloud } from 'lucide-react';

type Destination = "Airtable" | "CSV Export" | "Generic CRM";

export default function DestinationsPage() {
  const [openDialog, setOpenDialog] = useState<Destination | null>(null);

  const destinations: {
    name: Destination;
    description: string;
    icon: React.ReactNode;
    fields: { id: string; label: string; type: string; placeholder: string }[];
  }[] = [
    {
      name: "Airtable",
      description: "Sync extracted data directly to your Airtable base.",
      icon: <Table className="size-8 text-blue-500" />,
      fields: [
        { id: "apiKey", label: "API Key", type: "password", placeholder: "key... "},
        { id: "baseId", label: "Base ID", type: "text", placeholder: "app... "},
        { id: "tableId", label: "Table Name", type: "text", placeholder: "Your Table Name"},
      ],
    },
    {
      name: "CSV Export",
      description: "Generate a CSV file of your data for manual import.",
      icon: <Sheet className="size-8 text-green-600" />,
      fields: [
          { id: 'filePath', label: 'Export Path', type: 'text', placeholder: '/exports/freight.csv' },
          { id: 'fileName', label: 'File Name', type: 'text', placeholder: 'extraction-log_{{date}}' },
      ],
    },
    {
      name: "Generic CRM",
      description: "Connect to a generic CRM via a webhook endpoint.",
      icon: <UploadCloud className="size-8 text-purple-500" />,
      fields: [
          { id: 'webhookUrl', label: 'Webhook URL', type: 'url', placeholder: 'https://api.crm.com/v1/...' },
          { id: 'authToken', label: 'Auth Token', type: 'password', placeholder: 'Bearer ...' },
      ],
    },
  ];
  
  const currentDestination = destinations.find(d => d.name === openDialog);

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Destinations</CardTitle>
          <CardDescription>
            Manage where your extracted data is sent. Connect to your tools.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {destinations.map((dest) => (
              <Card key={dest.name}>
                <CardHeader className="flex flex-row items-center gap-4">
                  {dest.icon}
                  <div className="flex-1">
                    <CardTitle>{dest.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{dest.description}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => setOpenDialog(dest.name)}>
                    Configure
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={!!openDialog} onOpenChange={(isOpen) => !isOpen && setOpenDialog(null)}>
        <DialogContent>
          {currentDestination && (
            <>
              <DialogHeader>
                <DialogTitle>Configure {currentDestination.name}</DialogTitle>
                <DialogDescription>
                  Enter the details to connect to {currentDestination.name}.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {currentDestination.fields.map(field => (
                  <div className="grid grid-cols-4 items-center gap-4" key={field.id}>
                    <Label htmlFor={field.id} className="text-right">
                      {field.label}
                    </Label>
                    <Input id={field.id} type={field.type} placeholder={field.placeholder} className="col-span-3" />
                  </div>
                ))}
              </div>
               <div className="text-xs text-center text-muted-foreground">
                  Phase 1 demo only; no external calls are made.
                </div>
              <DialogFooter>
                 <DialogClose asChild>
                    <Button type="button" variant="secondary">Cancel</Button>
                 </DialogClose>
                <Button type="submit" onClick={() => setOpenDialog(null)}>Save Configuration</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
