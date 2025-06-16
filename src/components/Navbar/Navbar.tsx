import { Link, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";

import HSI_Logo from "../../images/HSI_Logo.jpg";
import { useUser } from "../../context/UserContext";

export default function Navbar() {
  const { user, setUser } = useUser();
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

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link to="/">
          <img src={HSI_Logo} alt="Task Tracker" className={styles.logoImage} />
        </Link>
      </div>
      <ul className={styles.navLinks}>
        <li>
          <Link to="/home" className={styles.navLink}>
            Home
          </Link>
        </li>
        <li>
          {user ? (
            <button onClick={handleLogout} className={styles.navLink}>
              Logout
            </button>
          ) : (
            <Link to="/login" className={styles.navLink}>
              Login
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
}
