# UI Screen Specifications Sheet

## Executive Summary
This document lists the formal design specifications for the core screens of the NusaHub MVP. It maps the visual elements, navigation controls, primary/secondary actions, state feedbacks, and responsive layouts for each screen listed in the inventory.

## Main Analysis

### SCR-01-Register & SCR-02-Login Specs
- **Screen Purpose**: Onboarding portal to verify credentials.
- **Components**: Logo display container, Input text fields (Username, Email, Password), Primary action button, secondary registration links.
- **Primary Actions**: 'Submit' Registration / 'Sign In' Credentials.
- **Secondary Actions**: Toggle Password Visibility, Navigate to Register/Login view links.
- **Navigation**: None (standalone landing layout).
- **Empty State**: None.
- **Loading State**: Disable form controls, render centered spinner overlay.
- **Error State**: Render inline error text below input fields with red alerts.
- **Responsive Behavior**: Form container max-width 400px centered on screen.

### SCR-03-HomeFeed Spec
- **Screen Purpose**: Central portal displaying updates and e-commerce listings.
- **Components**: Top header search bar, scrollable list feed of creator posts, image/media boxes, comments button, buy links.
- **Primary Actions**: Click Buy Link (opens Marketplace detail / checkout sheet).
- **Secondary Actions**: Like post, Comment, Share link.
- **Navigation**: Bottom navigation bar, Drawer slide trigger.
- **Empty State**: Render "Welcome to NusaHub! Creator posts will appear here." message.
- **Loading State**: Pulse placeholder skeleton containers.
- **Error State**: "Failed to load feed. Tap to retry" overlay block.
- **Responsive Behavior**: Post grid cards adapt dynamically (1 column on mobile, max-width 640px).

### SCR-06-ChatRoom Spec
- **Screen Purpose**: Active conversation messaging room with transaction features.
- **Components**: Top header participant profile name, scrollable conversation bubbles thread, bottom input field, product attachment checkout card.
- **Primary Actions**: Click Product card 'Buy' button (opens checkout sheet).
- **Secondary Actions**: Type text message, attach mock product.
- **Navigation**: Top header 'Back' button to ChatsList.
- **Empty State**: "Start chatting with this user." prompt.
- **Loading State**: Muted list skeleton loaders.
- **Error State**: Render warning symbol beside undelivered messages.
- **Responsive Behavior**: Chat thread stretches to fill viewport width.

### SCR-10-WalletCenter Spec
- **Screen Purpose**: Digital finance ledger mock workspace.
- **Components**: Balance display card, Action links (Transfer, Scan QR), scrollable transaction history list.
- **Primary Actions**: Click 'Transfer' (opens Prompt Sheet) / Scan QR (opens camera UI).
- **Secondary Actions**: Filter transaction log items by date.
- **Navigation**: Drawer back button.
- **Empty State**: "No transactions logged yet." prompt.
- **Loading State**: Spinner over balance card.
- **Error State**: "Wallet network unavailable" banner check.
- **Responsive Behavior**: Balance card resizes dynamically.

### SCR-12-InventoryList Spec
- **Screen Purpose**: Seller catalog log panel.
- **Components**: Top header FAB ("Add Item"), inventory grid listing titles, price, stock metrics, and edit button.
- **Primary Actions**: Click FAB "Add Item" (opens modal sheet).
- **Secondary Actions**: Edit item, delete item.
- **Navigation**: Bottom navigation bar (via mode switch).
- **Empty State**: "Your store catalog is empty. Click Add Item to start selling." prompt.
- **Loading State**: Muted lists loader.
- **Error State**: "Failed to load inventory. Retry." alert.
- **Responsive Behavior**: Grid switches to list mode on small viewports.

## Key Insights
- **Strict Layout Alignment**: By locking screen specifications to these parameters, we ensure that the generated layout components will render consistently.
- **Consistent Onboarding flows**: Registration, Login, and Wallet verification screens share consistent form schemas to simplify user learning.

## Decision Impact
- **docs/05-development/**: Layout verification tests will use these specs to validate visual outputs.
- **docs/03-product/PRD.md**: MVP functionality is mapped exactly against these screen parameters.

## Review Status
- **Reviewer**: Product Manager (ChatGPT)
- **Status**: Under Review
- **Approval Date**: Pending

## Related Documents
- [07-Screen-Inventory.md](07-Screen-Inventory.md)
- [08-Interaction-Guidelines.md](08-Interaction-Guidelines.md)
