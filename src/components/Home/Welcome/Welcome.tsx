import styles from "./Welcome.module.css";
import { useUser } from "../../../context/UserContext";

interface WelcomeProps {
  className?: string;
}

export default function Welcome({ className }: WelcomeProps) {
  const { user } = useUser();
  return (
    <div className={`${className} ${styles.container}`}>
      <h1 className={styles.heading}>Welcome to Intern Task Tracking System</h1>
      <p className={styles.subheading}>
        A centralized workspace for managing intern tasks, reports, and time
        logs. This platform is designed for interns, department heads, and
        supervisors to streamline daily operations and productivity.
      </p>
      {user && (
        <p className={styles.welcomeText}>
          Good day, {user.role} {user.name.split(" ")[0]}!
        </p>
      )}
    </div>
  );
}
