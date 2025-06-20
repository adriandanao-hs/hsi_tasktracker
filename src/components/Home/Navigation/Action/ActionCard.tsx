import { Link } from "react-router-dom";
import styles from "./ActionCard.module.css";
import { ComponentType, SVGProps } from "react";

interface ActionCardProps {
  to: string;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  dayTime: string;
  department?: string;
  subject?: string;
  details?: string;
}

export default function ActionCard({
  to,
  icon: Icon,
  dayTime,
  department,
  subject,
  details,
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
        <Link to={to} className={styles.link}>
          {Icon && <Icon className={styles.icon} />}
          <span>View</span>
        </Link>
      </div>
    </div>
  );
}
