# User Flows: Journey Specifications

## Executive Summary
This document maps step-by-step user journeys for the 11 key MVP tasks. It details the exact triggers, user actions, system operations, and screen transitions required to complete transactional and social paths within the NusaHub interface.

## Main Analysis
Below are the step-by-step user flows for the core MVP scenarios:

### 1. Register & Login Flows
- **Register Flow**: User visits login view âž” clicks 'Register' âž” enters Display Name, Email, Password, Handle âž” clicks 'Submit' âž” System registers user, logs them in automatically âž” redirects user to Home Feed.
- **Login Flow**: User visits login view âž” enters Email and Password âž” clicks 'Sign In' âž” System validates credentials âž” loads user session âž” redirects user to Home Feed.

### 2. Communication & AI Flows
- **Open Chat & Send Message**: User opens Chat Tab âž” selects contact room âž” types message in chat input âž” clicks send âž” System appends text block instantly, alerts counterparty.
- **Ask AI**: User opens AI Assistant Tab âž” inputs natural language request (e.g. "Transfer Rp 50,000 to Ibu Sri") âž” AI parses query, executes mock action, and responds in chat window.

### 3. Commerce & Wallet Flows
- **Browse Feed & Buy Product**: User views Home Feed âž” clicks product catalog link in creator post âž” opens Product Detail view âž” clicks 'Buy Now' âž” triggers checkout Prompt Sheet.
- **Checkout & Wallet Transfer**: User reviews checkout Prompt Sheet details âž” clicks 'Confirm Payment' âž” System checks dummy wallet balance âž” updates transaction log, decrements balance, sends payment signal to Seller, decrements product stock âž” shows Transaction Success page.
- **Wallet Transfer (Direct)**: User enters Wallet UI âž” clicks 'Transfer' âž” enters recipient unique handle & amount âž” clicks confirm âž” System executes mock transfer âž” updates balances and ledger logs.

### 4. Merchant Dashboard Operations
- **Switch Mode**: User visits Profile Tab âž” toggles mode selector switch âž” screen re-loads layout to show Merchant Dashboard views.
- **Manage Product**: Merchant opens Inventory list âž” clicks 'Add Item' âž” inputs Title, Price, Description, Stock âž” clicks 'Save' âž” Item is appended to Marketplace catalog.

## Key Insights
- **Zero Redirection Checkout**: The transaction flow (Checkout & Wallet Transfer) happens entirely within the customer session without redirecting to external banking interfaces, which reduces transaction drop-offs.
- **Dynamic AI Parsing**: The AI assistant acts as a text trigger, skipping complex menu hierarchies and executing commands like payments or task creations directly.

## Decision Impact
- **docs/03-product/PRD.md**: Validates that all user flows conform to the MVP scope parameters.
- **09-UI-Screen-Specifications.md**: Defines user flow navigation triggers and state changes for screen blueprints.

## Review Status
- **Reviewer**: Product Manager (ChatGPT)
- **Status**: Under Review
- **Approval Date**: Pending

## Related Documents
- [01-Sitemap.md](01-Sitemap.md)
- [04-Navigation-System.md](04-Navigation-System.md)
