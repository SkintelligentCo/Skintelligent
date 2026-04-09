import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "../providers/AuthProvider";
import { GuardShellSkeleton } from "./PageSkeletons";

const navHiddenRoutes = new Set(["/login", "/signup", "/onboarding"]);

function GuardShell() {
  const location = useLocation();
  return <GuardShellSkeleton withNavOffset={!navHiddenRoutes.has(location.pathname)} />;
}

export function PublicOnlyRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <GuardShell />;
  }

  if (user) {
    return <Navigate to={user.profile ? "/dashboard" : "/onboarding"} replace />;
  }

  return <Outlet />;
}

export function ProtectedRoute() {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <GuardShell />;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (!user.profile && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />;
  }

  if (user.profile && location.pathname === "/onboarding") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
