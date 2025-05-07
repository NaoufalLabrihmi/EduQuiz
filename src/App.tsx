
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CourseProvider } from "./context/CourseContext";

// Pages
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CourseList from "./pages/CourseList";
import CourseView from "./pages/CourseView";
import CourseCreation from "./pages/CourseCreation";
import AboutPage from "./pages/AboutPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CourseProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/courses" element={<CourseList />} />
              <Route path="/courses/:courseId" element={<CourseView />} />
              <Route path="/create-course" element={<CourseCreation />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CourseProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
