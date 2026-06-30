# UI/UX Master Specification: NusaHub MVP

## Executive Summary
This document serves as the absolute Single Source of Truth (SSOT) for the user experience and user interface of the NusaHub MVP prototype. It unifies sitemap structures, information architectures, navigation schemas, design token variables, reusable component libraries, interaction states, and detailed specifications for all 27 screens. It is designed to be fully implementation-ready for frontend developers and interface designers.

## Design Philosophy
NusaHub follows a **Warm Minimalist** design philosophy. The platform prioritizes high content legibility, wide white spaces, and a clean structural layout, avoiding unnecessary visual clutter. By incorporating soft, natural color tones and circular visual corner treatments, the application balances professional utility with an inclusive, accessible, and friendly atmosphere.

## Design Principles
- **LUI-Orchestrated (Language User Interface)**: Interface pathways prioritize direct conversational triggers over complex, deep self-service navigation menus.
- **Frictionless Transitions**: Eliminates the "app-switching loop" by executing transactional and social checkouts inline.
- **Cognitive Conservation**: Standardized layout patterns and clear, immediate action highlights reduce user analysis fatigue.
- **Resource Mindfulness**: Mobile screens are designed to function smoothly on low-spec hardware without layout shifts.

## Brand Personality
- **Warm & Empathetic**: Empowers users with a design that feels accessible, localized, and friendly.
- **Minimal & Premium**: Clean visual hierarchies, high-quality typography, and responsive spacing profiles.
- **Efficient & Reliable**: Immediate action feedback, secure validation structures, and simple transitions.

## User Experience Goals
- **Single-Context checkout**: Complete an e-commerce transaction from product discovery to payment within a single chat viewport.
- **Frictionless Onboarding**: Access all secondary utilities (wallet, workspace, settings) through a single identity credential.
- **Low Cognitive Overhead**: Allow less tech-literate users to navigate business and payment tasks via simple natural language chats.

---

## UI Layout Rules

### 1. Safe Area & Spacing
- **Safe Area Margins**: All screens enforce a top safe-area margin (minimum 44px on mobile viewports for system status bars) and bottom home indicator bar padding (minimum 34px).
- **Page Side Padding**: Persistent 16px lateral margins on mobile viewports to prevent elements from cropping on screen edges.
- **Gutter Rules**: Grid elements maintain a standardized 12px grid gutter.

### 2. Header & Top Bar Rules
- **Standard Height**: 56px viewport height.
- **Left Element**: Back button (chevron icon) or User Profile Avatar (triggering Drawer side panel).
- **Middle Element**: Centered Screen Title (18px, Medium weight).
- **Right Element**: Secondary context actions (e.g. settings gears, filters, notifications bell).

### 3. Bottom Navigation Bar Rules
- **Height**: 64px viewport height.
- **Items**: Horizontal alignment of 5 core tabs. Icons must occupy a bounding target area of 24px x 24px, with a labels caption (10px, Medium) underneath.
- **Selection State**: Active tab shows solid Pandan Green (`#2E6F40`) icon; inactive tabs show muted warm grey (`#6E6A64`) icons.

### 4. Scroll Rules
- Page layouts default to vertical layouts. Horizontal scrolling is restricted to tab selection filters (Chips), image carousels, and Mini App logs.
- Scrollbars are hidden on mobile viewports but scroll indicators must pulse when lazy-loaded elements are appended.

### 5. Floating Action Button (FAB) Rules
- **Size**: 56px x 56px circular button.
- **Position**: Placed 16px from the right edge and 16px from the bottom navigation bar edge.
- **Z-Index**: Bounded at a high elevation level (z-index 1000) to override content grids.

### 6. Responsive Breakpoints
- **Mobile First**: Design scales from mobile viewport widths (320px - 480px).
- **Tablet viewport**: 481px - 768px (elements stretch, grid adjusts to 2-columns).
- **Maximum Content Width**: All layouts restrict content container widths to a maximum of 768px on larger desktop screens, centering the layout viewport.

### 7. Touch Target Sizes
- All interactive links, check buttons, tabs, and action boxes must occupy a minimum hit-box target of 48px x 48px to prevent touch alignment errors.

---

## Information Architecture & Sitemap

