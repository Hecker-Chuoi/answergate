
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Check, AlertTriangle, ArrowLeft } from 'lucide-react';
import { useTest } from '@/context/TestContext';
import { Test } from '@/types/test';

const sampleTest: Test = {
  id: "math-test-1",
  title: "Kiểm tra Toán học",
  description: "Bài kiểm tra Toán học gồm 50 câu hỏi trắc nghiệm",
  timeLimit: 90, // 90 minutes
  questions: Array(50).fill(null).map((_, index) => ({
    id: `q-${index + 1}`,
    text: `Đây là câu hỏi số ${index + 1}`,
    options: [
      { id: `q-${index + 1}-a`, text: "Đáp án A" },
      { id: `q-${index + 1}-b`, text: "Đáp án B" },
      { id: `q-${index + 1}-c`, text: "Đáp án C" },
      { id: `q-${index + 1}-d`, text: "Đáp án D" }
    ],
    correctOptionId: `q-${index + 1}-a` // Just a sample, normally this would be varied
  }))
};

const TestConfirmation = () => {
  const navigate = useNavigate();
  const { startTest } = useTest();
  const [agreed, setAgreed] = useState(false);
  
  const handleStartTest = () => {
    startTest(sampleTest);
    navigate('/test');
  };
  
  const handleBack = () => {
    navigate('/student-home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center">
          <Button variant="ghost" onClick={handleBack} className="mr-4">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Xác nhận bắt đầu bài kiểm tra</h1>
        </div>
      </header>
      
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="bg-white shadow-lg rounded-lg max-w-3xl w-full overflow-hidden">
          <div className="bg-primary text-white px-6 py-4">
            <h2 className="text-xl font-semibold">Kiểm tra Toán học</h2>
            <p className="text-white/80">Thời gian: 90 phút | Số câu hỏi: 50</p>
          </div>
          
          <div className="p-6">
            <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-amber-500 mr-3 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-amber-800">Lưu ý quan trọng</h3>
                  <p className="text-sm text-amber-700 mt-1">
                    Sau khi bắt đầu bài kiểm tra, bạn sẽ không thể tạm dừng hoặc quay lại trang trước.
                    Bài làm sẽ được nộp tự động khi hết thời gian.
                  </p>
                </div>
              </div>
            </div>
            
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quy định thi</h3>
            
            <ul className="space-y-3 text-gray-700 mb-6">
              <li className="flex items-start">
                <span className="flex-shrink-0 h-5 w-5 text-green-500 mr-2">
                  <Check className="h-5 w-5" />
                </span>
                <span>Không được sử dụng tài liệu, thiết bị hỗ trợ không được phép.</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 h-5 w-5 text-green-500 mr-2">
                  <Check className="h-5 w-5" />
                </span>
                <span>Không được trao đổi, thảo luận trong quá trình làm bài.</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 h-5 w-5 text-green-500 mr-2">
                  <Check className="h-5 w-5" />
                </span>
                <span>Phải hoàn thành bài thi trong thời gian quy định.</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 h-5 w-5 text-green-500 mr-2">
                  <Check className="h-5 w-5" />
                </span>
                <span>Không được rời khỏi trang kiểm tra khi chưa hoàn thành.</span>
              </li>
            </ul>
            
            <div className="flex items-start mb-6">
              <input 
                id="agree" 
                name="agree" 
                type="checkbox" 
                checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
                className="h-4 w-4 mt-1 text-primary border-gray-300 rounded"
              />
              <label htmlFor="agree" className="ml-2 block text-gray-700">
                Tôi đã đọc, hiểu và đồng ý tuân thủ các quy định thi trên.
              </label>
            </div>
            
            <div className="flex justify-end">
              <Button 
                onClick={handleStartTest} 
                disabled={!agreed}
                className="w-full sm:w-auto"
              >
                Bắt đầu làm bài
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TestConfirmation;
