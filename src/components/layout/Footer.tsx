
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-white border-t py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link to="/" className="flex items-center mb-4">
              <span className="text-xl font-bold bg-gradient-to-r from-edu-purple to-edu-blue bg-clip-text text-transparent">
                EduQuiz
              </span>
            </Link>
            <p className="text-gray-600">
              An interactive platform for teachers and students to create and participate in course-based learning.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/courses" className="text-gray-600 hover:text-edu-purple transition-colors">
                  Courses
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-600 hover:text-edu-purple transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-edu-purple transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <p className="text-gray-600 mb-2">support@eduquiz.com</p>
            <p className="text-gray-600">123 Education Lane, Knowledge City</p>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-6">
          <p className="text-center text-gray-600">
            © {new Date().getFullYear()} EduQuiz. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
