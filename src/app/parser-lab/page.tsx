import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export default function ParserLabPage() {
  return (
    <div className="grid h-full grid-rows-[auto_1fr] gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Parser Lab</CardTitle>
          <CardDescription>
            Paste a sample email to test the parsing engine.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Paste your sample email here..."
            className="min-h-[400px] resize-y"
          />
        </CardContent>
        <CardFooter>
          <Button>Parse Email</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
