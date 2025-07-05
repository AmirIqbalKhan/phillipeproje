
# ✅ EventMingle Feature Todo List

This list tracks the implementation status of features outlined in `Custom_Event_Platform_Features.md`.

- `[x]` - Done
- `[/]` - Partially Done (backend or basic UI exists, but not fully implemented)
- `[ ]` - To Do

---

## 🧑‍💼 Master Admin Features

### User & Organizer Management
- `[x]` View, edit, delete any user or organizer
- `[/]` Organizer verification (KYC, business info) - *Basic verification flag exists, but no formal KYC process.*
- `[x]` Approve/reject new organizer applications
- `[x]` Assign or modify user roles
- `[x]` Track user login history and IP address
- `[x]` Suspend/reactivate accounts

### Event Management
- `[x]` Approve or reject event submissions
- `[/]` Edit all event details - *Admin can perform actions, but no dedicated form to edit all event fields.*
- `[/]` Reschedule or cancel events manually - *Schema supports `CANCELLED` status, but no specific UI for rescheduling or canceling.*
- `[x]` Feature/promote events
- `[ ]` Set blackout dates or event type restrictions
- `[x]` Access audit logs for event changes

### Financial Controls
- `[x]` View all transactions and ticket sales
- `[x]` Approve or hold organizer payouts
- `[/]` Set commission rates (flat or %) - *Global rate is configurable, but not per-organizer or per-event.*
- `[/]` Issue refunds (full or partial) - *UI exists for full refund; schema supports partial, but UI may not.*
- `[ ]` View chargeback and dispute history - *Schema has `DISPUTED` status, but no UI to manage it.*
- `[x]` Export financial reports in CSV/Excel

### Analytics & Insights
- `[x]` Dashboard with real-time KPIs
- `[ ]` Booking trends by category/date
- `[ ]` Conversion rates (views to bookings)
- `[ ]` Organizer performance tracking
- `[x]` Growth reports (weekly/monthly/yearly)
- `[ ]` Traffic and event popularity stats

### System Settings
- `[/]` Manage admin and staff accounts - *User roles can be changed, but no dedicated UI for managing specific staff roles/permissions.*
- `[ ]` Set or change role permissions - *Schema supports permissions, but no UI to configure them.*
- `[/]` Toggle platform features on/off - *Raw JSON editor exists, but no user-friendly toggles.*
- `[/]` Customize email templates - *Raw JSON editor exists, not a template builder.*
- `[/]` Configure tax rules and currency - *Currency is configurable, tax rules are not.*
- `[x]` Set global platform preferences

---

## 👩‍💻 Employee Dashboard Features (Role-Based)

*Note: The main dashboard for employees exists and is role-aware, but the specific tool pages are not yet implemented.*

### Support Staff
- `[/]` Search and manage attendee bookings - *(Dashboard link exists, page To Do)*
- `[/]` Cancel or reschedule tickets - *(Dashboard link exists, page To Do)*
- `[/]` Issue manual refunds if authorized - *(Dashboard link exists, page To Do)*
- `[/]` Respond to support messages - *(Dashboard link exists, page To Do)*
- `[/]` Access attendee booking history - *(Dashboard link exists, page To Do)*
- `[/]` View and process deletion requests - *(Dashboard link exists, page To Do)*

### Event Moderators
- `[/]` Review and approve event submissions - *(Dashboard link exists, page To Do)*
- `[/]` Edit titles, categories, and media - *(Dashboard link exists, page To Do)*
- `[/]` Flag or remove low-quality listings - *(Dashboard link exists, page To Do)*
- `[/]` Feature events for promotion - *(Dashboard link exists, page To Do)*
- `[/]` Leave internal notes for admin team - *(Dashboard link exists, page To Do)*
- `[/]` Detect duplicates or spam events - *(Dashboard link exists, page To Do)*

