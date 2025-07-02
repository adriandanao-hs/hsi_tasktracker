import React, { useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { PasswordInput } from "../../components/ui/PasswordInput";
import styles from "./Register.module.css";

// Types
interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
  departments: string[];
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  role?: string;
  departments?: string;
  general?: string;
}

// Constants
const ROLES = [
  { value: "Intern", label: "Intern" },
  { value: "Department Head", label: "Department Head" },
  { value: "Supervisor", label: "Supervisor" },
] as const;

const DEPARTMENTS = [
  { value: "Web Development", label: "Web Development" },
  { value: "Mobile Development", label: "Mobile Development" },
  { value: "Project Management", label: "Project Management" },
  { value: "Quality Assurance", label: "Quality Assurance" },
  { value: "Graphics Design", label: "Graphics Design" },
  { value: "System Administration", label: "System Administration" },
  {
    value: "Admin/Accounting, and Finance",
    label: "Admin/Accounting, and Finance",
  },
  { value: "IT Sales", label: "IT Sales" },
  { value: "Marketing Unleash", label: "Marketing Unleash" },
  { value: "Human Resource", label: "Human Resource" },
  { value: "PS Docu Task", label: "PS Docu Task" },
  { value: "E-commerce Unleash", label: "E-commerce Unleash" },
  { value: "Game Development", label: "Game Development" },
  { value: "Unleash Game Dev", label: "Unleash Game Dev" },
  { value: "Unleash Web Dev", label: "Unleash Web Dev" },
  { value: "Unleash L1", label: "Unleash L1" },
  { value: "Unleash Ops", label: "Unleash Ops" },
  { value: "Unleash GFX", label: "Unleash GFX" },
] as const;

// Validation functions
const validateEmail = (email: string): string | undefined => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return "Email is required";
  if (!emailRegex.test(email)) return "Please enter a valid email address";
  return undefined;
};

const validatePassword = (password: string): string | undefined => {
  if (!password) return "Password is required";
  if (password.length < 6) return "Password must be at least 6 characters long";
  return undefined;
};

const validateForm = (formData: RegisterFormData): FormErrors => {
  const errors: FormErrors = {};

  // Name validation
  if (!formData.name.trim()) {
    errors.name = "Name is required";
  } else if (formData.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters long";
  }

  // Email validation
  const emailError = validateEmail(formData.email);
  if (emailError) errors.email = emailError;

  // Password validation
  const passwordError = validatePassword(formData.password);
  if (passwordError) errors.password = passwordError;

  // Confirm password validation
  if (!formData.confirmPassword) {
    errors.confirmPassword = "Please confirm your password";
  } else if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  // Role validation
  if (!formData.role) {
    errors.role = "Please select a role";
  }

  // Department validation
  if (formData.departments.length < 2) {
    errors.departments = "Please select at least 2 departments";
  }

  return errors;
};

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "Intern",
    departments: [],
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = useCallback(
    (field: keyof RegisterFormData, value: string) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));

      // Clear field-specific error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({
          ...prev,
          [field]: undefined,
        }));
      }
    },
    [errors]
  );

  const handleDepartmentToggle = useCallback(
    (department: string) => {
      setFormData((prev) => {
        const isSelected = prev.departments.includes(department);

        if (isSelected) {
          // Remove department if already selected
          return {
            ...prev,
            departments: prev.departments.filter((d) => d !== department),
          };
        } else {
          // Add department if not selected and under limit
          if (prev.departments.length >= 2) {
            return prev; // Don't add if already at limit
          }
          return {
            ...prev,
            departments: [...prev.departments, department],
          };
        }
      });

      // Clear department error when user makes a selection
      if (errors.departments) {
        setErrors((prev) => ({
          ...prev,
          departments: undefined,
        }));
      }
    },
    [errors.departments]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Validate form
      const validationErrors = validateForm(formData);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      setLoading(true);
      setErrors({});

      try {
        const response = await fetch(
          "https://hsitasktrackerbackend.vercel.app/api/auth/register",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: formData.name.trim(),
              email: formData.email.trim(),
              password: formData.password,
              role: formData.role,
              departments: formData.departments, // Send departments array only
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Registration failed");
        }

        setSubmitted(true);

        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } catch (error: any) {
        setErrors({
          general: error.message || "An error occurred during registration",
        });
      } finally {
        setLoading(false);
      }
    },
    [formData, navigate]
  );

  if (submitted) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.successContainer}>
            <div className={styles.successIcon}>
              <svg
                className={styles.successCheck}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className={styles.successTitle}>Registration Successful!</h2>
            <p className={styles.successMessage}>
              Your account has been created successfully. Redirecting to
              login...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Create Account</h1>
          <p className={styles.subtitle}>
            Join our team and start managing your tasks efficiently
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div>
            <label className={styles.label}>
              Full Name <span className={styles.required}>*</span>
            </label>
            <Input
              className={styles.input}
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              error={errors.name}
              placeholder="Enter your full name"
              autoComplete="name"
              required
            />
          </div>

          <div>
            <label className={styles.label}>
              Email <span className={styles.required}>*</span>
            </label>
            <Input
              className={styles.input}
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              error={errors.email}
              placeholder="Enter your email address"
              autoComplete="email"
              required
            />
          </div>

          <div>
            <label className={styles.label}>
              Password <span className={styles.required}>*</span>
            </label>
            <PasswordInput
              label="Password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              error={errors.password}
              placeholder="Create a password"
              autoComplete="new-password"
              required
              className={styles.input}
            />
          </div>

          <div>
            <label className={styles.label}>
              Confirm Password <span className={styles.required}>*</span>
            </label>
            <PasswordInput
              label="Confirm Password"
              value={formData.confirmPassword}
              onChange={(e) =>
                handleInputChange("confirmPassword", e.target.value)
              }
              error={errors.confirmPassword}
              placeholder="Confirm your password"
              autoComplete="new-password"
              required
              className={styles.input}
            />
          </div>

          <div>
            <label className={styles.label}>
              Role <span className={styles.required}>*</span>
            </label>
            <select
              value={formData.role}
              onChange={(e) => handleInputChange("role", e.target.value)}
              className={`${styles.select} ${errors.role ? "error" : ""}`}
              required
            >
              {ROLES.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
            {errors.role && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                {errors.role}
              </p>
            )}
          </div>

          <div>
            <label className={styles.label}>
              Departments <span className={styles.required}>*</span>
              <span className="text-xs text-gray-500 ml-2">
                (Select up to 2)
              </span>
            </label>
            <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 dark:bg-gray-700 max-h-24 overflow-y-auto">
              <div className="space-y-2">
                {DEPARTMENTS.map((dept) => (
                  <label
                    key={dept.value}
                    className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData.departments.includes(dept.value)}
                      onChange={() => handleDepartmentToggle(dept.value)}
                      disabled={
                        !formData.departments.includes(dept.value) &&
                        formData.departments.length >= 2
                      }
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {dept.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            {errors.departments && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                {errors.departments}
              </p>
            )}
            {formData.departments.length > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                Selected: {formData.departments.join(", ")}
              </p>
            )}
          </div>

          {errors.general && (
            <div className={styles.error}>
              <svg
                className={styles.errorIcon}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{errors.general}</span>
            </div>
          )}

          <Button
            type="submit"
            loading={loading}
            disabled={loading}
            className={styles.button}
            size="lg"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
          Already have an account?{" "}
          <Link to="/login" className={styles.link}>
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