### Unified Information Architecture
- **Auth Module**: Handles registration, sign-in validation, session persistence, and role toggling.
- **Home Feed Module**: Pulls social posts, media assets, and product catalog tags from creators.
- **Chat Module**: Real-time communication logs containing message arrays, thread states, and checkout triggers.
- **Marketplace Module**: Consolidated database lists for search filters, product detail structures, shopping carts, and order checkouts.
- **Wallet Module**: Simulated transaction ledgers, transfer logs, virtual account models, and scanner parameters.
- **Merchant Dashboard**: Seller inventory levels, billing logs, and delivery coordinates.
- **Workspace Module**: Lightweight text notes documents, todo check lists, and calendar appointments.
- **Mini Apps Module**: Iframe sandbox registry indexing active widgets.
- **Profile Module**: Core account credentials, theme variables, and settings.

### Sitemap Layout
```text
NusaHub Root Viewport
├── Auth Modules
│   ├── SCR-01: Splash Screen
│   ├── SCR-02: Onboarding Intro
│   ├── SCR-03: Login Screen
│   ├── SCR-04: Register Screen
│   └── SCR-05: Forgot Password
├── Bottom Nav Tabs
│   ├── TAB-01: Home Feed Tab
│   │   └── SCR-07: Notifications List
│   ├── TAB-02: Chats List Tab
│   │   └── SCR-09: Chat Active Room
│   │       └── SCR-14: Checkout Sheet (Bottom Overlay)
│   ├── TAB-03: AI Assistant Tab
│   ├── TAB-04: Workspace Tab
│   │   ├── SCR-22: Notes view
│   │   ├── SCR-23: Calendar view
│   │   └── SCR-24: Tasks Checklist
│   └── TAB-05: User Profile Tab
│       └── SCR-27: Settings Screen
├── Drawer Utilities
│   ├── SCR-15: Wallet Home Screen
│   │   ├── SCR-16: Transfer Form Sheet
│   │   └── SCR-17: Transactions History List
│   └── SCR-25: Mini Apps Explorer
└── Merchant Mode Views (Role Switched)
    ├── SCR-18: Merchant Dashboard
    ├── SCR-19: Merchant Product Manager
    ├── SCR-20: Merchant Orders Console
    └── SCR-21: Merchant Analytics graphs
```

---

## Navigation System Specs

### 1. Bottom Navigation Bar
- **Description**: Persistent 5-tab bar at viewport bottom.
- **Interactions**: Tapping a tab immediately switches the active screen state, updates the URL path (or mock viewport registry), and highlights the active icon.

### 2. Side Drawer (Left Menu)
- **Description**: A panel sliding in from the left edge covering 70% viewport width.
- **Content**: User Profile Card, Wallet quick-balance card, link to Mini Apps Explorer, link to Settings.
- **Interaction**: Dismissed by tapping outside the drawer boundary or swiping left.

### 3. Context Menu
- **Description**: Overlay menu rendering beside clicked components.
- **Interactions**: Long-pressing messages or list elements reveals action links (Copy, Reply, Delete, Edit).

### 4. Floating Action Button (FAB)
- **Description**: Primary action trigger overlay.
- **Interactions**: Single tap opens contextual action modals (e.g. creating notes, appending tasks).

### 5. Deep Linking Rules
- Platform routes resolve using URL parameters:
  - `nusahub://chat?id={room_id}`: Direct route to active conversation.
  - `nusahub://product?id={item_id}`: Direct route to marketplace product detail.
  - `nusahub://wallet/transfer?user={username}`: Pre-populates wallet transfer fields.

---

## Standardized Design Tokens

### 1. Color Palette Tokens
| Token Name | Hex Value | Usage Description |
| :--- | :--- | :--- |
| `color-primary` | `#2E6F40` | Pandan Green: buttons, active tab states, highlights |
| `color-secondary` | `#D06A4C` | Terracotta warm clay: accent triggers, link highlights |
| `color-bg-light` | `#FAF6F0` | Sand Cream: primary page backgrounds (Light Mode) |
| `color-surface-light` | `#FFFFFF` | Surface White: cards, inputs, buttons, headers |
| `color-text-primary` | `#222222` | Charcoal warm grey: primary text, headers, title inputs |
| `color-text-muted` | `#6E6A64` | Muted warm grey: captions, placehold text, disabled items |
| `color-error` | `#D32F2F` | Alert Red: error states, system warning icons |
| `color-success` | `#388E3C` | Alert Green: check overlays, payment successes |
| `color-bg-dark` | `#1A1916` | Dark Cream: primary page backgrounds (Dark Mode) |
| `color-surface-dark` | `#2E2C26` | Dark Surface: dark mode cards, inputs, overlays |
| `color-text-dark` | `#F3EFE9` | Warm white: dark mode primary text |

