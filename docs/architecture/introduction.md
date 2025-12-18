# Introduction

This document outlines the complete fullstack architecture for **SimpleConf**, including backend systems, frontend implementation, and their integration. It serves as the single source of truth for AI-driven development, ensuring consistency across the entire technology stack.

This unified approach combines what would traditionally be separate backend and frontend architecture documents, streamlining the development process for modern fullstack applications where these concerns are increasingly intertwined.

## Starter Template / Existing Project

**Existing Frontend:** The project leverages a v0.dev-generated Next.js application located at `/app-shell-layout/` with the following pre-configured choices:

| Aspect | Pre-configured Choice |
|--------|----------------------|
| Framework | Next.js 16 (App Router) |
| React | React 19 |
| UI Library | shadcn/ui (Radix + Tailwind CSS 4) |
| Styling | Tailwind CSS 4 with PostCSS |
| Forms | react-hook-form + zod |
| Markdown | react-markdown + react-syntax-highlighter |
| State | React Context + useState |
| Toasts | sonner |

**Architectural Constraints from Frontend:**
- Must integrate with separate Fastify backend via REST API
- Frontend expects REST-like endpoints (based on component structure)
- Authentication UI already built — backend must match expected auth flow

## Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2024-12-18 | 1.0 | Initial architecture document | Winston (Architect Agent) |

---
