import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function InboxInspectorPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Inbox Inspector</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex h-96 items-center justify-center rounded-md border border-dashed">
          <p className="text-muted-foreground">
            Connect to sample inbox to preview
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
