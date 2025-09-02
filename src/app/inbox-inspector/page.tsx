import { Suspense } from 'react';
import { InboxInspectorClient } from "./inbox-inspector-client";
import { mockEmails, mockDetectedFields } from "./data";
import { Skeleton } from '@/components/ui/skeleton';

function InboxInspectorContent() {
  return <InboxInspectorClient emails={mockEmails} detectedFields={mockDetectedFields} />;
}


export default function InboxInspectorPage() {
  return (
    <Suspense fallback={<InboxInspectorSkeleton />}>
        <InboxInspectorContent />
    </Suspense>
  );
}

function InboxInspectorSkeleton() {
    return (
        <div className="grid h-[calc(100vh-8rem)] grid-cols-10 gap-6">
            <div className="col-span-10 flex flex-col gap-4 lg:col-span-2">
                <Skeleton className="h-8 w-32" />
                <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-8 w-16 rounded-full" />
                    <Skeleton className="h-8 w-20 rounded-full" />
                    <Skeleton className="h-8 w-24 rounded-full" />
                </div>
                <Skeleton className="flex-1" />
            </div>
            <Skeleton className="col-span-10 lg:col-span-5" />
            <Skeleton className="col-span-10 lg:col-span-3" />
        </div>
    );
}
