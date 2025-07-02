import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SunIcon, MoonIcon, ArrowUpIcon } from "@heroicons/react/24/outline";
import { useUser } from "../../context/UserContext";
import { useTheme } from "../../hooks/useTheme";
import { actions } from "./navbarData";
import styles from "./Navbar.module.css";
import { getAssetUrl } from "../../services/api";

import ChronoLogoWhite from "../../images/chrono_logo_white.png";
import defaultAvatar from "../../images/default-avatart.jpg";

export default function Navbar() {
  const { user, logout } = useUser();
  const { toggleTheme, isDark } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const [showScroll, setShowScroll] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
      navigate("/login");
    }
  };

  const userActions = actions[user?.role as keyof typeof actions] || [];

  // Show button when scrolled down
  React.useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.topSection}>
          <div className={styles.logo}>
            <Link to="/" className={styles.logoLink}>
              <div className={styles.logoBox}>
                <img
                  src={ChronoLogoWhite}
                  alt="Task Tracker"
                  className={styles.logoImage}
                />
              </div>
            </Link>
          </div>

          <ul className={styles.navLinks}>
            {userActions.map((item) => (
              <li key={item.label} className={styles.navItem}>
                <Link
                  to={item.to}
                  className={`${styles.navLink} ${styles.navItemStyle}`}
                >
                  <item.icon className={styles.icons} />
                  <span className={styles.iconText}>
                    {item.label.split(" ").map((word, index) => (
                      <React.Fragment key={index}>
                        {word}
                        {index < item.label.split(" ").length - 1 && <br />}
                      </React.Fragment>
                    ))}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom Links */}
        <ul className={styles.bottomLinks}>
          <li>
            <button
              onClick={toggleTheme}
              className={`${styles.navLink} ${styles.navItemStyle}`}
              aria-label="Toggle theme"
            >
              {isDark ? (
                <MoonIcon className={styles.icons} />
              ) : (
                <SunIcon className={styles.icons} />
              )}
              <span className={styles.iconText}>Theme</span>
            </button>
          </li>
          <li>
            <button
              className={styles.profileContainer}
              onClick={() => setSidebarOpen((prev) => !prev)}
              aria-label="Open profile menu"
            >
              <img
                src={`${getAssetUrl()}${user?.photo}` || defaultAvatar}
                alt="Profile"
                className={styles.profileImage}
              />
            </button>

            {sidebarOpen && (
              <div
                className={styles.sidebarOverlay}
                onClick={() => setSidebarOpen(false)}
              />
            )}
            <div
              className={`${styles.sidebar} ${
                sidebarOpen ? styles.sidebarOpen : styles.sidebarClosed
              }`}
            >
              <button
                onClick={() => setSidebarOpen(false)}
                className="absolute top-2 right-2 text-lg font-bold hover:text-gray-600 dark:hover:text-gray-300"
                aria-label="Close menu"
              >
                &times;
              </button>
              <div className="flex flex-col mt-10 space-y-2">
                <Link
                  to="/profile"
                  className={styles.menuItems}
                  onClick={() => setSidebarOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className={`${styles.menuItems} text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300`}
                >
                  Logout
                </button>
              </div>
            </div>
          </li>
        </ul>
      </nav>
      {showScroll && (
        <button
          onClick={scrollToTop}
          className={styles.scrollToTopBtn}
          aria-label="Scroll to top"
        >
          <ArrowUpIcon className={styles.scrollToTopIcon} />
        </button>
      )}
    </>
  );
}
