
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CourseForm from "@/components/courses/CourseForm";

export default function CourseCreation() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Only allow teachers to access this page
    if (!isLoading) {
      if (!user) {
        navigate("/login");
      } else if (user.role !== "teacher") {
        navigate("/dashboard");
      }
    }
  }, [user, isLoading, navigate]);
  
  // If still loading or no user, show loading
  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-500">Loading...</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-10 px-4">
        <div className="container mx-auto max-w-5xl">
          <h1 className="text-3xl font-bold mb-8 text-center">Create New Course</h1>
          <CourseForm />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
