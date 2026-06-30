# Design System Specification

## Executive Summary
This document defines the original visual design system for NusaHub, including the color palette, typography, grid spacing, elevation levels, and design assets. It establishes a warm, minimal, and highly accessible user experience.

## Main Analysis

### 1. Design Philosophy
- **Modern & Minimal**: Focus on clean visual structures, white spaces, and content-first hierarchies, avoiding heavy decorative elements.
- **Warm & Friendly**: Incorporating earthy, warm color tokens to make digital banking and business tools feel inclusive and accessible to Indonesian users.

### 2. Warm Color Palette
- **Primary**: *Pandan green* (Warm olive-tinted green) âž” Hex #2E6F40.
- **Secondary**: *Terracotta warm clay* (Accent color) âž” Hex #D06A4C.
- **Backgrounds**: *Sand cream* (Neutral soft warm white) âž” Hex #FAF6F0 (light mode).
- **Surfaces**: Pure white #FFFFFF (for cards, inputs, buttons).
- **Text Primary**: Charcoal warm grey âž” Hex #222222.
- **Text Secondary**: Muted warm grey âž” Hex #6E6A64.

### 3. Typography
- **Primary Typeface**: Sans-serif system font stack (Inter, Outfit, Roboto).
- **Hierarchy Scale**:
  - *Display Header*: 32px, Bold.
  - *Title H1*: 24px, Semi-Bold.
  - *Sub-title H2*: 18px, Medium.
  - *Body Text*: 14px, Regular.
  - *Muted Caption*: 12px, Regular.

### 4. Spacing, Grid & Layouts
- **Spacing Scale**: Base-8 spacing scale (8px, 16px, 24px, 32px, 48px, 64px).
- **Mobile Grid**: 4-column layouts, 16px side margins, 12px gutters.
- **Responsive Layout**: Adapts dynamically up to single-column desktop views (max-width 768px for portal layouts).

### 5. Elevation & Corner Radius
- **Shadow Levels**:
  - *Low Elevation*: 2px blur shadow, y-offset 1px.
  - *Medium Elevation*: 8px blur shadow, y-offset 4px (for sheets and dialogs).
- **Corner Radius Scale**:
  - *Medium (Buttons, Inputs)*: 8px.
  - *Large (Cards)*: 16px.
  - *Full (Avatars, Tags)*: 9999px.

### 6. Accessibility & Dark Mode
- **Contrast**: Main text tokens must maintain a minimum 4.5:1 contrast ratio against cream surfaces.
- **Dark Mode**: Backgrounds shift to #1A1916 (Deep warm dark), surfaces to #2E2C26, and text to #F3EFE9.

## Key Insights
- **No Harsh White/Black**: Avoiding stark #FFF and #000 values reduces screen eye-strain during extended chat and task management sessions.
- **Cream Warmth for Inclusivity**: The sand cream and pandan green colors differentiate NusaHub from cold, corporate blue banking applications.

## Decision Impact
- **06-Component-Library.md**: Primitives must import color, typography, and spacing tokens exactly as defined here.

## Review Status
- **Reviewer**: Product Manager (ChatGPT)
- **Status**: Under Review
- **Approval Date**: Pending

## Related Documents
- [06-Component-Library.md](06-Component-Library.md)
- [08-Interaction-Guidelines.md](08-Interaction-Guidelines.md)
