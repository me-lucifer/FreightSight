import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LabelsPage() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Labels</CardTitle>
          <CardDescription>
            Manage labels for organizing and categorizing emails.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-64 items-center justify-center rounded-md border border-dashed">
            <p className="text-muted-foreground">Labels settings placeholder</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
