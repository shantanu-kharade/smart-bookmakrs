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

##  Features Implemented
-  **Google OAuth:** Secure passwordless login using Supabase Auth helpers.
-  **CRUD Operations:** Users can add and delete their own bookmarks.
-  **Realtime Updates:** Changes sync instantly across multiple tabs/devices without refreshing.
-  **Privacy:** Implemented RLS so User A cannot access User B's data.
-  **Responsive UI:** Works on Mobile, Tablet, and Desktop with a Google-inspired aesthetic.

##  Problems and Solutions - dev logs
### 1. Architectural Paradigm Shift (MERN vs. Supabase)
**The Problem:** Coming from a MERN background, I was accustomed to building a dedicated backend API with Express and manually handling every route and controller. I initially struggled to trust that communicating directly with the database from the frontend could be secure and scalable.
**The Solution:** I adopted a "Supabase Native" architecture. Instead of building a redundant API layer, I used Next.js Server Components for direct, fast data fetching and Server Actions for data mutations. This reduced code complexity by approximately 40%.

### 2. Securing User Data (The "No Middleware" Approach)
**The Problem:** Ensuring that "User A cannot see User B's bookmarks" typically requires writing custom middleware to check tokens and user IDs on every single API route. I was unsure how to enforce this without a traditional backend.
**The Solution:** I implemented Postgres Row Level Security (RLS). By writing SQL policies (`auth.uid() = user_id`) directly on the table, the database itself enforces the security. This means even if the frontend code is buggy, the data remains secure.

### 3. The "Silent Failure" of Realtime Updates (Race Condition)
**The Problem:** I implemented the realtime listener, but when I added a bookmark in one tab, it didn't show up in the other. The connection was open, but no data was flowing.
**The Solution:** I found a "race condition." The app was connecting to the real-time stream before it finished checking who the user was. Because it connected too early, it connected as "Anonymous," and my RLS policies correctly blocked the updates. I fixed this by ensuring the `getSession` call completes before opening the WebSocket channel.

### 4. Middleware Deprecation Warning
**The Problem:** My specific version of Next.js warned that `Middleware` is deprecated and suggested using `Proxy` instead, causing build warnings that cluttered the console.
**The Solution:** I renamed the file from `middleware.ts` to `proxy.ts` and updated the exported function signature to align with the newer framework standard.

### 5. The "Bad OAuth State" Error
**The Problem:** During development, I intermittently received a `bad_oauth_state` error during login. This happens when the browser "forgets" the security key Supabase gave it during the redirect, or the key is used twice.
**The Solution:** I discovered that React Strict Mode (on by default in Next.js) was running the login code twice, instantly invalidating the security token. Disabling Strict Mode in the Next.js config stabilized the login flow.

### 6. WebSocket Connection Failure (API Key Mismatch)
**The Problem:** I saw a "WebSocket is closed before the connection is established" error in the console, preventing any realtime features from working.
**The Solution:** I realized my API Key in the environment variables started with `sb_publishable`, which was the wrong format for the specific Supabase client I was using. I replaced it with the correct Supabase `ANON` key (which always starts with `ey...`), allowing the secure handshake to complete.

### 7. Managing Sessions in Next.js App Router
**The Problem:** Managing cookies and sessions between Server Components (which render on the server) and Client Components (which run in the browser) was tricky. I had issues where the session would expire, but the UI would still look logged in.
**The Solution:** I implemented the standard Supabase Middleware pattern. This middleware runs on every request, checks if the Auth Cookie is expired, and refreshes it on the server side *before* the page even loads, ensuring a seamless user experience.

## AI Tools Used

I utilized several AI assistants to accelerate development, ensure architectural best practices, and debug complex integration issues.

* **ChatGPT & Gemini (Architecture & Backend):**
    * **Decision Making:** Used to brainstorm the core architecture, specifically weighing the pros and cons of a "Next.js BFF" pattern versus the "Supabase Native" approach. This helped me decide to go with the Native approach for better Realtime performance.
    * **Database Security:** Assisted in writing the specific SQL syntax for Row Level Security (RLS) policies to ensure `auth.uid() = user_id`.

* **ChatGPT Codex & Gemini (Frontend & UI):**
    * **Google Aesthetic:** generated the initial Tailwind CSS layouts for the responsive grid system. I specifically used prompts to replicate the "Google Material" look (soft shadows, rounded corners, "Google Blue" buttons) without needing heavy UI libraries.

* **GitHub Copilot & Gemini (Debugging & Logic):**
    * **Boilerplate Generation:** Rapidly generated the boilerplate code for Server Actions, allowing me to focus on business logic rather than typing syntax.
    * **Deep Debugging:** Crucial for debugging specific Next.js runtime errors. For example, instead of just fixing the "Middleware Deprecation" warning blindly, I used AI to explain *why* the framework changed and how to migrate to the new standard correctly.