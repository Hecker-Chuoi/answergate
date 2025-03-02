
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import MathJax from '@/components/MathJax';
import { 
  ArrowLeft, CheckCircle, XCircle, Clock, Award, 
  ChevronRight, ChevronLeft, Download, Printer 
} from 'lucide-react';

const DetailedResultsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [currentUser, setCurrentUser] = useState<{ username: string, role: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  
  // Mock test result data
  const [testResult, setTestResult] = useState({
    id: id,
    student: {
      id: 1,
      name: 'Nguyễn Văn A',
      email: 'nguyenvana@example.com'
    },
    test: {
      id: 1,
      title: 'Kiểm tra Toán học lớp 12',
      subject: 'Toán học'
    },
    score: 32,
    totalQuestions: 40,
    timeTaken: 3420, // in seconds (57 minutes)
    completedAt: '15/05/2023 10:57',
    answers: [
      {
        question: {
          id: 1,
          text: 'Giá trị của biểu thức $\\frac{\\sin^2(x) + \\cos^2(x)}{\\tan^2(x) + 1}$ là:',
          options: [
            'A. 0',
            'B. $\\frac{1}{2}$',
            'C. 1',
            'D. $\\sin^2(x)$'
          ],
          correctAnswer: 2 // index of correct answer (C)
        },
        selectedAnswer: 2, // user selected C (correct)
        isCorrect: true
      },
      {
        question: {
          id: 2,
          text: 'Giải phương trình $2x^2 - 5x + 2 = 0$. Các nghiệm của phương trình là:',
          options: [
            'A. $x = 2$ và $x = \\frac{1}{2}$',
            'B. $x = \\frac{5 + \\sqrt{17}}{4}$ và $x = \\frac{5 - \\sqrt{17}}{4}$',
            'C. $x = \\frac{5 + \\sqrt{9}}{4}$ và $x = \\frac{5 - \\sqrt{9}}{4}$',
            'D. $x = \\frac{4}{2}$ và $x = 0$'
          ],
          correctAnswer: 1 // index of correct answer (B)
        },
        selectedAnswer: 0, // user selected A (incorrect)
        isCorrect: false
      },
      {
        question: {
          id: 3,
          text: 'Đạo hàm của hàm số $f(x) = x^3 - 3x^2 + 2x - 1$ là:',
          options: [
            'A. $f\'(x) = 3x^2 - 6x + 2$',
            'B. $f\'(x) = 3x^2 + 6x + 2$',
            'C. $f\'(x) = 2x^3 - 3x^2 + 2$',
            'D. $f\'(x) = 3x^2 - 6x - 2$'
          ],
          correctAnswer: 0 // index of correct answer (A)
        },
        selectedAnswer: 0, // user selected A (correct)
        isCorrect: true
      }
      // ... more questions would be here in a real app
    ]
  });

  useEffect(() => {
    // Check if user is logged in
    const userStr = sessionStorage.getItem('currentUser');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setCurrentUser(user);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    setLoading(false);
  }, []);

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

  const nextQuestion = () => {
    if (currentQuestion < testResult.answers.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Đang tải...</div>;
  }

  // Define user permissions - admins, teachers, and the student who took the test can view
  const canAccessResults = currentUser && (
    currentUser.role === 'admin' || 
    currentUser.role === 'teacher' || 
    (currentUser.role === 'student' && testResult.student.name === currentUser.username)
  );

  if (!canAccessResults) {
    navigate('/');
    return null;
  }

  const percentage = Math.round((testResult.score / testResult.totalQuestions) * 100);
  const currentAnswer = testResult.answers[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="container mx-auto">
        <div className="mb-4">
          <Button
            variant="ghost"
            className="mb-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại
          </Button>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
            <div>
              <h1 className="text-2xl font-bold">{testResult.test.title}</h1>
              <p className="text-muted-foreground">
                Thí sinh: {testResult.student.name} | Hoàn thành: {testResult.completedAt}
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" className="flex items-center gap-2">
                <Printer size={16} />
                In kết quả
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Download size={16} />
                Tải PDF
              </Button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column - Summary */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Kết quả tổng quan</h2>
              
              <div className="flex justify-center mb-6">
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle
                      className="text-blue-100 stroke-current"
                      strokeWidth="10"
                      stroke="currentColor"
                      fill="transparent"
                      r="40"
                      cx="50"
                      cy="50"
                    />
                    <circle
                      className="text-blue-600 stroke-current"
                      strokeWidth="10"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                      r="40"
                      cx="50"
                      cy="50"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      strokeDashoffset={`${2 * Math.PI * 40 * (1 - testResult.score / testResult.totalQuestions)}`}
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold">{percentage}%</span>
                    <span className="text-sm text-muted-foreground">
                      {testResult.score}/{testResult.totalQuestions} điểm
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-blue-50 rounded-lg p-3 flex items-center">
                  <CheckCircle className="text-green-500 mr-3" size={20} />
                  <div>
                    <p className="text-sm text-muted-foreground">Đúng</p>
                    <p className="font-semibold">{testResult.score} câu</p>
                  </div>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-3 flex items-center">
                  <XCircle className="text-red-500 mr-3" size={20} />
                  <div>
                    <p className="text-sm text-muted-foreground">Sai</p>
                    <p className="font-semibold">{testResult.totalQuestions - testResult.score} câu</p>
                  </div>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-3 flex items-center">
                  <Clock className="text-blue-500 mr-3" size={20} />
                  <div>
                    <p className="text-sm text-muted-foreground">Thời gian hoàn thành</p>
                    <p className="font-semibold">{formatTime(testResult.timeTaken)}</p>
                  </div>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-3 flex items-center">
                  <Award className="text-yellow-500 mr-3" size={20} />
                  <div>
                    <p className="text-sm text-muted-foreground">Xếp loại</p>
                    <p className="font-semibold">
                      {percentage >= 90 ? 'Xuất sắc' : 
                       percentage >= 80 ? 'Giỏi' : 
                       percentage >= 70 ? 'Khá' : 
                       percentage >= 50 ? 'Trung bình' : 'Cần cố gắng hơn'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Câu trả lời của bạn</h2>
              <div className="grid grid-cols-5 gap-2">
                {testResult.answers.map((answer, index) => (
                  <button
                    key={index}
                    className={`relative w-10 h-10 flex items-center justify-center rounded-md text-sm font-medium transition-colors
                      ${currentQuestion === index ? 'ring-2 ring-blue-500 ring-offset-2' : 'ring-0'}
                      ${answer.isCorrect 
                        ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                    onClick={() => setCurrentQuestion(index)}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Right column - Question details */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Chi tiết câu hỏi</h2>
                <div className="text-sm text-muted-foreground">
                  Câu {currentQuestion + 1}/{testResult.answers.length}
                </div>
              </div>
              
              <div className="mb-6">
                <div className="bg-blue-50 rounded-lg p-4 mb-4">
                  <div className="font-medium mb-1">Câu hỏi {currentQuestion + 1}:</div>
                  <MathJax formula={currentAnswer.question.text} />
                </div>
                
                <div className="space-y-3">
                  {currentAnswer.question.options.map((option, index) => (
                    <div 
                      key={index} 
                      className={`border p-3 rounded-lg flex items-start ${
                        currentAnswer.selectedAnswer === index && currentAnswer.question.correctAnswer === index 
                          ? 'bg-green-50 border-green-200' 
                          : currentAnswer.selectedAnswer === index 
                            ? 'bg-red-50 border-red-200' 
                            : currentAnswer.question.correctAnswer === index 
                              ? 'bg-green-50 border-green-200' 
                              : 'bg-white border-gray-200'
                      }`}
                    >
                      <div className="mr-3 mt-0.5">
                        {currentAnswer.selectedAnswer === index && currentAnswer.question.correctAnswer === index ? (
                          <CheckCircle className="text-green-500 h-5 w-5" />
                        ) : currentAnswer.selectedAnswer === index ? (
                          <XCircle className="text-red-500 h-5 w-5" />
                        ) : currentAnswer.question.correctAnswer === index ? (
                          <CheckCircle className="text-green-500 h-5 w-5" />
                        ) : (
                          <div className="w-5 h-5 border border-gray-300 rounded-full" />
                        )}
                      </div>
                      <div>
                        <MathJax formula={option} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={prevQuestion}
                  disabled={currentQuestion === 0}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" /> Câu trước
                </Button>
                <Button 
                  variant="outline" 
                  onClick={nextQuestion}
                  disabled={currentQuestion === testResult.answers.length - 1}
                >
                  Câu tiếp theo <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedResultsPage;
