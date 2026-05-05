import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingState from "./LoadingState";
import type { UserRole } from "../types";

export default function ProtectedRoute({
  allowedRoles,
  children,
  redirectTo = "/login",
}: {
  allowedRoles?: UserRole[];
  children: JSX.Element;
  redirectTo?: string;
}) {
  const location = useLocation();
  const { isAuthenticated, isLoading, profile } = useAuth();

  if (isLoading) {
    return (
      <div className="container-page py-12">
        <LoadingState label="Проверка доступа" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  const role = profile?.role ?? "customer";

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
