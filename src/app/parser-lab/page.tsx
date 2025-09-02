
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, Bot, ChevronsRight, FlaskConical, Send, Trash2, Wand2 } from "lucide-react";
import type { LogEntry } from "../extraction-log/data";
import { Badge } from "@/components/ui/badge";


const initialKeywords = ["quote", "rate", "bid", "rfq", "lane"];
const initialLanePattern = "City, ST to City, ST";
const initialPricePattern = "$#,###.##";
const initialEquipmentSynonyms = "Dry Van, Van, Reefer, Flat, Flatbed, Stepdeck";

type TestResult = {
    interactionType: string;
    customer: string;
    origin: string;
    destination: string;
    equipment: string;
    weight: string;
    price: string;
    pickupDate: string;
    deliveryDate: string;
    confidence: number;
    ruleContributions: { rule: string; score: number }[];
};


export default function ParserLabPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [keywords, setKeywords] = useState(initialKeywords.join(', '));
    const [lanePattern, setLanePattern] = useState(initialLanePattern);
    const [pricePattern, setPricePattern] = useState(initialPricePattern);
    const [equipmentSynonyms, setEquipmentSynonyms] = useState(initialEquipmentSynonyms);

    const [confidenceWeights, setConfidenceWeights] = useState({
        keywords: 40,
        patterns: 50,
        sender: 10,
    });

    const [sampleEmail, setSampleEmail] = useState("");
    const [testResult, setTestResult] = useState<TestResult | null>(null);

    const handleSaveRules = () => {
        toast({
            title: "Rules Saved",
            description: "Your parser rules have been saved (mock action).",
        });
    };

    const handleClear = () => {
        setSampleEmail("");
        setTestResult(null);
    }
    
    const handleRunTest = () => {
        if (!sampleEmail) {
            toast({
                title: "Error",
                description: "Please paste a sample email to test.",
                variant: "destructive"
            });
            return;
        }

        // Mock analysis logic
        let confidence = 0;
        const contributions : TestResult['ruleContributions'] = [];
        
        const emailLower = sampleEmail.toLowerCase();
        const foundKeywords = keywords.split(', ').filter(k => emailLower.includes(k.toLowerCase()));
        if (foundKeywords.length > 0) {
            const score = Math.min(foundKeywords.length * 10, confidenceWeights.keywords);
            confidence += score;
            contributions.push({ rule: `Keywords (${foundKeywords.join(', ')})`, score });
        }

        const laneRegex = /(\w+\s*\w*,\s*[A-Z]{2})\s+to\s+(\w+\s*\w*,\s*[A-Z]{2})/i;
        const laneMatch = sampleEmail.match(laneRegex);
        
        if (laneMatch) {
            confidence += confidenceWeights.patterns * 0.5;
            contributions.push({ rule: 'Lane Pattern Matched', score: confidenceWeights.patterns * 0.5});
        }
        
        const priceRegex = /\$?(\d{1,3}(,\d{3})*(\.\d{2})?)/;
        const priceMatch = sampleEmail.match(priceRegex);
        if (priceMatch) {
            confidence += confidenceWeights.patterns * 0.3;
             contributions.push({ rule: 'Price Pattern Matched', score: confidenceWeights.patterns * 0.3});
        }
        
        const senderMatch = sampleEmail.match(/from:\s*.*@(.*)/i);
        if (senderMatch) {
            confidence += confidenceWeights.sender;
            contributions.push({ rule: 'Sender Domain Found', score: confidenceWeights.sender});
        }

        setTestResult({
            interactionType: "New Request",
            customer: senderMatch ? senderMatch[1].split('.')[0].replace(/^\w/, c => c.toUpperCase()) + " Inc." : "Sample Customer",
            origin: laneMatch ? laneMatch[1] : "Dallas, TX",
            destination: laneMatch ? laneMatch[2] : "Atlanta, GA",
            equipment: "Dry Van",
            weight: "44,000 lbs",
            price: priceMatch ? `$${priceMatch[1]}` : "$2,500",
            pickupDate: "2024-08-01",
            deliveryDate: "2024-08-04",
            confidence: Math.min(100, Math.round(confidence)),
            ruleContributions: contributions
        });
    }

    const handleSendToInbox = () => {
        if (!testResult) return;
        
        const [originCity, originState] = testResult.origin.split(', ');
        const [destinationCity, destinationState] = testResult.destination.split(', ');

        const logEntry: LogEntry = {
            customer: testResult.customer,
            interactionType: "New Request",
            originCity,
            originState,
            destinationCity,
            destinationState,
            equipment: testResult.equipment,
            weight: testResult.weight,
            targetPrice: testResult.price,
            pickupDate: testResult.pickupDate,
            deliveryDate: testResult.deliveryDate,
            messageId: `msg-labtest-${Date.now()}`,
            confidence: testResult.confidence,
            status: "Logged",
            timestamp: new Date().toISOString()
        };

        localStorage.setItem("latestLog", JSON.stringify(logEntry));
        router.push(`/extraction-log`);
    }

  return (
    <div className="grid h-full grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Left Column: Rule Builder */}
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>Rule Builder</CardTitle>
          <CardDescription>
            Define client-side rules to guide the extraction engine.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 space-y-6 overflow-y-auto">
          {/* Keyword Library */}
          <div>
            <Label htmlFor="keywords" className="font-semibold">Keyword Library</Label>
            <p className="text-sm text-muted-foreground mb-2">Keywords that signal quote intent.</p>
            <Input id="keywords" value={keywords} onChange={e => setKeywords(e.target.value)} />
          </div>

            <Separator />
            
          {/* Entity Patterns */}
          <div className="space-y-4">
            <h3 className="font-semibold">Entity Patterns</h3>
            <div className="space-y-2">
                <Label htmlFor="lanePattern">Lane Pattern</Label>
                <Input id="lanePattern" value={lanePattern} onChange={e => setLanePattern(e.target.value)} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="pricePattern">Price Pattern</Label>
                <Input id="pricePattern" value={pricePattern} onChange={e => setPricePattern(e.target.value)} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="equipment">Equipment Synonyms</Label>
                <Input id="equipment" value={equipmentSynonyms} onChange={e => setEquipmentSynonyms(e.target.value)} />
            </div>
          </div>
          
          <Separator />

          {/* Confidence Weighting */}
           <div className="space-y-4">
                <h3 className="font-semibold">Confidence Weighting</h3>
                 <div className="space-y-2">
                    <div className="flex justify-between">
                        <Label htmlFor="confidenceKeywords">Keywords</Label>
                        <span className="text-sm text-muted-foreground">{confidenceWeights.keywords}%</span>
                    </div>
                    <Slider id="confidenceKeywords" value={[confidenceWeights.keywords]} onValueChange={([val]) => setConfidenceWeights(w => ({ ...w, keywords: val}))} />
                 </div>
                 <div className="space-y-2">
                    <div className="flex justify-between">
                        <Label htmlFor="confidencePatterns">Patterns</Label>
                        <span className="text-sm text-muted-foreground">{confidenceWeights.patterns}%</span>
                    </div>
                    <Slider id="confidencePatterns" value={[confidenceWeights.patterns]} onValueChange={([val]) => setConfidenceWeights(w => ({ ...w, patterns: val}))} />
                 </div>
                 <div className="space-y-2">
                    <div className="flex justify-between">
                        <Label htmlFor="confidenceSender">Sender Domain</Label>
                         <span className="text-sm text-muted-foreground">{confidenceWeights.sender}%</span>
                    </div>
                    <Slider id="confidenceSender" value={[confidenceWeights.sender]} onValueChange={([val]) => setConfidenceWeights(w => ({ ...w, sender: val}))} />
                 </div>
           </div>

        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveRules}>Save Rules</Button>
        </CardFooter>
      </Card>

      {/* Right Column: Test Harness */}
      <div className="grid grid-rows-[1fr_auto] gap-6">
        <Card className="flex flex-col">
            <CardHeader>
                <CardTitle>Test Harness</CardTitle>
                <CardDescription>Paste a sample email to test the rules.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-4">
                <Textarea
                    placeholder="Paste your sample email here..."
                    className="flex-1 resize-y"
                    value={sampleEmail}
                    onChange={e => setSampleEmail(e.target.value)}
                />
                 <div className="flex gap-2">
                    <Button onClick={handleRunTest} className="w-full"><Wand2 className="mr-2" /> Run Test</Button>
                    <Button onClick={handleClear} variant="outline" className="w-full"><Trash2 className="mr-2" /> Clear</Button>
                </div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Results</CardTitle>
            </CardHeader>
            <CardContent>
                {testResult ? (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                             <div className="flex items-center gap-2">
                                <Bot className="size-5 text-primary" />
                                <h3 className="font-semibold">Detected: {testResult.interactionType}</h3>
                             </div>
                             <Badge variant={testResult.confidence > 80 ? 'default' : testResult.confidence > 50 ? 'secondary' : 'destructive'}>
                                {testResult.confidence}% Confidence
                             </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                            <p><strong>Customer:</strong> {testResult.customer}</p>
                            <p><strong>Equipment:</strong> {testResult.equipment}</p>
                            <p><strong>Origin:</strong> {testResult.origin}</p>
                            <p><strong>Destination:</strong> {testResult.destination}</p>
                            <p><strong>Price:</strong> {testResult.price}</p>
                            <p><strong>Weight:</strong> {testResult.weight}</p>
                        </div>
                        <div>
                            <h4 className="font-medium text-sm mb-1">Rule Contributions:</h4>
                            <ul className="text-xs text-muted-foreground list-disc pl-4 space-y-1">
                               {testResult.ruleContributions.map((r, i) => <li key={i}>{r.rule}: <strong>+{r.score} pts</strong></li>)}
                            </ul>
                        </div>
                        <Button className="w-full" onClick={handleSendToInbox}><Send className="mr-2" /> Send to Log</Button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-48 text-center border border-dashed rounded-lg">
                        <FlaskConical className="size-8 text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">Run a test to see results here.</p>
                    </div>
                )}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
