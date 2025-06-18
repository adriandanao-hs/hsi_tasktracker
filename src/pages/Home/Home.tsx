import styles from "./Home.module.css";
import Navbar from "../../components/Navbar/Navbar";
import Navigation from "../../components/Home/Navigation/Navigation";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className={`flex-1 ml-20 ${styles.container}`}>
        <div className={styles.content}>
          <div>
            <h1 className={styles.heading}>Dashboard</h1>
          </div>
          <div className="row-start-2">
            <Navigation />
          </div>
        </div>
      </div>
    </>
  );
}
