import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DestinationsPage() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Destinations</CardTitle>
          <CardDescription>
            Manage where your extracted data is sent.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-64 items-center justify-center rounded-md border border-dashed">
            <p className="text-muted-foreground">
              Destinations settings placeholder
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
