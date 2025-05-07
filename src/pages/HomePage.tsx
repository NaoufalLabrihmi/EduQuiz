
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useCourses } from "@/context/CourseContext";
import CourseCard from "@/components/courses/CourseCard";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function HomePage() {
  const { user } = useAuth();
  const { courses } = useCourses();
  
  // Show only 3 featured courses on homepage
  const featuredCourses = courses.slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-edu-purple to-edu-blue text-white py-20 px-4">
          <div className="container mx-auto max-w-5xl">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div className="space-y-6 animate-fade-in">
                <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                  Learn, Create, and Test Your Knowledge
                </h1>
                <p className="text-lg md:text-xl opacity-90">
                  An interactive platform for teachers to create courses with quizzes and for students to learn and test their understanding.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button asChild size="lg" className="bg-white text-edu-purple hover:bg-gray-100">
                    <Link to="/courses">Explore Courses</Link>
                  </Button>
                  {!user && (
                    <Button asChild size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                      <Link to="/login">Sign In</Link>
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="md:flex justify-center hidden">
                <div className="relative">
                  <div className="absolute -inset-4 rounded-lg bg-white/20 backdrop-blur-lg animate-pulse"></div>
                  <img 
                    src="https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&auto=format&fit=crop" 
                    alt="Education"
                    className="rounded-lg shadow-lg relative w-full max-w-md"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
                <div className="w-16 h-16 bg-edu-soft-purple rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-edu-purple">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Create Courses</h3>
                <p className="text-gray-600">
                  Teachers can upload PDF materials and create engaging quizzes for their students.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
                <div className="w-16 h-16 bg-edu-soft-purple rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-edu-purple">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Learn Materials</h3>
                <p className="text-gray-600">
                  Students can access and study course materials directly within the platform.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
                <div className="w-16 h-16 bg-edu-soft-purple rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-edu-purple">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Test Knowledge</h3>
                <p className="text-gray-600">
                  After studying, students can take quizzes to test their understanding of the material.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Featured Courses Section */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="container mx-auto max-w-5xl">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl font-bold">Featured Courses</h2>
              <Button asChild variant="ghost" className="text-edu-purple">
                <Link to="/courses">View All</Link>
              </Button>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {featuredCourses.map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
            
            {featuredCourses.length === 0 && (
              <div className="text-center py-10">
                <p className="text-gray-500 mb-4">No courses available yet.</p>
                {user?.role === "teacher" && (
                  <Button asChild className="btn-primary">
                    <Link to="/create-course">Create Your First Course</Link>
                  </Button>
                )}
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
