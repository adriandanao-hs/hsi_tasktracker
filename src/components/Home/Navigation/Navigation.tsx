import ActionCard from "./ActionCard";
import { actions } from "./actionsData";
import styles from "./Navigation.module.css";
import { useUser } from "../../../context/UserContext";

interface NavigationProps {
  className?: string;
}

export default function Navigation({ className }: NavigationProps) {
  const { user, loading } = useUser();

  if (loading) return <p>Loading...</p>;

  if (!user) return null;

  const roleActions = actions[user.role as keyof typeof actions];

  return (
    <div className={`${className} ${styles.container}`}>
      {roleActions.map((action) => (
        <ActionCard key={action.label} {...action} />
      ))}
    </div>
  );
}
