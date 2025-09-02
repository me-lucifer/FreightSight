import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ReviewQueuePage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Review Queue</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex h-96 items-center justify-center rounded-md border border-dashed">
          <p className="text-muted-foreground">The review queue is empty.</p>
        </div>
      </CardContent>
    </Card>
  );
}
