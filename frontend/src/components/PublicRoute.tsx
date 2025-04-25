import { JSX, useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../context/auth-context";

const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const authContext = useContext(AuthContext);

  if (authContext?.user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;
