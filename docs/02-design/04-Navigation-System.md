# Navigation System Specification

## Executive Summary
This document outlines the layout, visual design, and interactive behaviors for the four core navigation components of the NusaHub MVP: the Bottom Navigation Bar, the Drawer (Side Menu), Context Menus, and the Floating Action Button (FAB).

## Main Analysis

### 1. Bottom Navigation Bar
- **Position**: Persistent at the bottom of the device viewport.
- **Items**:
  1. *Feed*: Portal to creator posts and social updates.
  2. *Chats*: Access to personal messaging rooms.
  3. *AI Assistant*: Central natural language prompt interface.
  4. *Workspace*: Notes, tasks, and calendar.
  5. *Profile*: User settings and mode toggle console.
- **Visual Design**: Subtle primary background color with inactive icons, shifting to active color state with micro-animations when tapped.

### 2. Drawer (Side Menu)
- **Position**: Slides in from the left edge of the viewport.
- **Triggers**: Click on the user's avatar image inside top headers.
- **Content**:
  - Wallet balance quick overview with deep links to Wallet details.
  - Active Mini Apps history list.
  - Settings portal link.
  - App Version.

### 3. Context Menu
- **Triggers**: Long-press on chats, post items, notes list items, or messages.
- **Actions**:
  - *Messages*: Copy, Reply, Delete, Forward.
  - *Chats*: Pin to top, Mute alerts, Archive.
  - *Notes/Tasks*: Edit, Delete, Share.

### 4. Floating Action Button (FAB)
- **Home Feed**: Tapping FAB opens a 'Create Post' overlay window.
- **Chats Tab**: Tapping FAB opens a 'New Conversation' select menu.
- **Workspace Notes**: Tapping FAB opens a 'New Note' blank draft interface.

## Key Insights
- **Persistent Bottom Access**: Placing all core tabs on the bottom navigation bar ensures easy thumb-reach on mobile layouts.
- **Drawer for Secondary Utilities**: Using the left-sliding drawer for tools like Wallet and Mini App records prevents clutter on the main screen layouts.

## Decision Impact
- **05-Design-System.md**: Navigation spacing, shadows, and click-target areas must match Design System layouts.
- **09-UI-Screen-Specifications.md**: Defines persistent navigation bars on all screen spec layouts.

## Review Status
- **Reviewer**: Product Manager (ChatGPT)
- **Status**: Under Review
- **Approval Date**: Pending

## Related Documents
- [01-Sitemap.md](01-Sitemap.md)
- [03-User-Flows.md](03-User-Flows.md)
