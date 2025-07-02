import { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";
import styles from "./InternList.module.css";
import InternDetailsModal from "./InternDetailsModal";
import { getAssetUrl, getBaseUrl } from "../../services/api";

interface Intern {
  _id: string;
  name: string;
  email: string;
  departments: string[];
  photo: string;
  role: string;
}

export default function InternList() {
  const [interns, setInterns] = useState<Intern[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedIntern, setSelectedIntern] = useState<Intern | null>(null);
  const { user } = useUser();

  useEffect(() => {
    const fetchInterns = async () => {
      try {
        const response = await fetch(
          `${getBaseUrl()}/user/interns/${user?._id}`,
          {
            credentials: "include",
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch interns");
        }
        const data = await response.json();
        setInterns(data);
      } catch (err: any) {
        setError(err.message || "Error fetching interns");
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) {
      fetchInterns();
    }
  }, [user?._id]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading interns...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorMessage}>{error}</p>
      </div>
    );
  }

  return (
    <>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Photo</th>
              <th className={styles.th}>Name</th>
              <th className={styles.th}>Email</th>
              <th className={styles.th}>Department</th>
              <th className={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {interns.map((intern) => (
              <tr key={intern._id} className={styles.tr}>
                <td className={styles.td}>
                  <img
                    src={
                      `${getAssetUrl()}${intern.photo}` || "/default-avatar.jpg"
                    }
                    alt={intern.name}
                    className={styles.avatar}
                  />
                </td>
                <td className={styles.td}>{intern.name}</td>
                <td className={styles.td}>{intern.email}</td>
                <td className={styles.td}>
                  {intern.departments.map((dept, index) => (
                    <span key={dept} className={styles.department}>
                      {dept}
                      {index < intern.departments.length - 1 && ", "}
                    </span>
                  ))}
                </td>
                <td className={styles.td}>
                  <button
                    className={styles.viewButton}
                    onClick={() => setSelectedIntern(intern)}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {interns.length === 0 && (
          <p className={styles.noInterns}>
            No interns found in your department.
          </p>
        )}
      </div>

      {selectedIntern && (
        <InternDetailsModal
          intern={selectedIntern}
          onClose={() => setSelectedIntern(null)}
        />
      )}
    </>
  );
}
