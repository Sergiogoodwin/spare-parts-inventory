# Spare Parts Inventory Module

A lightweight web application for tracking mechanical and electrical spare 
parts inventory. Built to give small maintenance teams real-time visibility 
into stock levels, with automatic low-stock alerts to prevent unplanned 
downtime.

This project was built using the **BMAD Method** — a structured 
AI-assisted development workflow that emphasizes planning and documentation 
before writing code. Each phase (Brief → PRD → Architecture → Development) 
produced a living document that informed the next, with Cursor (AI-powered 
IDE) used throughout the build phase.

## BMAD Process Documentation
The full paper trail of the build process lives in the `/docs` folder:
- [Product Brief](docs/product-brief.md) — problem statement, goals, 
  scope, and target user
- [PRD](docs/prd.md) — detailed feature requirements and acceptance 
  criteria
- [Architecture](docs/architecture.md) — technical decisions, data model, 
  API design, and component structure

## Tech Stack
| Layer | Technology | Reason |
|---|---|---|
| Frontend | React + Vite | Component-based UI, fast dev server |
| Backend | Flask (Python) | Lightweight REST API, minimal setup |
| Database | SQLite | Zero config, file-based, perfect for scope |
| IDE | Cursor | AI-assisted development throughout |

## Features
- View all parts in a sortable table
- Add, edit, and delete parts
- Visual low-stock alerts when quantity falls below threshold
- Search and filter by name or category

## Running Locally
*Setup instructions coming after build phase.*