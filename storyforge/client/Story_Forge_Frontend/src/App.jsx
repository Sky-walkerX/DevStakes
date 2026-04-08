import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Layout from './components/Layout';
import Landing from './components/Landing';
import GenreSelection from './components/GenreSelection';
import CommunityHub from './components/CommunityHub';
import Identity from './components/Identity';
import StoryPlayer from './components/StoryPlayer';

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
  const [nav, setNav] = useState({
    currentScreen: 'landing',
    transition: 'fade',
    data: null
  });

  const navigate = (to, data = null) => {
    let transition = 'push';

    if (to === 'landing') {
      transition = 'push_back';
    } else if (to === 'identity') {
      transition = 'slide_up';
    } else if (nav.currentScreen === 'identity' && to === 'community-hub') {
      transition = 'push_back';
    } else if (nav.currentScreen === 'community-hub' && to === 'genre-selection') {
      transition = 'push_back';
    } else if (to === 'gameplay') {
      transition = 'fade';
    }

    setNav({
      currentScreen: to,
      previousScreen: nav.currentScreen,
      transition,
      data
    });
    
    window.scrollTo(0, 0);
  };

  const renderScreen = () => {
    switch (nav.currentScreen) {
      case 'landing':
        return <Landing onNavigate={navigate} />;
      case 'genre-selection':
        return <GenreSelection onNavigate={navigate} />;
      case 'community-hub':
        return <CommunityHub onNavigate={navigate} />;
      case 'identity':
        return <Identity onNavigate={navigate} />;
      case 'gameplay':
        return <StoryPlayer onNavigate={navigate} genre={nav.data?.genre || 'Sci-Fi'} />;
      default:
        return <Landing onNavigate={navigate} />;
    }
  };

  const currentVariants = variants[nav.transition || 'fade'];

  return (
    <Layout currentScreen={nav.currentScreen} onNavigate={navigate}>
      <AnimatePresence mode="wait">
        <motion.div
          key={nav.currentScreen}
          initial={currentVariants.initial}
          animate={currentVariants.animate}
          exit={currentVariants.exit}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="app-transition-container"
        >
          {renderScreen()}
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
}