### 2. Typography Tokens
- **Font Stack**: `font-primary = Inter, Outfit, Roboto, system-ui, sans-serif`
- **Text Scale**:
  - `font-size-display = 32px` (line-height: 40px, Weight: Bold)
  - `font-size-h1 = 24px` (line-height: 32px, Weight: Semi-Bold)
  - `font-size-h2 = 18px` (line-height: 24px, Weight: Medium)
  - `font-size-body = 14px` (line-height: 20px, Weight: Regular)
  - `font-size-caption = 12px` (line-height: 16px, Weight: Regular)

### 3. Spacing Tokens
- `space-xs = 4px`
- `space-sm = 8px`
- `space-md = 16px`
- `space-lg = 24px`
- `space-xl = 32px`
- `space-xxl = 48px`

### 4. Corner Radius Tokens
- `radius-sm = 4px` (small badges, tags, chips)
- `radius-md = 8px` (buttons, text fields, inputs)
- `radius-lg = 16px` (cards, modal containers, bottom sheets top corners)
- `radius-full = 9999px` (avatar circular boxes, pill icons)

### 5. Elevation & Shadow Tokens
- `shadow-none = none`
- `shadow-low`: `box-shadow: 0px 1px 2px rgba(34, 34, 34, 0.05)` (resting cards, headers)
- `shadow-medium`: `box-shadow: 0px 4px 12px rgba(34, 34, 34, 0.1)` (sheets, modal dialog boxes)
- `shadow-high`: `box-shadow: 0px 8px 24px rgba(34, 34, 34, 0.15)` (FAB, floating context menus)

---

## Component Library Specs

### 1. Buttons
- **Primary Button**: Solid `color-primary` fill, `color-surface-light` text, `radius-md` edges. Target height: 48px.
- **Border Button**: Transparent fill, 1px `color-primary` border, `color-primary` text, `radius-md`. Target height: 48px.
- **Ghost/Tertiary Link**: Text only, `color-secondary` text, underlined on hover. Target height: 48px.

### 2. Cards
- **Feed Card**: White surface box with low shadow, 16px padding. Renders creator avatars, post text, media images, and catalog buy cards.
- **Product Card**: Grid cell with aspect ratio 1:1 image. Bottom displays product title, price tag, and 'Buy' CTA.
- **Merchant Card**: Horizontal layout showing store logos, seller description, and order volumes.
- **Wallet Card**: Pandan Green card, displays dummy wallet balances, masked account numbers, and quick transfer action triggers.
- **Profile Card**: Displays user avatar, handle, active roles badge, and deep links to settings.

### 3. Text Fields & Input Form Controls
- **Standard Input Box**: 1px grey border, `radius-md`, 16px height padding. Border shifts to `color-primary` on focus, and to `color-error` on inputs error checks.
- **Search input Box**: Light cream surface, `radius-full`, search magnifying glass icon on the left.

### 4. Overlays & sheets
- **Dialog Modal Box**: Centered overlay modal with `shadow-medium`, 16px corner radius. Used for confirmations and warnings.
- **Bottom Sheet Drawer**: Slide-up sheet with `radius-lg` top corners, persistent close handle header on top, covers 50-80% viewport height.

### 5. Utilities Primitives
- **Toast**: Auto-dismissing banner. Green fill for successes, Red fill for errors.
- **Chat Bubble**: Sent bubble is solid primary green; received bubble is light grey.
- **Badge**: Tiny red dot indicator over icons showing unread actions counter.
- **Chip**: Oval pill button, used for category selections and filters.
- **Tabs**: Horizontal toggle bar separating sub-views.
- **Avatar**: Circular profile image container with 1px border.

---

## Screen Inventory Spec Sheet

### Module 1: Authentication

#### SCR-01: Splash Screen
- **Purpose**: Brand portal landing loading state view.
- **Main Components**: Centered logo, tagline text, loading indicator spinner.
- **Primary Actions**: None.
- **Secondary Actions**: None.
- **Navigation**: Auto-routes to Onboarding (or Home Feed if user session exists) after 2 seconds.
- **Empty State**: None.
- **Loading State**: Active centered spinner loader.
- **Error State**: Render "App validation failure" prompt with retry button if network fails.
- **Responsive Behavior**: Stretches full screen height and width. Centered container max-width 400px.
- **Implementation Priority**: Medium.
- **Sprint Notes**: Simplest static screen. Quick implementation target.

