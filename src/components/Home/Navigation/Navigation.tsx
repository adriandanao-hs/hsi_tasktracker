import { actions } from "./navigationData";
import { useEffect, useState } from "react";
import ActionCard from "./Action/ActionCard";
import styles from "./Navigation.module.css";
import { useUser } from "../../../context/UserContext";

import { PlusIcon } from "@heroicons/react/24/outline";

import AnnouncementModal from "./Announcement/AnnouncementModal";

interface Task {
  _id: string;
  label: string;
  to: string;
  icon?: any;
  dayTime?: string;
  subject?: string;
  details?: string;
}

interface Announcement {
  _id: string;
  user: {
    _id: string;
    name: string;
    photo?: string;
  };
  title: string;
  message: string;
  departments: string[];
  createdAt: Date;
}

export default function Navigation() {
  const { user, loading } = useUser();
  const [fetching, setFetching] = useState(true);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    if (!user) return;

    const fetchTasks = async () => {
      try {
        const res = await fetch(
          `http://localhost:10533/api/fetchTasks?role=${user.role}`
        );
        const data = await res.json();
        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setFetching(false);
      }
    };

    fetchTasks();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    console.log(user);
    const fetchAnnouncements = async () => {
      try {
        const res = await fetch(
          `http://localhost:10533/api/announcement?department=${user.department}`
        );
        console.log(res);
        const data = await res.json();
        console.log(data);
        setAnnouncements(data);
      } catch (error) {
        console.error("Error fetching announcements:", error);
      }
    };

    fetchAnnouncements();
  }, [user]);

  if (loading || fetching) return <div>Loading...</div>;
  if (!user) return null;

  return (
    <>
      {showAnnouncementModal && (
        <AnnouncementModal onClose={() => setShowAnnouncementModal(false)} />
      )}

      {user?.role === "Department Head" && (
        <ul className={styles.actions}>
          {(actions["Department Head"] || []).map((action) => (
            <li key={action.label}>
              <button
                className={styles.actionButton}
                onClick={() => {
                  if (action.label === "Announcement")
                    setShowAnnouncementModal(true);
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
            {announcements.map((a) => (
              <div key={a._id} className={styles.cardContainer}>
                <h3 className={styles.announcementHeader}>{a.title}</h3>
                <p className={styles.announcementBody}>{a.message}</p>
                <p className={styles.announcementMeta}>
                  Posted by: {a.user.name} on{" "}
                  {new Date(a.createdAt).toLocaleDateString("en-PH", {
                    dateStyle: "medium",
                  })}
                </p>
                <p className={styles.announcementMeta}>
                  Departments: {a.departments.join(", ")}
                </p>
              </div>
            ))}
          </div>
        </>
      )}

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
            />
          </div>
        ))}
      </div>
    </>
  );
}
