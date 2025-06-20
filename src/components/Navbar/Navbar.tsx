import { actions } from "./navbarData";
import styles from "./Navbar.module.css";
import { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import { Link, useNavigate } from "react-router-dom";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";

import HSI_Logo from "../../images/HSI_Logo.jpg";
import default_avatart from "../../images/default-avatart.jpg";

export default function Navbar() {
  const { user, setUser } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:10533/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        const errData = await res.json();
        console.error("Logout failed:", errData.message || "Unknown error");
        return;
      }

      setUser(null);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <nav className={styles.navbar}>
      <div className={styles.topSection}>
        <div className={styles.logo}>
          <Link to="/">
            <img
              src={HSI_Logo}
              alt="Task Tracker"
              className={styles.logoImage}
            />
          </Link>
        </div>

        {/* Top  */}

        <ul className={styles.navLinks}>
          {(actions[user?.role as keyof typeof actions] || []).map((item) => {
            return (
              <li key={item.label} className={styles.navItem}>
                <Link
                  to={item.to}
                  className={`${styles.navLink} ${styles.navItemStyle}`}
                >
                  <item.icon className={styles.icons} />
                  <span className={styles.iconText}>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Bottom Links */}
      <ul className={styles.bottomLinks}>
        <li>
          <button
            onClick={() => setDarkMode((prev) => !prev)}
            className={`${styles.navLink} ${styles.navItemStyle}`}
            aria-label="Toggle theme"
          >
            {darkMode ? (
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
          >
            <img
              src={user!.photo || default_avatart}
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
              className="absolute top-2 right-2 text-lg font-bold"
            >
              &times;
            </button>
            <div className="flex flex-col mt-10">
              <button className={styles.menuItems}>Profile</button>
              <button onClick={handleLogout} className={styles.menuItems}>
                Logout
              </button>
            </div>
          </div>
        </li>
      </ul>
    </nav>
  );
}
