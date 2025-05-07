
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CourseForm from "@/components/courses/CourseForm";

export default function CourseCreation() {
  return (
    <div className="min-h-screen flex flex-col dark:bg-gray-900">
      <Header />
      
      <main className="flex-1 py-10 px-4">
        <div className="container mx-auto max-w-5xl">
          <h1 className="text-3xl font-bold mb-8 text-center dark:text-white">Create New Course</h1>
          <CourseForm />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
