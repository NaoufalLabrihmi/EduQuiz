
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCourses } from "@/context/CourseContext";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PDFViewer from "@/components/pdf/PDFViewer";
import QuizForm from "@/components/quiz/QuizForm";
import QuizCreator from "@/components/quiz/QuizCreator";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export default function CourseView() {
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuth();
  const { getCourse, getQuizByCourseId, saveQuizResult, addQuiz } = useCourses();
  const navigate = useNavigate();
  
  const [showQuiz, setShowQuiz] = useState(false);
  const [showQuizCreator, setShowQuizCreator] = useState(false);
  const [courseComplete, setCourseComplete] = useState(false);
  
  // Get the course data
  const course = courseId ? getCourse(courseId) : undefined;
  const quiz = courseId ? getQuizByCourseId(courseId) : undefined;
  
  useEffect(() => {
    if (courseId && !course) {
      // Course not found, redirect to courses page
      toast.error("Course not found");
      navigate("/courses");
    }
  }, [courseId, course, navigate]);
  
  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-500">Loading...</p>
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
  
  const handleQuizComplete = (answers: number[], score: number) => {
    if (!user || !quiz) return;
    
    // Save quiz results
    saveQuizResult({
      userId: user.id,
      quizId: quiz.id,
      score,
      totalQuestions: quiz.questions.length,
      completedAt: new Date()
    });
  };
  
  const handleCreateQuiz = () => {
    setShowQuizCreator(true);
  };
  
  const handleQuizCreationComplete = () => {
    setShowQuizCreator(false);
    toast.success("Quiz created successfully!");
  };
  
  const isTeacher = user?.role === "teacher";
  const isAuthor = isTeacher && user?.id === course.teacherId;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-10 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
            <p className="text-gray-600 mb-4">{course.description}</p>
            <div className="flex items-center text-sm text-gray-500 mb-6">
              <span>Created by {course.teacherName}</span>
              <span className="mx-2">•</span>
              <span>Updated {course.updatedAt.toLocaleDateString()}</span>
            </div>
            
            {!showQuiz && !showQuizCreator && (
              <div className="flex flex-wrap gap-3">
                {isAuthor && !quiz && (
                  <Button onClick={handleCreateQuiz} className="btn-primary">
                    Create Quiz
                  </Button>
                )}
                
                {courseComplete && quiz && (
                  <Button onClick={startQuiz} className="btn-primary">
                    Start Quiz
                  </Button>
                )}
                
                <Button onClick={() => navigate("/courses")} variant="outline">
                  Back to Courses
                </Button>
              </div>
            )}
          </div>
          
          {showQuiz && quiz ? (
            <QuizForm questions={quiz.questions} onComplete={handleQuizComplete} />
          ) : showQuizCreator ? (
            <QuizCreator courseId={course.id} onComplete={handleQuizCreationComplete} />
          ) : (
            <div className="space-y-10">
              <Card>
                <CardHeader>
                  <CardTitle>Course Material</CardTitle>
                  <CardDescription>
                    Read through the course material. You can take the quiz once you've completed the material.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <PDFViewer pdfUrl={course.pdfUrl} onComplete={handlePDFComplete} />
                </CardContent>
              </Card>
              
              {courseComplete && quiz && (
                <Card className="bg-edu-soft-purple border-edu-purple">
                  <CardHeader>
                    <CardTitle>Ready for a quiz?</CardTitle>
                    <CardDescription>
                      Now that you've completed the course material, test your knowledge with a quiz!
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button onClick={startQuiz} className="btn-primary">
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
