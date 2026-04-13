# Product Requirements Document

**Project:** Spare Parts Inventory Module  
**Author:** Sergio  
**Date:** April 2026  
**Version:** 1.0  
**Reference:** product-brief.md  

---

## 1. Overview

This PRD defines the full feature requirements for the Spare Parts Inventory Module. It expands on the Product Brief by specifying exact functionality, data fields, acceptance criteria, and edge cases. This document serves as the source of truth for the Architecture and Development phases.

---

## 2. Feature List & Priorities

| ID | Feature | Priority | Description |
|---|---|---|---|
| F-01 | View all parts | P1 | Display all parts in a sortable table with key fields visible at a glance |
| F-02 | Add a part | P1 | Form to create a new part with all required fields |
| F-03 | Edit a part | P1 | Inline or modal form to update any field on an existing part |
| F-04 | Delete a part | P1 | Remove a part with a confirmation step to prevent accidental deletion |
| F-05 | Low-stock alert | P1 | Visual flag on any part where quantity is at or below its threshold |
| F-06 | Search & filter | P2 | Filter the parts table by name or category in real time |
| F-07 | Sort columns | P3 | Click column headers to sort ascending/descending |

---

## 3. Data Model

| Field | Type | Required | Notes |
|---|---|---|---|
| id | Integer | Yes | Auto-generated primary key |
| name | String | Yes | Human-readable part name, max 100 chars |
| sku | String | Yes | Unique identifier for the part, max 50 chars |
| category | String | No | Used for filtering (e.g. Electrical, Mechanical) |
| quantity | Integer | Yes | Current stock count, must be ≥ 0 |
| threshold | Integer | Yes | Minimum quantity before low-stock alert triggers |
| location | String | No | Storage location (e.g. Shelf A3, Cabinet 2) |
| notes | String | No | Free text field for any additional context |
| created_at | Timestamp | Yes | Auto-set on creation |
| updated_at | Timestamp | Yes | Auto-updated on every save |

---

## 4. Acceptance Criteria

| Feature | Acceptance Criteria |
|---|---|
| F-01 View parts | All parts load on page open. Table shows name, SKU, category, quantity, threshold, location. Empty state shows a message if no parts exist. |
| F-02 Add part | Form validates required fields before submit. Duplicate SKU is rejected with an error message. On success, new part appears in table immediately without page refresh. |
| F-03 Edit part | All fields are editable. Changes persist after save. Table reflects updated values immediately. |
| F-04 Delete part | User sees a confirmation prompt before deletion. On confirm, part is removed from table immediately. Action cannot be undone. |
| F-05 Low-stock | Any part where quantity ≤ threshold displays a visible warning indicator. Updates in real time when quantity is edited. |
| F-06 Search | Typing in the search box filters the table in real time. Matches on name or category. Clearing the box restores all parts. |

---

## 5. API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/parts | Return all parts as JSON array |
| POST | /api/parts | Create a new part from request body |
| PUT | /api/parts/:id | Update all fields of an existing part |
| DELETE | /api/parts/:id | Delete a part by ID |

---

## 6. Non-Functional Requirements

- App runs locally with a single start command for both frontend and backend
- No authentication required — single user assumption
- All data persists in SQLite — no external database setup needed
- App must function fully offline after initial setup
- No third-party UI component libraries — plain React and CSS only

---

## 7. Out of Scope

- User authentication and role management
- Supplier or vendor tracking
- Purchase order generation
- Barcode or QR code scanning
- Multi-location or warehouse support
- Reporting, analytics, or export features
- Email or push notifications
- Mobile app or responsive mobile design