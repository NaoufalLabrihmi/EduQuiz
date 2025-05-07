import { useState } from "react";
import { useCourses } from "@/context/CourseContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CourseCard from "@/components/courses/CourseCard";
import { Input } from "@/components/ui/input";
import PDFViewer from "@/components/pdf/PDFViewer";

export default function CourseList() {
  const { courses } = useCourses();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);
  
  const filteredCourses = searchTerm ? 
    courses.filter(course => 
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      course.description.toLowerCase().includes(searchTerm.toLowerCase())
    ) : 
    courses;
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-main">
      <Header />
      
      <main className="flex-1 py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <h1 className="text-5xl font-extrabold text-blue-900 mb-10 animate-fade-in-fast">All Courses</h1>
          
          <div className="mb-12 max-w-lg mx-auto animate-scale-in">
            <div className="glass-card p-4 flex items-center gap-3 shadow-xl">
              <Input
                type="search"
                placeholder="Search courses by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent text-blue-900 placeholder:text-blue-400 focus:ring-2 focus:ring-blue-400 rounded-xl border-0 shadow-none"
              />
            </div>
          </div>
          
          {filteredCourses.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-10 animate-fade-in-fast">
              {filteredCourses.map((course) => (
                <div key={course.id}>
                  <CourseCard course={course} onView={() => setSelectedCourse(course)} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 animate-fade-in-fast">
              <h2 className="text-2xl font-bold mb-2 text-blue-900">No courses found</h2>
              <p className="text-blue-500">
                {searchTerm ? 
                  `No courses match your search for "${searchTerm}"` : 
                  "No courses available yet. Check back later!"}
              </p>
            </div>
          )}
        </div>
        {/* Modal PDF Presentation */}
        {selectedCourse && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center min-h-screen bg-black/60 backdrop-blur-xl">
            <PDFViewer pdfUrl={selectedCourse.pdfUrl} onClose={() => setSelectedCourse(null)} />
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
