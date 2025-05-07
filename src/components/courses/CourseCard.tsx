import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Course } from "@/types";

interface CourseCardProps {
  course: Course;
  hasQuiz?: boolean;
  onView?: () => void;
  onQuiz?: () => void;
}

export default function CourseCard({ course, hasQuiz, onView, onQuiz }: CourseCardProps) {
  return (
    <div className="glass-card overflow-hidden shadow-2xl rounded-3xl border-2 border-blue-200/60 transition-transform duration-300 hover:-translate-y-2 hover:shadow-3xl animate-fade-in-fast flex flex-col min-h-[340px]">
      <div className="relative h-40 md:h-48 overflow-hidden group">
        <img
          src={course.thumbnailUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop"}
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <Badge
          variant="outline"
          className="absolute top-4 left-4 bg-gradient-to-r from-blue-500 to-blue-400 text-white font-bold shadow-lg rounded-full px-4 py-1 text-xs animate-scale-in backdrop-blur-md border-0"
        >
          Course
        </Badge>
      </div>
      <CardContent className="pt-5 pb-2 flex-1">
        <h3 className="text-xl font-extrabold text-blue-900 mb-2 line-clamp-2 animate-fade-in-fast">{course.title}</h3>
        <p className="text-base text-blue-900/70 line-clamp-3 mb-4 animate-fade-in-fast">{course.description}</p>
        <div className="flex items-center text-xs text-blue-900/50 gap-2 animate-fade-in-fast">
          <span>By {course.teacherName}</span>
          <span className="mx-1">•</span>
          <span>{course.createdAt.toLocaleDateString()}</span>
        </div>
      </CardContent>
      <CardFooter className="border-t-0 bg-transparent px-6 py-4 animate-fade-in-fast flex gap-2">
        <Button className="w-full btn-primary shadow-lg hover:scale-105 transition-transform duration-200 animate-scale-in" onClick={onView}>
          View Course
        </Button>
      </CardFooter>
    </div>
  );
}
