import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const Header = () => {
  const { isAuthenticated, user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <header className="fixed left-0 right-0 top-0 z-50 flex w-full select-none items-center justify-center px-8 py-2">
      <div className="w-full rounded-xl border border-border/30 bg-background/60 backdrop-blur-xl shadow-sm supports-[backdrop-filter]:bg-background/40">
        <div className="mx-auto w-full max-w-[1320px] flex justify-between items-center py-2">
          {/* Logo */}
          <Link to="/" className="transition-opacity hover:opacity-80">
            <img
              src="/TalentLink.svg"
              alt="TalentLink Logo"
              className="h-8 w-auto"
            />
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `${isActive ? "text-foreground" : "text-muted-foreground"} text-sm font-medium  transition-colors hover:text-foreground`
              }
            >
              Trang Chủ
            </NavLink>
            <NavLink
              to="/discovery"
              className={({ isActive }) =>
                `${isActive ? "text-foreground" : "text-muted-foreground"} text-sm font-medium  transition-colors hover:text-foreground`
              }
            >
              Khám Phá
            </NavLink>
            <NavLink
              to="/jobs"
              className={({ isActive }) =>
                `${isActive ? "text-foreground" : "text-muted-foreground"} text-sm font-medium  transition-colors hover:text-foreground`
              }
            >
              Việc làm
            </NavLink>

            <NavLink
              to="/about"
              className={({ isActive }) =>
                `${isActive ? "text-foreground" : "text-muted-foreground"} text-sm font-medium  transition-colors hover:text-foreground`
              }
            >
              Giới Thiệu
            </NavLink>
          </nav>

          {/* Buttons */}
          {isAuthenticated ? (<div>Xin Chào, {user?.display_name}</div>) : (<div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild className="hidden md:flex">
              <Link to="/auth/login">Đăng nhập</Link>
            </Button>
            <Button variant="default" size="sm" asChild>
              <Link to="/auth/signup">Đăng ký</Link>
            </Button>
          </div>)}

        </div>
      </div>
    </header >

  );
};

export default Header;
