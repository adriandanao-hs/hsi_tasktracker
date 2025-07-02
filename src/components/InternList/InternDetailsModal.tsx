import { useEffect, useState } from "react";
import styles from "./InternDetailsModal.module.css";

interface Attendance {
  _id: string;
  date: string;
  checkIn: string;
  checkOut: string | null;
  notes?: string;
}

interface TaskLog {
  _id: string;
  taskName: string;
  dayTime: string;
  department: string;
  subject: string;
  details: string;
  status: "pending" | "in-progress" | "completed";
  statusLog: {
    userId: string;
    userName: string;
    status: "pending" | "in-progress" | "completed";
    proofOfCompletion?: {
      type: "file";
      value: string;
    };
    updatedAt: string;
  }[];
}

interface InternDetailsModalProps {
  intern: {
    _id: string;
    name: string;
    email: string;
    departments: string[];
    photo: string;
  };
  onClose: () => void;
}

export default function InternDetailsModal({
  intern,
  onClose,
}: InternDetailsModalProps) {
  const [attendanceLogs, setAttendanceLogs] = useState<Attendance[]>([]);
  const [taskLogs, setTaskLogs] = useState<TaskLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"attendance" | "tasks">(
    "attendance"
  );
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());

  const toggleTask = (taskId: string) => {
    setExpandedTasks((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      return newSet;
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch attendance logs
        const attendanceResponse = await fetch(
          `http://localhost:10533/api/attendance/history/${intern._id}`,
          {
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!attendanceResponse.ok) {
          throw new Error("Failed to fetch attendance logs");
        }
        const attendanceData = await attendanceResponse.json();

        // Fetch task logs
        const taskResponse = await fetch(
          `http://localhost:10533/api/task/intern/${intern._id}`,
          {
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!taskResponse.ok) {
          throw new Error("Failed to fetch task logs");
        }
        const taskData = await taskResponse.json();

        setAttendanceLogs(attendanceData);
        setTaskLogs(taskData);
      } catch (err: any) {
        setError(err.message || "Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [intern._id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-PH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-PH", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.internInfo}>
            <img
              src={
                `http://localhost:10533${intern.photo}` || "/default-avatar.jpg"
              }
              alt={intern.name}
              className={styles.internPhoto}
            />
            <div>
              <h2 className={styles.internName}>{intern.name}</h2>
              <p className={styles.internEmail}>{intern.email}</p>
              <p className={styles.internDepartments}>
                {intern.departments.join(", ")}
              </p>
            </div>
          </div>
          <button onClick={onClose} className={styles.closeButton}>
            ×
          </button>
        </div>

        <div className={styles.tabContainer}>
          <button
            className={`${styles.tabButton} ${
              activeTab === "attendance" ? styles.activeTab : ""
            }`}
            onClick={() => setActiveTab("attendance")}
          >
            Attendance Logs
          </button>
          <button
            className={`${styles.tabButton} ${
              activeTab === "tasks" ? styles.activeTab : ""
            }`}
            onClick={() => setActiveTab("tasks")}
          >
            Task Logs
          </button>
        </div>

        {loading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
            <p>Loading...</p>
          </div>
        ) : error ? (
          <div className={styles.errorContainer}>
            <p className={styles.errorMessage}>{error}</p>
          </div>
        ) : (
          <div className={styles.logsContainer}>
            {activeTab === "attendance" ? (
              <div className={styles.attendanceLogs}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Check In</th>
                      <th>Check Out</th>
                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceLogs.map((log) => (
                      <tr key={log._id}>
                        <td>{formatDate(log.date)}</td>
                        <td>{formatTime(log.checkIn)}</td>
                        <td>
                          {log.checkOut ? formatTime(log.checkOut) : "Not yet"}
                        </td>
                        <td>{log.notes || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {attendanceLogs.length === 0 && (
                  <p className={styles.noData}>No attendance logs found.</p>
                )}
              </div>
            ) : (
              <div className={styles.taskLogs}>
                {taskLogs.map((task) => (
                  <div key={task._id} className={styles.taskCard}>
                    <div
                      className={styles.taskHeader}
                      onClick={() => toggleTask(task._id)}
                      role="button"
                      tabIndex={0}
                    >
                      <div className={styles.taskHeaderLeft}>
                        <svg
                          className={`${styles.chevronIcon} ${
                            expandedTasks.has(task._id)
                              ? styles.chevronExpanded
                              : ""
                          }`}
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M6 8L10 12L14 8"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <h3 className={styles.taskName}>
                          {task.taskName} - {formatDate(task.dayTime)}
                        </h3>
                      </div>
                      <span
                        className={`${styles.taskStatus} ${
                          styles[`status${task.status}`]
                        }`}
                      >
                        {task.status}
                      </span>
                    </div>

                    {expandedTasks.has(task._id) && (
                      <div className={styles.taskExpandedContent}>
                        <div className={styles.taskDetails}>
                          <p>
                            <strong>Department:</strong> {task.department}
                          </p>
                          <p>
                            <strong>Subject:</strong> {task.subject}
                          </p>
                          <p>
                            <strong>Details:</strong> {task.details}
                          </p>
                          <p>
                            <strong>Due:</strong> {formatDate(task.dayTime)}
                          </p>
                        </div>

                        <div className={styles.statusLogList}>
                          <h4 className={styles.statusLogTitle}>
                            Status History
                          </h4>
                          {task.statusLog.map((log) => (
                            <div
                              key={log.updatedAt}
                              className={styles.statusLogItem}
                            >
                              <span className={styles.statusDate}>
                                {formatDate(log.updatedAt)}
                              </span>
                              <span
                                className={`${styles.statusBadge} ${
                                  styles[`status${log.status}`]
                                }`}
                              >
                                {log.status}
                              </span>
                              {log.proofOfCompletion && (
                                <a
                                  href={`http://localhost:10533${log.proofOfCompletion.value}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={styles.proofLink}
                                >
                                  View Proof
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {taskLogs.length === 0 && (
                  <p className={styles.noData}>No task logs found.</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
