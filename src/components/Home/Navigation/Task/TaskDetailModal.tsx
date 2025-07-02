import { useState, useEffect, ChangeEvent } from "react";
import styles from "./TaskDetailModal.module.css";
import { Task } from "../../../../types";
import { useUser } from "../../../../context/UserContext";
import { getBaseUrl, getAssetUrl } from "../../../../services/api";

interface TaskDetailModalProps {
  taskId: string;
  onClose: () => void;
  onSuccess?: () => void;
}

interface StatusUpdateData {
  status: "pending" | "in-progress" | "completed";
  proofOfCompletion?: {
    type: "image" | "link";
    value: string;
  };
}

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending", color: "bg-gray-500" },
  { value: "in-progress", label: "In Progress", color: "bg-blue-500" },
  { value: "completed", label: "Completed", color: "bg-green-500" },
] as const;

export default function TaskDetailModal({
  taskId,
  onClose,
  onSuccess,
}: TaskDetailModalProps) {
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [statusUpdate, setStatusUpdate] = useState<StatusUpdateData>({
    status: "pending",
  });
  const [proofFile, setProofFile] = useState<File | null>(null);
  const { user } = useUser();
  const [proofModal, setProofModal] = useState<null | {
    type: string;
    value: string;
  }>(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await fetch(`${getBaseUrl()}/task/${taskId}`, {
          credentials: "include",
        });

        if (!response.ok) {
          if (response.status === 403) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Access denied");
          }
          throw new Error("Failed to fetch task");
        }

        const taskData = await response.json();
        setTask(taskData);
        setStatusUpdate({ status: taskData.status });
      } catch (err: any) {
        setError(err.message || "Failed to fetch task");
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [taskId]);

  const handleStatusChange = (newStatus: StatusUpdateData["status"]) => {
    setStatusUpdate({ status: newStatus });
    setError("");
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProofFile(e.target.files[0]);
    } else {
      setProofFile(null);
    }
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (statusUpdate.status === "completed" && !proofFile) {
      setError("Proof file is required when marking as completed");
      return;
    }

    setUpdating(true);
    setError("");

    try {
      let response;
      if (statusUpdate.status === "completed") {
        const formData = new FormData();
        formData.append("status", statusUpdate.status);
        if (proofFile) {
          formData.append("proofFile", proofFile);
        }
        response = await fetch(`${getBaseUrl()}/task/${taskId}/status`, {
          method: "PUT",
          body: formData,
          credentials: "include",
        });
      } else {
        response = await fetch(`${getBaseUrl()}/task/${taskId}/status`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: statusUpdate.status }),
          credentials: "include",
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 403) {
          throw new Error(errorData.message || "Access denied");
        }
        throw new Error(errorData.message || "Failed to update task status");
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message || "Failed to update task status");
    } finally {
      setUpdating(false);
      setProofFile(null);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (loading) {
    return (
      <div className={styles.overlay} onClick={handleOverlayClick}>
        <div className={styles.modal}>
          <div className={styles.loading}>Loading task details...</div>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className={styles.overlay} onClick={handleOverlayClick}>
        <div className={styles.modal}>
          <div className={styles.error}>Task not found</div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    const statusOption = STATUS_OPTIONS.find(
      (option) => option.value === status
    );
    return statusOption?.color || "bg-gray-500";
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-PH", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Manila",
    });
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        {/* Proof Modal Overlay */}
        {proofModal && (
          <div
            className={styles.proofModalOverlay}
            onClick={() => setProofModal(null)}
          >
            <div
              className={styles.proofModalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className={styles.closeButton}
                onClick={() => setProofModal(null)}
                aria-label="Close proof modal"
              >
                &times;
              </button>
              <img
                src={proofModal.value}
                alt="Proof of completion"
                className={styles.proofModalImage}
              />
            </div>
          </div>
        )}
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Task Details</h2>
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

        <div className={styles.taskInfo}>
          <div className={styles.taskHeader}>
            <h3 className={styles.taskName}>{task.taskName}</h3>
            <span
              className={`${styles.statusBadge} ${getStatusColor(task.status)}`}
            >
              {task.status.replace("-", " ")}
            </span>
          </div>

          <div className={styles.taskDetails}>
            <div className={styles.detailRow}>
              <span className={styles.label}>Assigned To:</span>
              <span className={styles.value}>{task.to}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.label}>Department:</span>
              <span className={styles.value}>{task.department}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.label}>Role:</span>
              <span className={styles.value}>{task.role}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.label}>Subject:</span>
              <span className={styles.value}>{task.subject}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.label}>Due Date:</span>
              <span className={styles.value}>
                {formatDateTime(task.dayTime)}
              </span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.label}>Details:</span>
              <span className={styles.value}>{task.details}</span>
            </div>
          </div>

          {/* Department Head and other roles: Show intern statuses only */}
          {user &&
            user.role !== "Intern" &&
            task.statusLog &&
            task.statusLog.length > 0 && (
              <div className={styles.statusLogSection}>
                <h4 className={styles.statusLogTitle}>Intern Statuses</h4>
                <div className={styles.statusLogList}>
                  {task.statusLog.map((log, index) => (
                    <div key={index} className={styles.statusLogItem}>
                      <div className={styles.statusLogHeader}>
                        <span className={styles.statusLogUser}>
                          {log.userName}
                        </span>
                        <span
                          className={`${
                            styles.statusLogStatus
                          } ${getStatusColor(log.status)}`}
                        >
                          {log.status.replace("-", " ")}
                        </span>
                      </div>
                      {log.proofOfCompletion && (
                        <div className={styles.statusLogProof}>
                          <span className={styles.proofLabel}>Proof:</span>
                          <button
                            type="button"
                            className={styles.viewProofButton}
                            onClick={() =>
                              log.proofOfCompletion &&
                              setProofModal({
                                type: log.proofOfCompletion.type,
                                value: `${getAssetUrl()}/api/task${
                                  log.proofOfCompletion.value
                                }`,
                              })
                            }
                          >
                            View Proof
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Intern: Show update status form only for their own status */}
          {user &&
            user.role === "Intern" &&
            task.statusLog &&
            task.statusLog.length > 0 &&
            (() => {
              const myLog = task.statusLog.find(
                (log) => log.userId === user.email || log.userName === user.name
              );
              if (!myLog) return null;
              return (
                <form onSubmit={handleSubmit} className={styles.statusForm}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Update Status:</label>
                    <div className={styles.statusOptions}>
                      {STATUS_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() =>
                            handleStatusChange(
                              option.value as
                                | "pending"
                                | "in-progress"
                                | "completed"
                            )
                          }
                          className={`${styles.statusOption} ${
                            statusUpdate.status === option.value
                              ? styles.selected
                              : ""
                          } ${option.color}`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  {statusUpdate.status === "completed" && (
                    <div className={styles.proofSection}>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>
                          Proof of Completion (file upload):
                        </label>
                        <input
                          type="file"
                          accept="image/*,application/pdf"
                          onChange={handleFileChange}
                          className={styles.input}
                          required
                          disabled={updating}
                        />
                        {proofFile && (
                          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                            Selected: {proofFile.name}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
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
                      disabled={updating}
                    >
                      Close
                    </button>
                    <button
                      type="submit"
                      className={styles.submitButton}
                      disabled={updating}
                    >
                      {updating && <span className={styles.loadingSpinner} />}
                      {updating ? "Updating..." : "Update Status"}
                    </button>
                  </div>
                </form>
              );
            })()}
        </div>
      </div>
    </div>
  );
}
