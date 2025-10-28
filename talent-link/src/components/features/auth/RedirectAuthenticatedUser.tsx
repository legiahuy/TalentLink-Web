import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

interface RedirectAuthenticatedUserProps {
  children: ReactNode;
}

const RedirectAuthenticatedUser: React.FC<RedirectAuthenticatedUserProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default RedirectAuthenticatedUser;