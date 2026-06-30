# Reusable Component Library Specification

## Executive Summary
This document defines the specification guidelines for all reusable user interface components used across the NusaHub MVP. It provides designers and engineers with standard parameter rules for inputs, buttons, sheets, and overlays.

## Main Analysis

### 1. Button Library
- **Primary Solid Button**:
  - *Style*: Solid primary green background, white text, bold font, 8px corner radius.
  - *States*: Enabled, Pressed (opacity 0.8), Disabled (grey background).
- **Secondary Border Button**:
  - *Style*: Transparent background, primary green border line (1px width), green text, 8px corner radius.
- **Tertiary Link Button**:
  - *Style*: Text only, accent terracotta color, underline on hover.

### 2. Input Fields
- **Text Input Box**:
  - *Style*: 1px warm grey border, white surface, 8px corner radius, 12px horizontal padding.
  - *Active state*: Border color shifts to primary green.
  - *Error state*: Border color shifts to error red.
- **Search Input Bar**:
  - *Style*: Muted warm grey background, rounded full edges (9999px), magnifying glass icon on left.

### 3. Cards
- **Product Catalog Card**:
  - *Structure*: Aspect ratio 1:1 image box on top, Title, price caption below, bottom right Primary action button.
  - *Elevation*: Low shadow, 16px corner radius.
- **Chat Checkout Card**:
  - *Structure*: Horizontally aligned card. Left 48px product image, middle title and price, right 'Buy' button trigger.

### 4. Overlays & Sheets
- **Bottom Sheet Drawer**:
  - *Style*: Slides up from screen bottom, covers 50-80% viewport height, rounded top edges (16px).
- **Dialog Modal Box**:
  - *Style*: Centered on screen viewport, medium elevation shadow, 16px corner radius.

## Key Insights
- **Standardized Click Targets**: All touch targets for buttons, inputs, and list links maintain a minimum dimension of 48px to prevent touch alignment errors.
- **Self-Contained Card Structures**: Cards are modular and encapsulate their own details, making them easily portable to Home Feed feeds or Chat lists.

## Decision Impact
- **09-UI-Screen-Specifications.md**: All screen specification sheets reference components defined in this library.

## Review Status
- **Reviewer**: Product Manager (ChatGPT)
- **Status**: Under Review
- **Approval Date**: Pending

## Related Documents
- [05-Design-System.md](05-Design-System.md)
- [08-Interaction-Guidelines.md](08-Interaction-Guidelines.md)
