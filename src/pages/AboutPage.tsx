
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-10 px-4">
        <div className="container mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold mb-8 text-center">About EduQuiz</h1>
          
          <div className="prose prose-lg mx-auto">
            <p>
              EduQuiz is an educational platform designed to connect teachers and students through interactive learning experiences. Our mission is to make education more accessible, engaging, and effective.
            </p>
            
            <h2>Our Platform</h2>
            <p>
              With EduQuiz, teachers can easily create and share educational content by uploading PDF course materials and creating custom quizzes to assess student understanding. Students can access these materials, learn at their own pace, and test their knowledge with interactive quizzes.
            </p>
            
            <h2>For Teachers</h2>
            <ul>
              <li>Upload PDF learning materials for students</li>
              <li>Create custom multiple-choice quizzes</li>
              <li>Track student performance and engagement</li>
              <li>Build a library of educational resources</li>
            </ul>
            
            <h2>For Students</h2>
            <ul>
              <li>Access course materials in one convenient location</li>
              <li>Study at your own pace with our integrated PDF viewer</li>
              <li>Test your understanding with interactive quizzes</li>
              <li>Track your progress and performance across courses</li>
            </ul>
            
            <h2>Our Vision</h2>
            <p>
              We believe in a future where quality education is accessible to everyone, everywhere. EduQuiz is our contribution to that vision—a platform that empowers educators and learners to connect, share knowledge, and grow together.
            </p>
            
            <p>
              Thank you for being a part of our educational community!
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
