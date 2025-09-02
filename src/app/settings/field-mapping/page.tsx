import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function FieldMappingPage() {
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
          <div className="flex h-64 items-center justify-center rounded-md border border-dashed">
            <p className="text-muted-foreground">
              Field mapping settings placeholder
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