#### SCR-02: Onboarding Intro
- **Purpose**: Present core platform value propositions to new users.
- **Main Components**: Visual slider gallery, title headers, sub-text, dots indicator, and "Get Started" button.
- **Primary Actions**: Click "Get Started" ➔ navigates to Login (SCR-03).
- **Secondary Actions**: Swipe slider to navigate value cards, click "Skip" link.
- **Navigation**: "Skip" and "Get Started" route to Login (SCR-03).
- **Empty State**: None.
- **Loading State**: None.
- **Error State**: None.
- **Responsive Behavior**: Content scales to fit viewport height. Slides center dynamically.
- **Implementation Priority**: Medium.
- **Sprint Notes**: UI slides can be mocked using static cards in the prototype.

#### SCR-03: Login Screen
- **Purpose**: Authenticate user credentials.
- **Main Components**: Title header, form inputs (Email, Password), "Sign In" primary button, "Forgot Password" link, "Register Account" link.
- **Primary Actions**: Click "Sign In" ➔ validates inputs ➔ routes to Home Feed (SCR-06).
- **Secondary Actions**: Toggle password visibility, click navigation links.
- **Navigation**: Links route to Register (SCR-04) and Forgot Password (SCR-05).
- **Empty State**: None.
- **Loading State**: Disables form inputs, displays spinner loader over button.
- **Error State**: Displays inline warning messages below input fields with red outlines.
- **Responsive Behavior**: Form container max-width 400px centered horizontally on viewport.
- **Implementation Priority**: High.
- **Sprint Notes**: Essential for initial user validation. Uses local mock database credentials.

#### SCR-04: Register Screen
- **Purpose**: Create a new NusaHub user account.
- **Main Components**: Title header, form inputs (Display Name, Unique Handle, Email, Password), "Submit" primary button, "Back to Login" link.
- **Primary Actions**: Click "Submit" ➔ registers user, logs them in ➔ routes to Home Feed (SCR-06).
- **Secondary Actions**: Toggle password visibility.
- **Navigation**: Link routes back to Login (SCR-03).
- **Empty State**: None.
- **Loading State**: Disables input controls, displays spinner loader over button.
- **Error State**: Displays validation check warnings (e.g. "Handle already taken") in red text.
- **Responsive Behavior**: Form container max-width 400px centered on screen.
- **Implementation Priority**: High.
- **Sprint Notes**: Sets up the user profile schema in the mock local database.

#### SCR-05: Forgot Password
- **Purpose**: Reset user passwords.
- **Main Components**: Title description header, Email input field, "Send Reset Link" primary button, back link.
- **Primary Actions**: Click "Send Reset Link" ➔ triggers mock email alert ➔ displays success toast.
- **Secondary Actions**: None.
- **Navigation**: Link routes back to Login (SCR-03).
- **Empty State**: None.
- **Loading State**: Disables email input box, shows spinner.
- **Error State**: "Email not registered" warning inline text.
- **Responsive Behavior**: Container max-width 400px centered on viewport.
- **Implementation Priority**: Low.
- **Sprint Notes**: Can be simulated with a success alert message.

---

### Module 2: Home Feed

#### SCR-06: Home Feed
- **Purpose**: Main portal for creator posts, social interactions, and catalog links.
- **Main Components**: Search input bar, scrollable list of Feed Cards, creator avatar chevrons, likes/comments counters, attached product cards.
- **Primary Actions**: Tap attached product card link ➔ navigates to Product Detail (SCR-12).
- **Secondary Actions**: Like post, write comment, share post, click avatar to view profile.
- **Navigation**: Bottom navigation bar tabs, Left avatar click slides open Drawer menu.
- **Empty State**: "No posts logged. Swipe down to refresh." message.
- **Loading State**: Displays pulsing grey skeleton cards for posts.
- **Error State**: "Failed to load feed. Tap to retry" overlay screen.
- **Responsive Behavior**: Stretches single column. Max-width container 640px.
- **Implementation Priority**: High.
- **Sprint Notes**: The primary portal for post discovery. Key UI showcase screen.

#### SCR-07: Notifications List
- **Purpose**: Catalog user alerts and notifications.
- **Main Components**: Scrollable list of alerts (system messages, likes, new follows, orders updates).
- **Primary Actions**: Tap notification ➔ navigates to related detail screen (e.g. chat, order).
- **Secondary Actions**: Click "Mark all as read" top header link.
- **Navigation**: Top chevron back button to previous view.
- **Empty State**: "You are all caught up! No notifications." prompt.
- **Loading State**: Pulse list skeleton loaders.
- **Error State**: "Failed to update alerts" toast message.
- **Responsive Behavior**: Simple list layout scaling full viewport width.
- **Implementation Priority**: Medium.
- **Sprint Notes**: Alerts logs can be mocked in local lists.

