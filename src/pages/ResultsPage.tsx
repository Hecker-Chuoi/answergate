
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTest } from '@/context/TestContext';
import { Button } from '@/components/ui/button';
import { Check, X, Clock, Award, ArrowRight, Home } from 'lucide-react';

const ResultsPage = () => {
  const navigate = useNavigate();
  const { testResult } = useTest();
  
  useEffect(() => {
    // Redirect to homepage if no test result
    if (!testResult) {
      navigate('/');
    }
  }, [testResult, navigate]);
  
  if (!testResult) {
    return null;
  }
  
  const { score, totalQuestions, timeTaken, test } = testResult;
  const percentage = Math.round((score / totalQuestions) * 100);
  
  // Format time taken
  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs}h ${mins}m ${secs}s`;
    }
    return `${mins}m ${secs}s`;
  };
  
  // Determine performance text
  const getPerformanceText = () => {
    if (percentage >= 90) return "Excellent!";
    if (percentage >= 75) return "Great job!";
    if (percentage >= 60) return "Good work!";
    if (percentage >= 50) return "Well done!";
    return "Keep practicing!";
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="w-full max-w-3xl animate-slide-in">
        <div className="glass-panel rounded-2xl p-8 shadow-medium">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Test Results</h1>
            <p className="text-lg text-muted-foreground">{test.title}</p>
          </div>
          
          <div className="flex flex-col items-center justify-center mb-8">
            <div className="relative w-40 h-40 mb-4">
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle
                    className="text-muted stroke-current"
                    strokeWidth="10"
                    stroke="currentColor"
                    fill="transparent"
                    r="40"
                    cx="50"
                    cy="50"
                  />
                  <circle
                    className="text-primary stroke-current"
                    strokeWidth="10"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="40"
                    cx="50"
                    cy="50"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - score / totalQuestions)}`}
                    transform="rotate(-90 50 50)"
                  />
                </svg>
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold">{percentage}%</span>
                <span className="text-sm text-muted-foreground">{score}/{totalQuestions}</span>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-foreground mb-1">
              {getPerformanceText()}
            </h2>
            <p className="text-muted-foreground">
              You completed the test in {formatTime(timeTaken)}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white/80 rounded-xl p-5 shadow-sm border border-border/50">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 p-2 bg-green-100 rounded-lg">
                  <Check className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Correct Answers</p>
                  <p className="text-xl font-semibold">{score}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/80 rounded-xl p-5 shadow-sm border border-border/50">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 p-2 bg-red-100 rounded-lg">
                  <X className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Incorrect Answers</p>
                  <p className="text-xl font-semibold">{totalQuestions - score}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/80 rounded-xl p-5 shadow-sm border border-border/50">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 p-2 bg-blue-100 rounded-lg">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Time Taken</p>
                  <p className="text-xl font-semibold">{formatTime(timeTaken)}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="w-full sm:w-auto text-base px-6 py-5"
            >
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <Button
              onClick={() => {
                // In a real app, this would navigate to a detailed review page
                // For now, just go back to home
                navigate('/');
              }}
              className="w-full sm:w-auto btn-primary text-base px-6 py-5"
            >
              <Award className="w-4 h-4 mr-2" />
              View Detailed Results
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
