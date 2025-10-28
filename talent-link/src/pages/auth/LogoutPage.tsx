import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { useNavigate } from "react-router-dom";


export default function LogoutPage() {
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
  return (<div>
    <Button onClick={handleLogout}>Logout</Button>
  </div>)
}