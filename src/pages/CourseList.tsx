import { useState } from "react";
import { useCourses } from "@/context/CourseContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CourseCard from "@/components/courses/CourseCard";
import { Input } from "@/components/ui/input";
import PDFViewer from "@/components/pdf/PDFViewer";
import QuizForm from "@/components/quiz/QuizForm";
import { useNavigate } from "react-router-dom";
import { Search, Plus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function CourseList() {
  const { courses, quizzes } = useCourses();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [page, setPage] = useState(0);
  const CARDS_PER_PAGE = 3;
  const navigate = useNavigate();
  
  const filteredCourses = searchTerm ? 
    courses.filter(course => 
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      course.description.toLowerCase().includes(searchTerm.toLowerCase())
    ) : 
    courses;

  const totalPages = Math.ceil(filteredCourses.length / CARDS_PER_PAGE);
  const paginatedCourses = filteredCourses.slice(page * CARDS_PER_PAGE, (page + 1) * CARDS_PER_PAGE);
  
  const handlePDFComplete = (courseId) => {
    const quiz = quizzes.find(q => q.courseId === courseId);
    if (quiz) {
      setSelectedQuiz(quiz);
      setShowQuizModal(true);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-main">
      <Header />
      
      <main className="flex-1 py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <h1 className="text-5xl font-extrabold text-blue-900 mb-10 animate-fade-in-fast">All Courses</h1>
          
          {/* Impressive Search Bar */}
          <div className="mb-12 max-w-lg mx-auto animate-scale-in">
            <div className="relative glass-card p-4 flex items-center gap-3 shadow-xl border-2 border-blue-200/60">
            <Input
              type="search"
              placeholder="Search courses by title or description..."
              value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setPage(0); }}
                className="w-full bg-transparent text-blue-900 placeholder:text-blue-400 focus:ring-2 focus:ring-blue-400 rounded-xl border-0 shadow-none pl-12"
            />
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-400 pointer-events-none">
                <Search className="w-6 h-6" />
              </span>
            </div>
          </div>
          
          {filteredCourses.length > 0 ? (
            <>
              <div className="grid md:grid-cols-3 gap-10 animate-fade-in-fast transition-all duration-500">
                {paginatedCourses.map((course) => {
                  const quiz = quizzes.find(q => q.courseId === course.id);
                  return (
                    <div key={course.id} className="transition-transform duration-500 ease-in-out">
                      <CourseCard
                        course={course}
                        hasQuiz={!!quiz}
                        onView={() => setSelectedCourse(course)}
                        onQuiz={() => quiz && navigate(`/courses/${course.id}/quiz`)}
                      />
                    </div>
                  );
                })}
              </div>
              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center mt-12 animate-fade-in-fast">
                  <div className="glass-card bg-gradient-to-br from-blue-100/80 to-white/80 border-2 border-blue-200/60 shadow-xl rounded-full px-4 py-2 flex gap-2 items-center">
                    {/* Previous Button */}
                    <button
                      className={`w-12 h-12 flex items-center justify-center rounded-full transition-all duration-150 font-bold text-blue-700 bg-gradient-to-br from-blue-100/60 to-pink-100/60 shadow-md border-0 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed ${page === 0 ? 'opacity-60' : ''}`}
                      disabled={page === 0}
                      onClick={() => setPage(page - 1)}
                      aria-label="Previous Page"
                    >
                      <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" /></svg>
                    </button>
                    {/* Page Numbers (show all if <=5 pages) */}
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setPage(i)}
                        className={`w-12 h-12 flex items-center justify-center rounded-full font-bold text-blue-700 transition-all duration-150 mx-1
                          ${page === i
                            ? 'bg-gradient-to-br from-blue-400 via-blue-500 to-pink-400 text-white shadow-xl scale-110 border-0'
                            : 'bg-gradient-to-br from-blue-100/60 to-pink-100/60 shadow-md border-0 hover:scale-105 active:scale-95'}
                        `}
                        style={{ minWidth: 48 }}
                        aria-current={page === i ? 'page' : undefined}
                      >
                        {i + 1}
                      </button>
              ))}
                    {/* Next Button */}
                    <button
                      className={`w-12 h-12 flex items-center justify-center rounded-full transition-all duration-150 font-bold text-blue-700 bg-gradient-to-br from-blue-100/60 to-pink-100/60 shadow-md border-0 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed ${page === totalPages - 1 ? 'opacity-60' : ''}`}
                      disabled={page === totalPages - 1}
                      onClick={() => setPage(page + 1)}
                      aria-label="Next Page"
                    >
                      <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6" /></svg>
                    </button>
                  </div>
            </div>
              )}
            </>
          ) : (
            <div className="text-center py-24 animate-fade-in-fast flex flex-col items-center justify-center gap-6">
              {/* Beautiful empty state illustration */}
              <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-4">
                <circle cx="60" cy="60" r="56" fill="#e0e7ff" />
                <rect x="30" y="50" width="60" height="30" rx="8" fill="#2563eb" fillOpacity="0.15" />
                <rect x="40" y="60" width="40" height="10" rx="5" fill="#2563eb" fillOpacity="0.25" />
                <rect x="50" y="70" width="20" height="6" rx="3" fill="#2563eb" fillOpacity="0.35" />
                <circle cx="60" cy="44" r="8" fill="#2563eb" fillOpacity="0.18" />
              </svg>
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
            <PDFViewer
              pdfUrl={selectedCourse.pdfUrl}
              courseId={selectedCourse.id}
              onComplete={() => {}}
              onClose={() => setSelectedCourse(null)}
              onQuizClick={() => {
                const quiz = quizzes.find(q => q.courseId === selectedCourse.id);
                if (quiz) {
                  setSelectedQuiz(quiz);
                  setShowQuizModal(true);
                }
              }}
            />
          </div>
        )}
        {/* Quiz Modal */}
        {showQuizModal && selectedQuiz && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-xl">
            <div className="bg-white/90 rounded-3xl shadow-2xl p-6 flex flex-col items-center animate-fade-in-fast max-w-2xl w-full relative">
              <button
                onClick={() => setShowQuizModal(false)}
                className="absolute top-4 right-4 bg-white/90 hover:bg-white text-blue-700 rounded-full shadow-2xl p-2 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300 z-50 border-2 border-white/60 hover:scale-110 active:scale-95"
                title="Close Quiz"
                aria-label="Close Quiz"
              >
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
              <QuizForm questions={selectedQuiz.questions} onComplete={() => {}} onClose={() => setShowQuizModal(false)} />
            </div>
          </div>
        )}
        {/* Floating Create Course Button (teacher only) */}
        {user?.role === 'teacher' && (
          <button
            onClick={() => navigate('/create-course')}
            className="fixed bottom-8 right-8 z-50 bg-gradient-to-br from-blue-500 to-blue-400 text-white shadow-2xl rounded-full p-5 flex items-center justify-center border-2 border-white/70 backdrop-blur-md hover:scale-110 active:scale-95 transition-all duration-200 animate-scale-in"
            title="Create Course"
          >
            <Plus className="w-7 h-7" />
          </button>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
