
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Plus, Tag, X } from 'lucide-react';

type LabelDef = {
    name: string;
    color: string;
    colorClass: string;
};

const initialLabels: LabelDef[] = [
    { name: "New Request", color: "blue", colorClass: "bg-blue-500" },
    { name: "Follow-up", color: "amber", colorClass: "bg-amber-500" },
    { name: "Quote Sent", color: "green", colorClass: "bg-green-600" },
];

const colorOptions = [
    { name: 'blue', class: 'bg-blue-500' },
    { name: 'amber', class: 'bg-amber-500' },
    { name: 'green', class: 'bg-green-600' },
    { name: 'red', class: 'bg-red-500' },
    { name: 'purple', class: 'bg-purple-500' },
    { name: 'pink', class: 'bg-pink-500' },
    { name: 'indigo', class: 'bg-indigo-500' },
    { name: 'gray', class: 'bg-gray-500' },
];

export default function LabelsPage() {
    const [labels, setLabels] = useState(initialLabels);
    const [newLabelName, setNewLabelName] = useState("");

    const handleAddLabel = () => {
        if (newLabelName.trim() === "") return;
        const newLabel: LabelDef = {
            name: newLabelName,
            color: 'gray',
            colorClass: 'bg-gray-500',
        };
        setLabels([...labels, newLabel]);
        setNewLabelName("");
    }

    const handleDeleteLabel = (name: string) => {
        setLabels(labels.filter(label => label.name !== name));
    }

    const handleColorChange = (name: string, color: string, colorClass: string) => {
        setLabels(labels.map(label => label.name === name ? { ...label, color, colorClass } : label));
    }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Labels</CardTitle>
          <CardDescription>
            Manage labels for organizing and categorizing emails.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            {/* Existing Labels */}
            <div className="space-y-4">
                <h3 className="font-medium">Interaction Labels</h3>
                {labels.map((label) => (
                    <div key={label.name} className="flex items-center justify-between gap-4 rounded-lg border p-3">
                        <div className="flex items-center gap-3">
                            <Tag className="size-5" style={{ color: `hsl(var(--${label.color}-500))` }} />
                            <span className={cn("font-medium", `text-${label.color}-700`)}>{label.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <div className="flex items-center gap-1">
                               {colorOptions.map(color => (
                                   <button 
                                     key={color.name}
                                     onClick={() => handleColorChange(label.name, color.name, color.class)}
                                     className={cn(
                                         "size-5 rounded-full border-2",
                                         label.color === color.name ? 'border-primary' : 'border-transparent',
                                         color.class
                                     )}
                                     aria-label={`Set color to ${color.name}`}
                                   />
                               ))}
                           </div>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteLabel(label.name)} aria-label={`Delete ${label.name} label`}>
                                <X className="size-4" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Add New Label */}
            <div className="space-y-4">
                <h3 className="font-medium">Add New Label</h3>
                <div className="flex items-center gap-2">
                    <Input 
                        placeholder="New label name..." 
                        value={newLabelName}
                        onChange={(e) => setNewLabelName(e.target.value)}
                        className="max-w-xs"
                    />
                    <Button onClick={handleAddLabel}>
                        <Plus className="mr-2 size-4" />
                        Add Label
                    </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                    Custom labels are for mock purposes only in this demo.
                </p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
