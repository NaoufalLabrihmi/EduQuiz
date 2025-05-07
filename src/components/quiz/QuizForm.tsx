import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Question } from "@/types";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CheckCircle2 } from 'lucide-react';

interface QuizFormProps {
  questions: Question[];
  onComplete: (answers: number[], score: number) => void;
  onClose?: () => void;
}

export default function QuizForm({ questions, onComplete, onClose }: QuizFormProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>(new Array(questions.length).fill(-1));
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  // Pagination logic (moved to top level)
  const QUESTIONS_PER_PAGE = 10;
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE);
  const paginatedQuestions = questions.slice(page * QUESTIONS_PER_PAGE, (page + 1) * QUESTIONS_PER_PAGE);
  
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
    const correctCount = questions.reduce((acc, q, i) => acc + (answers[i] === q.correctOptionIndex ? 1 : 0), 0);
    const incorrectCount = questions.length - correctCount;
    return (
      <Card className="max-w-3xl mx-auto animate-fade-in bg-gradient-to-br from-blue-100/80 via-fuchsia-100/70 to-teal-100/80 border-0 shadow-2xl rounded-3xl">
        {/* Sticky Summary Bar */}
        <div className="sticky top-0 z-10 bg-gradient-to-br from-blue-100/90 via-fuchsia-100/80 to-teal-100/90 rounded-t-3xl shadow-md pb-2">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-extrabold text-blue-900 drop-shadow-lg">Quiz Results</CardTitle>
            <CardDescription className="text-lg text-blue-700/80">
              You scored {score}% ({correctCount} of {questions.length} correct)
            </CardDescription>
          </CardHeader>
          {/* Stats Summary */}
          <div className="flex flex-col items-center justify-center gap-4 mb-2">
            <div className="flex gap-6 items-center">
              <div className="flex flex-col items-center">
                <span className="text-4xl font-bold text-green-500">{correctCount}</span>
                <span className="text-base text-green-700 font-semibold">Correct</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-4xl font-bold text-red-500">{incorrectCount}</span>
                <span className="text-base text-red-700 font-semibold">Incorrect</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-4xl font-bold text-blue-700">{score}%</span>
                <span className="text-base text-blue-700 font-semibold">Score</span>
              </div>
            </div>
            {/* Visual Bar */}
            <div className="w-full max-w-md h-6 bg-blue-100 rounded-full overflow-hidden shadow-inner border border-blue-200">
              <div
                className="h-full bg-gradient-to-r from-green-400 to-lime-400"
                style={{ width: `${(correctCount / questions.length) * 100}%` }}
              />
              <div
                className="h-full bg-gradient-to-r from-red-400 to-pink-400"
                style={{ width: `${(incorrectCount / questions.length) * 100}%`, marginLeft: `${(correctCount / questions.length) * 100}%` }}
              />
            </div>
          </div>
          <div className={`text-7xl font-extrabold text-center my-4 drop-shadow-xl ${
            score >= 80 ? 'text-green-500' : 
            score >= 50 ? 'text-yellow-500' : 'text-red-500'
          } animate-bounce`}>{score}%</div>
        </div>
        <CardContent>
          {/* Results Grid with Pagination */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[50vh] overflow-y-auto pr-2 transition-all duration-300">
            {paginatedQuestions.map((question, index) => {
              const globalIndex = page * QUESTIONS_PER_PAGE + index;
              return (
                <div 
                  key={question.id} 
                  className={`p-3 rounded-xl border-2 shadow flex flex-col gap-1 text-sm ${
                    answers[globalIndex] === question.correctOptionIndex
                      ? 'bg-green-50 border-green-300'
                      : 'bg-red-50 border-red-300'
                  } transition-all duration-300`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold tracking-wide ${answers[globalIndex] === question.correctOptionIndex ? 'bg-green-400/80 text-white' : 'bg-red-400/80 text-white'}`}> 
                      {answers[globalIndex] === question.correctOptionIndex ? 'Correct' : 'Incorrect'}
                    </span>
                    <span className="text-blue-900 font-semibold text-base">{globalIndex + 1}. {question.text}</span>
                  </div>
                  <div className="mt-1 grid grid-cols-1 gap-1">
                    {question.options.map((option, optIndex) => (
                      <div 
                        key={optIndex}
                        className={`p-1 rounded text-xs font-medium flex items-center gap-2 ${
                          optIndex === question.correctOptionIndex
                            ? 'bg-green-100 text-green-800'
                            : answers[globalIndex] === optIndex
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-blue-900'
                        }`}
                      >
                        {option}
                        {optIndex === question.correctOptionIndex && (
                          <span className="ml-1 text-[10px] text-green-600 font-bold">(Correct answer)</span>
                        )}
                        {answers[globalIndex] === optIndex && (
                          <span className="ml-1 text-[10px] text-blue-700 font-bold">(Your answer)</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-6">
              <Button
                variant="outline"
                className="px-4 py-1 rounded-lg"
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>
              <span className="text-blue-900 font-semibold">Page {page + 1} of {totalPages}</span>
              <Button
                variant="outline"
                className="px-4 py-1 rounded-lg"
                disabled={page === totalPages - 1}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={onClose ? onClose : () => window.location.reload()} variant="outline" className="bg-white/80 border-blue-200 text-blue-900 font-semibold px-6 py-2 rounded-xl shadow-md hover:bg-blue-100/60">
            Return to Course
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  return (
    <Card className="max-w-2xl mx-auto animate-fade-in bg-gradient-to-br from-blue-50/80 via-fuchsia-50/70 to-teal-50/80 border-0 shadow-xl rounded-3xl">
      <CardHeader>
        <div className="flex justify-between items-center mb-2">
          <CardTitle className="text-2xl font-extrabold text-blue-900 drop-shadow">Question {currentQuestionIndex + 1} of {questions.length}</CardTitle>
          {timeLeft !== null && (
            <div className={`text-base font-semibold px-4 py-1 rounded-full shadow-sm ${
              timeLeft > 60 ? 'bg-green-100 text-green-800' : 
              timeLeft > 30 ? 'bg-yellow-100 text-yellow-800' : 
              'bg-red-100 text-red-800'
            } animate-pulse`}>⏰ {formatTime(timeLeft)}</div>
          )}
        </div>
        <CardDescription className="text-lg text-blue-700/80 font-medium">
          Select the correct answer from the options below
        </CardDescription>
        <div className="w-full h-2 bg-gradient-to-r from-blue-400 via-fuchsia-400 to-teal-400 rounded-full mt-4 mb-2">
          <div
            className="h-2 bg-gradient-to-r from-green-400 to-lime-400 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="text-xl font-bold text-blue-900 mb-2">{currentQuestion.text}</div>
          <RadioGroup
            value={answers[currentQuestionIndex].toString()}
            onValueChange={handleAnswerChange}
            className="space-y-4"
          >
            {currentQuestion.options.map((option, index) => (
              <div
                key={index}
                className={`flex items-center space-x-3 border-2 border-blue-100 rounded-xl p-4 bg-white/80 hover:bg-blue-50 transition-all cursor-pointer shadow-sm ${answers[currentQuestionIndex] === index ? 'ring-2 ring-blue-400' : ''}`}
                onClick={() => handleAnswerChange(index.toString())}
                role="button"
                tabIndex={0}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleAnswerChange(index.toString()); }}
              >
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-lg text-blue-900 font-medium">
                  {option}
                </Label>
                {answers[currentQuestionIndex] === index && (
                  <CheckCircle2 className="text-green-500 w-6 h-6 ml-2" />
                )}
              </div>
            ))}
          </RadioGroup>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center mt-4">
        <Button 
          onClick={handlePrevious}
          variant="outline"
          disabled={currentQuestionIndex === 0}
          className="bg-white/80 border-blue-200 text-blue-900 font-semibold px-6 py-2 rounded-xl shadow-md hover:bg-blue-100/60"
        >
          Previous
        </Button>
        <div className="text-base text-blue-700 font-semibold">
          {currentQuestionIndex + 1} of {questions.length}
        </div>
        <Button 
          onClick={handleNext}
          disabled={answers[currentQuestionIndex] === -1}
          className="bg-gradient-to-r from-blue-500 via-fuchsia-500 to-teal-400 text-white font-bold px-8 py-2 rounded-xl shadow-lg hover:scale-105 transition-transform duration-200"
        >
          {isLastQuestion ? "Submit Quiz" : "Next"}
        </Button>
      </CardFooter>
    </Card>
  );
}
