# Product Requirements Document (PRD)

# Arunachal Tourism CRM & Expedition Platform

---

# 1. Document Overview

## Product Name
Arunachal Expedition CRM & Tourism Platform

## Version
v1.0

## Date
24 May 2026

## Author
Aditya Kumar

## Stakeholders
- Founder / Business Owner
- Travel Operations Team
- Finance Team
- Admin Team
- Tour Managers
- Developers
- Designers
- End Customers

## Product Vision
Create a premium cinematic tourism platform combined with a powerful operational CRM system for managing Arunachal Pradesh tourism trips.

The system should:
- Inspire travelers visually
- Simplify trip operations
- Manage group bookings
- Track profits and revenue
- Streamline itinerary planning
- Centralize all trip operations

---

# 2. Executive Summary

The Arunachal Tourism CRM & Expedition Platform is a full-stack travel management ecosystem designed for curated tourism experiences across Arunachal Pradesh.

The product combines:

1. A visually immersive luxury tourism website
2. A centralized admin CRM dashboard
3. Dynamic itinerary management
4. Group and solo traveler bookings
5. Revenue and expense tracking
6. Trip planning workflows
7. Booking and payment management

The frontend experience focuses heavily on premium visual storytelling inspired by cinematic travel brands.

The backend CRM focuses on operational efficiency.

The platform supports only curated destinations:
- Tawang
- Ziro
- Mechuka
- Anini

---

# 3. Problem Statement

## Current Problems

Travel operators currently face multiple operational inefficiencies:

| Problem | Impact |
|---|---|
| Manual trip planning in spreadsheets | High operational overhead |
| No centralized booking workflow | Data inconsistency |
| No structured itinerary management | Slow execution |
| No revenue/profit visibility | Weak business analytics |
| Group travel handled manually | Booking confusion |
| Customer document management difficult | Compliance issues |
| Poor tourism website design | Low conversion rates |

## Why Solve This Now

The premium adventure tourism market is growing rapidly.

However:
- Most operators still run manually.
- Existing travel CRMs are generic.
- Arunachal tourism requires custom itinerary handling.
- Customers expect premium digital experiences.

This platform solves both:
- Customer acquisition
- Internal operational management

---

# 4. Goals & Objectives

## Primary Goals

| Goal | KPI |
|---|---|
| Increase booking conversions | +40% |
| Reduce manual operational work | -70% |
| Centralize trip management | 100% CRM usage |
| Improve customer experience | Booking flow < 5 min |
| Improve revenue visibility | Real-time dashboard |

## Secondary Goals

- GST-ready invoicing
- Scalable booking architecture
- Mobile responsiveness
- Dynamic itinerary building
- Expandable location system

---

# 5. Target Audience & User Personas

## User Segments

| Segment | Description |
|---|---|
| Solo Travelers | Adventure travelers |
| Group Travelers | Friends/family groups |
| Trekking Tourists | Nature & hiking focused |
| Luxury Tourists | Premium travel experiences |
| Admin Operators | Internal planning staff |

---

## Persona 1 — Solo Adventure Traveler

| Attribute | Value |
|---|---|
| Age | 24-35 |
| Goal | Explore Arunachal safely |
| Pain Point | Complex planning |
| Motivation | Premium adventure |

---

## Persona 2 — Group Travelers

| Attribute | Value |
|---|---|
| Group Size | 3-15 |
| Goal | Shared experiences |
| Pain Point | Managing group logistics |
| Motivation | Organized travel |

---

## Persona 3 — Admin Operator

| Attribute | Value |
|---|---|
| Goal | Manage operations efficiently |
| Pain Point | Manual spreadsheets |
| Motivation | Operational visibility |

---

# 6. Product Scope

## In Scope

### Public Tourism Website
- Landing page
- Destinations page
- Tour package pages
- Dynamic itinerary sections
- Gallery
- Testimonials
- Booking forms
- CTA sections
- Responsive design

### Customer Features
- Solo booking
- Group booking
- Aadhaar uploads
- Installment payments
- Booking confirmation
- Itinerary viewing

### Admin CRM Features
- Trip creation
- Booking management
- Revenue dashboard
- Expense tracking
- Calendar planning
- Stay management
- Itinerary builder
- Profit tracking

---

## Out of Scope (V1)

- Flight booking
- Hotel APIs
- Mobile app
- Vendor marketplace
- AI chatbot
- Multi-language support
- Dynamic pricing engine

---

# 7. Website UX/UI Requirements

## Design Direction

The UI should feel:
- Premium
- Cinematic
- Minimal
- Emotional
- Luxury travel focused

The uploaded design reference should inspire:
- Layout
- Typography
- Hero sections
- Image placements
- Card design
- Visual hierarchy

---

## Visual Design Language

| Component | Style |
|---|---|
| Hero Banner | Full-screen cinematic |
| Navbar | Transparent glassmorphism |
| Cards | Rounded with soft shadows |
| Buttons | Pill-shaped minimal |
| Typography | Elegant modern sans-serif |
| Galleries | Large immersive imagery |
| Animations | Smooth transitions |

---

## Website Sections

