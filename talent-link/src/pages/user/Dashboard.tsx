import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { useNavigate } from "react-router-dom";


export default function DashboardPage() {
  const { logout } = useAuth()
  const navigate = useNavigate();
  const handleLogout = () => {
    try {
      logout();
      navigate("/auth/login");
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <div className="min-h-screen flex flex-cols justify-center items-center">
      <Button onClick={handleLogout}>Đăng xuất</Button>
    </div>)
}