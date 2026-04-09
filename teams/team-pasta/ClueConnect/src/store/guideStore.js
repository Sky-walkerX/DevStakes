import { create } from 'zustand';

export const tutorialSteps = [
  {
    id: 1,
    text: "Welcome, Detective. I am Agent AI, your personal investigation assistant. Ready to solve some crimes?",
  },
  {
    id: 2,
    text: "The Board is where you'll connect Evidence to build a case against the Suspects.",
  },
  {
    id: 3,
    text: "Review the briefing to discover initial clues. Click on 'Briefing' or 'Evidence' tabs to navigate.",
  },
  {
    id: 4,
    text: "Keep an eye on the timer! If you run out of time, the culprit escapes. Good luck, Detective.",
  }
];

const randomTips = [
  "Look closely at alibis. They often have holes.",
  "Forensics don't lie, but people do.",
  "Check the timeline twice.",
  "Every piece of evidence connects to something.",
  "Don't let the suspect sweat you out."
];



export const useGuideStore = create((set, get) => ({
  isOpen: true,
  currentStepIndex: 0,
  isTyping: false,
  isDormant: false,
  customMessage: null, 
  audioUnlocked: false,
  
  unlockAudio: () => set({ audioUnlocked: true }),

  nextStep: () => {
    const { currentStepIndex, customMessage } = get();
    if (customMessage) {
      set({ isOpen: false, isDormant: true, customMessage: null });
      return;
    }
    
    if (currentStepIndex < tutorialSteps.length - 1) {
      const nextId = currentStepIndex + 1;
      set({ currentStepIndex: nextId, isTyping: true });
    } else {
      set({ isOpen: false, isDormant: true });
    }
  },

  skipTutorial: () => {
    set({ isOpen: false, isDormant: true, customMessage: null });
  },

  openTutorial: () => {
    const randomTip = randomTips[Math.floor(Math.random() * randomTips.length)];
    const msg = `Hey Boss! ${randomTip}`;
    set({ isOpen: true, isDormant: false, customMessage: msg, isTyping: true });
  },

  startBriefing: (caseData) => {
    if (!caseData) return;
    const text = `Hey Detective! We've got a hot new case in ${caseData.location || "the area"}. ${caseData.description || ""} Let's piece this puzzle together and find the truth!`;
    set({ isOpen: true, isDormant: false, customMessage: text, isTyping: true });
  },

  agentSpeak: (message) => {
    set({ isOpen: true, isDormant: false, customMessage: message, isTyping: true });
    setTimeout(() => {
        if (get().customMessage === message) {
            set({ isOpen: false, isDormant: true, customMessage: null });
        }
    }, 5000);
  },

  setTyping: (status) => set({ isTyping: status }),
}));
