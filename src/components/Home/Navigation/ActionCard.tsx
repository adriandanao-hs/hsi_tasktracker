import { Link } from "react-router-dom";
import styles from "./ActionCard.module.css";
import { ComponentType, SVGProps } from "react";

interface ActionCardProps {
  label: string;
  to: string;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
}

export default function ActionCard({ label, to, icon: Icon }: ActionCardProps) {
  return (
    <Link to={to} className={styles.link}>
      {Icon && <Icon className="w-6 h-6 text-gray-700 dark:text-gray-200" />}
      <span className="font-medium text-gray-700 dark:text-gray-200">
        {label}
      </span>
    </Link>
  );
}
