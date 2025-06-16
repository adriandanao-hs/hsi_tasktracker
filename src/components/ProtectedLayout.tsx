import React from "react";
import { Outlet } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";

const ProtectedLayout: React.FC = () => (
  <PrivateRoute>
    <Outlet />
  </PrivateRoute>
);

export default ProtectedLayout;