---

### Module 3: Chats & AI

#### SCR-08: Chat List
- **Purpose**: Access active conversation rooms.
- **Main Components**: Header title, search input box, scrollable lists of chat logs, unread counts red badges, message snapshots, and a Floating Action Button (FAB).
- **Primary Actions**: Tap chat log item ➔ navigates to Chat Detail (SCR-09).
- **Secondary Actions**: Swipe left on items to delete/mute conversation, click FAB to start new chat.
- **Navigation**: Bottom navigation bar tabs, left header avatar slides open Drawer.
- **Empty State**: "No active conversations. Tap + to start chatting." message.
- **Loading State**: Skeleton loading outlines.
- **Error State**: "Chats list update failure" banner checks.
- **Responsive Behavior**: Spans full viewport width.
- **Implementation Priority**: High.
- **Sprint Notes**: Core portal for communication workflows. Key prototype feature.

#### SCR-09: Chat Detail
- **Purpose**: Active conversation room panel with integrated payment shortcuts.
- **Main Components**: Participant header title, scrollable bubble logs, input message bar, attachment controls panel, product card widget checkouts.
- **Primary Actions**: Click product card 'Buy' button ➔ opens Checkout Sheet (SCR-14).
- **Secondary Actions**: Type message, click send button, long-press bubbles for Context Menu.
- **Navigation**: Left header 'Back' arrow to Chat List (SCR-08).
- **Empty State**: "Start chatting with this contact." prompt.
- **Loading State**: Pulse message skeleton loaders.
- **Error State**: Render warning alert symbol beside undelivered chat messages.
- **Responsive Behavior**: Spans full screen, keyboard pushes viewport up on focus.
- **Implementation Priority**: High.
- **Sprint Notes**: Essential for testing the chat-commerce workflow (merging communication & checkout).

#### SCR-10: AI Assistant
- **Purpose**: Conversational AI prompt interface.
- **Main Components**: AI title header, scrollable logs of prompt actions, input text area, action tags shortcuts.
- **Primary Actions**: Submit natural language prompt (e.g. "Pay Ibu Sri Rp 50,000 for snacks").
- **Secondary Actions**: Click shortcut action tags (e.g. "Check Wallet Balance").
- **Navigation**: Bottom navigation bar tabs, left avatar opens Drawer.
- **Empty State**: "Hello! I am your AI Assistant. How can I help you today?" intro box.
- **Loading State**: Active pulsing dots loading indicator.
- **Error State**: "AI service disconnected. Tap to retry" dialog alert.
- **Responsive Behavior**: Input container remains aligned at viewport bottom.
- **Implementation Priority**: High.
- **Sprint Notes**: Focuses on text parsing logic to trigger wallet transfers and workspace checklists in the prototype.

---

### Module 4: E-Commerce & Wallet

#### SCR-11: Product List (Marketplace)
- **Purpose**: Browse and search marketplace catalogs.
- **Main Components**: Search input bar, filter Chips (Categories, Price tags), product cells grid layout.
- **Primary Actions**: Tap Product Card ➔ navigates to Product Detail (SCR-12).
- **Secondary Actions**: Select category filter chips, search query.
- **Navigation**: Bottom navigation bar tabs, left avatar opens Drawer.
- **Empty State**: "No items match your search. Try another query." prompt.
- **Loading State**: Pulse Product grid placeholder skeletons.
- **Error State**: "Marketplace updates failure. Retry" banner check.
- **Responsive Behavior**: 2 columns grid on mobile viewport. Stretches to 4 columns on tablet.
- **Implementation Priority**: High.
- **Sprint Notes**: Simple grid listing items from the local mock catalog.

#### SCR-12: Product Detail
- **Purpose**: View catalog product specifications.
- **Main Components**: Back button header, image carousel, title, price tag, merchant store metadata, description text block, "Buy Now" and "Add to Cart" bottom bar.
- **Primary Actions**: Click "Buy Now" ➔ opens Checkout Sheet (SCR-14).
- **Secondary Actions**: Click "Add to Cart" ➔ shows success toast, click merchant details link.
- **Navigation**: Back chevron routes to Marketplace list (SCR-11) or previous view.
- **Empty State**: None.
- **Loading State**: Pulsing skeleton text blocks.
- **Error State**: "Product details failed to load." dialog box.
- **Responsive Behavior**: Split screen layout on tablet viewports (image left, text right).
- **Implementation Priority**: High.
- **Sprint Notes**: Vital for verifying product specifications and description layouts.

