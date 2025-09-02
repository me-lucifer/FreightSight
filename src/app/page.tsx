import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-96 items-center justify-center rounded-md border border-dashed">
            <p className="text-muted-foreground">KPIs will appear here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
