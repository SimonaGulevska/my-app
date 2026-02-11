## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

# Next.js Interactive Dashboard

A professional, modular Next.js application featuring a persistent authentication system, a logic-based Face Matching memory game, and a dynamic monthly event calendar.

## 🚀 Features

### 🔐 Authentication System
* **Local Persistence:** Uses `localStorage` to keep users logged in even after page refreshes.
* **Full Registration:** Captures **Name, Mail, Phone Number, and Password**.
* **Session Guard:** Automatically redirects to the login screen if no active session is found.

### 🎮 Face Matching Game
* **Face-Recognition Logic:** Uses a variety of expressive face emojis to improve focus.
* **Level Progression:** 
  - **Easy:** 12 cards / 4-column grid
  - **Medium:** 16 cards / 4-column grid
  - **Hard:** 20 cards / 5-column grid
* **Dynamic Records:** Saves and displays the **Best Time** and **Best Moves** for every difficulty level.
* **3D Interface:** Features custom-built indigo gradient cards with realistic flipping animations.

### 📅 Advanced Calendar
* **Auto-Calculation:** Automatically determines the number of days in the current month and the correct starting weekday.
* **Event Management:** Allows multiple events per day with specific "From-To" time slots.
* **Validation Logic:** Prevents users from adding events to dates and time that has already passed.
* **User-Specific Data:** Calendar events are keyed to the user's email so different accounts don't see each other's schedules.
* **Conflict Detection:** Alerts users if an event overlaps with an existing booking.
* **Persistence:** Auto-saves schedule data to `localStorage` based on user email.

## 🛠️ Tech Stack

* **Framework:** [Next.js 15+](https://nextjs.org/) (App Router)
* **Styling:** [Tailwind CSS v4.0](https://tailwindcss.com/)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Storage:** Browser `localStorage` API
