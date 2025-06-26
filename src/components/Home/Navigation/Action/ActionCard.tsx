import { ComponentType, SVGProps } from "react";
import styles from "./ActionCard.module.css";

interface ActionCardProps {
  _id?: string;
  to?: string;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  dayTime: string;
  department?: string;
  subject?: string;
  details?: string;
  onClick?: () => void;
}

export default function ActionCard({
  _id,
  to,
  icon: Icon,
  dayTime,
  department,
  subject,
  details,
  onClick,
}: ActionCardProps) {
  return (
    <div>
      <div>
        <p className={`${styles.subtitle} mb-2`}>{`${dayTime}`}</p>
        <p className={styles.title}>{department || "Department"}</p>
        <p className={`${styles.subtitle} font-semibold`}>
          {subject || "Subject"}
        </p>
        <p className={`${styles.subtitle} my-2`}>{details || "Details"}</p>
      </div>
      <div className="flex justify-end">
        {onClick ? (
          <button onClick={onClick} className={styles.link}>
            {Icon && <Icon className={styles.icon} />}
            <span>View</span>
          </button>
        ) : (
          <a href={to} className={styles.link}>
            {Icon && <Icon className={styles.icon} />}
            <span>View</span>
          </a>
        )}
      </div>
    </div>
  );
}
