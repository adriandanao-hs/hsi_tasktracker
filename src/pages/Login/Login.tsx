import { useState } from "react";
import styles from "./Login.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { PasswordInput } from "../../components/ui/PasswordInput";

import logo from "../../images/chrono_logo.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading, error, clearError } = useUser();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    await login({ email, password });
    navigate("/home");
  };

  return (
    <div className={styles.bgWrapper}>
      <div className={styles.card}>
        {/* Left: Logo and tagline */}
        <div className={styles.leftPanel}>
          <div className={styles.logoBox}>
            {/* Placeholder for logo SVG */}
            <img src={logo} alt="" />
          </div>
        </div>
        {/* Right: Login form */}
        <div className={styles.rightPanel}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <Input
              className={styles.input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              disabled={loading}
            />

            <PasswordInput
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              disabled={loading}
            />

            <div className={styles.forgotRow}>
              <Link to="/forgot-password" className={styles.forgotRow}>
                Forgot Password?
              </Link>
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.actionRow}>
              <Link to="/register" className={styles.createAccount}>
                Create account
              </Link>
              <Button
                type="submit"
                loading={loading}
                disabled={loading}
                className={styles.submit}
              >
                Sign In
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
