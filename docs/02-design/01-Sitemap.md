# Sitemap: NusaHub MVP

## Executive Summary
This document establishes the official hierarchical sitemap for the NusaHub MVP prototype. It maps the structural relationships between core landing views, child sub-pages, and workflow consoles, ensuring a horizontal, easily accessible user path.

## Main Analysis
Below is the page structure of the NusaHub portal. All primary tabs are accessible from the persistent navigation system.

`	ext
NusaHub MVP Portal Root
â”œâ”€â”€ 1. Authentication Module
â”‚   â”œâ”€â”€ Register Screen
â”‚   â””â”€â”€ Login Screen
â”œâ”€â”€ 2. Core Shell Tabs (Main Tabs)
â”‚   â”œâ”€â”€ Home Feed Tab
â”‚   â”‚   â”œâ”€â”€ Post Detail View
â”‚   â”‚   â””â”€â”€ Creator Catalog Link
â”‚   â”œâ”€â”€ Chat Tab
â”‚   â”‚   â””â”€â”€ Active Conversation Room (with Checkout Card interface)
â”‚   â”œâ”€â”€ AI Assistant Tab
â”‚   â”‚   â””â”€â”€ AI Interaction Log
â”‚   â”œâ”€â”€ Workspace Tab
â”‚   â”‚   â”œâ”€â”€ Notes Hub (View note, edit note)
â”‚   â”‚   â”œâ”€â”€ Tasks Checklist (Filter task, add task)
â”‚   â”‚   â””â”€â”€ Calendar View (Event detail popup)
â”‚   â””â”€â”€ User Profile Tab
â”‚       â””â”€â”€ System Mode-Switcher UI (Toggle Consumer / Merchant / Creator layouts)
â”œâ”€â”€ 3. Secondary Modules
â”‚   â”œâ”€â”€ Marketplace Center
â”‚   â”‚   â”œâ”€â”€ Product Detail Screen
â”‚   â”‚   â””â”€â”€ checkout Sheet
â”‚   â”œâ”€â”€ Wallet UI
â”‚   â”‚   â”œâ”€â”€ Balance Ledger View
â”‚   â”‚   â”œâ”€â”€ Transfer Prompt Sheet
â”‚   â”‚   â””â”€â”€ QR Scan Simulator page
â”‚   â”œâ”€â”€ Merchant Dashboard (Visible in Merchant Mode)
â”‚   â”‚   â”œâ”€â”€ Inventory Management list (Add / Edit catalog item)
â”‚   â”‚   â””â”€â”€ Orders Fulfillment Console (Active, completed orders logs)
â”‚   â””â”€â”€ Settings Portal
â”‚       â”œâ”€â”€ General Profile Settings
â”‚       â””â”€â”€ System Settings (Theme, Permissions)
â””â”€â”€ 4. Mini App Workspace
    â””â”€â”€ Sandboxed Iframe Viewer (Widget sandbox loader)
`

## Key Insights
- **Shallow Navigation Hierarchy**: The sitemap is designed to prevent deep sub-menu nesting. Core transaction flows are kept within 2 taps of the root tab to optimize navigation on limited mobile device layouts.
- **Unified Profile Switching**: Toggle menus permit switching between Consumer, Seller, and Creator mode interfaces without logging out, preserving user profile state in the client database.

## Decision Impact
- **Navigation System (04-Navigation-System.md)**: Determines which top-level paths are placed on the bottom navigation bar and which are mapped into the Drawer.
- **UI Screen Specifications (09-UI-Screen-Specifications.md)**: Sets the list of screens requiring detailed spec sheets.

## Review Status
- **Reviewer**: Product Manager (ChatGPT)
- **Status**: Under Review
- **Approval Date**: Pending

## Related Documents
- [02-Information-Architecture.md](02-Information-Architecture.md)
- [07-Screen-Inventory.md](07-Screen-Inventory.md)
