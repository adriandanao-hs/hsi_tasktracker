import styles from "./Navbar.module.css";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  HomeIcon,
  ArrowRightEndOnRectangleIcon,
  ArrowLeftEndOnRectangleIcon,
  MoonIcon,
  SunIcon,
  BuildingOfficeIcon,
  BuildingOffice2Icon,
} from "@heroicons/react/24/outline";

import HSI_Logo from "../../images/HSI_Logo.jpg";
import { useUser } from "../../context/UserContext";

export default function Navbar() {
  const { user, setUser } = useUser();
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
        <ul className={styles.navLinks}>
          <li>
            <Link
              to="/home"
              className={`${styles.navLink} ${styles.navItemStyle}`}
            >
              <HomeIcon className={styles.icons} />
              <span className={styles.iconText}>Home</span>
            </Link>
          </li>
          <li>
            <Link
              to="/home"
              className={`${styles.navLink} ${styles.navItemStyle}`}
            >
              <BuildingOfficeIcon className={styles.icons} />
              <span className={styles.iconText}>Major Department</span>
            </Link>
          </li>
          <li>
            <Link
              to="/home"
              className={`${styles.navLink} ${styles.navItemStyle}`}
            >
              <BuildingOffice2Icon className={styles.icons} />
              <span className={styles.iconText}>Minor Department</span>
            </Link>
          </li>
        </ul>
      </div>

      {/* Bottom Links */}
      <ul className={styles.bottomLinks}>
        <li>
          {user ? (
            <button
              onClick={handleLogout}
              className={`${styles.navLink} ${styles.navItemStyle}`}
            >
              <ArrowRightEndOnRectangleIcon className={styles.icons} />
              <span>Logout</span>
            </button>
          ) : (
            <Link
              to="/login"
              className={`${styles.navLink} ${styles.navItemStyle}`}
            >
              <ArrowLeftEndOnRectangleIcon className={styles.icons} />
              <span>Login</span>
            </Link>
          )}
        </li>
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
            <span>Theme</span>
          </button>
        </li>
      </ul>
    </nav>
  );
}
