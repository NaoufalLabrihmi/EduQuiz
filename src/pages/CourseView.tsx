
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCourses } from "@/context/CourseContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PDFViewer from "@/components/pdf/PDFViewer";
import QuizForm from "@/components/quiz/QuizForm";
import QuizCreator from "@/components/quiz/QuizCreator";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function CourseView() {
  const { courseId } = useParams<{ courseId: string }>();
  const { getCourse, getQuizByCourseId, saveQuizResult, addQuiz, loadCourses, isLoading } = useCourses();
  const navigate = useNavigate();
  
  const [showQuiz, setShowQuiz] = useState(false);
  const [showQuizCreator, setShowQuizCreator] = useState(false);
  const [courseComplete, setCourseComplete] = useState(false);
  
  // Get the course data
  const course = courseId ? getCourse(courseId) : undefined;
  const quiz = courseId ? getQuizByCourseId(courseId) : undefined;
  
  // Reload data when the component mounts
  useEffect(() => {
    loadCourses();
  }, []);
  
  useEffect(() => {
    if (!isLoading && courseId && !course) {
      // Course not found, redirect to courses page
      toast.error("Course not found");
      navigate("/courses");
    }
  }, [courseId, course, navigate, isLoading]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-gray-900 dark:text-white">
        <p className="text-xl text-gray-500 dark:text-gray-400">Loading...</p>
      </div>
    );
  }
  
  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-gray-900 dark:text-white">
        <p className="text-xl text-gray-500 dark:text-gray-400">Loading...</p>
      </div>
    );
  }
  
  const handlePDFComplete = () => {
    setCourseComplete(true);
    toast.success("You've completed the course material!");
  };
  
  const startQuiz = () => {
    if (!quiz) {
      toast.error("No quiz available for this course yet");
      return;
    }
    
    setShowQuiz(true);
  };
  
  const handleQuizComplete = async (answers: number[], score: number) => {
    // Save quiz results
    if (!quiz) return;
    
    try {
      await saveQuizResult({
        userId: "guest",
        quizId: quiz.id,
        score,
        totalQuestions: quiz.questions.length,
        completedAt: new Date()
      });
      
      toast.success("Quiz results saved successfully!");
    } catch (error) {
      console.error("Error saving quiz results:", error);
      toast.error("Failed to save quiz results");
    }
  };
  
  const handleCreateQuiz = () => {
    setShowQuizCreator(true);
  };
  
  const handleQuizCreationComplete = () => {
    setShowQuizCreator(false);
    toast.success("Quiz created successfully!");
  };
  
  return (
    <div className="min-h-screen flex flex-col dark:bg-gray-900 dark:text-white">
      <Header />
      
      <main className="flex-1 py-6 px-4 bg-gradient-to-b from-gray-900 to-gray-950">
        <div className="container mx-auto max-w-6xl">
          {!showQuiz && !showQuizCreator && (
            <div className="mb-6 bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl shadow-lg">
              <h1 className="text-3xl font-bold mb-2 text-white">{course.title}</h1>
              <p className="text-gray-300 mb-4">{course.description}</p>
              <div className="flex items-center text-sm text-gray-400 mb-6">
                <span>Created by {course.teacherName}</span>
                <span className="mx-2">•</span>
                <span>Updated {course.updatedAt.toLocaleDateString()}</span>
              </div>
              
              <div className="flex flex-wrap gap-3">
                {!quiz && (
                  <Button onClick={handleCreateQuiz} className="bg-blue-600 hover:bg-blue-700 text-white">
                    Create Quiz
                  </Button>
                )}
                
                {courseComplete && quiz && (
                  <Button onClick={startQuiz} className="bg-green-600 hover:bg-green-700 text-white">
                    Start Quiz
                  </Button>
                )}
                
                <Button onClick={() => navigate("/courses")} variant="outline" className="dark:border-gray-600 dark:text-gray-300">
                  Back to Courses
                </Button>
              </div>
            </div>
          )}
          
          {showQuiz && quiz ? (
            <QuizForm questions={quiz.questions} onComplete={handleQuizComplete} />
          ) : showQuizCreator ? (
            <QuizCreator courseId={course.id} onComplete={handleQuizCreationComplete} />
          ) : (
            <div className="space-y-6">
              <Card className="dark:bg-gray-800/80 dark:text-white dark:border-gray-700 overflow-hidden shadow-2xl">
                <CardHeader className="bg-gray-800 dark:bg-gray-800 border-b dark:border-gray-600">
                  <div className="flex justify-between items-center">
                    <CardTitle>Course Presentation</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline" className="dark:border-gray-600 dark:text-gray-300">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                        <span className="ml-1">Download</span>
                      </Button>
                      <Button size="sm" variant="outline" className="dark:border-gray-600 dark:text-gray-300">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
                        <span className="ml-1">Share</span>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 pb-0 px-0">
                  <PDFViewer pdfUrl={course.pdfUrl} onComplete={handlePDFComplete} />
                </CardContent>
              </Card>
              
              {courseComplete && quiz && (
                <Card className="bg-blue-950/50 border-blue-900 shadow-blue-900/20 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-blue-400">Ready for a quiz?</CardTitle>
                    <CardDescription className="dark:text-gray-300">
                      Now that you've completed the course material, test your knowledge with a quiz!
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button onClick={startQuiz} className="bg-green-600 hover:bg-green-700 text-white">
                      Start Quiz
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
