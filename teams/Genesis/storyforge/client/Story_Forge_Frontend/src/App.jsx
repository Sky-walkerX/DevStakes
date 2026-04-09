import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './components/Landing';
import GenreSelection from './components/GenreSelection';
import CommunityHub from './components/CommunityHub';
import Identity from './components/Identity';
import StoryPlayer from './components/StoryPlayer';
import CreateStory from './components/CreateStory';

const variants = {
  push: {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
  },
  push_back: {
    initial: { opacity: 0, x: -100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 100 },
  },
  slide_up: {
    initial: { opacity: 0, y: 100 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -100 },
  },
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  }
};

export default function App() {
  const location = useLocation();
  const transitionType = location.state?.transition || 'fade';
  const currentVariants = variants[transitionType];

  return (
    <Layout>
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={currentVariants.initial}
          animate={currentVariants.animate}
          exit={currentVariants.exit}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="app-transition-container"
        >
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Landing />} />
            <Route path="/genre-selection" element={<GenreSelection />} />
            <Route path="/community-hub" element={<CommunityHub />} />
            <Route path="/identity" element={<Identity />} />
            <Route path="/create-story" element={<CreateStory />} />
            <Route path="/gameplay" element={<StoryPlayer />} />
            <Route path="*" element={<Landing />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
}
