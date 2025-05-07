
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="border-b bg-white sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center h-16 px-4">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-edu-purple to-edu-blue bg-clip-text text-transparent">
              EduQuiz
            </span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <Link to="/courses" className="text-gray-600 hover:text-edu-purple transition-colors">
            Courses
          </Link>
          {user?.role === "teacher" && (
            <Link to="/create-course" className="text-gray-600 hover:text-edu-purple transition-colors">
              Create Course
            </Link>
          )}
          <Link to="/about" className="text-gray-600 hover:text-edu-purple transition-colors">
            About
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                    <AvatarFallback className="bg-edu-purple text-white">
                      {user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span>{user.name}</span>
                    <span className="text-xs text-gray-500">{user.email}</span>
                    <span className="text-xs text-edu-purple capitalize">{user.role}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/dashboard" className="cursor-pointer w-full">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer w-full">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-500">
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="default" className="btn-primary">
              <Link to="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
