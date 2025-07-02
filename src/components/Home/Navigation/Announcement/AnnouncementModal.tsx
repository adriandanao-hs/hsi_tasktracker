import { FormEvent, useState } from "react";
import styles from "./AnnouncementModal.module.css";
import { getBaseUrl } from "../../../../services/api";

interface AnnouncementModalProps {
  onClose: () => void;
  onSuccess?: () => void;
  userDepartments: string[]; // User's departments to filter available options
}

interface AnnouncementData {
  title: string;
  message: string;
  departments: string[];
  expiresAt?: string; // ISO string for expiration date
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

export default function AnnouncementModal({
  onClose,
  onSuccess,
  userDepartments,
}: AnnouncementModalProps) {
  const [formData, setFormData] = useState<AnnouncementData>({
    title: "",
    message: "",
    departments: [],
    expiresAt: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Filter departments to only show those relevant to the user
  const availableDepartments = DEPARTMENTS.filter((dept) =>
    userDepartments.includes(dept)
  );

  const handleInputChange = (
    field: keyof AnnouncementData,
    value: string | string[]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleDepartmentToggle = (department: string) => {
    setFormData((prev) => ({
      ...prev,
      departments: prev.departments.includes(department)
        ? prev.departments.filter((d) => d !== department)
        : [...prev.departments, department],
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.message.trim()) {
      setError("Please fill in all required fields");
      return;
    }

    if (formData.departments.length === 0) {
      setError("Please select at least one department");
      return;
    }

    // Validate expiration date if provided
    if (formData.expiresAt) {
      const expirationDate = new Date(formData.expiresAt);
      const now = new Date();

      if (expirationDate <= now) {
        setError("Expiration date must be in the future");
        return;
      }
    }

    setLoading(true);
    setError("");

    try {
      const announcementData = {
        title: formData.title.trim(),
        message: formData.message.trim(),
        departments: formData.departments,
        expiresAt: formData.expiresAt || undefined,
      };

      const response = await fetch(`${getBaseUrl()}/announcement/post`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(announcementData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to post announcement");
      }

      // Reset form and close modal
      setFormData({
        title: "",
        message: "",
        departments: [],
        expiresAt: "",
      });

      // Call the success callback to refresh announcements
      if (onSuccess) {
        onSuccess();
      }

      onClose();
    } catch (err: any) {
      setError(
        err.message || "An error occurred while posting the announcement"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Get minimum date (today) for expiration date input
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Post Announcement</h2>
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
            <label htmlFor="title" className={styles.label}>
              Title *
            </label>
            <input
              id="title"
              type="text"
              placeholder="Enter announcement title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className={styles.input}
              required
              disabled={loading}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="message" className={styles.label}>
              Message *
            </label>
            <textarea
              id="message"
              placeholder="Enter announcement message"
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              className={styles.textarea}
              required
              disabled={loading}
            />
          </div>

          <div className={styles.departmentsContainer}>
            <label className={styles.departmentsLabel}>
              Select Departments *
              <span className="text-xs text-gray-500 ml-2">
                (Your departments only)
              </span>
            </label>
            <div className={styles.departmentsList}>
              {availableDepartments.map((department) => (
                <div key={department} className={styles.departmentItem}>
                  <input
                    type="checkbox"
                    id={`dept-${department}`}
                    value={department}
                    checked={formData.departments.includes(department)}
                    onChange={() => handleDepartmentToggle(department)}
                    className={styles.checkbox}
                    disabled={loading}
                  />
                  <label
                    htmlFor={`dept-${department}`}
                    className={styles.departmentName}
                  >
                    {department}
                  </label>
                </div>
              ))}
            </div>
            {availableDepartments.length === 0 && (
              <p className="text-sm text-gray-500 mt-2">
                No departments available for you to post announcements to.
              </p>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="expiresAt" className={styles.label}>
              Expiration Date
              <span className="text-xs text-gray-500 ml-2">
                (Optional - Leave empty for no expiration)
              </span>
            </label>
            <input
              id="expiresAt"
              type="datetime-local"
              value={formData.expiresAt}
              onChange={(e) => handleInputChange("expiresAt", e.target.value)}
              min={getMinDate()}
              className={styles.input}
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
              {loading ? "Posting..." : "Post Announcement"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
