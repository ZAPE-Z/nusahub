# Interaction Guidelines

## Executive Summary
This document specifies the standard interactive state feedback, gestures, scroll behaviors, loading states, and error handling rules for the NusaHub MVP interface. It ensures a highly responsive and predictable user experience.

## Main Analysis

### 1. Interactive Button & Link States
- **Hover State (Web/Desktop)**: Button backgrounds fade by 10% opacity; underline added to text links.
- **Focus State**: Render a 2px primary green outline around text inputs, buttons, and selectable list items.
- **Active (Pressed) State**: Interactive elements scale down slightly (98% scale) when tapped to simulate physical feedback.
- **Disabled State**: Opacity reduced to 30%, mouse pointer set to not-allowed.

### 2. Loading State Feedback
- **Skeleton Loading**: Used for the Home Feed and Marketplace listings. Displays light grey pulsing shapes mimicking layout outlines.
- **Spinner Loader**: Used for form submissions, login loading, and payment check overlays. A small, green rotating spinner centered on the action card.

### 3. Error, Success & Empty States
- **Empty State**: Simple center illustration, warm title caption, and a primary action button (e.g. "Create Note").
- **Error State Dialog**: Modal displaying a warn icon, short descriptive explanation, and a "Retry" primary button.
- **Success State Overlay**: Short overlay checkmark animations, auto-dismissing after 1.5 seconds.

### 4. Gestures & Scroll Behaviors
- **Pull to Refresh**: Pulling down on lists (Home Feed, ChatsList, Inventory) triggers page reload and refreshes data indicators.
- **Infinite Scroll**: Scrolling down to 80% viewport height triggers lazy loading for additional list items.
- **Swipe Actions**: Swiping left on items in lists (chats, tasks, notes) reveals context options (e.g., delete, archive).

## Key Insights
- **Feedback Assurance**: Every user action (clicks, taps, submissions) must trigger immediate feedback (e.g. active scales, spinners) within 100ms to prevent duplicate taps.
- **Reduced Layout Shifts**: Skeleton loading outlines prevent layout shifts when lazy-loading media assets, preserving user scroll positions.

## Decision Impact
- **09-UI-Screen-Specifications.md**: All UI screen spec states (loading, empty, error) must follow guidelines mapped here.

## Review Status
- **Reviewer**: Product Manager (ChatGPT)
- **Status**: Under Review
- **Approval Date**: Pending

## Related Documents
- [05-Design-System.md](05-Design-System.md)
- [06-Component-Library.md](06-Component-Library.md)
