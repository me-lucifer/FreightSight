
"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

type LogEntry = {
  timestamp: string;
  source: string;
  status: string;
  confidence: number;
  [key: string]: any;
};

const mockLogs: LogEntry[] = [
    { timestamp: "2024-07-21T14:48:00Z", source: "Global Movers", status: "Logged", confidence: 99 },
    { timestamp: "2024-07-20T11:23:00Z", source: "QuickShip Inc.", status: "Logged", confidence: 98 },
    { timestamp: "2024-07-19T09:05:00Z", source: "SteelWorks", status: "Logged", confidence: 99 },
];


export default function ExtractionLogPage() {
    const [latestLog, setLatestLog] = useState<LogEntry | null>(null);
    const [allLogs, setAllLogs] = useState<LogEntry[]>(mockLogs);

    useEffect(() => {
        const storedLog = localStorage.getItem("latestLog");
        if (storedLog) {
            const parsedLog: LogEntry = JSON.parse(storedLog);
            setLatestLog(parsedLog);
            // Add to table if not already there
            if (!allLogs.find(log => log.timestamp === parsedLog.timestamp)) {
                setAllLogs(prevLogs => [parsedLog, ...prevLogs]);
            }
            localStorage.removeItem("latestLog");
        }
    }, []);

  return (
    <div className="space-y-6">
      {latestLog && (
        <Card className="bg-teal-50 border-teal-200">
            <CardHeader>
                <CardTitle>Recently Logged Extraction</CardTitle>
                <CardDescription>This entry was just logged from the Inbox Inspector.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <p><strong>Customer:</strong> {latestLog.customer}</p>
                    <p><strong>Interaction:</strong> {latestLog.interactionType}</p>
                    <p><strong>Origin:</strong> {latestLog.originCity}, {latestLog.originState}</p>
                    <p><strong>Destination:</strong> {latestLog.destinationCity}, {latestLog.destinationState}</p>
                    <p><strong>Equipment:</strong> {latestLog.equipment}</p>
                    <p><strong>Rate:</strong> {latestLog.targetPrice}</p>
                </div>
            </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Extraction Log</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Confidence</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allLogs.length > 0 ? (
                 allLogs.map((log, index) => (
                    <TableRow key={index}>
                        <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                        <TableCell>{log.source}</TableCell>
                        <TableCell><Badge>{log.status}</Badge></TableCell>
                        <TableCell>{log.confidence}%</TableCell>
                    </TableRow>
                 ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No extractions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