#### SCR-13: Cart Screen
- **Purpose**: Consolidate items added for checkout.
- **Main Components**: Item list cards, checkbox controls, item counter adjustments, total pricing, "Proceed to Checkout" primary button.
- **Primary Actions**: Click "Proceed to Checkout" ➔ opens Checkout Sheet (SCR-14).
- **Secondary Actions**: Adjust quantities, delete items.
- **Navigation**: Top header back chevron.
- **Empty State**: "Your cart is empty. Start shopping in the Marketplace!" placeholder.
- **Loading State**: Disable checkboxes, render spinner.
- **Error State**: "Cart update failure" alert.
- **Responsive Behavior**: Clean list layout adapting to viewport height.
- **Implementation Priority**: Medium.
- **Sprint Notes**: Maintains cart details in a temporary array.

#### SCR-14: Checkout Sheet (Bottom Sheet)
- **Purpose**: Verify transaction detail and execute payment.
- **Main Components**: Order summary (items, pricing, shipping selection), payment method (Wallet display), "Confirm Payment" primary button.
- **Primary Actions**: Click "Confirm Payment" ➔ decrements wallet balance, decrements catalog stock ➔ routes to Success transaction view.
- **Secondary Actions**: Select shipping provider dropdown.
- **Navigation**: Swipe down sheet to close/cancel transaction.
- **Empty State**: None.
- **Loading State**: Disables confirm button, displays centered spinner overlay.
- **Error State**: Displays inline errors (e.g. "Insufficient wallet balance") in red text.
- **Responsive Behavior**: Max-width sheet 480px, snaps to viewport bottom.
- **Implementation Priority**: High.
- **Sprint Notes**: Crucial checkout overlay sheet. Links wallet balances and inventory levels.

#### SCR-15: Wallet Home Screen
- **Purpose**: Digital financial portal dashboard.
- **Main Components**: Header back button, Wallet Card (balance, masked number), Quick Action links (Transfer, Scan QR), Transaction History list, "Deposit Mock Funds" link.
- **Primary Actions**: Click 'Transfer' ➔ opens Transfer Form Sheet (SCR-16); click 'Scan QR' ➔ opens camera.
- **Secondary Actions**: Click "Deposit Mock Funds" (adds Rp 500,000 to simulated balance).
- **Navigation**: Drawer back button to previous view.
- **Empty State**: "No transactions logged." prompt.
- **Loading State**: Spinners over balance counters.
- **Error State**: "Failed to connect to wallet ledger." alert.
- **Responsive Behavior**: Balance card resizes dynamically to fit screen width.
- **Implementation Priority**: High.
- **Sprint Notes**: Core financial console. The "Deposit Mock Funds" button simplifies testing.

#### SCR-16: Transfer Form Sheet (Bottom Sheet)
- **Purpose**: Execute manual peer-to-peer wallet transfers.
- **Main Components**: Input fields (Recipient Handle, Amount, Note), "Confirm Transfer" primary button.
- **Primary Actions**: Click "Confirm Transfer" ➔ executes dummy transfer, updates balance, displays success toast.
- **Secondary Actions**: Cancel/close sheet link.
- **Navigation**: Swipe down to dismiss.
- **Empty State**: None.
- **Loading State**: Centered spinner, disables input.
- **Error State**: "Recipient handle not found" red warning inline alerts.
- **Responsive Behavior**: Centered modal container on tablet/desktop viewports.
- **Implementation Priority**: High.
- **Sprint Notes**: Links directly to the unique user handle verification logic.

#### SCR-17: Transactions History List
- **Purpose**: Review all wallet balance movements.
- **Main Components**: Scrollable lists of ledger items sorted by date, details (receiver/sender, amount, type, status).
- **Primary Actions**: Tap transaction item ➔ opens receipt popups.
- **Secondary Actions**: Filter by transaction type (Credits/Debits).
- **Navigation**: Top header back chevron.
- **Empty State**: "No transaction logs available." prompt.
- **Loading State**: Skeleton outlines list loaders.
- **Error State**: "Ledger failed to load." toast.
- **Responsive Behavior**: Stretches full width.
- **Implementation Priority**: Medium.
- **Sprint Notes**: Reads transfer arrays from the client database.

---

### Module 5: Merchant Dashboard

