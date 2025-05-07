
import { useCourses } from "@/context/CourseContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import CourseCard from "@/components/courses/CourseCard";

export default function Dashboard() {
  const { courses, quizResults } = useCourses();
  
  return (
    <div className="min-h-screen flex flex-col dark:bg-gray-900">
      <Header />
      
      <main className="flex-1 py-10 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold dark:text-white">Dashboard</h1>
            <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
              <Link to="/create-course">Create New Course</Link>
            </Button>
          </div>
          
          <div className="mb-10 p-6 bg-gradient-to-br from-blue-500 to-teal-500 rounded-lg text-white">
            <h2 className="text-xl font-semibold mb-2">
              Welcome to EduQuiz!
            </h2>
            <p className="text-white/90">
              Browse available courses or create your own learning materials.
            </p>
          </div>
          
          <h2 className="text-xl font-semibold mb-4 dark:text-white">Available Courses</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {courses.length > 0 ? (
              courses.map(course => (
                <CourseCard key={course.id} course={course} />
              ))
            ) : (
              <Card className="md:col-span-3 bg-gray-50 dark:bg-gray-800 border-dashed dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="dark:text-white">No courses available</CardTitle>
                  <CardDescription className="dark:text-gray-300">
                    There are no courses available at the moment. Be the first to create one!
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Link to="/create-course">Create Your First Course</Link>
                  </Button>
                </CardFooter>
              </Card>
            )}
          </div>
          
          <h2 className="text-xl font-semibold mt-10 mb-4 dark:text-white">Recent Quiz Results</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {quizResults.length > 0 ? (
              quizResults.map(result => {
                const quiz = courses.find(c => 
                  c.id === quizResults.find(qr => qr.id === result.id)?.quizId
                );
                
                return (
                  <Card key={result.id} className="dark:bg-gray-800 dark:border-gray-700">
                    <CardHeader>
                      <CardTitle className="dark:text-white">{quiz?.title || "Quiz Result"}</CardTitle>
                      <CardDescription className="dark:text-gray-300">
                        Completed on {result.completedAt.toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium dark:text-gray-300">Score</p>
                          <p className="text-2xl font-bold dark:text-white">{result.score}%</p>
                        </div>
                        <div>
                          <p className="font-medium dark:text-gray-300">Questions</p>
                          <p className="text-xl dark:text-white">{Math.round(result.score / 100 * result.totalQuestions)} / {result.totalQuestions} correct</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <Card className="md:col-span-2 bg-gray-50 dark:bg-gray-800 border-dashed dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="dark:text-white">No quiz results yet</CardTitle>
                  <CardDescription className="dark:text-gray-300">
                    You haven't completed any quizzes yet. Start by taking a course and completing its quiz!
                  </CardDescription>
                </CardHeader>
              </Card>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
