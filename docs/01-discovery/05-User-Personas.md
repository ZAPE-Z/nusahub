# Target User Personas

## Executive Summary
This document establishes four representative user personas representing the core segments of NusaHub: the Daily End-User, the Micro-Merchant (UMKM), the Digital Creator, and the Third-Party Developer. These personas are used to guide product management decisions, design flows, and engineering prioritization throughout the project lifecycle.

## Main Analysis
- **Persona 1: Daily End-User (Budi, 24, Jakarta)**:
  - *Demographics*: Urban worker, high smartphone usage, budget-conscious.
  - *Device*: Entry-level Android (32GB storage, 3GB RAM).
  - *Behavior*: Uses WhatsApp for family/work, GoPay for daily coffee, Instagram for news.
  - *Frustrations*: Frequently uninstalls apps to free up space; hates copying and pasting bank virtual accounts.
- **Persona 2: Micro-Merchant (UMKM) (Ibu Sri, 42, Bandung)**:
  - *Demographics*: Runs a home-based snack business, sells on Instagram and WhatsApp.
  - *Behavior*: Coordinates orders manually via chat; keeps inventory on a paper log; checks banking app manually to verify customer transfers.
  - *Frustrations*: Oversells items due to out-of-sync logs; wastes hours daily verifying payment screenshots.
- **Persona 3: Digital Creator (Andi, 29, Yogyakarta)**:
  - *Demographics*: Independent designer and writer, builds an active online community.
  - *Behavior*: Shares tutorials on TikTok/Instagram, hosts community discussions on Telegram, sells templates via global tools.
  - *Frustrations*: High international payment fees; community engagement is scattered across unlinked apps; algorithmic changes drop his reach.
- **Persona 4: Third-Party Developer (Rian, 26, Surabaya)**:
  - *Demographics*: Freelance developer, builds local utility apps and widgets.
  - *Behavior*: Writes light web apps, struggles to distribute to local users.
  - *Frustrations*: App stores are expensive and slow; major Indonesian apps do not offer open integration APIs.

## Key Insights
- **Unified Portal Necessity**: Budi and Ibu Sri represent a shared interaction loop. Budi wants a simple purchase; Sri wants automated tracking. NusaHub's chat-commerce directly resolves their mutual frustrations.
- **Role Fluidity**: Andi acts as both a creator (community host) and a merchant (selling templates). A unified account layout that handles both monetization and chat is essential.

## Decision Impact
- **docs/03-product/PRD.md**: Direct influence on user flow design, account settings (role switching), and features like AI Assistant and Merchant Dashboard.
- **docs/02-design/**: Visual layouts and step counts must conform to Ibu Sri's digital literacy level and Budi's low-spec device performance bounds.

## Review Status
- **Reviewer**: Product Manager (ChatGPT)
- **Status**: Under Review
- **Approval Date**: Pending

## Related Documents
- [04-Target-Users.md](04-Target-Users.md)
- [06-Jobs-To-Be-Done.md](06-Jobs-To-Be-Done.md)