### Finance Team
- `[/]` View and manage transactions - *(Dashboard link exists, page To Do)*
- `[/]` Handle pending organizer payouts - *(Dashboard link exists, page To Do)*
- `[/]` Approve or delay refunds - *(Dashboard link exists, page To Do)*
- `[/]` Generate and export reports - *(Dashboard link exists, page To Do)*
- `[/]` Monitor for suspicious financial activity - *(Dashboard link exists, page To Do)*

### Marketing Team
- `[/]` Upload banners or promotional graphics - *(Dashboard link exists, page To Do)*
- `[/]` Create and manage discount codes - *(Dashboard link exists, page To Do)*
- `[/]` Schedule campaigns or announcements - *(Dashboard link exists, page To Do)*
- `[/]` Set featured events or seasonal highlights - *(Dashboard link exists, page To Do)*
- `[/]` Monitor performance of promotions - *(Dashboard link exists, page To Do)*
- `[/]` Edit SEO/meta data for events - *(Dashboard link exists, page To Do)*

### Technical/Admin Staff
- `[/]` Access logs and debug tools - *(Dashboard link exists, page To Do)*
- `[/]` Reset user sessions or access tokens - *(Dashboard link exists, page To Do)*
- `[/]` Monitor background jobs and system health - *(Dashboard link exists, page To Do)*
- `[/]` Handle plugin/module conflicts - *(Dashboard link exists, page To Do)*
- `[/]` Safely deploy or roll back changes - *(Dashboard link exists, page To Do)*
- `[/]` Control internal system settings - *(Dashboard link exists, page To Do)*

---

## 🗣️ Social Features

### User Profiles
- `[/]` Public profile with name, photo, and bio - *Schema and settings page exist, but no public-facing profile page.*
- `[/]` Viewable history of past and upcoming events - *Exists for the logged-in user, but not for public viewing.*
- `[/]` Ability to follow or unfollow users and organizers - *Backend model exists, no UI.*
- `[ ]` Privacy settings (toggle profile visibility and activity)
- `[x]` Profile verification status (optional)

### Activity Feed & Announcements
- `[/]` Personalized feed showing activity - *Basic feed exists for RSVPs, but not for other activities.*
- `[ ]` Trending events section based on user interest
- `[ ]` Organizer announcements with tagging options

### Messaging & Interaction
- `[x]` Direct messaging between attendees and/or organizers
- `[x]` Event-specific group chat or message board
- `[/]` Comment threads on event pages - *Backend model exists, no UI.*
- `[/]` Like, react, and share options for events or reviews - *Backend model exists, no UI.*
- `[/]` RSVP comments or public notes - *Schema supports notes, but no UI to add/view them.*

### Friends & Followers
- `[/]` Ability to follow other users or event organizers - *Backend model exists, no UI.*
- `[/]` See friends’ upcoming and past events - *Partially available in social feed, but not as a dedicated feature.*
- `[ ]` Suggested users based on mutual events or interests
- `[/]` Optional friend request system (toggleable) - *Backend model exists, no UI.*

### Media & Event Reviews
- `[/]` Upload event photos and videos to personal or event pages - *Backend model and upload API exist, but no UI on event pages.*
- `[ ]` Tag attendees or organizers in uploads
- `[/]` Leave star-rated reviews with text and media - *Backend model exists, no UI.*
- `[ ]` View albums or galleries from completed events

### Social Calendar
- `[ ]` View friends’ or followers’ upcoming events
- `[ ]` Combined calendar view for planning
- `[ ]` Add friends’ events to personal schedule
- `[ ]` Sync with external calendars (Google/Apple)
- `[ ]` RSVP visibility (e.g., “Philippe is attending”)

### Privacy & Moderation
- `[/]` Block or report users, comments, or media - *Backend for reporting exists, but no UI for users to create reports.*
- `[x]` Admin moderation dashboard for flagged content
- `[ ]` Control over visibility of profile and activity
- `[x]` Tools to manage abusive or spammy behavior - *Admin can suspend users.*
