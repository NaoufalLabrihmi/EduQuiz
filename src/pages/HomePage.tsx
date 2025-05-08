import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useCourses } from "@/context/CourseContext";
import CourseCard from "@/components/courses/CourseCard";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import Login from "@/pages/Login";
import SignUp from "@/pages/SignUp";
import { useState } from "react";

export default function HomePage() {
  const { user } = useAuth();
  const { courses } = useCourses();
  const [openLogin, setOpenLogin] = useState(false);
  const [openSignUp, setOpenSignUp] = useState(false);
  
  // Show only 3 featured courses on homepage
  const featuredCourses = courses.slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-main">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-24 px-4 flex items-center justify-center overflow-hidden">
          {/* Floating blurred shapes */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-400/30 rounded-full blur-3xl animate-fade-in-fast" />
          <div className="absolute -bottom-32 right-0 w-80 h-80 bg-fuchsia-400/20 rounded-full blur-2xl animate-fade-in-fast" />
          <div className="container mx-auto max-w-5xl z-10">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div className="space-y-8 animate-fade-in-fast">
                <div className="glass-card p-10 shadow-xl">
                  <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-blue-900 mb-4 animate-scale-in">
                    Learn, Create, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-fuchsia-600">Wow</span> Yourself
                  </h1>
                  <p className="text-lg md:text-2xl text-blue-900/80 mb-6 animate-fade-in-fast">
                    An interactive platform for teachers to create courses with quizzes and for students to learn and test their understanding.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Button asChild size="lg" className="btn-primary animate-scale-in shadow-xl">
                      <Link to="/courses">Explore Courses</Link>
                    </Button>
                    {!user && (
                      <>
                        <Button asChild size="lg" variant="outline" className="text-blue-900 border-blue-400 hover:bg-blue-50/40 animate-fade-in-fast">
                          <Link to="/login">Sign In</Link>
                        </Button>
                        <Button asChild size="lg" variant="outline" className="text-fuchsia-700 border-fuchsia-400 hover:bg-fuchsia-50/40 animate-fade-in-fast">
                          <Link to="/signup">Sign Up</Link>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="md:flex justify-center hidden animate-scale-in">
                <div className="relative">
                  <div className="absolute -inset-4 rounded-3xl bg-white/30 backdrop-blur-lg animate-pulse z-0" />
                  <img
                    src="https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&auto=format&fit=crop"
                    alt="Education"
                    className="rounded-3xl shadow-2xl relative w-full max-w-md z-10"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-4xl font-extrabold text-center mb-14 text-blue-900 animate-fade-in-fast">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-10">
              {[1,2,3].map((step, idx) => (
                <div key={step} className="glass-card p-8 text-center shadow-xl animate-fade-in-fast hover:scale-105 transition-transform duration-200">
                  <div className="w-16 h-16 mx-auto mb-5 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-fuchsia-400 shadow-lg animate-scale-in">
                    <span className="text-3xl font-extrabold text-white drop-shadow-lg">{step}</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-blue-900">
                    {step === 1 && 'Create Courses'}
                    {step === 2 && 'Learn Materials'}
                    {step === 3 && 'Test Knowledge'}
                  </h3>
                  <p className="text-blue-900/70 text-lg">
                    {step === 1 && 'Teachers can upload PDF materials and create engaging quizzes for their students.'}
                    {step === 2 && 'Students can access and study course materials directly within the platform.'}
                    {step === 3 && 'After studying, students can take quizzes to test their understanding of the material.'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Featured Courses Section */}
        <section className="py-20 px-4 bg-gradient-to-br from-white/80 to-blue-50/60">
          <div className="container mx-auto max-w-5xl">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-4xl font-extrabold text-blue-900">Featured Courses</h2>
              <Button asChild variant="ghost" className="text-blue-700 font-bold animate-fade-in-fast">
                <Link to="/courses">View All</Link>
              </Button>
            </div>
            <div className="grid md:grid-cols-3 gap-10">
              {featuredCourses.map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
            {featuredCourses.length === 0 && (
              <div className="text-center py-10">
                <p className="text-blue-500 mb-4">No courses available yet.</p>
                {user?.role === "teacher" && (
                  <Button asChild className="btn-primary animate-scale-in">
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
