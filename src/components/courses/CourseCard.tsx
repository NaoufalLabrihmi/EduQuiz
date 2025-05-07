
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Course } from "@/types";

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <Card className="overflow-hidden card-hover">
      <div className="h-48 overflow-hidden">
        <img 
          src={course.thumbnailUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop"} 
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <CardContent className="pt-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold line-clamp-2">{course.title}</h3>
          <Badge variant="outline" className="bg-edu-soft-purple text-edu-purple-dark">
            Course
          </Badge>
        </div>
        <p className="text-sm text-gray-600 line-clamp-3 mb-3">
          {course.description}
        </p>
        <div className="flex items-center text-xs text-gray-500">
          <span>By {course.teacherName}</span>
          <span className="mx-2">•</span>
          <span>{course.createdAt.toLocaleDateString()}</span>
        </div>
      </CardContent>
      <CardFooter className="border-t bg-gray-50 px-5 py-3">
        <Button asChild className="w-full btn-primary">
          <Link to={`/courses/${course.id}`}>View Course</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
