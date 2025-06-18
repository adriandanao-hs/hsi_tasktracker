import { useState } from "react";
import styles from "./Login.module.css";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { setUser } = useUser();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:10533/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const errData = await res.json();
        setError(errData.message || "Login failed. Please try again.");
        return;
      }
      const data = await res.json();
      setUser(data.user);
      navigate("/home");
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div className={styles.bgWrapper}>
      <div className={styles.card}>
        {/* Left: Logo and tagline */}
        <div className={styles.leftPanel}>
          <div className={styles.logoBox}>
            {/* Placeholder for logo SVG */}
            <svg
              width="90"
              height="70"
              viewBox="0 0 90 70"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <polyline
                points="10,60 35,35 55,55 75,25"
                stroke="#1a2341"
                strokeWidth="6"
                fill="none"
              />
              <polygon points="75,25 85,25 85,15" fill="#1a2341" />
            </svg>
          </div>
          <div className={styles.brandName}>chrono</div>
          <div className={styles.tagline}>Tagline</div>
        </div>
        {/* Right: Login form */}
        <div className={styles.rightPanel}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <input
                type="email"
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <div className={styles.passwordWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  className={styles.input}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className={styles.showButton}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
            <div className={styles.forgotRow}>
              <Link to="/forgot-password" className={styles.forgotLink}>
                Forgot Password?
              </Link>
            </div>
            {error && <div className={styles.error}>{error}</div>}
            <div className={styles.actionRow}>
              <Link to="/register" className={styles.createAccount}>
                Create account
              </Link>
              <button type="submit" className={styles.submit}>
                Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
