# Smart Bookmark App

A real-time, secure bookmark manager built with Next.js  and Supabase.


##  Links
- **Live Demo:** [https://smart-bookmakrs.vercel.app/]
- **Source Code:** [https://github.com/shantanu-kharade/smart-bookmakrs]

## Tech Stack
- **Frontend:** Next.js 16 (App Router), Tailwind CSS
- **Backend:** Supabase (Postgres Database, Auth, Realtime)
- **Security:** Row Level Security (RLS) policies
- **Deployment:** Vercel

## Features

- **Google OAuth Authentication** – Secure passwordless login using Supabase Auth.
- **Bookmark CRUD Operations** – Users can create and delete their own bookmarks.
- **Realtime Synchronization** – Instant updates across multiple tabs/devices using Supabase Realtime.
- **Data Privacy with RLS** – Enforced Row Level Security (`auth.uid() = user_id`) to ensure users can only access their own data.
- **Server-Side Session Management** – Implemented session refresh using Next.js middleware pattern.
- **Responsive UI** – Mobile-first design built with Tailwind CSS.



## Engineering Highlights

- Designed a **Supabase Native architecture**, leveraging Server Components and Server Actions instead of a traditional custom backend.
- Implemented **Postgres Row Level Security (RLS)** for database-level access control instead of relying on application-layer middleware.
- Resolved a **realtime race condition** by ensuring session validation completed before initializing WebSocket connections.
- Debugged and fixed **OAuth state conflicts** caused by React Strict Mode double invocation.
- Diagnosed and resolved **WebSocket connection failures** due to incorrect Supabase API key configuration.

## Technical Challenges & Solutions

### 1. Architectural Design: MERN vs Supabase Native
Transitioned from a traditional MERN-style backend (custom Express APIs) to a Supabase Native architecture.  
Leveraged Next.js Server Components for data fetching and Server Actions for mutations, eliminating the need for a redundant API layer and reducing overall code complexity.



### 2. Database-Level Access Control with RLS
Implemented Postgres Row Level Security (RLS) policies using:
`auth.uid() = user_id`.
This ensures strict per-user data isolation at the database level, removing reliance on application-layer middleware for access control.



### 3. Realtime Synchronization Race Condition
Identified and resolved a race condition where the WebSocket connection initialized before session validation.  
Delayed realtime subscription setup until authentication was confirmed, ensuring RLS-protected events were delivered correctly.



### 4. OAuth State Handling Issue
Diagnosed intermittent `bad_oauth_state` errors during Google login.  
Determined the issue was caused by React Strict Mode triggering duplicate login requests. Stabilized the flow by adjusting configuration to prevent duplicate token usage.








## AI Assistance

AI tools were used during development as permitted by the assignment.

Specifically, AI assisted with:

- Brainstorming architectural approaches (e.g., Supabase Native vs. custom API layer)
- Generating initial boilerplate for Server Actions and Supabase integrations
- Debugging framework-specific issues (OAuth state errors, middleware changes, WebSocket configuration)
- Reviewing SQL syntax for Row Level Security (RLS) policies

All final implementation decisions, security configurations, and debugging resolutions were validated, tested, and integrated independently.