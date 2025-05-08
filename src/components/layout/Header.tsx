import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();
  return (
    <header className="fixed top-6 left-1/2 -translate-x-1/2 z-30 w-[95vw] max-w-6xl glass-card shadow-2xl border-2 border-blue-200/60 backdrop-blur-xl animate-fade-in-fast">
      <div className="flex justify-between items-center h-16 px-6">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-extrabold bg-gradient-to-r from-blue-500 to-blue-400 bg-clip-text text-transparent drop-shadow-lg tracking-tight">
              EduQuiz
            </span>
          </Link>
        </div>

        <nav className="flex items-center gap-8 w-full justify-end">
          <Link to="/courses" className="text-blue-700 font-semibold hover:text-blue-900 transition-colors duration-150 px-2 py-1 rounded-lg hover:bg-blue-100/40">
            Courses
          </Link>
          {user && (
            <>
              <Link to="/create-course" className="text-blue-700 font-semibold hover:text-blue-900 transition-colors duration-150 px-2 py-1 rounded-lg hover:bg-blue-100/40">
                Create Course
              </Link>
              <Button onClick={logout} variant="outline" className="border-blue-400 text-blue-700 hover:bg-blue-50/40 ml-2">
                Log out
              </Button>
            </>
          )}
          <Link to="/about" className="text-blue-700 font-semibold hover:text-blue-900 transition-colors duration-150 px-2 py-1 rounded-lg hover:bg-blue-100/40">
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}
