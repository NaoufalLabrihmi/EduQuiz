import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useCourses } from "@/context/CourseContext";
import { Question } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";

interface QuizCreatorProps {
  courseId: string;
  onComplete: () => void;
}

export default function QuizCreator({ courseId, onComplete }: QuizCreatorProps) {
  const { addQuiz } = useCourses();
  
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState<Partial<Question>[]>([
    { 
      text: "", 
      options: ["", "", "", ""], 
      correctOptionIndex: 0 
    }
  ]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title) {
      toast.error("Please add a quiz title");
      return;
    }
    
    // Validate questions
    const invalidQuestions = questions.filter(
      q => !q.text || q.options?.some(opt => !opt)
    );
    
    if (invalidQuestions.length > 0) {
      toast.error("Please fill in all question texts and options");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Convert partial questions to full questions with IDs
      const fullQuestions = questions.map((q, index) => ({
        id: `q-${index}-${Date.now()}`, // This ID will be replaced by Supabase
        text: q.text!,
        options: q.options!,
        correctOptionIndex: q.correctOptionIndex!
      }));
      
      const result = await addQuiz({
        courseId,
        title,
        questions: fullQuestions
      });
      
      if (!result) {
        throw new Error("Failed to create quiz");
      }
      
      toast.success("Quiz created successfully");
      onComplete();
    } catch (error) {
      console.error("Error creating quiz:", error);
      toast.error("Failed to create quiz");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const addQuestion = () => {
    setQuestions([
      ...questions, 
      { 
        text: "", 
        options: ["", "", "", ""], 
        correctOptionIndex: 0 
      }
    ]);
  };
  
  const removeQuestion = (index: number) => {
    if (questions.length <= 1) {
      toast.error("You need at least one question");
      return;
    }
    
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };
  
  const handleQuestionChange = (index: number, field: keyof Question, value: any) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [field]: value
    };
    setQuestions(updatedQuestions);
  };
  
  const handleOptionChange = (questionIndex: number, optionIndex: number, value: string) => {
    const updatedQuestions = [...questions];
    const options = [...(updatedQuestions[questionIndex].options || [])];
    options[optionIndex] = value;
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      options
    };
    setQuestions(updatedQuestions);
  };
  
  const setCorrectOption = (questionIndex: number, optionIndex: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      correctOptionIndex: optionIndex
    };
    setQuestions(updatedQuestions);
  };
  
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Create Quiz</CardTitle>
        <CardDescription>
          Add questions and options for your course quiz
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Quiz Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="End of Module Assessment"
              required
            />
          </div>
          
          {questions.map((question, questionIndex) => (
            <Card key={questionIndex} className="border-dashed">
              <CardHeader className="py-3 px-4">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base">Question {questionIndex + 1}</CardTitle>
                  <Button 
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeQuestion(questionIndex)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    Remove
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={`question-${questionIndex}`}>Question Text</Label>
                  <Textarea
                    id={`question-${questionIndex}`}
                    value={question.text}
                    onChange={(e) => handleQuestionChange(questionIndex, "text", e.target.value)}
                    placeholder="What is the correct answer to this question?"
                    rows={2}
                    required
                  />
                </div>
                
                <div className="space-y-3">
                  <Label>Options</Label>
                  {question.options?.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center space-x-3">
                      <Checkbox
                        id={`q${questionIndex}-option${optionIndex}-correct`}
                        checked={question.correctOptionIndex === optionIndex}
                        onCheckedChange={() => setCorrectOption(questionIndex, optionIndex)}
                      />
                      <div className="flex-1">
                        <Input
                          value={option}
                          onChange={(e) => handleOptionChange(questionIndex, optionIndex, e.target.value)}
                          placeholder={`Option ${optionIndex + 1}`}
                          required
                        />
                      </div>
                      <Label 
                        htmlFor={`q${questionIndex}-option${optionIndex}-correct`}
                        className="text-xs cursor-pointer text-gray-500"
                      >
                        Correct answer
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
          
          <div className="flex justify-center">
            <Button
              type="button"
              onClick={addQuestion}
              variant="outline"
              className="w-full"
            >
              Add Question
            </Button>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button 
            type="button"
            variant="outline"
            onClick={onComplete}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="btn-primary"
          >
            {isSubmitting ? "Creating..." : "Create Quiz"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