### Landing Page

#### Hero Section
- Fullscreen destination video/image
- Animated CTA
- Destination highlights
- Quick package cards

#### Featured Destinations
- Tawang
- Ziro
- Mechuka
- Anini

#### Tour Cards
Each tour card should include:
- Destination image
- Days count
- Price
- CTA button
- Quick itinerary

#### Testimonials
- Customer stories
- Review cards
- User images

#### How Booking Works
- Step-by-step booking flow

#### Footer
- Contact info
- Social links
- Newsletter

---

# 8. Supported Destinations

## Allowed Locations

| State | Location |
|---|---|
| Arunachal Pradesh | Tawang |
| Arunachal Pradesh | Ziro |
| Arunachal Pradesh | Mechuka |
| Arunachal Pradesh | Anini |

The admin can ONLY create itineraries using these locations.

---

# 9. Trip & Itinerary System

## Tawang Itinerary Example

| Day | Stay Location | Properties |
|---|---|---|
| Day 1 | Sangti Valley | P1, P2, P3 |
| Day 2 | Dirang | P1, P2 |
| Day 3 | Tawang | Multiple |
| Day 4 | Tawang | Multiple |
| Day 5 | Jamiri | Multiple |

---

## Visiting Places

| Location | Visiting Places |
|---|---|
| Tawang | Jang |
| Tawang | Jaswant Garh |
| Tawang | Sela |
| Tawang | Tawang War Memorial |

---

## Admin Itinerary Features

Admin can:
- Add day-wise itineraries
- Assign stay locations
- Add visiting places
- Add inclusions/exclusions
- Add trek activities
- Add vehicle types
- Add pricing

---

# 10. Booking Form Requirements

## Main Booking Form

The booking form is the primary customer conversion flow.

---

## Personal Information Fields

| Field | Type | Required |
|---|---|---|
| First Name | Text | Yes |
| Middle Name | Text | No |
| Last Name | Text | Yes |
| Email ID | Email | Yes |
| Address | Textarea | Yes |
| Pin | Number | Yes |
| Contact Number | Phone | Yes |
| Date of Birth | Date | Yes |
| Gender | Dropdown | Yes |
| Upload Aadhaar Card | File Upload | Yes |

---

## Booking Information

| Field | Type |
|---|---|
| Solo / Group | Toggle |
| Number of People | Number |
| Trip Selection | Dropdown |
| Start Date | Date |
| End Date | Date |
| Booking Amount | Currency |

---

## Group Booking Flow

If group booking selected:

- Generate Group Booking ID
- Attach multiple travelers to same group
- Each traveler uploads Aadhaar separately
- Shared itinerary under one booking

---

# 11. Booking ID Generation Logic

## Format

Example:

H2601-Tawang-6-1605-2005-Satish

Breakdown:

| Segment | Meaning |
|---|---|
| H2601 | Unique trip identifier |
| Tawang | Destination |
| 6 | Number of days |
| 1605 | Start date |
| 2005 | End date |
| Satish | Customer name |

---

# 12. Admin Dashboard Requirements

## Dashboard Overview

The admin dashboard should provide complete operational visibility.

---

## KPI Cards

| KPI | Description |
|---|---|
| Total Revenue | Gross revenue |
| Total Profit | Revenue - expenses |
| Total Expenses | Operational costs |
| Active Trips | Running trips |
| Pending Payments | Outstanding dues |
| Completed Trips | Closed trips |
| Monthly Bookings | Monthly trend |
| Average Booking Value | Revenue/bookings |

---

## Analytics Charts

| Chart | Type |
|---|---|
| Revenue Trend | Line Chart |
| Booking Distribution | Pie Chart |
| Monthly Bookings | Bar Chart |
| Location Popularity | Horizontal Bar |
| Expense Breakdown | Donut Chart |

---

# 13. Trip Planning Dashboard

## Features

### Trip Planning Table

| Field | Description |
|---|---|
| Trip ID | Unique identifier |
| Booking ID | Linked booking |
| Stay Options | Assigned stays |
| Booking Amount Paid | Payment tracking |
| Booking Status | Pending/Partial/Done |

---

## Calendar View

Location-specific calendar for:
- Tawang
- Ziro
- Mechuka
- Anini

---

## Calendar Colors

| Color | Meaning |
|---|---|
| Green | Fully completed booking |
| Orange | Partial payments |
| Red | Booking not started |

---

## Daily Stay Planning

Admin can assign:
- Day-wise stays
- Vehicles
- Activities
- Trekking
- Bonfire
- BBQ

---

# 14. Trip Creation Module

## Admin Trip Creation

Admin should be able to create:
- Custom trips
- Group trips
- Solo trips
- Seasonal itineraries

---

## Trip Creation Fields

| Field | Type |
|---|---|
| Trip ID | Auto-generated |
| Trip Name | Text |
| Location | Dropdown |
| Number of Days | Number |
| Vehicle Type | Dropdown |
| GST Included | Boolean |
| Inclusions | Rich Text |
| Exclusions | Rich Text |
| Total Cost | Currency |

---

## Day-wise Itinerary Structure

