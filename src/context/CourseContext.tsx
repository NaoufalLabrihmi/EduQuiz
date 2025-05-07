
import React, { createContext, useContext, useState, useEffect } from "react";
import { Course, Quiz, Question, QuizResult } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CourseContextType {
  courses: Course[];
  quizzes: Quiz[];
  quizResults: QuizResult[];
  getCourse: (id: string) => Course | undefined;
  getQuizByCourseId: (courseId: string) => Quiz | undefined;
  addCourse: (course: Omit<Course, "id" | "createdAt" | "updatedAt">) => Promise<Course | undefined>;
  addQuiz: (quiz: Omit<Quiz, "id">) => Promise<Quiz | undefined>;
  saveQuizResult: (result: Omit<QuizResult, "id">) => Promise<QuizResult | undefined>;
  loadCourses: () => Promise<void>;
  isLoading: boolean;
}

// Initialize with empty arrays
const initialState = {
  courses: [],
  quizzes: [],
  quizResults: [],
  isLoading: true,
};

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export const CourseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState(initialState);
  const { courses, quizzes, quizResults, isLoading } = state;

  // Load initial data from Supabase
  const loadCourses = async () => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      // Fetch courses
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('*');
      
      if (coursesError) {
        throw coursesError;
      }

      // Transform DB data to our app types
      const transformedCourses: Course[] = coursesData.map(course => ({
        id: course.id,
        title: course.title,
        description: course.description || "",
        teacherId: "guest", // We're not using authentication yet
        teacherName: course.teacher_name,
        pdfUrl: course.pdf_url || "",
        thumbnailUrl: course.thumbnail_url,
        createdAt: new Date(course.created_at),
        updatedAt: new Date(course.updated_at)
      }));

      // Fetch quizzes
      const { data: quizzesData, error: quizzesError } = await supabase
        .from('quizzes')
        .select('*');
      
      if (quizzesError) {
        throw quizzesError;
      }
      
      // Transform quizzes
      const quizPromises = quizzesData.map(async (quiz) => {
        // Fetch questions for each quiz
        const { data: questionsData, error: questionsError } = await supabase
          .from('questions')
          .select('*')
          .eq('quiz_id', quiz.id);
          
        if (questionsError) {
          console.error("Error fetching questions:", questionsError);
          return null;
        }
        
        // Transform questions
        const questions: Question[] = questionsData.map(q => ({
          id: q.id,
          text: q.text,
          options: Array.isArray(q.options) ? q.options : [],
          correctOptionIndex: q.correct_option_index
        }));
        
        // Return transformed quiz
        return {
          id: quiz.id,
          courseId: quiz.course_id,
          title: quiz.title,
          questions
        };
      });
      
      const transformedQuizzes: Quiz[] = (await Promise.all(quizPromises)).filter(Boolean) as Quiz[];
      
      // Fetch quiz results
      const { data: resultsData, error: resultsError } = await supabase
        .from('quiz_results')
        .select('*');
      
      if (resultsError) {
        throw resultsError;
      }
      
      // Transform quiz results
      const transformedResults: QuizResult[] = resultsData.map(result => ({
        id: result.id,
        userId: result.user_id || "guest",
        quizId: result.quiz_id,
        score: result.score,
        totalQuestions: result.total_questions,
        completedAt: new Date(result.completed_at)
      }));
      
      // Update state with all fetched data
      setState({
        courses: transformedCourses,
        quizzes: transformedQuizzes,
        quizResults: transformedResults,
        isLoading: false
      });
      
    } catch (error) {
      console.error("Error loading data from Supabase:", error);
      toast.error("Failed to load courses data");
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };
  
  // Load data on initial render
  useEffect(() => {
    loadCourses();
  }, []);

  const getCourse = (id: string): Course | undefined => {
    return courses.find(course => course.id === id);
  };

  const getQuizByCourseId = (courseId: string): Quiz | undefined => {
    return quizzes.find(quiz => quiz.courseId === courseId);
  };

  const addCourse = async (courseData: Omit<Course, "id" | "createdAt" | "updatedAt">): Promise<Course | undefined> => {
    try {
      // Convert to DB format
      const dbCourse = {
        title: courseData.title,
        description: courseData.description,
        teacher_name: courseData.teacherName,
        pdf_url: courseData.pdfUrl,
        thumbnail_url: courseData.thumbnailUrl || null
      };
      
      // Insert into Supabase
      const { data, error } = await supabase
        .from('courses')
        .insert(dbCourse)
        .select('*')
        .single();
      
      if (error) {
        throw error;
      }
      
      // Transform returned data to our app type
      const newCourse: Course = {
        id: data.id,
        title: data.title,
        description: data.description || "",
        teacherId: "guest",
        teacherName: data.teacher_name,
        pdfUrl: data.pdf_url || "",
        thumbnailUrl: data.thumbnail_url || undefined,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };
      
      // Update local state
      setState(prev => ({
        ...prev,
        courses: [...prev.courses, newCourse]
      }));
      
      return newCourse;
    } catch (error) {
      console.error("Error adding course to Supabase:", error);
      toast.error("Failed to create course");
      return undefined;
    }
  };

  const addQuiz = async (quizData: Omit<Quiz, "id">): Promise<Quiz | undefined> => {
    try {
      // First create the quiz
      const { data: quizRecord, error: quizError } = await supabase
        .from('quizzes')
        .insert({
          course_id: quizData.courseId,
          title: quizData.title
        })
        .select('*')
        .single();
      
      if (quizError) {
        throw quizError;
      }
      
      // Then create all questions
      const questionsToInsert = quizData.questions.map(q => ({
        quiz_id: quizRecord.id,
        text: q.text,
        options: q.options, // This will be stored as JSONB
        correct_option_index: q.correctOptionIndex
      }));
      
      const { data: questionsData, error: questionsError } = await supabase
        .from('questions')
        .insert(questionsToInsert)
        .select('*');
      
      if (questionsError) {
        throw questionsError;
      }
      
      // Transform questions to our app format
      const questions: Question[] = questionsData.map(q => ({
        id: q.id,
        text: q.text,
        options: Array.isArray(q.options) ? q.options : [],
        correctOptionIndex: q.correct_option_index
      }));
      
      // Create the complete quiz object
      const newQuiz: Quiz = {
        id: quizRecord.id,
        courseId: quizRecord.course_id,
        title: quizRecord.title,
        questions
      };
      
      // Update local state
      setState(prev => ({
        ...prev,
        quizzes: [...prev.quizzes, newQuiz]
      }));
      
      return newQuiz;
    } catch (error) {
      console.error("Error adding quiz to Supabase:", error);
      toast.error("Failed to create quiz");
      return undefined;
    }
  };

  const saveQuizResult = async (resultData: Omit<QuizResult, "id">): Promise<QuizResult | undefined> => {
    try {
      // Convert to DB format
      const dbResult = {
        quiz_id: resultData.quizId,
        user_id: resultData.userId,
        score: resultData.score,
        total_questions: resultData.totalQuestions,
        completed_at: resultData.completedAt.toISOString()
      };
      
      // Insert into Supabase
      const { data, error } = await supabase
        .from('quiz_results')
        .insert(dbResult)
        .select('*')
        .single();
      
      if (error) {
        throw error;
      }
      
      // Transform to our app type
      const newResult: QuizResult = {
        id: data.id,
        userId: data.user_id || "guest",
        quizId: data.quiz_id,
        score: data.score,
        totalQuestions: data.total_questions,
        completedAt: new Date(data.completed_at)
      };
      
      // Update local state
      setState(prev => ({
        ...prev,
        quizResults: [...prev.quizResults, newResult]
      }));
      
      return newResult;
    } catch (error) {
      console.error("Error saving quiz result to Supabase:", error);
      toast.error("Failed to save quiz result");
      return undefined;
    }
  };

  return (
    <CourseContext.Provider 
      value={{ 
        courses, 
        quizzes, 
        quizResults,
        isLoading,
        getCourse,
        getQuizByCourseId,
        addCourse,
        addQuiz,
        saveQuizResult,
        loadCourses
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};

export const useCourses = () => {
  const context = useContext(CourseContext);
  if (context === undefined) {
    throw new Error("useCourses must be used within a CourseProvider");
  }
  return context;
};
