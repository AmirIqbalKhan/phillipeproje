# 🎉 Event Mashups – Unified Event Platform (React + Tailwind CSS)

A powerful web application designed to streamline **event discovery**, **event management**, and **platform governance**, built using **Next.js**, **React**, **Tailwind CSS**, and **PostgreSQL**. It serves three user types—**Attendees**, **Organizers**, and **Super Admins**—in a unified, intuitive, and modular system.

---

## ⚙️ Tech Stack

| Tech         | Purpose                                |
|--------------|-----------------------------------------|
| Next.js      | Routing, SSR, and API endpoints         |
| React        | Modular UI development                  |
| Tailwind CSS | Utility-first CSS styling               |
| PostgreSQL   | Relational database management          |
| Vercel       | Hosting & deployment                    |

---

## 🧭 Website Structure + Feature Flow (Full Details)

---

### 🏠 1. **Homepage** (`/`)
**Purpose:** Entry point for all users and guests.

#### Key Sections:
- **Hero Section**: Eye-catching title and CTA buttons (`Discover Events`, `Host an Event`)
  - Components: `/components/Hero.tsx`
- **Featured Events**: Shows trending or editor's picks
  - API: `GET /api/events?featured=true`
  - Components: `FeaturedEvents.tsx`
- **Category Icons**: Quick filter by type (🎤 Concerts, 🧠 Workshops, 💼 Conferences)
  - Components: `CategoryFilter.tsx`
- **Social Feed**: Shows friends' RSVP activity
  - API: `GET /api/user/social-feed`
  - Components: `SocialFeed.tsx`
- **Split Cost Section Preview**: Teaser of how split payments work
- **Trust & Testimonials**: Carousel of reviews, security badges

---

### 🔍 2. **Event Discovery Page** (`/discover`)
**Purpose:** Swipe through or browse a list of events based on interest, location, and time.

#### Features:
- **Swipe UI** (Tinder-style cards): Implemented with `react-tinder-card`
- **Filters**: Category, city, price, date range
  - Components: `FilterPanel.tsx`
  - API: `GET /api/events?filters=...`
- **Search Bar**: Event title, tags, or location
- **Saved Events**: Bookmark functionality

---

### 🗓️ 3. **Event Details Page** (`/event/[eventId]`)
**Purpose:** Full information on a selected event.

#### Features:
- **Header**: Name, location, date, organizer profile
- **Media Carousel**: Event photos/videos
- **About Section**: Full description, agenda, guest speakers
- **Actions**: RSVP, Save, Share, Invite
- **Cost Split**: If invited by friend, join group payment
- **Calendar Sync**: Add to Google/Apple Calendar
- **Map**: Embedded map using Google Maps
- **Live Chat**: Chat with organizer (authenticated users only)

---

### 🔐 4. **Authentication** (`/login`, `/register`)
**Purpose:** Access control for all users

#### Flow:
- **Login/Register**: With email/password or social login
- **Role Detection**: Redirect to unified dashboard with role-based features

---

### 🎛️ 5. **Unified Dashboard** (`/dashboard`)
**Purpose:** Comprehensive control center for all user types with role-based feature access

#### **Core Sections (All Users):**
- **Overview**: Personalized dashboard with role-specific widgets
- **Events**: Browse, create, manage events (based on permissions)
- **Calendar**: Integrated calendar with sync and event management
- **Chat**: Unified messaging system for all communications
- **Profile**: User settings, preferences, and account management

#### **User Features (Attendees):**
- **My Events**: RSVPs, saved events, and invites
- **Payments**: Split payments, dues, and receipts
- **Social Feed**: Friends' events and activity
- **Rewards**: Referral QR codes and bonuses
- **Recommendations**: AI-curated events based on history

#### **Organizer Features (Event Managers & Venue Owners):**
- **Event Management**: Create, edit, duplicate, cancel events
  - Smart forms, tag manager, pricing, media uploader
- **Venue Management**: Add/edit venue layouts and availability
- **Staff Management**: Assign roles, manage availability
- **Resource Management**: Equipment, logistics, vendor management
- **Client CRM**: Manage event customers and relationships
- **Analytics**: Event performance and attendee insights

#### **Admin Features (Super Admins):**
- **Platform Analytics**: KPIs, retention, ticket sales across all events
- **User Moderation**: View reports, manage users, take actions
- **Security Management**: Role permissions, 2FA setup, audit logs
- **System Integrations**: Webhooks, API keys, sync services
- **Platform Settings**: Branding, terms, pricing control
- **Workflow Automation**: Rules and automation (e.g., auto-ban, notifications)

#### **Role-Based Access Control:**
- **User Role Detection**: Automatic feature visibility based on user type
- **Permission System**: Granular access control for different features
- **Contextual UI**: Interface adapts based on user permissions
- **Unified Navigation**: Single dashboard with conditional sections

---

## 📄 Essential Pages

| Page                         | Type        | Purpose                                       |
|------------------------------|-------------|-----------------------------------------------|
| `/`                          | Public      | Entry point, discovery, CTA                   |
| `/discover`                  | Public      | Filtered/swipe event search                   |
| `/event/[id]`                | Public      | Detailed event info                           |
| `/login`, `/register`        | Auth        | Account creation                              |
| `/dashboard`                 | Unified     | Comprehensive dashboard for all user types    |
| `/about`, `/contact`, `/terms`, `/privacy` | Public | Static/legal pages                            |

---

## 🧩 Component Placement

| Component            | Folder Path                  |
|----------------------|------------------------------|
| Hero.tsx             | `/components/`               |
| FeaturedEvents.tsx   | `/components/`               |
| EventCard.tsx        | `/components/`               |
| FilterPanel.tsx      | `/components/`               |
| DashboardSidebar.tsx | `/components/dashboard/`     |
| ChatThread.tsx       | `/components/common/chat/`   |
| PaymentModal.tsx     | `/components/payments/`      |
| CalendarSync.tsx     | `/components/calendar/`      |
| RoleBasedWidget.tsx  | `/components/dashboard/`     |

---

## ✅ Summary

The Event Mashups platform offers a **public-facing event discovery flow** and a **unified dashboard** that serves all user types with role-based feature access. This approach provides a seamless user experience while maintaining appropriate access controls and feature visibility based on user permissions.
