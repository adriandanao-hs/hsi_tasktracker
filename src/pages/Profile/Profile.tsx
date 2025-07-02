import { useState } from "react";
import { useUser } from "../../context/UserContext";
import defaultAvatar from "../../images/default-avatart.jpg";
import { apiService } from "../../services/api";
import Navbar from "../../components/Navbar/Navbar";
import styles from "./Profile.module.css";

export default function Profile() {
  const { user } = useUser();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset states
    setIsUploading(true);
    setUploadError("");

    try {
      await apiService.updatePhoto(file);
      // Reload the page to reflect changes
      window.location.reload();
    } catch (err) {
      setUploadError("Failed to upload photo. Please try again.");
      console.error("Error uploading photo:", err);
    } finally {
      setIsUploading(false);
    }
  };

  if (!user) return null;

  return (
    <>
      <Navbar />
      <div className={`flex-1 ml-[56px] ${styles.container}`}>
        <div className={styles.content}>
          <div>
            <h1 className={styles.heading}>Profile</h1>
          </div>
          <div className={styles.profileCard}>
            <div className={styles.photoContainer}>
              <div className={styles.photoWrapper}>
                <img
                  src={`http://localhost:10533${user.photo}` || defaultAvatar}
                  alt="Profile"
                  className={styles.photo}
                />
                <label htmlFor="photo-upload" className={styles.editButton}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoUpload}
                    disabled={isUploading}
                  />
                </label>
              </div>
              {isUploading && (
                <p className={`${styles.uploadStatus} ${styles.uploadingText}`}>
                  Uploading photo...
                </p>
              )}
              {uploadError && (
                <p className={`${styles.uploadStatus} ${styles.errorText}`}>
                  {uploadError}
                </p>
              )}
            </div>

            <div className={styles.profileSection}>
              <div>
                <h3 className={styles.sectionTitle}>Name</h3>
                <p className={styles.sectionContent}>{user.name}</p>
              </div>

              <div>
                <h3 className={styles.sectionTitle}>Email</h3>
                <p className={styles.sectionContent}>{user.email}</p>
              </div>

              <div>
                <h3 className={styles.sectionTitle}>Role</h3>
                <p className={styles.sectionContent}>{user.role}</p>
              </div>

              <div>
                <h3 className={styles.sectionTitle}>Departments</h3>
                <div className={styles.departmentList}>
                  {user.departments.map((dept, index) => (
                    <div key={dept} className={styles.departmentItem}>
                      <span className={styles.sectionContent}>
                        {index === 0 ? "Main: " : "Secondary: "}
                        {dept}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
