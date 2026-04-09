# Project Name
ClueConnect - Crime Investigation Simulator
## Team Name
PASTA

## Team Members
- Parth Badgire (GitHub: @parthbadgire-code)
- Advait Deshpande (GitHub: @ADVAITRD1296)
- Samruddhi More (GitHub: @samruddhimore27)
- Aary Garge (GitHub: @aary7126)
- Tisha Sarkar (GitHub: @TishaSarkar541)

## Idea Chosen
Custom :  Interactive Crime Investigation Simulator
## Problem Statement
Traditional crime-solving games are either too simplistic (simple multiple choice) or require
heavy narrative. Users crave interactive, detective-like experiences where they feel
genuinely involved in solving the mystery.

## Tech Stack
- React
- Supabase (Postgresql)

## Features

- **Interactive Investigation Board**: A spatial canvas where players can drag-and-drop evidence items to visually organize their thoughts and create connections, mimicking a classic "murder board."
- **Immersive Narrative**: Engaging case files with detailed backgrounds, suspect descriptions, alibis, and descriptions of physical evidence.
- **Agent AI (Virtual Assistant)**: A voice-enabled guide character that provides a step-by-step tutorial, dynamic case briefings, and helpful investigation tips.
- **Dynamic Scoring System**: Performance is calculated based on investigation speed (time bonus), evidence discovery, connection density, and accusation accuracy.
- **Global Leaderboard**: Securely tracks and displays top-performing detectives using real-time database synchronization.
- **Authentication**: User accounts powered by Supabase for persisting progress and scores across sessions.

## Implementation Details

### Core Architecture
- **Framework**: Built with [React](https://reactjs.org/) and [Vite](https://vitejs.dev/) for a lightning-fast development experience and optimized production bundles.
- **State Management**: Uses [Zustand](https://github.com/pmndrs/zustand) for highly efficient, decentralized global state management, handling everything from audio synchronization to complex investigation board mechanics.
- **Animations**: [Framer Motion](https://www.framer.com/motion/) is utilized for sleek page transitions, interactive UI elements, and the sophisticated loading system.
- **Database & Auth**: Integrated with [Supabase](https://supabase.com/) for PostgreSQL storage, real-time leaderboard updates, and easy-to-use authentication.

### Key Technical Aspects
- **Audio Synthesis**: Employs the browser's native **Web Speech API** for Text-to-Speech capabilities. A custom "global interaction listener" is implemented to unlock audio playback across modern browsers.
- **Graph-based Logic**: The investigation board uses a custom graph implementation to track nodes (evidence) and edges (connections), which directly influences the final score.
- **Responsive Styling**: Custom CSS combined with Tailwind utilities ensures a premium, dark-mode "detective aesthetic" that is responsive across different screen sizes.

  
## 🚀 How to Run Locally

Follow these steps to set up and run ClueConnect on your local machine:
## 1. Clone the Repository
```bash
git clone https://github.com/parthbadgire-code/devstakes.git
cd devstakes/teams/team-pasta/ClueConnect
```
## 2. Install Dependencies
```bash
npm install
```
## 3. Configure Supabase
Create a `.env.local` file in the project root directory:

```bash
touch .env.local
```

Add the mentioned Supabase credentials to `.env.local`:

```env
VITE_SUPABASE_URL=https://dcjupqefwcyizhiwkckr.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjanVwcWVmd2N5aXpoaXdrY2tyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2NjQ2MzgsImV4cCI6MjA5MTI0MDYzOH0.BrR0u8GOC3xIhBTsq-i5ZN0kGRVytNMgJvtYWHPrmjw
```

## 4. Run the Development Server
```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or the port shown in your terminal).

---


## Live Demo

https://clueconnect.vercel.app/

## Screenshots / Demo

Demo Video : https://drive.google.com/file/d/1gtIwfaJeL5LAJHpNahBQj_rXQ9_uEq-_/view?usp=sharing
Screenshots : https://drive.google.com/drive/folders/1Mh_Q1haiWgPPd-1ExRhlXE-63G2qe9LJ?usp=sharing
