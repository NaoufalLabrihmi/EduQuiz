
export type UserRole = 'teacher' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  teacherId: string;
  teacherName: string;
  pdfUrl: string;
  thumbnailUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctOptionIndex: number;
}

export interface Quiz {
  id: string;
  courseId: string;
  title: string;
  questions: Question[];
}

export interface QuizResult {
  id: string;
  userId: string;
  quizId: string;
  score: number;
  totalQuestions: number;
  completedAt: Date;
}
