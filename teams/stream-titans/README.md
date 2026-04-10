# 🎥 StreamTitans — Live Commerce Platform

> **Where fashion meets live streaming.** Discover, claim, and buy thrifted & trending fashion in real-time.

---

## Team Name
**Team StreamTitans**

## Team Members
- Ayush Bharti (GitHub: @Ayush-2511)
- Eshita Modi (GitHub: @Eshita65)
- Aadya Agarwal (GitHub: @Aadya25416)
- Manjeet Singh Meena (GitHub: @manjeetsinghmeena)
- Aranya Kumar (GitHub: @Aranya0811)

---

## 💡 Idea Chosen
**Custom: StreamTitans — AI-Powered Live Commerce for Fashion & Thrifting**

---

## 🧩 Problem Statement

India's resale and thrifting market is fragmented and mostly offline. Gen-Z buyers want the excitement of live shopping — the thrill of claiming a limited item before it's gone — but platforms like Instagram Live lack real-time commerce infrastructure. Simultaneously, independent fashion creators struggle to reach buyers, manage inventory, and price their thrifted goods competitively.

StreamTitans bridges this gap by combining **live streaming**, **real-time commerce**, and **AI-powered features** into a single platform tailored for fashion and thrifting in India.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend Framework | React 19 + Vite 8 |
| Styling | Vanilla CSS with CSS Variables (Brutalist Design System) |
| Authentication | Firebase Auth (Google OAuth + Email/Password) |
| Database | Firebase Firestore |
| Media Uploads | Cloudinary |
| AI Features | Google Gemini API (`gemini-flash-latest`) via `@google/generative-ai` |
| Icons | Lucide React |
| Notifications | React Hot Toast |
| Routing | Hash-based SPA routing (no React Router) |
| Deployment | Vercel / Netlify |

---

## ✨ Key Features

### 🛒 Buyer Experience
- **Live Stream Discovery** — Browse ongoing fashion live streams in a card-based deck
- **Thrift Marketplace** — Browse polaroid-style thrift items with rapid claim system
- **E-commerce View** — Browse curated drops and trending pieces
- **AI Semantic Search** — Natural language search across the full product catalog (e.g. *"something warm for winter in earth tones"*)
- **Personalized Feed** — AI-powered recommendation engine that re-ranks items based on your interaction history
- **Advanced Filters** — Full-screen popup filter system with price sliders, size grids, brand search, and colour swatches
- **Cart & Wallet** — Order management and balance tracking

### 🎬 Creator Experience
- **Creator Dashboard** — Full analytics, inventory management, and stream scheduling
- **AI Price Estimator** — Instantly suggests optimal INR pricing for thrifted items based on title, category, and condition
- **Live Stream Controls** — Start streams, add product drops, and manage orders in real-time
- **Inventory Manager** — Add products (with Cloudinary image upload), track live vs. draft listings, view stock and revenue metrics

### 🤖 AI Features (Powered by Gemini)
- **Titans AI Chatbot** — Floating assistant that answers buyer questions about claims, shipping, and the platform
- **Semantic Search Engine** — Understands natural language queries and returns relevant products by meaning, not keywords
- **AI Price Estimator** — Real-time price range suggestions for thrifted fashion items
- **Personalized Recommendation Feed** — Re-ranks content based on session activity

---

## 🏗️ Architecture Overview

```
StreamTitans/
├── frontend/
│   ├── src/
│   │   ├── pages/           # Top-level views (Home, LandingFlow, CreatorDashboard)
│   │   ├── components/      # All UI components
│   │   │   ├── landing/     # Landing page components (Hero, Auth, Email)
│   │   │   ├── profile/     # Buyer profile & settings
│   │   │   ├── creator/     # Creator dashboard tabs & components
│   │   │   ├── ecommerce-v2/# E-commerce section
│   │   │   └── thrift-v2/   # Thrift section
│   │   ├── context/         # Global state (Auth, Stream, Product, UserActivity)
│   │   ├── firebase/        # Firebase config, auth, firestore, cloudinary
│   │   ├── data/            # Mock data for streams, products, creators
│   │   └── index.css        # Global Brutalist CSS Design System
```

**State Management Strategy:**
- `AuthContext` — Firebase user session, role (buyer/seller), real-time listener
- `StreamContext` — Controls the global stream overlay modal
- `ProductContext` — Controls the global product claim overlay modal
- `UserActivityContext` — Tracks click events to power the personalized feed algorithm
- Local `useState` for all UI-specific interactions

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js 18+
- A Firebase project with **Authentication** (Google + Email/Password) and **Firestore** enabled
- A Google Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
- A [Cloudinary](https://cloudinary.com/) account (for image uploads)

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/Ayush-2511/StreamTitans.git
cd StreamTitans/frontend

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Then edit .env.local and fill in your keys (see below)

# 4. Start the development server
npm run dev
```

### Environment Variables (`.env.local`)

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Google Gemini AI
VITE_GEMINI_API_KEY=your_gemini_api_key

# Cloudinary (for product image uploads)
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

> ℹ️ A `.env.example` template is included in the repository with all required variable names.

---

## 🌐 Live Demo

🔗 **[StreamTitans Live →](https://stream-titans.vercel.app)**

---

## 📸 Screenshots / Demo

### Demo Video link —
🔗 **[Demo link →](https://www.youtube.com/watch?v=aBeuu__VSco)**

### Landing Page — Infinite Scrolling Fashion Grid
> Animated, tilted columns of fashion imagery with a smooth Auth flow
![landing-page](./frontend/public/screenshots/landing_page.png)

### Buyer Home — Live Stream Deck
> Real-time live stream cards with category filtering and a Claim button
![buyer-home](./frontend/public/screenshots/buyer_home.png)

### Thrift Marketplace — Polaroid Grid
> Vintage-style product cards with fast claim mechanics
![thrift-marketplace](./frontend/public/screenshots/thrift_marketplace.png)

### Creator Dashboard — Inventory Manager
> Full product management with AI Price Estimator and Cloudinary uploads
![dashboard](./frontend/public/screenshots/dashboard.png)

### AI Chatbot — Titans AI Assistant
> Floating chat widget powered by Gemini, answers platform-specific questions
![ai-chatbot](./frontend/public/screenshots/ai_chatbot.png)

### AI Semantic Search
> Natural language search modal accessible from the navbar
![ai-search](./frontend/public/screenshots/ai_search.png)

### Other screenshots
![alt-text](./frontend/public/screenshots/analytics.png)
![alt-text](./frontend/public/screenshots/creator_profile.png)
![alt-text](./frontend/public/screenshots/ecommerce_deals.png)
![alt-text](./frontend/public/screenshots/editors_pick.png)
![alt-text](./frontend/public/screenshots/general_settings.png)
![alt-text](./frontend/public/screenshots/inventory.png)
![alt-text](./frontend/public/screenshots/join_seller.png)
![alt-text](./frontend/public/screenshots/live_stream_view.png)
![alt-text](./frontend/public/screenshots/login.png)
![alt-text](./frontend/public/screenshots/my_streams.png)
![alt-text](./frontend/public/screenshots/onboarding.png)
![alt-text](./frontend/public/screenshots/orders.png)
![alt-text](./frontend/public/screenshots/seller_verification.png)
![alt-text](./frontend/public/screenshots/user_profile_settings.png)
![alt-text](./frontend/public/screenshots/wallet.png)

---

## 🤝 Contributing

This project was built as part of a hackathon. For collaboration, please open an issue or reach out to the team directly.

---

*StreamTitans © 2026 · Built with LOVE for the live commerce generation*