| Field | Type |
|---|---|
| Day Number | Integer |
| Stay Location | String |
| Visiting Places | Multi-select |
| Activities | Multi-select |
| Stay Properties | Multi-select |

---

# 15. Revenue & Expense Management

## Revenue Tracking

Track:
- Booking amount
- Installments
- Final payments
- GST
- Add-ons

---

## Expense Tracking

| Expense Type |
|---|
| Stay |
| Food |
| Vehicle |
| Trekking |
| Guide |
| Bonfire |
| BBQ |
| Miscellaneous |

---

## Profit Calculation

Profit = Total Revenue - Total Expenses

---

# 16. Functional Requirements

## Authentication

| Requirement | Details |
|---|---|
| Admin Login | JWT authentication |
| Session Management | Secure cookies |
| Role Protection | Admin-only access |

---

## File Upload System

| Requirement | Details |
|---|---|
| Aadhaar Upload | PDF/JPG/PNG |
| Max File Size | 5 MB |
| Cloud Storage | AWS S3 |
| Secure Access | Signed URLs |

---

## Booking Engine

| Requirement | Details |
|---|---|
| Real-time validation | Required |
| Group bookings | Required |
| Installments | Required |
| Confirmation emails | Required |

---

# 17. Non-Functional Requirements

## Performance

| Metric | Target |
|---|---|
| Homepage Load | <2 sec |
| Dashboard Load | <3 sec |
| Mobile Lighthouse | 90+ |

---

## Security

| Requirement |
|---|
| JWT authentication |
| Rate limiting |
| Secure file uploads |
| Encrypted data |
| Input sanitization |

---

## Scalability

| Requirement |
|---|
| Support 10k+ bookings |
| CDN-based images |
| Horizontal backend scaling |

---

# 18. Technical Architecture

## Recommended Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 |
| Styling | Tailwind CSS |
| Backend | Node.js |
| Database | PostgreSQL |
| ORM | Prisma |
| File Storage | AWS S3 |
| Authentication | JWT |
| Charts | Recharts |
| Hosting | Vercel + AWS |

---

# 19. Database Design

## Booking Table

| Column | Type |
|---|---|
| booking_id | UUID |
| group_booking_id | String |
| first_name | String |
| middle_name | String |
| last_name | String |
| email | String |
| address | Text |
| pin | String |
| contact_number | String |
| dob | Date |
| gender | Enum |
| aadhaar_url | String |

---

## Trip Table

| Column | Type |
|---|---|
| trip_id | UUID |
| location | Enum |
| itinerary | JSON |
| inclusions | JSON |
| exclusions | JSON |
| total_income | Decimal |
| total_expenses | Decimal |
| total_profit | Decimal |

---

## Stay Table

| Column | Type |
|---|---|
| stay_id | UUID |
| trip_id | FK |
| day_number | Integer |
| location | String |
| property_name | String |

---

# 20. API Requirements

## Public APIs

| API | Method |
|---|---|
| /api/book-trip | POST |
| /api/trips | GET |
| /api/locations | GET |

---

## Admin APIs

| API | Method |
|---|---|
| /api/admin/trips | CRUD |
| /api/admin/bookings | CRUD |
| /api/admin/dashboard | GET |
| /api/admin/expenses | CRUD |

---

# 21. Success Metrics

| KPI | Target |
|---|---|
| Booking Conversion | 8%+ |
| Monthly Revenue Growth | 20% |
| Repeat Customers | 30% |
| Average Session Time | 4+ minutes |
| Admin Efficiency Gain | 70% |

---

# 22. Risks & Mitigation

| Risk | Mitigation |
|---|---|
| Fake bookings | OTP verification |
| Aadhaar misuse | Secure encrypted storage |
| Heavy media assets | CDN optimization |
| Admin misuse | Audit logs |

---

# 23. Timeline & Milestones

## Phase 1 — Foundation (2 Weeks)
- Database schema
- Authentication
- Base architecture

---

## Phase 2 — Public Website (3 Weeks)
- Landing page
- Destination pages
- Booking system
- Mobile responsiveness

---

## Phase 3 — Admin CRM (4 Weeks)
- Dashboard
- Trip planner
- Revenue tracking
- Booking management

---

## Phase 4 — Analytics & Finance (2 Weeks)
- Charts
- Reports
- Profit calculations

---

## Phase 5 — QA & Deployment (1 Week)
- Testing
- Security checks
- Deployment

---

# 24. Future Enhancements

## Planned Features

- AI itinerary generator
- WhatsApp automation
- Dynamic pricing engine
- Vendor management
- Mobile applications
- Multi-language support
- Real-time weather integration
- AI travel assistant

---

# 25. Final Product Philosophy

The product must avoid looking like a generic tourism template.

Most travel startups fail because they:
- copy generic templates,
- lack operational systems,
- and focus only on frontend aesthetics.

This platform should combine:

1. Cinematic customer experience
2. Operationally powerful CRM
3. Structured itinerary planning
4. Financial visibility
5. Scalable backend architecture

The frontend sells aspiration.

The backend manages reality.

That combination is what makes this product commercially viable.

