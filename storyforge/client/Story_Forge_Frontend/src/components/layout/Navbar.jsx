import React from 'react';
import { NavLink } from 'react-router-dom';
import { Sparkles, BookOpen } from 'lucide-react';
import styles from './Navbar.module.css';

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logoContainer}>
        <NavLink to="/" className={styles.logo}>
          StoryForge
        </NavLink>
      </div>

      <div className={styles.navLinks}>
        <NavLink 
          to="/" 
          className={({ isActive }) => 
            isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
          }
          end
        >
          Home
        </NavLink>
        <NavLink 
          to="/chronicles" 
          className={({ isActive }) => 
            isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
          }
        >
          My Chronicles
        </NavLink>
        <NavLink 
          to="/profile" 
          className={({ isActive }) => 
            isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
          }
        >
          Profile
        </NavLink>
      </div>

      <div className={styles.actions}>
        <button className={styles.iconButton}>
          <BookOpen size={20} />
        </button>
        <button className={styles.iconButton}>
          <Sparkles size={20} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
