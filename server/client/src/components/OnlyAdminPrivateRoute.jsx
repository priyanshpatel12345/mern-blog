import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

function OnlyAdminPrivateRoute() {
  const { currentUser } = useSelector((state) => state.user);
  return currentUser.isAdmin ? <Outlet /> : <Navigate to="/sign-in" />;
}

export default OnlyAdminPrivateRoute;
