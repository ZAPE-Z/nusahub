# Product Requirements Document (PRD): NusaHub MVP Prototype

- **Status**: Draft
- **Owner**: Product Manager
- **Milestone**: Milestone 2 â€” Product Discovery
- **Version**: 1.0.0
- **Last Updated**: 2026-07-01

---

## Product Overview
NusaHub is an AI-First Super App Platform designed for Indonesia. This PRD details the requirements for the initial MVP prototype. The goal is to build a unified horizontal platform that integrates communication, social networking, marketplace commerce, digital wallets, creator utilities, workspaces, and AI assistance into a single lightweight core shell.

## Problem Statement
Indonesia's mobile-first digital market is highly active but fragmented. Users must switch between multiple separate applications (messaging, e-commerce, banking, logistics) on storage-constrained smartphones. MSMEs and creators face high administrative burdens from managing stock, payments, and communications across unlinked apps. Closed conglomerates block integration, while AI utilities remain isolated chatbots, causing transaction drop-offs and lost business efficiency.

## Product Goals
- Validate horizontal platform integration inside a single lightweight mobile/web portal.
- Eliminate the app-switching loop by merging conversation and commerce checkout workflows.
- Provide simple administrative automation tools (billing, stock checking) for micro-merchants.
- Integrate system-level AI orchestration capable of processing transactions based on natural language instructions.

## Target Users
- **End-Users (Budi)**: Mobile-first consumers using low-spec Android devices, seeking frictionless messaging and transactions.
- **UMKM Merchants (Ibu Sri)**: Micro-merchants selling via chat, seeking inventory sync and billing automation.
- **Digital Creators (Andi)**: Seeking direct community engagement and low-fee local monetization.
- **Third-Party Developers (Rian)**: Local developers wanting to deploy lightweight sandboxed widgets.

## MVP Scope
The MVP prototype focuses on ten core functional areas:
1. **Authentication**: Single login credentials with unified profile setups.
2. **Home Feed**: Unified feed merging creator updates, social posts, and product catalogs.
3. **Chat**: Text messaging rooms supporting embedded transaction triggers.
4. **AI Assistant**: Conversational agent executing payments, balance checks, and bookings.
5. **Marketplace**: Clean product search, listing, and catalog views.
6. **Merchant Dashboard**: Order, inventory, payment, and shipping consolidated console.
7. **Wallet (Dummy)**: Virtual wallet simulating balances, deposits, and payments.
8. **Workspace**: Lightweight personal dashboard for notes, tasks, and calendars.
9. **Mini Apps (Placeholder)**: Secure runtime placeholder for lightweight third-party widgets.
10. **User Profile**: Profile portal allowing seamless switching between consumer, seller, and creator modes.

## Product Scope Matrix
| Feature Area | MVP Scope (Prototype) | Future Roadmap Scope (Production) |
| :--- | :--- | :--- |
| **Authentication** | Email & Password, unified local database storage | SMS OTP verification, Social OAuth (Google, Apple), biometric logins |
| **Home Feed** | Basic vertical feed loading text, local images, and mock catalogs | Algorithmic personalization feed, live-stream video integration |
| **Chat** | Real-time text messaging, mock product card attachment, purchase button | Voice calls, group video calls, file document sharing protocols |
| **AI Assistant** | Natural language text execution (payments, tasks, search) | Local language voice recognition (Javanese, Sundanese), offline AI |
| **Marketplace** | Basic catalog list, filter tags, mock checkout flow | Integrated search auctions, multi-merchant unified checkout carts |
| **Merchant Dashboard** | Basic inventory tracker, billing generator, order console | Advanced sales analytics graphs, auto-syncing multi-channel APIs |
| **Wallet (Dummy)** | Simulated balances, simulated transfers, QRIS scanner UI | Official Bank Indonesia QRIS payments, credit scoring models |
| **Workspace** | Basic note-taking, checklist tasks list, calendar reminders | Collaborative docs, team roles permissioning, sync to external calendars |
| **Mini Apps** | Dummy iframe placeholder loading mock HTML widget | Sandboxed Native JS SDK, secure hardware APIs, mini-app marketplace |
| **User Profile** | Mode switching switch UI, basic profile settings | Multi-account profiles, merchant regulatory verification (KYC/KTP) |

## Out of Scope
- Integration with live bank networks, credit cards, or actual financial gateways.
- Real-time courier vehicle tracking or direct API dispatching to local 3PL networks.
- Personalization algorithms for content distribution.
- Complete sandboxed SDK implementation for Mini Apps.
- Marketing systems, affiliate advertising, or pricing plan modules.

