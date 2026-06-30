# Information Architecture (IA)

## Executive Summary
This document specifies the information architecture for the NusaHub MVP. It details the content fields, data structures, and metadata models for each key functional area of the platform to guide database developers and interface designers.

## Main Analysis
Below are the data fields mapped to the MVP screen layouts:

### 1. Authentication Data Model
- **Register/Login Inputs**: Email, Password (Hashed), Display Name, Unique Handle (@username).
- **User Session Metadata**: Session ID, Active Role State (Consumer | Merchant | Creator).

### 2. Home Feed Post Data Model
- **Post Item**: Post ID, Creator ID, Creator Name, Avatar Image URL, Timestamp, Text Content, Media URLs (optional), Like Count, Comment Count.
- **E-Commerce Tag Reference**: Product Catalog ID, Product Card Reference.

### 3. Chat Room Data Model
- **Conversation Hub**: Room ID, Participant Details (IDs, names, avatars).
- **Message Item**: Message ID, Sender ID, Timestamp, Payload Type (Text | Image | ProductCard | TransactionPrompt).
- **Checkout Attachment Widget**: Product Catalog ID, Title, Price, Stock Status, Checkout Action Trigger.

### 4. Marketplace Catalog Data Model
- **Product Item**: Catalog ID, Merchant ID, Title, Description, Price, Stock Quantity, Product Image URLs, Category Tag.

### 5. Wallet Ledger Model
- **Wallet State**: Wallet ID, Account Holder User ID, Simulated Balance (Rp).
- **Transaction Entry**: Transaction ID, Reference ID (order/transfer), Type (Debit | Credit), Amount (Rp), Counterparty User ID, Timestamp, Status (Pending | Approved | Failed).

### 6. Workspace Data Model
- **Note Item**: Note ID, User ID, Title, Body Markdown, Last Modified Timestamp.
- **Task Item**: Task ID, User ID, Description, Completed Status (Boolean), Due Date.
- **Calendar Event**: Event ID, User ID, Title, Description, Start Time, End Time.

## Key Insights
- **Normalized Cross-Module Pointers**: Utilizing unified IDs (e.g. Product Catalog ID referencing the same model in Marketplace, Chat, and Merchant Dashboard) ensures data consistency.
- **Simulated Financial Ledger**: Keeping wallet transaction models clean and structured makes it easy to replace mock data with actual payment gateways in Phase 2.

## Decision Impact
- **UI Screen Specifications (09-UI-Screen-Specifications.md)**: Tells screen designers exactly which text blocks, fields, and image loaders need to be rendered in the layout specs.

## Review Status
- **Reviewer**: Product Manager (ChatGPT)
- **Status**: Under Review
- **Approval Date**: Pending

## Related Documents
- [01-Sitemap.md](01-Sitemap.md)
- [06-Component-Library.md](06-Component-Library.md)
