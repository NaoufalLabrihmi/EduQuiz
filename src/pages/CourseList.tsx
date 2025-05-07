
import { useState } from "react";
import { useCourses } from "@/context/CourseContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CourseCard from "@/components/courses/CourseCard";
import { Input } from "@/components/ui/input";

export default function CourseList() {
  const { courses } = useCourses();
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredCourses = searchTerm ? 
    courses.filter(course => 
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      course.description.toLowerCase().includes(searchTerm.toLowerCase())
    ) : 
    courses;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-10 px-4">
        <div className="container mx-auto max-w-5xl">
          <h1 className="text-3xl font-bold mb-6">All Courses</h1>
          
          <div className="mb-8 max-w-md">
            <Input
              type="search"
              placeholder="Search courses by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          
          {filteredCourses.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <h2 className="text-2xl font-semibold mb-2">No courses found</h2>
              <p className="text-gray-500">
                {searchTerm ? 
                  `No courses match your search for "${searchTerm}"` : 
                  "No courses available yet. Check back later!"}
              </p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
