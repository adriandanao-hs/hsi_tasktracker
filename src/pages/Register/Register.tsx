import React, { useState } from "react";
import styles from "./Register.module.css";
import { useNavigate } from "react-router-dom";

const Register: React.FC = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "Intern",
    department: "",
  
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:10533/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Registration failed");
      }

      setSubmitted(true);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
   
    <div className={styles.registerContainer}>
      <h2 className={styles.registerTitle}>Register</h2>

      {submitted ? (
        <div className={styles.registerSuccessBox}>
          <div className={styles.registerSuccessIcon}>✓</div>
          <div className={styles.registerSuccessText}>Registration successful! Redirecting to login...</div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className={styles.registerForm}>
          <div>
            <label className={styles.registerLabel}>
              Username:
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                autoComplete="username"
                className={styles.registerInput}
              />
            </label>
          </div>
          <div>
            <label className={styles.registerLabel}>
              Email:
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
                className={styles.registerInput}
              />
            </label>
          </div>
          <div>
            <label className={styles.registerLabel}>
              Password:
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="new-password"
                className={styles.registerInput}
              />
            </label>
          </div>
          <div>
            <label className={styles.registerLabel}>
              Role:
              <select
                name="role"
                value={form.role}
                onChange={handleSelectChange}
                required
                className={styles.registerSelect}
              >
                <option value="Intern">Intern</option>
                <option value="Department Head">Department Head</option>
                <option value="Supervisor">Supervisor</option>
              </select>
            </label>
          </div>
          <div>
            <label className={styles.registerLabel}>
              Department:
              <select
                name="department"
                value={form.department}
                onChange={handleSelectChange}
                required
                className={styles.registerSelect}
              >
                <option value="">-- Select Department --</option>
                <option value="Web Dev">Web Development</option>
                <option value="Mob Dev">Mobile Development</option>
                <option value="Pro Man">Project Management</option>
                <option value="Qua Ass">Quality Assurance</option>
                <option value="Gra Des">Graphics Design</option>
                <option value="Sys Adm">System Administration</option>
                <option value="A/A, Fin">Admin/Accounting, and Finance</option>
                <option value="It Sal">IT Sales</option>
                <option value="Mar Unl">Marketing Unleash</option>
                <option value="Hum Res">Human Resource</option>
                <option value="PS Doc Tas">PS Docu Task</option>
                <option value="E-com Unl">E-commerce Unleash</option>
                <option value="Game Dev">Game Development</option>
                <option value="Unl Game Dev">Unleash Game Dev</option>
                <option value="Unl Web Dev">Unleash Web Dev</option>
                <option value="Unl L1 ">Unleash L1</option>
                <option value="Unl Op">Unleash Op</option>
                <option value="Unl GFX">Unleash GFX</option>
              </select>
            </label>
          </div>
        

          {error && <div className={styles.registerError}>{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className={styles.registerButton}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      )}
    </div>
  
  );
};

export default Register;
