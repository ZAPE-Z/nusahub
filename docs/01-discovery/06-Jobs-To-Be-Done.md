# Jobs-To-Be-Done (JTBD) Framework

## Executive Summary
This document applies the Jobs-To-Be-Done (JTBD) framework to analyze the core functional, social, and emotional jobs that users seek to resolve by using NusaHub. By defining these core progress statements, we align feature specifications with customer motivations.

## Main Analysis
- **Job 1: End-User Transaction Progress**:
  - *Core Job*: "When I want to buy an item from a local merchant, I want to confirm, pay for, and track the purchase instantly within our chat, so I can save time, avoid fraud, and keep my device running fast."
  - *Functional Dimension*: Single screen checkout, automated bank/wallet transfer verification, instant delivery tracking.
  - *Emotional/Social Dimension*: Feeling secure that my payment is verified, feeling smart for not having to download another app.
- **Job 2: MSME Operational Automation**:
  - *Core Job*: "When I receive an order from a customer on my chat channel, I want to register the transaction, verify payment, and book a delivery rider automatically, so I can eliminate manual copy-pasting, prevent stock errors, and scale my sales."
  - *Functional Dimension*: Chat-integrated billing, automated balance check, auto-booking logistics.
  - *Emotional/Social Dimension*: Feeling in control of my business, looking professional to my clients.
- **Job 3: Creator Monetization & Direct Access**:
  - *Core Job*: "When I distribute my creative content, I want to monetize it directly and host community discussions under one secure hub, so I can own my audience relationships and protect my income from algorithm shifts."
  - *Functional Dimension*: Integrated local tipping/subscriptions, unified community chats.
  - *Emotional/Social Dimension*: Feeling independent and secure in my creative business.

## Key Insights
- **Eliminate the Transition Friction**: The primary value lies in removing the "app-switching loop." Merging the transaction check and payment directly into the messaging stream satisfies the customer's functional and emotional job needs.
- **Trust as a Core Job**: Trust is a massive emotional job in Indonesia. Escrow payments and verified seller tags resolve the user's anxiety about online shopping scams.

## Decision Impact
- **docs/03-product/PRD.md**: Translates the JTBD dimensions into specific user flows, chatbot capabilities, and merchant dashboard features.
- **docs/04-architecture/**: Dictates the communication security protocols and escrow data flows needed to resolve the trust dimensions.

## Review Status
- **Reviewer**: Product Manager (ChatGPT)
- **Status**: Under Review
- **Approval Date**: Pending

## Related Documents
- [01-Problem-Discovery.md](01-Problem-Discovery.md)
- [05-User-Personas.md](05-User-Personas.md)
