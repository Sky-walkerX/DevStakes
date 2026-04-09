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

## Implementation Details
1. Case Overview Screen
Crime story + key details
Timer countdown (15–20 minutes per case)
Progress indicator (clues collected, suspects analyzed)
"Begin Investigation" CTA
2. Case Files / Evidence Hub
Timeline (interactive, chronological events)
Evidence List (searchable, with descriptions)
Suspect Profiles (motive, alibi, timeline conflicts)
Clue discovery triggers (unlock new info as you investigate)
3. Interactive Evidence Board
Drag-and-drop canvas to connect evidence
Connection lines between related clues
Color-coded categories (weapon, location, motive, alibi)
Notes section to annotate findings
Real-time visual representation of detective work
4. Suspect Analysis Panel
Individual suspect deep-dive
View alibi vs. timeline conflicts
Highlight contradictions automatically
Track motive, opportunity, means
5. Final Decision
"Accuse" button locks in verdict
Reveals culprit + explanation
Score calculation:
Base Score: 100
-10 per minute over time
+15 per correct clue connection
-20 for wrong accusation
Comparison: "You solved in X minutes! "
Show correct answer + reasoning
6. Results Screen
Verdict Reveal (correct/incorrect)
Score & Ranking
Case Summary (what you found, what you missed)
Share Results (screenshot or social)
Play Again / Next Case
7. Auth
added log in, register and leaderboard
using Supabase Auth 

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
