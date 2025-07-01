import styles from "./InternList.module.css";
import Navbar from "../../components/Navbar/Navbar";
import InternList from "../../components/InternList/InternList";

export default function InternListPage() {
  return (
    <>
      <Navbar />
      <div className={`flex-1 ml-[56px] ${styles.container}`}>
        <div className={styles.content}>
          <div>
            <h1 className={styles.heading}>Department Interns</h1>
          </div>
          <div className="row-start-2">
            <InternList />
          </div>
        </div>
      </div>
    </>
  );
}
