import { Link } from "react-router-dom";
import styles from "./Home.module.css";
import Navbar from "../../components/Navbar/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.card}>
          <h1 className={styles.heading}>Intern Task Tracker</h1>
          <p className={styles.subheading}>
            Track intern tasks, deadlines, and progress - all in one place.
          </p>
          <div className={styles.buttonContainer}>
            <Link to="/login" className={styles.buttonPrimary}>
              Login
            </Link>
            <Link to="/register" className={styles.buttonSecondary}>
              Register
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
