import React, { ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { LoadingSpinner } from "./ui/LoadingSpinner";

interface PrivateRouteProps {
  children: ReactElement;
  fallbackPath?: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  children,
  fallbackPath = "/login",
}) => {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to={fallbackPath} replace />;
  }

  return children;
};

export default PrivateRoute;
