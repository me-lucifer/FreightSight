import { InboxInspectorClient } from "./inbox-inspector-client";
import { mockEmails, mockDetectedFields } from "./data";

export default function InboxInspectorPage() {
  return <InboxInspectorClient emails={mockEmails} detectedFields={mockDetectedFields} />;
}
