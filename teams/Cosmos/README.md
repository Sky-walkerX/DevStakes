# StudyBro

## Team Name
Cosmos

## Team Members
- Nayan Gupta (GitHub: NayanG-45 )
- Vaibhav Jain (GitHub: vjsir830 )
- Aditya Sharma (GitHub: adiz123shar )
- Sreyash Gaddam (GitHub: Sreyash308 )
- Amishka Sisodiya (GitHub: amishkasisodiya57 ) 

## Idea Chosen
StudyBro — Interactive AI-Powered LMS

## Problem Statement
Tech beginners often struggle to build consistent daily study habits because traditional learning materials are static, tedious, and lack immediate feedback. There is a critical need for an engaging, gamified platform that transforms raw notes into active recall sessions seamlessly without requiring users to manually format their study materials.

## Tech Stack
- React (Vite)
- Tailwind CSS (Premium Dark Mode & Glassmorphism styling)
- Framer Motion (Hardware-accelerated 3D animations and transitions)
- Lucide React (Clean iconography)
- Groq AI API (`llama-3.1-8b-instant` for rapid JSON generation)

## Implementation Details
- **Architecture & State Management:** The application acts as a standalone SPA that fundamentally relies on a customized `useLocalStorage` hook to simulate a persistent backend. This guarantees users retain active login streaks, past quiz scores, and AI-generated study data strictly within their browser session limits, creating a fast friction-less experience.
- **Dynamic AI Generation:** The `AIGenerator` component intercepts user-uploaded `.txt` files (via standard HTML5 FileReader APIs) or pasted notes, and queries Groq's high-speed inference engine using standard zero-shot prompt engineering. The returned JSON matrix is parsed securely and prepended into the app's global state to instantly spawn custom "Daily 10 Quizzes" and "Smart Flashcards".
- **Advanced UI/UX:** The "Smart Flashcards" view utilizes deep CSS mappings (`transform-style: preserve-3d` coupled with `rotateY`) orchestrated heavily via `framer-motion` layout animations to produce a premium, engaging tactile feel. The layout is managed efficiently via a strictly responsive top-level `Navbar.jsx`.

## How to Run Locally
1. Clone the repository: `git clone https://github.com/NayanG-45/DevStakes.git`
2. Navigate to the project directory: `cd Cosmos`
3. Install dependencies: `npm install`
4. Set up your AI: In `src/components/AIGenerator.jsx`, ensure the `GROQ_API_KEY` is populated.
5. Start the local development server: `npm run dev`
6. Open your browser and visit: `http://localhost:5173/`

## Live Demo
https://dev-stakes-m2gzbxqkz-guddan8795-5084s-projects.vercel.app

## Screenshots / Demo
Youtube Demo Video Link => https://youtu.be/D1Mp_ZRlJ9g