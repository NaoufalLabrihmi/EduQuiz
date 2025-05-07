
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Question } from "@/types";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface QuizFormProps {
  questions: Question[];
  onComplete: (answers: number[], score: number) => void;
}

export default function QuizForm({ questions, onComplete }: QuizFormProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>(new Array(questions.length).fill(-1));
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  
  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  
  // Set time based on question count - 30 seconds per question
  useEffect(() => {
    const totalTime = questions.length * 30;
    setTimeLeft(totalTime);
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          if (prev === 1) calculateResults();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [questions.length]);

  const handleAnswerChange = (value: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = parseInt(value, 10);
    setAnswers(newAnswers);
  };
  
  const handleNext = () => {
    if (isLastQuestion) {
      calculateResults();
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  
  const handlePrevious = () => {
    setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1));
  };
  
  const calculateResults = () => {
    let correct = 0;
    questions.forEach((question, index) => {
      if (answers[index] === question.correctOptionIndex) {
        correct++;
      }
    });
    
    const calculatedScore = Math.round((correct / questions.length) * 100);
    setScore(calculatedScore);
    setShowResults(true);
    onComplete(answers, calculatedScore);
  };
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  if (showResults) {
    return (
      <Card className="max-w-3xl mx-auto animate-fade-in">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Quiz Results</CardTitle>
          <CardDescription>
            You scored {score}% ({Math.round(score / 100 * questions.length)} of {questions.length} questions correct)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className={`text-6xl font-bold text-center my-8 ${
            score >= 80 ? 'text-green-500' : 
            score >= 50 ? 'text-yellow-500' : 'text-red-500'
          }`}>
            {score}%
          </div>
          
          <div className="space-y-4">
            {questions.map((question, index) => (
              <div 
                key={question.id} 
                className={`p-4 rounded-lg border ${
                  answers[index] === question.correctOptionIndex
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <p className="font-medium">{index + 1}. {question.text}</p>
                <div className="mt-2 grid grid-cols-1 gap-2">
                  {question.options.map((option, optIndex) => (
                    <div 
                      key={optIndex}
                      className={`p-2 rounded text-sm ${
                        optIndex === question.correctOptionIndex
                          ? 'bg-green-100 text-green-800'
                          : answers[index] === optIndex
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100'
                      }`}
                    >
                      {option}
                      {optIndex === question.correctOptionIndex && (
                        <span className="ml-2 text-xs text-green-600">(Correct answer)</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={() => window.location.reload()} variant="outline">
            Return to Course
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  return (
    <Card className="max-w-2xl mx-auto animate-fade-in">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Question {currentQuestionIndex + 1} of {questions.length}</CardTitle>
          {timeLeft !== null && (
            <div className={`text-sm font-medium px-3 py-1 rounded-full ${
              timeLeft > 60 ? 'bg-green-100 text-green-800' : 
              timeLeft > 30 ? 'bg-yellow-100 text-yellow-800' : 
              'bg-red-100 text-red-800'
            }`}>
              Time left: {formatTime(timeLeft)}
            </div>
          )}
        </div>
        <CardDescription>
          Select the correct answer from the options below
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          <div className="text-lg font-medium">{currentQuestion.text}</div>
          <RadioGroup
            value={answers[currentQuestionIndex].toString()}
            onValueChange={handleAnswerChange}
            className="space-y-4"
          >
            {currentQuestion.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 border p-3 rounded-md hover:bg-gray-50">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          onClick={handlePrevious}
          variant="outline"
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </Button>
        
        <div className="text-sm text-gray-500">
          {currentQuestionIndex + 1} of {questions.length}
        </div>
        
        <Button 
          onClick={handleNext}
          disabled={answers[currentQuestionIndex] === -1}
          className="btn-primary"
        >
          {isLastQuestion ? "Submit Quiz" : "Next"}
        </Button>
      </CardFooter>
    </Card>
  );
}
