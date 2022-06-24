import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "../slices/auth";

export const PrivateRoute = ({ component: RouteComponent }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  return isAuthenticated ? <RouteComponent /> : <Navigate to="/signin" />;
};
