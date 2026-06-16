<h1 align="center">✨ DevForge - Interactive Code Editor ✨</h1>

<p align="center">
  A full-stack SaaS code editor built with Next.js 15, featuring AI-powered code assistance, multi-language support, and a community snippet sharing system.
</p>

## 🚀 Live Demo
[dev-forge-941e.vercel.app](https://dev-forge-941e.vercel.app)

## ✨ Features

- 💻 Online IDE with multi-language support (10 languages)
- 🤖 AI Help powered by Google Gemini — explain, debug, and optimize code
- 🎨 5 customizable VSCode themes
- ✨ Smart output handling with Success & Error states
- 💎 Free & Pro plans via Lemon Squeezy
- 🤝 Community-driven code sharing system
- 🔍 Advanced filtering & search capabilities
- 👤 Personal profile with execution history tracking
- 📊 Comprehensive statistics dashboard
- ⚙️ Customizable font size controls
- 🔗 Webhook integration support

## 🛠️ Tech Stack

- **Frontend:** Next.js 15, TypeScript, Tailwind CSS, Framer Motion
- **Backend:** Convex
- **Auth:** Clerk
- **Payments:** Lemon Squeezy
- **Code Execution:** JDoodle API
- **AI:** Google Gemini API

## ⚙️ Setup

### 1. Clone the repository
```shell
git clone https://github.com/Alsanad-001/DevForge.git
cd DevForge
npm install
```

### 2. Set up `.env.local`
```js
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CONVEX_DEPLOYMENT=
NEXT_PUBLIC_CONVEX_URL=
NEXT_PUBLIC_CONVEX_SITE_URL=
JDOODLE_CLIENT_ID=
JDOODLE_CLIENT_SECRET=
GEMINI_API_KEY=
```

### 3. Add these to Convex Dashboard
```js
CLERK_WEBHOOK_SECRET=
LEMON_SQUEEZY_WEBHOOK_SECRET=
```

### 4. Run the app
```shell
npm run dev
npx convex dev
```

