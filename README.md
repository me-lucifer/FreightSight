# An AI System that Turns Outlook Emails into Structured Freight Quote Insights

> **Phase-1 MVP** — Detect quote-related emails, classify the interaction (New Request / Follow-up / Quote Sent), extract key entities (lanes, equipment, price, dates, customer), and log them into a structured system for reporting and action.

---

## Table of Contents
- [Why this exists](#why-this-exists)
- [What it does (Phase-1)](#what-it-does-phase-1)
- [Who it’s for](#who-its-for)
- [How it works (at a glance)](#how-it-works-at-a-glance)
- [Core features](#core-features)
- [Tech stack](#tech-stack)
- [Data model](#data-model)
- [Screens & prototype](#screens--prototype)
- [Quick start (dev)](#quick-start-dev)
- [Configuration](#configuration)
- [Roadmap](#roadmap)
- [Assumptions & constraints](#assumptions--constraints)
- [FAQ](#faq)
- [Repository structure](#repository-structure)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## Why this exists
Freight teams receive a high volume of **quote requests via email**. Manually triaging, copy-pasting fields, and updating spreadsheets/CRMs leads to:
- missed or slow responses,
- inconsistent field capture (lane formats, equipment names, prices),
- poor visibility into volumes, SLAs, and win rates,
- weak auditability (“who changed what, when”).

This project provides a **lightweight, vendor-agnostic** Phase-1 system to **detect, classify, extract, and log** structured data from Outlook emails—so operations can act faster and leaders can measure what matters.

---

## What it does (Phase-1)
- **Detects** quote-related emails from a Microsoft Outlook inbox (near real-time).
- **Classifies** each interaction: **New Request**, **Follow-up**, or **Quote Sent**.
- **Extracts** key entities: customer, lanes (origin/destination), equipment, weight, price/rate, dates.
- **Logs** a clean record into a chosen destination (e.g., Airtable or PostgreSQL).
- **Surfaces** low-confidence cases to a **Review Queue** for human confirmation.

> ⚠️ Phase-1 is intentionally scoped for reliability and clarity—no auto-replies, large-scale OCR, or multi-inbox orchestration yet.

---

## Who it’s for
- **Logistics coordinators** who triage emails and create quotes.
- **Ops managers** who need KPIs (volumes, response times, conversion).
- **Data/IT** who want structured, mapped data without heavy change-management.

---

## How it works (at a glance)
```
Outlook Inbox
   └── Microsoft Graph (webhooks + delta)
        └── Event Handler (Azure Functions / Node)
             └── Detect & Classify (rules + optional LLM fallback)
                  └── Extract Entities (patterns/regex/synonyms)
                       └── Review (low-confidence) → Operator confirms/edits
                            └── Log to Destination (Airtable / PostgreSQL)
```

---

## Core features
- **Inbox Inspector (UI)** — 3-pane email list, preview, and detected fields.
- **Auto Classification** — New / Follow-up / Sent badges.
- **Entity Extraction** — Lanes, equipment, price, dates, customer.
- **Extraction Log** — Filterable table + detail drawer with audit notes.
- **Review Queue** — Edit, accept & log low-confidence items.
- **Parser Lab** — Test/tune keywords, patterns, and synonyms safely.

---

## Tech stack
**Phase-1 reference implementation (vendor-agnostic where possible):**
- **Email ingest:** Microsoft Graph (Outlook) — change notifications + delta queries  
- **Compute:** Azure Functions (Node.js/TypeScript)  
- **Queueing:** Azure Service Bus (or Storage Queues)  
- **Parsing:** custom rules/regex, `chrono-node` (dates), synonyms for equipment; optional **LLM fallback** (Azure OpenAI) with JSON output and PII masking  
- **Destination:** Airtable **or** PostgreSQL (Prisma ORM)  
- **Web UI:** Next.js (React, TS) + Tailwind + shadcn/ui, TanStack Table, Recharts  
- **Auth/SSO (internal UI):** Microsoft Entra ID (OIDC)  
- **Secrets & Ops:** Azure Key Vault, GitHub Actions CI/CD, Sentry/App Insights

> Swap Azure for AWS equivalents (Lambda, SQS, Secrets Manager, RDS) if your environment prefers.

---

## Data model
**EmailMessage**
- `id`, `subject`, `from`, `receivedAt`, `bodyPreview`, `rawBodyRef` (optional pointer)

**QuoteRecord**
- `interactionType` (**NEW_REQUEST | FOLLOW_UP | QUOTE_SENT**)  
- `customer`  
- `originCity`, `originState`, `destinationCity`, `destinationState`  
- `equipment` (e.g., Dry Van, Reefer, Flatbed)  
- `weight`, `price`, `pickupDate`, `deliveryDate`  
- `confidence` (0–100)  
- `sourceEmailId`, `status` (**PENDING_REVIEW | VERIFIED | LOGGED**)

**Example `QuoteRecord` JSON**
```json
{
  "interactionType": "NEW_REQUEST",
  "customer": "LogiTrans LLC",
  "originCity": "Dallas",
  "originState": "TX",
  "destinationCity": "Atlanta",
  "destinationState": "GA",
  "equipment": "Dry Van",
  "weight": "42,000 lb",
  "price": "1250 USD",
  "pickupDate": "2025-10-30",
  "deliveryDate": "2025-11-01",
  "confidence": 88,
  "sourceEmailId": "AAMkAGI2...",
  "status": "PENDING_REVIEW"
}
```

---

## Screens & prototype
This repository includes (or links to) a **clickable prototype** built with Firebase Studio (no backend) for stakeholder demos:

- **Dashboard KPIs**  
- **Inbox Inspector (3-pane)**  
- **Extraction Log + Detail Drawer**  
- **Parser Lab**  
- **Review Queue**

> Add screenshots to `/docs/screenshots/` and reference them in the README for quick context:
> - `/docs/screenshots/dashboard.png`
> - `/docs/screenshots/inbox-inspector.png`
> - `/docs/screenshots/extraction-log.png`
> - `/docs/screenshots/parser-lab.png`
> - `/docs/screenshots/review-queue.png`

---

## Quick start (dev)
> **Note:** This is a Phase-1 reference; some steps are stubs/placeholders for your environment.

1. **Clone & install**
   ```bash
   git clone https://github.com/<org>/<repo>.git
   cd <repo>
   npm install
   ```

2. **Environment**
   Create `.env.local` (UI) and `.env` (functions) with placeholders:
   ```
   # Microsoft Graph / Entra ID
   TENANT_ID=
   CLIENT_ID=
   CLIENT_SECRET=
   GRAPH_SUBSCRIPTION_VALIDATION_TOKEN=
   GRAPH_WEBHOOK_URL=https://<ngrok-or-dev-url>/api/graph/webhook

   # Destination (choose one)
   AIRTABLE_API_KEY=
   AIRTABLE_BASE_ID=
   AIRTABLE_TABLE=QuoteRecords

   # or PostgreSQL
   DATABASE_URL=postgresql://user:pass@host:5432/dbname

   # Optional LLM fallback
   AZURE_OPENAI_ENDPOINT=
   AZURE_OPENAI_KEY=
   ```

3. **Run the web UI**
   ```bash
   npm run dev
   # UI at http://localhost:3000
   ```

4. **Run functions (local)**
   ```bash
   npm run functions:dev
   # Exposes webhook endpoints for Graph validation
   ```

5. **Expose a public URL** (for Graph notifications)
   ```bash
   npx ngrok http 7071
   # Update GRAPH_WEBHOOK_URL accordingly, then create a Graph subscription (script or Graph Explorer)
   ```

> For a pure demo without Outlook hookup, use the **mock data mode** in the UI to simulate inbox items and logging.

---

## Configuration
- **Labels & thresholds:** Adjust classification labels and confidence thresholds in `config/classification.ts`.
- **Patterns & synonyms:** Edit lane patterns, equipment synonyms, and price/date regex in `config/parsing.ts`.
- **Field mapping:** Map internal fields → Airtable/DB columns in `config/mapping.ts`.

---

## Roadmap
- **Phase-1 (this repo):** Outlook ingest, detect/classify/extract, review, log to one destination.
- **Phase-2 (planned):**
  - Attachment OCR (PDF/Excel/BOLs) via Azure Document Intelligence
  - Multi-inbox scale (topics/consumer groups)
  - CRM triggers (HubSpot/Salesforce) and analytics dashboards
  - Auto-reply drafts (policy-gated)
  - Production hardening & security review

---

## Assumptions & constraints
- Access to **anonymized** sample emails for rules/prompt tuning.
- Single destination (Airtable or PostgreSQL) for Phase-1.
- Internal operator UI with SSO; no external customer portal in Phase-1.

---

## FAQ
**Q: Is this a finished product?**  
A: No. This is a **custom solution** scoped for a Phase-1 MVP to prove value quickly and safely.

**Q: Do we need LLMs from day one?**  
A: Not necessarily. We start with rules/regex/synonyms and **only** use LLM fallback on low-confidence cases.

**Q: Can it parse attachments?**  
A: Attachments (PDF/Excel) are **Phase-2** via OCR/Document Intelligence.

**Q: Where is the data stored?**  
A: You can choose **Airtable** for easy visibility or **PostgreSQL** for control/perf. Mapping is configurable.

---

## Repository structure
```
/apps/ui/                # Next.js (React, TS) operator console (Dashboard, Inbox, Log, Review, Parser Lab)
/apps/functions/         # Azure Functions (webhook handlers, processors)
/packages/core/          # Parsing, classification, confidence, mapping
/config/                 # Labels, thresholds, patterns, synonyms, field mapping
/docs/screenshots/       # PNG/JPG for README and presentations
/scripts/                # Dev helpers: create Graph subscription, seed mock data
```

---

## Contributing
Contributions are welcome! Please open an issue to discuss changes first.  
For code:
- write tests (Vitest/Jest for core, Playwright for UI),
- run `npm run lint` and `npm run test`,
- follow commit conventions if present.

---

## Contact
Questions, ideas, or interested in using this for your team?  
**Amit Mhaske:** _<Amit Mhaske>_ — _<itsthelucifer@gmail.com>_
