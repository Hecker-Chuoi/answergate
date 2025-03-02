
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTest } from '@/context/TestContext';
import { Test } from '@/types/test';

// Mock data for a sample test
const mockTest: Test = {
  id: '1',
  title: 'Sample Multiple Choice Test',
  description: 'This is a sample test with multiple-choice questions.',
  timeLimit: 60, // 60 minutes
  questions: Array.from({ length: 50 }, (_, i) => ({
    id: `q${i + 1}`,
    text: `This is question ${i + 1}. What is the correct answer?`,
    options: [
      { id: `q${i + 1}_a`, text: `Option A for question ${i + 1}` },
      { id: `q${i + 1}_b`, text: `Option B for question ${i + 1}` },
      { id: `q${i + 1}_c`, text: `Option C for question ${i + 1}` },
      { id: `q${i + 1}_d`, text: `Option D for question ${i + 1}` },
    ],
    correctOptionId: `q${i + 1}_${['a', 'b', 'c', 'd'][Math.floor(Math.random() * 4)]}`,
  })),
};

const Index = () => {
  const navigate = useNavigate();
  const { startTest } = useTest();
  const [isReadingInstructions, setIsReadingInstructions] = useState(false);
  
  const handleStartTest = () => {
    startTest(mockTest);
    navigate('/test');
  };
  
  const handleViewInstructions = () => {
    setIsReadingInstructions(true);
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-b from-blue-50 to-white">
      <div className="w-full max-w-4xl animate-fade-in">
        {!isReadingInstructions ? (
          <div className="glass-panel rounded-2xl p-8 shadow-medium">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-3">{mockTest.title}</h1>
              <p className="text-lg text-muted-foreground">{mockTest.description}</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white/80 rounded-xl p-6 shadow-sm border border-border/50">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 p-2 bg-primary/10 rounded-lg">
                    <Check className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">Multiple Choice</h3>
                    <p className="text-sm text-muted-foreground">
                      {mockTest.questions.length} questions with 4 options each
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/80 rounded-xl p-6 shadow-sm border border-border/50">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 p-2 bg-primary/10 rounded-lg">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">Time Limit</h3>
                    <p className="text-sm text-muted-foreground">
                      {mockTest.timeLimit} minutes to complete
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
              <Button 
                className="w-full sm:w-auto btn-primary text-base px-8 py-6"
                onClick={handleStartTest}
              >
                Start Test
              </Button>
              <Button 
                variant="outline"
                className="w-full sm:w-auto text-base px-8 py-6"
                onClick={handleViewInstructions}
              >
                View Instructions
              </Button>
            </div>
          </div>
        ) : (
          <div className="glass-panel rounded-2xl p-8 shadow-medium">
            <h2 className="text-2xl font-bold text-foreground mb-6">Test Instructions</h2>
            
            <div className="space-y-4 mb-8">
              <div className="bg-white/80 rounded-xl p-5 shadow-sm border border-border/50">
                <h3 className="font-medium text-foreground mb-2">Test Format</h3>
                <p className="text-muted-foreground text-sm">
                  This test consists of {mockTest.questions.length} multiple-choice questions.
                  Each question has 4 possible answers, but only one is correct.
                </p>
              </div>
              
              <div className="bg-white/80 rounded-xl p-5 shadow-sm border border-border/50">
                <h3 className="font-medium text-foreground mb-2">Time Limit</h3>
                <p className="text-muted-foreground text-sm">
                  You have {mockTest.timeLimit} minutes to complete the test.
                  A timer will be displayed to help you keep track of the remaining time.
                </p>
              </div>
              
              <div className="bg-white/80 rounded-xl p-5 shadow-sm border border-border/50">
                <h3 className="font-medium text-foreground mb-2">Navigation</h3>
                <p className="text-muted-foreground text-sm">
                  You can navigate between questions using the "Previous" and "Next" buttons
                  or by clicking on a specific question number in the navigation panel.
                </p>
              </div>
              
              <div className="bg-white/80 rounded-xl p-5 shadow-sm border border-border/50">
                <h3 className="font-medium text-foreground mb-2">Marking Questions</h3>
                <p className="text-muted-foreground text-sm">
                  You can mark questions for later review by clicking the bookmark icon.
                  Marked questions will be highlighted in the navigation panel.
                </p>
              </div>
              
              <div className="bg-white/80 rounded-xl p-5 shadow-sm border border-border/50">
                <h3 className="font-medium text-foreground mb-2">Submitting</h3>
                <p className="text-muted-foreground text-sm">
                  You can submit your test at any time by clicking the "Submit Test" button.
                  The test will be automatically submitted when the time is up.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
              <Button 
                className="w-full sm:w-auto btn-primary text-base px-8 py-6"
                onClick={handleStartTest}
              >
                Start Test
              </Button>
              <Button 
                variant="outline"
                className="w-full sm:w-auto text-base px-8 py-6"
                onClick={() => setIsReadingInstructions(false)}
              >
                Back
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