## User Stories
- **US-01 (Consumer Checkout)**: As Budi, I want to click a buy button inside my chat with Ibu Sri and pay using my wallet, so I don't have to copy virtual accounts or open banking apps.
- **US-02 (Merchant Dashboard)**: As Ibu Sri, I want to view my inventory levels and active orders in one dashboard, so I don't oversell snacks or lose order notes.
- **US-03 (AI Payments)**: As Budi, I want to type "Pay Ibu Sri Rp 50,000 for snacks" to the AI Assistant, so it executes the dummy wallet transfer instantly.
- **US-04 (Creator Portal)**: As Andi, I want to share my design catalog directly to my home feed and collect tipping from fans in chat, so I don't pay high international fees.
- **US-05 (Developer Widget)**: As Rian, I want to load a custom calculator inside the Mini App placeholder, so I can test lightweight platform integrations.

## Functional Requirements
- **FR-01 (Authentication)**: The system must support registration, login, and mode-switching (Consumer, Seller, Creator) from a unified account.
- **FR-02 (Chat Checkout)**: Chat rooms must support rendering interactive purchase cards linked to the Marketplace catalog.
- **FR-03 (Merchant Automation)**: The Merchant Dashboard must automatically decrement inventory levels upon successful dummy wallet checkout.
- **FR-04 (AI Processing)**: The AI Assistant must parse text prompts for keywords (pay, 	ransfer, check balance, dd task) and trigger simulated wallet and workspace operations.
- **FR-05 (Wallet Simulation)**: The simulated wallet must track balances, update on transaction approvals, and log transfers.

## Non-Functional Requirements
- **NFR-01 (Performance)**: The core portal must remain under 5MB in load size to support basic devices.
- **NFR-02 (Usability)**: Layout navigation steps must not exceed 3 steps for core transaction actions.
- **NFR-03 (Portability)**: The prototype must load and render properly across responsive mobile web interfaces and desktop browsers.
- **NFR-04 (Security)**: Simulated account passwords and wallet transaction payloads must use standard hash encryptions.

## User Flow
1. User logs in and lands on the Home Feed.
2. User opens a Chat room with a merchant.
3. User clicks an attached product card in chat, triggers checkout prompt.
4. User approves dummy wallet payment, receives transaction confirmation.
5. Merchant Dashboard registers the order, decrements stock, and alerts the merchant.

## Information Architecture
`	ext
NusaHub MVP Portal
â”œâ”€â”€ Auth (Login, Register)
â”œâ”€â”€ Home Feed (Social, Creator Posts, Catalogs)
â”œâ”€â”€ Chat (Conversations list, Active Room, Checkout Card)
â”œâ”€â”€ AI Assistant (Chatbot Console, Action triggers)
â”œâ”€â”€ Marketplace (Products list, Catalog view, Checkout Form)
â”œâ”€â”€ Merchant Dashboard (Inventory console, Orders list, Billing)
â”œâ”€â”€ Workspace (Notes page, Checklist tasks, Calendar)
â”œâ”€â”€ Wallet UI (Balances console, Deposit mock, QR Scan)
â””â”€â”€ User Profile (Account details, Mode-switch UI, Settings)
`

## Feature List
- Single sign-on and profile dashboard.
- Real-time text chat rooms.
- Interactive catalog catalog search.
- Consolidated merchant console.
- Simulated wallet balance and QR code interface.
- Lightweight note and task tracker.
- Context-aware AI chatbot text parsing engine.
- Mini App mock rendering widget.

## Acceptance Criteria
- A user can register, login, and toggle between Consumer and Merchant dashboards successfully.
- Clicking "Purchase" in chat immediately prompts for dummy wallet authorization, transfers simulated funds, updates merchant logs, and decrements stock.
- Typing "Check balance" to the AI Assistant outputs the current simulated wallet balance.
- All MVP modules load and function inside a responsive web browser without error.

## Success Metrics
- **Checkout Completion Rate**: Percentage of shopping sessions that complete successfully.
- **Context-Switching Reduction**: Zero external app redirections during transaction flows.
- **UMKM Task Speed**: Average time taken to update stock and verify mock transactions (target under 10 seconds).

## Risks
- **Scope Creep**: Trying to add live banking integrations or full mini-app SDKs can delay prototype delivery. *Mitigation: Keep payment/logistics APIs strictly simulated.*
- **Low Spec Performance**: Portal size could bloat if heavy libraries are imported. *Mitigation: Restrict dependencies to vanilla HTML/CSS/JS.*

## Future Roadmap
- Phase 2: Live local payment gateways (QRIS, bank APIs) and logistics integrations.
- Phase 3: Developer Mini App JS SDK release and marketplace.
- Phase 4: Local language voice recognition models.
