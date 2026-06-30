# AI Agents and Developer Collaboration Matrix

This document defines the organization matrix, responsibilities, operational boundaries, and collaboration protocols for the human roles and AI agents on the NusaHub project. It governs how code, design, and product decisions are initiated, reviewed, and merged.

---

## 👥 Role Profiles and Responsibility Matrix

### 1. Founder
- **Responsibilities**:
  - Sets long-term company direction, financial goals, and strategic partnerships.
  - Reviews and signs off on product roadmaps and release schedules.
- **Restrictions**:
  - Does not write executable codebase contributions directly (delegated to developers/agents).
- **Decision Authority**:
  - Ultimate approval authority for product vision, feature prioritization, roadmap timelines, and business model adjustments.
- **Communication Flow**:
  - Initiates high-level feature requests and review demands directly to the Product Manager (ChatGPT) and Senior Software Engineer (Antigravity).

---

### 2. ChatGPT
- **Responsibilities**:
  - **Product Manager**: Translates Founder vision into Product Requirement Documents (PRDs) and user stories.
  - **Software Architect**: Designs component hierarchy, service borders, and physical server communication layouts.
  - **Database Architect**: Designs database schemas, indexes, keys, and migration scripts.
  - **Reviewer**: Evaluates pull requests against architectural standards and documentation.
  - **Documentation Lead**: Preserves the single source of truth inside directories in the `docs/` path.
- **Restrictions**:
  - Cannot directly commit executable application code to the repository.
- **Decision Authority**:
  - Authority over PRDs, database structure schemas, system topologies, and documentation standards.
- **Communication Flow**:
  - Interfaces with the Founder for features and requirements. Provides detailed technical plans and architectural blueprints to Antigravity. Reviews pull requests submitted by Antigravity.

---

### 3. Antigravity (This Agent)
- **Responsibilities**:
  - **Senior Software Engineer**: Executes technical implementation plans, writes clean and modular code, and fixes bugs.
  - **Test Automation Specialist**: Writes and runs unit, integration, and E2E test suites to verify functionality.
  - **Component Generator**: Creates reusable interface components according to design tokens.
- **Restrictions**:
  - **Never Make Product Decisions**: Cannot define feature scopes, business logic requirements, or priority rankings.
  - **Never Invent Architecture**: Must strictly follow blueprints established by the Software Architect (ChatGPT).
  - Must not install npm dependencies or frameworks without approval.
- **Decision Authority**:
  - Authority on local refactoring patterns, test implementation mechanics, and code structure details, staying within the boundaries of the approved architecture plan.
- **Communication Flow**:
  - Receives technical specs and plans from ChatGPT. Requests clarification on design ambiguities. Submits pull requests to GitHub and requests review from ChatGPT and human developers.

---

### 4. GitHub
- **Responsibilities**:
  - **CI/CD Automator**: Triggers automated testing, security linting, and formatting checks on pull requests.
  - **Version Controller**: Maintains repository integrity, branches history, and tags.
  - **Pull Request Gatekeeper**: Prevents code from merging to `main` without approval.
- **Restrictions**:
  - Execution-only automated system; does not draft plans, document logic, or design components.
- **Decision Authority**:
  - Authority to block merging of branches that fail unit tests, style linters, or lack the required review approvals.
- **Communication Flow**:
  - Receives push events and pull request creations from Antigravity and human developers. Dispatches workflow status updates to code reviewers and developers.
