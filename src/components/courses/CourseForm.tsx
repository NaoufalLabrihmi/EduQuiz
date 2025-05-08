import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useCourses } from "@/context/CourseContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';
import { UploadCloud, Image as ImageIcon, FileText } from "lucide-react";
import React from "react";
import axios from "axios";

export default function CourseForm({ onCourseCreated, onFormChange, submitting, initialValues }: { onCourseCreated?: (courseId: string) => void, onFormChange?: (data: any) => void, submitting?: boolean, initialValues?: any }) {
  const { addCourse, addQuiz } = useCourses();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState(initialValues?.title || "");
  const [description, setDescription] = useState(initialValues?.description || "");
  const [pdfFile, setPdfFile] = useState<File | null>(initialValues?.pdfFile || null);
  const [thumbnailUrl, setThumbnailUrl] = useState(initialValues?.thumbnailUrl || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authorName, setAuthorName] = useState(initialValues?.teacherName || "");
  const [pdfError, setPdfError] = useState("");
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !authorName || !pdfFile) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // 1. Upload PDF to Supabase Storage
      const pdfFileName = `${uuidv4()}-${pdfFile.name}`;
      const { error: uploadError, data } = await supabase.storage
        .from('course_pdfs')
        .upload(pdfFileName, pdfFile);

      if (uploadError) {
        throw uploadError;
      }
      
      // 2. Get public URL for the PDF
      const { data: { publicUrl } } = supabase.storage
        .from('course_pdfs')
        .getPublicUrl(pdfFileName);
      
      // 3. Fetch science image from Unsplash (official API)
      let fetchedThumbnailUrl = "";
      try {
        const unsplashRes = await axios.get(
          `https://api.unsplash.com/search/photos`,
          {
            params: {
              query: `math physics science ${title}`,
              orientation: "landscape",
              per_page: 1,
            },
            headers: {
              Authorization: "Client-ID Zm_VU9oGvbugZ5X18HQ0jgomVgSPTCS2GNABl1IADwg"
            }
          }
        );
        if (
          unsplashRes.data &&
          unsplashRes.data.results &&
          unsplashRes.data.results.length > 0
        ) {
          fetchedThumbnailUrl = unsplashRes.data.results[0].urls.regular;
        } else {
          fetchedThumbnailUrl = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop";
        }
      } catch {
        fetchedThumbnailUrl = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop";
      }
      
      // 4. Create the course with the PDF URL and fetched image
      const newCourse = await addCourse({
        title,
        description,
        teacherId: "guest",
        teacherName: authorName,
        pdfUrl: publicUrl
      });
      
      if (newCourse) {
        toast.success("Course created successfully");
        const defaultQuiz = await addQuiz({
          courseId: newCourse.id,
          title: `${newCourse.title} Quiz`,
          questions: [
            {
              id: `q-0-${Date.now()}`,
              text: "Sample question: Replace this with your own!",
              options: ["Option 1", "Option 2", "Option 3", "Option 4"],
              correctOptionIndex: 0
            }
          ]
        });
        if (defaultQuiz) {
          toast.success("Default quiz created. Please edit your quiz.");
          if (onCourseCreated) {
            onCourseCreated(newCourse.id);
          } else {
            navigate(`/courses/${newCourse.id}`);
          }
        } else {
          toast.error("Failed to create default quiz. You can add one later.");
          if (onCourseCreated) {
            onCourseCreated(newCourse.id);
          } else {
        navigate(`/courses/${newCourse.id}`);
          }
        }
      } else {
        throw new Error("Failed to create course");
      }
    } catch (error) {
      console.error("Error creating course:", error);
      toast.error("Failed to create course");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === "application/pdf") {
        setPdfFile(file);
        setPdfError("");
        toast.success("PDF uploaded successfully");
        emitFormChange();
      } else {
        setPdfError("Please upload a PDF file");
        toast.error("Please upload a PDF file");
      }
    }
  };
  
  // Call onFormChange with the current form data
  const emitFormChange = () => {
    if (onFormChange) {
      onFormChange({
        title,
        description,
        teacherId: "guest",
        teacherName: authorName,
        pdfFile,
        thumbnailUrl
      });
    }
  };

  // In render, determine which file to show
  const displayedPdfFile = pdfFile || initialValues?.pdfFile || null;

  useEffect(() => {
    emitFormChange();
    // eslint-disable-next-line
  }, [pdfFile]);
  
  return (
    <Card className="mx-2 md:mx-6 glass-card bg-gradient-to-br from-blue-50/80 to-white/80 border-2 border-blue-200/60 shadow-xl rounded-3xl animate-fade-in-fast p-2 md:p-6">
      <CardHeader className="mb-4">
        <div className="flex items-center gap-3 mb-2">
          <FileText className="w-7 h-7 text-blue-400" />
          <CardTitle className="text-2xl font-extrabold text-blue-900 drop-shadow">Course Details</CardTitle>
        </div>
        <CardDescription className="text-blue-700/80 font-medium">
          Add a new course with learning materials and a quiz
        </CardDescription>
      </CardHeader>
      <div>
        <CardContent className="space-y-8">
          {/* Course Title */}
          <div className="mb-6">
            <Label htmlFor="title" className="block mb-2 text-blue-700 font-bold text-base">Course Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => { setTitle(e.target.value); emitFormChange(); }}
              placeholder=""
              required
              disabled={submitting}
              className="bg-white/80 border-2 border-blue-100 rounded-xl px-4 py-4 text-lg text-blue-900 font-semibold focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition-all"
            />
          </div>
          {/* Author Name */}
          <div className="mb-6">
            <Label htmlFor="authorName" className="block mb-2 text-blue-700 font-bold text-base">Author Name</Label>
            <Input
              id="authorName"
              value={authorName}
              onChange={(e) => { setAuthorName(e.target.value); emitFormChange(); }}
              placeholder=""
              required
              disabled={submitting}
              className="bg-white/80 border-2 border-blue-100 rounded-xl px-4 py-4 text-lg text-blue-900 font-semibold focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition-all"
            />
          </div>
          {/* Description */}
          <div className="mb-6">
            <Label htmlFor="description" className="block mb-2 text-blue-700 font-bold text-base">Course Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => { setDescription(e.target.value); emitFormChange(); }}
              placeholder=""
              rows={4}
              required
              disabled={submitting}
              className="bg-white/80 border-2 border-blue-100 rounded-xl px-4 py-4 text-lg text-blue-900 font-semibold focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition-all"
            />
          </div>
          {/* PDF Upload Dropzone */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <UploadCloud className="w-6 h-6 text-blue-400" />
              <span className="text-blue-900 font-bold text-lg">Course Material (PDF)</span>
            </div>
            <label htmlFor="pdfFile" className="block cursor-pointer">
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-blue-200 rounded-xl bg-white/70 hover:bg-blue-50 transition-all p-6 text-blue-500 font-semibold text-lg shadow-inner">
                {displayedPdfFile ? (
                  <></>
                ) : (
                  <span className="flex flex-col items-center gap-2"><UploadCloud className="w-10 h-10 text-blue-300" /> <span>Click or drag PDF here</span></span>
                )}
                <input
              id="pdfFile"
              type="file"
              accept="application/pdf"
                  onChange={(e) => { handleFileChange(e); emitFormChange(); }}
                  className="hidden"
                  disabled={submitting}
                />
              </div>
            </label>
            {/* Show uploaded PDF info */}
            {displayedPdfFile && (
              <div className="mt-4 flex items-center gap-4 glass-card bg-gradient-to-br from-blue-100/80 to-white/80 border border-blue-200/60 rounded-xl px-4 py-3 shadow animate-fade-in-fast">
                <FileText className="w-7 h-7 text-blue-500" />
                <div className="flex-1">
                  <div className="text-blue-900 font-bold text-base">Hi! You uploaded this file:</div>
                  <div className="text-blue-700 font-semibold text-sm truncate">{displayedPdfFile.name}</div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setPdfFile(null);
                    if (onFormChange) {
                      onFormChange({
                        title,
                        description,
                        teacherId: "guest",
                        teacherName: authorName,
                        pdfFile: null,
                        thumbnailUrl
                      });
                    }
                  }}
                  className="ml-2 px-4 py-2 rounded-lg bg-gradient-to-br from-blue-400 to-blue-500 text-white font-bold shadow hover:scale-105 active:scale-95 transition-all duration-150"
                >
                  Remove
                </button>
              </div>
            )}
            {pdfError && <p className="text-red-500 text-sm mt-2 animate-fade-in-fast">{pdfError}</p>}
            <p className="text-xs text-blue-400 mt-2">Upload your course material as a PDF file (max 10MB)</p>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}