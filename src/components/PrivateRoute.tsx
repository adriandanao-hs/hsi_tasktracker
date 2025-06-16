import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { ReactElement } from "react";

const PrivateRoute = ({ children }: { children: ReactElement }) => {
  const { user, loading } = useUser();

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
