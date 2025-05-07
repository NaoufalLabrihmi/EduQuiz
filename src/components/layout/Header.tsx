
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="border-b dark:border-gray-700 dark:bg-gray-900 sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center h-16 px-4">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
              EduQuiz
            </span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <Link to="/courses" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
            Courses
          </Link>
          <Link to="/create-course" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
            Create Course
          </Link>
          <Link to="/about" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
            About
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Button asChild variant="default" className="bg-blue-600 hover:bg-blue-700 text-white">
            <Link to="/create-course">Create Course</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
