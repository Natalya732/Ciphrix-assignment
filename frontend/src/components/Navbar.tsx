import { LogOut, User, CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <CheckSquare className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">Task Manager</h1>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm">
            <User className="h-4 w-4" />
            <span className="font-medium">{user?.name}</span>
            {user?.role === "admin" && (
              <span className="px-2 py-1 text-xs bg-primary text-primary-foreground rounded-full">
                Admin
              </span>
            )}
          </div>

          <ThemeToggle />

          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
}