#### SCR-18: Merchant Dashboard
- **Purpose**: Consolidated console for seller metrics and quick links.
- **Main Components**: Quick stats cards (Today's Sales, Active Orders, Total Inventory), link buttons (Manage Products, Orders List, Analytics).
- **Primary Actions**: Tap "Manage Products" / "Orders List".
- **Secondary Actions**: Refresh metrics.
- **Navigation**: Bottom nav bar tabs (replaces profile tab when active), left drawer access.
- **Empty State**: None (defaults metrics to Rp 0 / 0 items).
- **Loading State**: Pulsing skeleton overlays on stats cards.
- **Error State**: None.
- **Responsive Behavior**: Grid layout (3 columns on tablet/desktop, vertical list on mobile viewports).
- **Implementation Priority**: High.
- **Sprint Notes**: Core portal for UMKM sellers. Simplifies business tracking in the prototype.

#### SCR-19: Merchant Product Manager (Inventory List)
- **Purpose**: Manage store marketplace listings.
- **Main Components**: Inventory list grid cards, details (title, price, stock quantity, status), edit/delete button, FAB "Add Product".
- **Primary Actions**: Click FAB "Add Product" ➔ opens product edit sheet.
- **Secondary Actions**: Click edit product, click delete product, toggle status checkbox.
- **Navigation**: Top header back button to dashboard.
- **Empty State**: "Your catalog is empty. Click + to add your first product!" prompt.
- **Loading State**: Skeleton loaders for listing items.
- **Error State**: "Failed to load product logs." alerts.
- **Responsive Behavior**: Adapts grid cells dynamically based on width.
- **Implementation Priority**: High.
- **Sprint Notes**: Edits catalog arrays in the mock local database.

#### SCR-20: Merchant Orders Console
- **Purpose**: Manage and fulfill incoming customer orders.
- **Main Components**: Order list items, order status badges (Pending, Fulfilling, Shipped), items details, customer name and delivery address, "Approve & Book Courier" primary button.
- **Primary Actions**: Click "Approve & Book Courier" ➔ updates order status to Shipped ➔ shows success toast.
- **Secondary Actions**: Click "Cancel Order".
- **Navigation**: Top header back chevron.
- **Empty State**: "No active orders. Pull down to refresh." prompt.
- **Loading State**: Spinners over status updates.
- **Error State**: "Fulfillment validation failure" toast alert.
- **Responsive Behavior**: Stretches single column.
- **Implementation Priority**: High.
- **Sprint Notes**: Crucial orders tracking log matching customer checkout workflows.

#### SCR-21: Merchant Analytics
- **Purpose**: View store sales reports.
- **Main Components**: Sales bar graph, top-selling products list, total income summary metrics.
- **Primary Actions**: Select report date range filter.
- **Secondary Actions**: None.
- **Navigation**: Top header back button.
- **Empty State**: "No sales logs available for this period." prompt.
- **Loading State**: Spinner over graph boxes.
- **Error State**: "Analytics offline." banner.
- **Responsive Behavior**: Graph containers resize to fit viewport widths.
- **Implementation Priority**: Low.
- **Sprint Notes**: Graphs can be simulated using static placeholders.

---

### Module 6: Workspace & Profile

#### SCR-22: Workspace Notes
- **Purpose**: Personal markdown drafting workspace.
- **Main Components**: Notes list view, title, body content preview, last modified date, FAB "New Note".
- **Primary Actions**: Click FAB "New Note" ➔ opens Editor; click note item ➔ opens note editor.
- **Secondary Actions**: Click delete note.
- **Navigation**: Bottom navigation bar tabs, left drawer access.
- **Empty State**: "Your notes block is empty. Tap + to start writing." prompt.
- **Loading State**: Pulse list placeholders.
- **Error State**: None.
- **Responsive Behavior**: Split view pane on tablet viewports (notes list left, active editor right).
- **Implementation Priority**: High.
- **Sprint Notes**: A clean notepad tool using local database variables.

#### SCR-23: Workspace Calendar
- **Purpose**: Track appointments and events.
- **Main Components**: Monthly grid view, daily schedule list pane, FAB "Add Event".
- **Primary Actions**: Click grid date ➔ shows daily schedule; click FAB "Add Event" ➔ opens event modal.
- **Secondary Actions**: None.
- **Navigation**: Bottom navigation bar tabs, left drawer access.
- **Empty State**: "No events scheduled for this day." prompt.
- **Loading State**: None.
- **Error State**: None.
- **Responsive Behavior**: Monthly grid scales to fit viewport dimensions.
- **Implementation Priority**: Medium.
- **Sprint Notes**: Calendar can be simulated using a basic HTML table.

#### SCR-24: Workspace Tasks
- **Purpose**: Personal checklist manager.
- **Main Components**: Checklist list logs, checkbox triggers, input "Add Task" box, active/completed filters.
- **Primary Actions**: Toggle task checkbox ➔ marks completed; type text and click "Add" ➔ appends task.
- **Secondary Actions**: Click delete task.
- **Navigation**: Bottom navigation bar tabs, left drawer access.
- **Empty State**: "All caught up! No active tasks." prompt.
- **Loading State**: Pulse text skeletons.
- **Error State**: None.
- **Responsive Behavior**: Stretches full viewport width.
- **Implementation Priority**: High.
- **Sprint Notes**: Checklist functions directly inside the local array context.

#### SCR-25: Mini Apps Explorer
- **Purpose**: Index portal to load lightweight sandboxed widgets.
- **Main Components**: Search bar, category segments (utilities, games, productivity), Mini App icon cards.
- **Primary Actions**: Tap Mini App card ➔ opens iframe overlay viewer.
- **Secondary Actions**: None.
- **Navigation**: Drawer back button.
- **Empty State**: "No Mini Apps matched your search query." prompt.
- **Loading State**: Pulse grid skeletons.
- **Error State**: "Registry unavailable." toast alert.
- **Responsive Behavior**: Grid adapts to fill width.
- **Implementation Priority**: Medium.
- **Sprint Notes**: Simulates loading a lightweight widget within an iframe.

#### SCR-26: User Profile
- **Purpose**: Account overview and role toggle portal.
- **Main Components**: User avatar display, display name, handle text, mode toggle console switcher, settings links.
- **Primary Actions**: Toggle "Switch to Merchant/Creator Mode" switch ➔ reloads core dashboards.
- **Secondary Actions**: Click settings links, click Log Out.
- **Navigation**: Bottom navigation bar tabs, left drawer access.
- **Empty State**: None.
- **Loading State**: Spinner loader over switch modes toggles.
- **Error State**: None.
- **Responsive Behavior**: Card items centered on viewport.
- **Implementation Priority**: High.
- **Sprint Notes**: Essential switcher interface. Toggles layouts in the client browser session.

#### SCR-27: Settings Screen
- **Purpose**: General system setting updates.
- **Main Components**: Option list items (Profile Settings, Theme selections, Privacy permissions, App info).
- **Primary Actions**: Toggle Theme (Light / Dark mode).
- **Secondary Actions**: None.
- **Navigation**: Top header chevron back button to Profile.
- **Empty State**: None.
- **Loading State**: None.
- **Error State**: None.
- **Responsive Behavior**: Vertical scrollable list.
- **Implementation Priority**: Medium.
- **Sprint Notes**: Toggle theme changes the active Design Token variables class in the prototype context.

---

## Interaction Guidelines

### 1. Interactive Element States
- **Hover**: 10% background overlay opacity changes, mouse cursor set to pointer.
- **Focus**: Render a 2px primary green (`#2E6F40`) outline border around text input fields.
- **Active / Pressed**: Tap action triggers an immediate 98% scale transition on buttons and links.

### 2. Operational Feedback
- **Loading Overlay**: Disable interaction controls, render centered spinner over cards.
- **Success Overlay**: Display checkmark vector animation, auto-dismiss in 1.5 seconds.
- **Error Dialogue**: Centered overlay modal detailing failure, primary button "Retry".
- **Empty State Layout**: Display warm illustrations, title description, and a single call-to-action button.

### 3. Scroll & Lazy Loading Patterns
- **Pull to Refresh**: Dragging lists down triggers data fetch calls and spinner alerts.
- **Infinite Scroll**: Viewport bottom detection appends next items array list, displaying pulsing grey placeholder shape skeletons to prevent layouts shift.

### 4. Search & Gestures
- **Search bar**: Evaluates keyword inputs, updates list items in real-time, displays "Clear" button.
- **Swipes**: Swipe left on items to reveal delete or delete confirmation buttons.

---

## Review Status
- **Reviewer**: Product Manager (ChatGPT)
- **Status**: Under Review
- **Approval Date**: Pending

---

## Related Documents
- **[docs/01-discovery/01-Problem-Discovery.md](01-Problem-Discovery.md)**: Problem definitions and device limits.
- **[docs/03-product/PRD.md](../03-product/PRD.md)**: MVP scopes and functional specifications mapping.
- **[PROJECT_MANIFEST.md](../../PROJECT_MANIFEST.md)**: Product design system guidelines.
- **[AGENTS.md](../../AGENTS.md)**: Role boundaries contract.
