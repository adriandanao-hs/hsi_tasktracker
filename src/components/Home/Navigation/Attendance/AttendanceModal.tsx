import { useEffect, useState } from "react";
import styles from "./AttendanceModal.module.css";
import { useUser } from "../../../../context/UserContext";
import { getBaseUrl } from "../../../../services/api";

interface AttendanceModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

interface AttendanceRecord {
  _id: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  notes?: string;
}

export default function AttendanceModal({
  onClose,
  onSuccess,
}: AttendanceModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [attendance, setAttendance] = useState<AttendanceRecord | null>(null);
  const [successMsg, setSuccessMsg] = useState("");
  const { user } = useUser();

  // Fetch today's attendance on mount
  useEffect(() => {
    const fetchTodayAttendance = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(
          `${getBaseUrl()}/attendance/history/${user?._id}`,
          {
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch attendance");
        const records: AttendanceRecord[] = await res.json();
        // Find today's record
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to start of day for comparison

        const todayRecord = records.find((r) => {
          const recordDate = new Date(r.date);
          recordDate.setHours(0, 0, 0, 0); // Set to start of day for comparison
          return recordDate.getTime() === today.getTime();
        });

        setAttendance(todayRecord || null);
      } catch (err: any) {
        setError(err.message || "Error fetching attendance");
      } finally {
        setLoading(false);
      }
    };
    fetchTodayAttendance();
  }, [user?._id]); // Removed successMsg dependency

  // Clear success message after 3 seconds
  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => {
        setSuccessMsg("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  const handleCheckIn = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${getBaseUrl()}/attendance/checkin`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user?._id }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Check-in failed");
      }
      const data = await res.json();
      setAttendance(data);
      setSuccessMsg("Checked in successfully!");
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || "Check-in failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${getBaseUrl()}/attendance/checkout`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user?._id }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Check-out failed");
      }
      const data = await res.json();
      setAttendance(data);
      setSuccessMsg("Checked out successfully!");
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || "Check-out failed");
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const formatTime = (iso?: string) => {
    if (!iso) return "-";
    const d = new Date(iso);
    const date = d.toLocaleDateString([], {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const time = d.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    return `${date}, ${time}`;
  };

  const checkedIn = !!attendance?.checkIn;
  const checkedOut = !!attendance?.checkOut;

  const getStatusColor = () => {
    if (checkedOut) return styles.statusCompleted;
    if (checkedIn) return styles.statusActive;
    return styles.statusPending;
  };

  const getStatusText = () => {
    if (checkedOut) return "Checked out";
    if (checkedIn) return "Currently working";
    return "Not checked in";
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            <svg
              className={styles.titleIcon}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 8V12L15 15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle
                cx="12"
                cy="12"
                r="9"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
            Today's Attendance
          </h2>
          <button
            type="button"
            onClick={onClose}
            className={styles.closeButton}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <div className={styles.statusContainer}>
          <div className={`${styles.statusIndicator} ${getStatusColor()}`}>
            <span className={styles.statusDot}></span>
            <span className={styles.statusText}>{getStatusText()}</span>
          </div>
        </div>

        <div className={styles.timeContainer}>
          <div className={styles.timeEntry}>
            <svg
              className={styles.timeIcon}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 6V12L16 14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle
                cx="12"
                cy="12"
                r="9"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
            <div className={styles.timeInfo}>
              <span className={styles.timeLabel}>Check-in</span>
              <span className={styles.timeValue}>
                {formatTime(attendance?.checkIn)}
              </span>
            </div>
          </div>
          <div className={styles.timeEntry}>
            <svg
              className={styles.timeIcon}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 6V12L8 14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle
                cx="12"
                cy="12"
                r="9"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
            <div className={styles.timeInfo}>
              <span className={styles.timeLabel}>Check-out</span>
              <span className={styles.timeValue}>
                {formatTime(attendance?.checkOut)}
              </span>
            </div>
          </div>
        </div>

        {error && <div className={styles.error}>{error}</div>}
        {successMsg && <div className={styles.success}>{successMsg}</div>}

        <div className={styles.buttonContainer}>
          {!checkedIn && (
            <button
              type="button"
              onClick={handleCheckIn}
              disabled={loading}
              className={`${styles.submitButton} ${styles.checkInButton}`}
            >
              {loading ? (
                <span className={styles.loadingSpinner}></span>
              ) : (
                <>
                  <svg
                    className={styles.buttonIcon}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 8V12L15 15"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                  Clock In
                </>
              )}
            </button>
          )}
          {checkedIn && !checkedOut && (
            <button
              type="button"
              onClick={handleCheckOut}
              disabled={loading}
              className={`${styles.submitButton} ${styles.checkOutButton}`}
            >
              {loading ? (
                <span className={styles.loadingSpinner}></span>
              ) : (
                <>
                  <svg
                    className={styles.buttonIcon}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 8V12L15 15"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                  Clock Out
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
