
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useCourses } from "@/context/CourseContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import CourseCard from "@/components/courses/CourseCard";

export default function Dashboard() {
  const { user, isLoading } = useAuth();
  const { courses, quizResults } = useCourses();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to login if not logged in
    if (!isLoading && !user) {
      navigate("/login");
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
  
  const isTeacher = user.role === "teacher";
  
  // For teachers: show their authored courses
  // For students: show enrolled courses and quiz results
  const teacherCourses = courses.filter(course => course.teacherId === user.id);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-10 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
            {isTeacher && (
              <Button asChild className="btn-primary">
                <Link to="/create-course">Create New Course</Link>
              </Button>
            )}
          </div>
          
          <div className="mb-10 p-6 bg-edu-soft-purple rounded-lg">
            <h2 className="text-xl font-semibold mb-2">
              Welcome back, {user.name}!
            </h2>
            <p className="text-gray-700">
              {isTeacher ? 
                "Manage your courses and create new learning materials for your students." : 
                "Access your courses and track your learning progress."
              }
            </p>
          </div>
          
          {isTeacher ? (
            <>
              <h2 className="text-xl font-semibold mb-4">Your Courses</h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                {teacherCourses.length > 0 ? (
                  teacherCourses.map(course => (
                    <CourseCard key={course.id} course={course} />
                  ))
                ) : (
                  <Card className="md:col-span-3 bg-gray-50 border-dashed">
                    <CardHeader>
                      <CardTitle>No courses yet</CardTitle>
                      <CardDescription>
                        You haven't created any courses yet. Start by creating your first course.
                      </CardDescription>
                    </CardHeader>
                    <CardFooter>
                      <Button asChild className="btn-primary">
                        <Link to="/create-course">Create Your First Course</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                )}
              </div>
            </>
          ) : (
            <>
              <h2 className="text-xl font-semibold mb-4">Available Courses</h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                {courses.length > 0 ? (
                  courses.map(course => (
                    <CourseCard key={course.id} course={course} />
                  ))
                ) : (
                  <Card className="md:col-span-3 bg-gray-50 border-dashed">
                    <CardHeader>
                      <CardTitle>No courses available</CardTitle>
                      <CardDescription>
                        There are no courses available at the moment. Check back later!
                      </CardDescription>
                    </CardHeader>
                  </Card>
                )}
              </div>
              
              <h2 className="text-xl font-semibold mt-10 mb-4">Your Quiz Results</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {quizResults.filter(result => result.userId === user.id).length > 0 ? (
                  quizResults
                    .filter(result => result.userId === user.id)
                    .map(result => {
                      const quiz = courses.find(c => 
                        c.id === quizResults.find(qr => qr.id === result.id)?.quizId
                      );
                      
                      return (
                        <Card key={result.id}>
                          <CardHeader>
                            <CardTitle>{quiz?.title || "Quiz Result"}</CardTitle>
                            <CardDescription>
                              Completed on {result.completedAt.toLocaleDateString()}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-medium">Score</p>
                                <p className="text-2xl font-bold">{result.score}%</p>
                              </div>
                              <div>
                                <p className="font-medium">Questions</p>
                                <p className="text-xl">{Math.round(result.score / 100 * result.totalQuestions)} / {result.totalQuestions} correct</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })
                ) : (
                  <Card className="md:col-span-2 bg-gray-50 border-dashed">
                    <CardHeader>
                      <CardTitle>No quiz results yet</CardTitle>
                      <CardDescription>
                        You haven't completed any quizzes yet. Start by taking a course and completing its quiz!
                      </CardDescription>
                    </CardHeader>
                  </Card>
                )}
              </div>
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
