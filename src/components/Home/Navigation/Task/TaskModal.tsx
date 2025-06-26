import { FormEvent, useState } from "react";
import styles from "./TaskModal.module.css";

interface TaskModalProps {
  onClose: () => void;
  onSuccess?: () => void;
  userDepartments: string[]; // User's departments to filter available options
}

interface TaskData {
  taskName: string;
  dayTime: string;
  department: string;
  subject: string;
  details: string;
}

const DEPARTMENTS = [
  "Web Development",
  "Mobile Development",
  "Project Management",
  "Quality Assurance",
  "Graphics Design",
  "System Administration",
  "Admin/Accounting, and Finance",
  "IT Sales",
  "Marketing Unleash",
  "Human Resource",
  "PS Docu Task",
  "E-commerce Unleash",
  "Game Development",
  "Unleash Game Dev",
  "Unleash Web Dev",
  "Unleash L1",
  "Unleash Ops",
  "Unleash GFX",
] as const;

export default function TaskModal({
  onClose,
  onSuccess,
  userDepartments,
}: TaskModalProps) {
  const [formData, setFormData] = useState<TaskData>({
    taskName: "",
    dayTime: "",
    department: "",
    subject: "",
    details: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Filter departments to only show those relevant to the user
  const availableDepartments = DEPARTMENTS.filter((dept) =>
    userDepartments.includes(dept)
  );

  const handleInputChange = (field: keyof TaskData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (
      !formData.taskName.trim() ||
      !formData.dayTime ||
      !formData.department ||
      !formData.subject.trim() ||
      !formData.details.trim()
    ) {
      setError("Please fill in all required fields");
      return;
    }

    // Validate date/time
    const selectedDateTime = new Date(formData.dayTime);
    const now = new Date();

    if (selectedDateTime <= now) {
      setError("Task date/time must be in the future");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:10533/api/task/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          taskName: formData.taskName.trim(),
          dayTime: formData.dayTime,
          department: formData.department,
          subject: formData.subject.trim(),
          details: formData.details.trim(),
        }),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create task");
      }

      // Reset form and close modal
      setFormData({
        taskName: "",
        dayTime: "",
        department: "",
        subject: "",
        details: "",
      });

      // Call the success callback to refresh tasks
      if (onSuccess) {
        onSuccess();
      }

      onClose();
    } catch (err: any) {
      setError(err.message || "An error occurred while creating the task");
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Get minimum date/time (now) for task date/time input
  const getMinDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Create Task</h2>
          <button
            type="button"
            onClick={onClose}
            className={styles.closeButton}
            aria-label="Close modal"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="taskName" className={styles.label}>
              Task Name *
            </label>
            <input
              id="taskName"
              type="text"
              placeholder="Enter task name"
              value={formData.taskName}
              onChange={(e) => handleInputChange("taskName", e.target.value)}
              className={styles.input}
              required
              disabled={loading}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="dayTime" className={styles.label}>
              Date & Time *
            </label>
            <input
              id="dayTime"
              type="datetime-local"
              value={formData.dayTime}
              onChange={(e) => handleInputChange("dayTime", e.target.value)}
              min={getMinDateTime()}
              className={styles.input}
              required
              disabled={loading}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="department" className={styles.label}>
              Department *
              <span className="text-xs text-gray-500 ml-2">
                (Your departments only)
              </span>
            </label>
            <select
              id="department"
              value={formData.department}
              onChange={(e) => handleInputChange("department", e.target.value)}
              className={`${styles.select} ${
                error && !formData.department ? "error" : ""
              }`}
              required
              disabled={loading}
            >
              <option value="">-- Select Department --</option>
              {availableDepartments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            {error && !formData.department && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                Please select a department
              </p>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="subject" className={styles.label}>
              Subject *
            </label>
            <input
              id="subject"
              type="text"
              placeholder="Enter task subject"
              value={formData.subject}
              onChange={(e) => handleInputChange("subject", e.target.value)}
              className={styles.input}
              required
              disabled={loading}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="details" className={styles.label}>
              Details *
            </label>
            <textarea
              id="details"
              placeholder="Enter task details"
              value={formData.details}
              onChange={(e) => handleInputChange("details", e.target.value)}
              className={styles.textarea}
              required
              disabled={loading}
            />
          </div>

          {error && (
            <div className={styles.error}>
              <svg
                className="inline w-4 h-4 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {error}
            </div>
          )}

          <div className={styles.buttonGroup}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading || availableDepartments.length === 0}
            >
              {loading && <span className={styles.loadingSpinner} />}
              {loading ? "Creating..." : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
