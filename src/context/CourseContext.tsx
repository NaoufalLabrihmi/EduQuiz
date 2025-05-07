
import React, { createContext, useContext, useState } from "react";
import { Course, Quiz, Question, QuizResult } from "@/types";

// Mock data for demonstration
const MOCK_COURSES: Course[] = [
  {
    id: "1",
    title: "Introduction to React",
    description: "Learn the fundamentals of React including components, state, and props.",
    teacherId: "1",
    teacherName: "John Teacher",
    pdfUrl: "/sample.pdf", // This would be an actual URL in production
    thumbnailUrl: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2023-02-20")
  },
  {
    id: "2",
    title: "Advanced JavaScript",
    description: "Explore advanced JavaScript concepts like closures, prototypes and async programming.",
    teacherId: "1",
    teacherName: "John Teacher",
    pdfUrl: "/sample2.pdf",
    thumbnailUrl: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    createdAt: new Date("2023-03-10"),
    updatedAt: new Date("2023-04-05")
  }
];

const MOCK_QUIZZES: Quiz[] = [
  {
    id: "1",
    courseId: "1",
    title: "React Fundamentals Quiz",
    questions: [
      {
        id: "q1",
        text: "What function allows you to update state in React?",
        options: [
          "updateState()",
          "setState()",
          "changeState()",
          "modifyState()"
        ],
        correctOptionIndex: 1
      },
      {
        id: "q2",
        text: "What is JSX?",
        options: [
          "A JavaScript engine",
          "A database query language",
          "A syntax extension for JavaScript that looks like HTML",
          "A React-specific HTTP library"
        ],
        correctOptionIndex: 2
      },
      {
        id: "q3",
        text: "What hook allows you to use state in a functional component?",
        options: [
          "useEffect",
          "useContext",
          "useState",
          "useReducer"
        ],
        correctOptionIndex: 2
      }
    ]
  },
  {
    id: "2",
    courseId: "2",
    title: "JavaScript Advanced Concepts",
    questions: [
      {
        id: "q1",
        text: "What is a closure in JavaScript?",
        options: [
          "A way to close browser windows",
          "A function that has access to variables from its outer scope",
          "A method to close database connections",
          "A way to terminate functions"
        ],
        correctOptionIndex: 1
      },
      {
        id: "q2",
        text: "What does 'this' refer to in JavaScript?",
        options: [
          "The current function",
          "The global object",
          "Depends on how the function is called",
          "The parent object"
        ],
        correctOptionIndex: 2
      }
    ]
  }
];

interface CourseContextType {
  courses: Course[];
  quizzes: Quiz[];
  quizResults: QuizResult[];
  getCourse: (id: string) => Course | undefined;
  getQuizByCourseId: (courseId: string) => Quiz | undefined;
  addCourse: (course: Omit<Course, "id" | "createdAt" | "updatedAt">) => Course;
  addQuiz: (quiz: Omit<Quiz, "id">) => Quiz;
  saveQuizResult: (result: Omit<QuizResult, "id">) => QuizResult;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export const CourseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [courses, setCourses] = useState<Course[]>(MOCK_COURSES);
  const [quizzes, setQuizzes] = useState<Quiz[]>(MOCK_QUIZZES);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);

  const getCourse = (id: string): Course | undefined => {
    return courses.find(course => course.id === id);
  };

  const getQuizByCourseId = (courseId: string): Quiz | undefined => {
    return quizzes.find(quiz => quiz.courseId === courseId);
  };

  const addCourse = (courseData: Omit<Course, "id" | "createdAt" | "updatedAt">): Course => {
    const newCourse: Course = {
      ...courseData,
      id: `course-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setCourses(prev => [...prev, newCourse]);
    return newCourse;
  };

  const addQuiz = (quizData: Omit<Quiz, "id">): Quiz => {
    const newQuiz: Quiz = {
      ...quizData,
      id: `quiz-${Date.now()}`
    };
    
    setQuizzes(prev => [...prev, newQuiz]);
    return newQuiz;
  };

  const saveQuizResult = (resultData: Omit<QuizResult, "id">): QuizResult => {
    const newResult: QuizResult = {
      ...resultData,
      id: `result-${Date.now()}`
    };
    
    setQuizResults(prev => [...prev, newResult]);
    return newResult;
  };

  return (
    <CourseContext.Provider 
      value={{ 
        courses, 
        quizzes, 
        quizResults,
        getCourse,
        getQuizByCourseId,
        addCourse,
        addQuiz,
        saveQuizResult
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
