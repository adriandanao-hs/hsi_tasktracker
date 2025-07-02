import { actions } from "./navigationData";
import { useEffect, useState, useCallback } from "react";
import ActionCard from "./Action/ActionCard";
import styles from "./Navigation.module.css";
import { useUser } from "../../../context/UserContext";
import { Announcement } from "../../../types";
import { getBaseUrl } from "../../../services/api";

import { PlusIcon } from "@heroicons/react/24/outline";

import AnnouncementModal from "./Announcement/AnnouncementModal";
import TaskModal from "./Task/TaskModal";
import TaskDetailModal from "./Task/TaskDetailModal";
import AttendanceModal from "./Attendance/AttendanceModal";

interface TaskItem {
  _id: string;
  label: string;
  to: string;
  icon?: any;
  dayTime?: string;
  subject?: string;
  details?: string;
}

export default function Navigation() {
  const { user, loading } = useUser();
  const [fetching, setFetching] = useState(true);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);

  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  const fetchTasks = useCallback(async () => {
    if (!user) return;

    try {
      const response = await fetch(`${getBaseUrl()}/task?role=${user.role}`, {
        credentials: "include",
      });
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setFetching(false);
    }
  }, [user]);

  const fetchAnnouncements = useCallback(async () => {
    if (!user) return;

    try {
      // Fetch announcements for all user departments
      const userDepartments = user.departments;
      const departmentParams = userDepartments
        .map((dept) => `department=${encodeURIComponent(dept)}`)
        .join("&");

      const response = await fetch(
        `${getBaseUrl()}/announcement?${departmentParams}`,
        {
          credentials: "include",
        }
      );
      const data = await response.json();
      setAnnouncements(data);
    } catch (error) {
      console.error("Error fetching announcements:", error);
    }
  }, [user]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  const handleAnnouncementSuccess = useCallback(() => {
    // Refresh announcements when a new one is posted
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  const handleTaskSuccess = useCallback(() => {
    // Refresh tasks when a new one is created
    fetchTasks();
  }, [fetchTasks]);

  const handleTaskView = useCallback((taskId: string) => {
    setSelectedTaskId(taskId);
  }, []);

  const handleTaskDetailClose = useCallback(() => {
    setSelectedTaskId(null);
  }, []);

  const handleTaskDetailSuccess = useCallback(() => {
    // Refresh tasks when status is updated
    fetchTasks();
  }, [fetchTasks]);

  if (loading || fetching) return <div>Loading...</div>;
  if (!user) return null;

  const role = user?.role as keyof typeof actions;

  return (
    <>
      {showAnnouncementModal && (
        <AnnouncementModal
          onClose={() => setShowAnnouncementModal(false)}
          onSuccess={handleAnnouncementSuccess}
          userDepartments={user.departments}
        />
      )}

      {showTaskModal && (
        <TaskModal
          onClose={() => setShowTaskModal(false)}
          onSuccess={handleTaskSuccess}
          userDepartments={user.departments}
        />
      )}

      {selectedTaskId && (
        <TaskDetailModal
          taskId={selectedTaskId}
          onClose={handleTaskDetailClose}
          onSuccess={handleTaskDetailSuccess}
        />
      )}

      {showAttendanceModal && (
        <AttendanceModal onClose={() => setShowAttendanceModal(false)} />
      )}

      {user?.role && (
        <ul className={styles.actions}>
          {(actions[role] || []).map((action) => (
            <li key={action.label}>
              <button
                className={styles.actionButton}
                onClick={() => {
                  if (action.label === "Announcement")
                    setShowAnnouncementModal(true);
                  if (action.label === "Create Task") setShowTaskModal(true);
                  if (action.label === "Attendance")
                    setShowAttendanceModal(true);
                }}
              >
                <PlusIcon className={styles.icons} />
                <span>{action.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {announcements.length > 0 && (
        <>
          <h2 className={styles.title}>Announcements</h2>
          <div className={styles.announcementWrapper}>
            <div className="flex gap-4 w-max">
              {announcements.map((a) => (
                <div key={a._id} className={styles.cardContainer}>
                  <h3 className={styles.announcementHeader}>
                    {a.title}
                    <p className={styles.announcementMeta}>
                      {a.departments.join(", ")}
                    </p>
                  </h3>
                  <p className={styles.announcementBody}>{a.message}</p>
                  <p className={styles.announcementMeta}>
                    {new Date(a.createdAt).toLocaleDateString("en-PH", {
                      dateStyle: "medium",
                    })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {tasks.length > 0 && (
        <>
          <h2 className={styles.title}>Tasks</h2>
          <div className={styles.container}>
            {tasks.map((task) => (
              <div key={task._id} className={styles.cardContainer}>
                <ActionCard
                  {...task}
                  dayTime={new Date(task.dayTime!).toLocaleString("en-PH", {
                    dateStyle: "medium",
                    timeStyle: "short",
                    timeZone: "Asia/Manila",
                  })}
                  onClick={() => handleTaskView(task._id)}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}
