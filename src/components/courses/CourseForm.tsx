
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useCourses } from "@/context/CourseContext";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function CourseForm() {
  const { addCourse } = useCourses();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    if (!user) {
      toast.error("You must be logged in to create a course");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, we would upload the PDF file to a storage service
      // and get a URL back. For this demo, we'll use a placeholder URL
      const pdfUrl = pdfFile ? URL.createObjectURL(pdfFile) : "/sample.pdf";
      
      const newCourse = addCourse({
        title,
        description,
        teacherId: user.id,
        teacherName: user.name,
        pdfUrl,
        thumbnailUrl: thumbnailUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop"
      });
      
      toast.success("Course created successfully");
      navigate(`/courses/${newCourse.id}`);
    } catch (error) {
      toast.error("Failed to create course");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === "application/pdf") {
        setPdfFile(file);
        toast.success("PDF uploaded successfully");
      } else {
        toast.error("Please upload a PDF file");
      }
    }
  };
  
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Course</CardTitle>
        <CardDescription>
          Add a new course with learning materials and a quiz
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Course Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Introduction to JavaScript"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Course Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A comprehensive introduction to JavaScript programming language..."
              rows={4}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="pdfFile">Course Material (PDF)</Label>
            <Input
              id="pdfFile"
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="cursor-pointer"
              required
            />
            <p className="text-xs text-gray-500">
              Upload your course material as a PDF file (max 10MB)
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="thumbnailUrl">Thumbnail URL (Optional)</Label>
            <Input
              id="thumbnailUrl"
              value={thumbnailUrl}
              onChange={(e) => setThumbnailUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
            <p className="text-xs text-gray-500">
              Enter a URL for the course thumbnail image
            </p>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end">
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="btn-primary"
          >
            {isSubmitting ? "Creating..." : "Create Course"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
