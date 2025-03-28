
import React, { useState } from 'react';
import { Question, Answer } from '@/services/testService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash, Save, X, Edit, Check } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface TestQuestionEditorProps {
  question: Question;
  isEditing: boolean;
  onSave: (updatedQuestion: Question) => void;
  onCancel: () => void;
}

const TestQuestionEditor: React.FC<TestQuestionEditorProps> = ({
  question,
  isEditing,
  onSave,
  onCancel
}) => {
  const [questionText, setQuestionText] = useState(question.questionText);
  const [explainText, setExplainText] = useState(question.explainText || '');
  const [questionType, setQuestionType] = useState<'SINGLE_CHOICE' | 'MULTIPLE_CHOICES'>(question.questionType);
  const [answers, setAnswers] = useState<Answer[]>([...question.answers]);

  const handleAddAnswer = () => {
    const newAnswer: Answer = {
      answerText: '',
      isCorrect: false
    };
    setAnswers([...answers, newAnswer]);
  };

  const handleRemoveAnswer = (index: number) => {
    if (answers.length <= 2) {
      toast.error('Câu hỏi phải có ít nhất 2 đáp án');
      return;
    }
    const newAnswers = [...answers];
    newAnswers.splice(index, 1);
    setAnswers(newAnswers);
  };

  const handleAnswerTextChange = (index: number, text: string) => {
    const newAnswers = [...answers];
    newAnswers[index].answerText = text;
    setAnswers(newAnswers);
  };

  const handleCorrectAnswerChange = (index: number, isCorrect: boolean) => {
    const newAnswers = [...answers];
    
    if (questionType === 'SINGLE_CHOICE') {
      // For single choice, uncheck all other answers
      newAnswers.forEach((answer, i) => {
        newAnswers[i].isCorrect = i === index ? isCorrect : false;
      });
    } else {
      // For multiple choice, just toggle the current one
      newAnswers[index].isCorrect = isCorrect;
    }
    
    setAnswers(newAnswers);
  };

  const handleSave = () => {
    // Validate
    if (!questionText.trim()) {
      toast.error('Nội dung câu hỏi không được để trống');
      return;
    }
    
    // Check if all answers have content
    const emptyAnswerIndex = answers.findIndex(answer => !answer.answerText.trim());
    if (emptyAnswerIndex !== -1) {
      toast.error(`Nội dung đáp án ${emptyAnswerIndex + 1} không được để trống`);
      return;
    }
    
    // Check if there's at least one correct answer
    const hasCorrectAnswer = answers.some(answer => answer.isCorrect);
    if (!hasCorrectAnswer) {
      toast.error('Phải có ít nhất một đáp án đúng');
      return;
    }
    
    // For single choice, check if only one answer is selected
    if (questionType === 'SINGLE_CHOICE') {
      const correctAnswersCount = answers.filter(answer => answer.isCorrect).length;
      if (correctAnswersCount !== 1) {
        toast.error('Câu hỏi một đáp án chỉ được chọn một đáp án đúng');
        return;
      }
    }
    
    const updatedQuestion: Question = {
      ...question,
      questionText,
      explainText,
      questionType,
      answers
    };
    
    onSave(updatedQuestion);
  };

  if (isEditing) {
    return (
      <div className="border rounded-lg p-4 mb-4 bg-white">
        <div className="mb-4">
          <Label htmlFor="questionText">Nội dung câu hỏi</Label>
          <Textarea
            id="questionText"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            className="mt-1"
            placeholder="Nhập nội dung câu hỏi"
          />
        </div>
        
        <div className="mb-4">
          <Label htmlFor="questionType">Loại câu hỏi</Label>
          <Select
            value={questionType}
            onValueChange={(value: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICES') => setQuestionType(value)}
          >
            <SelectTrigger className="w-full mt-1">
              <SelectValue placeholder="Chọn loại câu hỏi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SINGLE_CHOICE">Một đáp án</SelectItem>
              <SelectItem value="MULTIPLE_CHOICES">Nhiều đáp án</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <Label>Các đáp án</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddAnswer}
              className="flex items-center gap-1"
            >
              <Plus size={16} />
              Thêm đáp án
            </Button>
          </div>
          
          <div className="space-y-3">
            {answers.map((answer, index) => (
              <div key={index} className="flex items-center gap-3 border p-2 rounded-md">
                <div className="flex-grow">
                  <Input
                    value={answer.answerText}
                    onChange={(e) => handleAnswerTextChange(index, e.target.value)}
                    placeholder={`Đáp án ${index + 1}`}
                  />
                </div>
                
                {questionType === 'SINGLE_CHOICE' ? (
                  <RadioGroup
                    value={answer.isCorrect ? "true" : "false"}
                    onValueChange={(value) => handleCorrectAnswerChange(index, value === "true")}
                    className="flex items-center gap-2"
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="true" id={`correct-${index}`} />
                      <Label htmlFor={`correct-${index}`} className="text-sm cursor-pointer">
                        Đáp án đúng
                      </Label>
                    </div>
                  </RadioGroup>
                ) : (
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={`correct-${index}`}
                      checked={answer.isCorrect}
                      onCheckedChange={(checked) => handleCorrectAnswerChange(index, checked === true)}
                    />
                    <Label htmlFor={`correct-${index}`} className="text-sm cursor-pointer">
                      Đáp án đúng
                    </Label>
                  </div>
                )}
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveAnswer(index)}
                  className="text-red-500 hover:text-red-700 p-0 h-8 w-8"
                >
                  <Trash size={16} />
                </Button>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mb-4">
          <Label htmlFor="explainText">Giải thích (tùy chọn)</Label>
          <Textarea
            id="explainText"
            value={explainText}
            onChange={(e) => setExplainText(e.target.value)}
            className="mt-1"
            placeholder="Nhập giải thích cho đáp án"
          />
        </div>
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel} className="flex items-center gap-1">
            <X size={16} />
            Hủy bỏ
          </Button>
          <Button onClick={handleSave} className="flex items-center gap-1">
            <Save size={16} />
            Lưu thay đổi
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-4 mb-4 bg-white">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold">{questionText}</h3>
        <div className="flex items-center gap-2">
          <span className={cn(
            "text-xs font-medium px-2 py-1 rounded-full",
            questionType === 'SINGLE_CHOICE' 
              ? "bg-blue-100 text-blue-800" 
              : "bg-purple-100 text-purple-800"
          )}>
            {questionType === 'SINGLE_CHOICE' ? 'Một đáp án' : 'Nhiều đáp án'}
          </span>
        </div>
      </div>
      
      <div className="space-y-3 mb-4">
        {answers.map((answer, index) => (
          <div 
            key={index} 
            className={cn(
              "flex items-center gap-3 p-3 rounded-md border",
              answer.isCorrect && "bg-green-50 border-green-200"
            )}
          >
            <div className="flex-grow">
              <div className="flex items-center gap-2">
                {questionType === 'SINGLE_CHOICE' ? (
                  <div className={cn(
                    "w-5 h-5 rounded-full border flex items-center justify-center",
                    answer.isCorrect && "bg-green-500 border-green-500 text-white"
                  )}>
                    {answer.isCorrect && <Check size={12} />}
                  </div>
                ) : (
                  <div className={cn(
                    "w-5 h-5 rounded border flex items-center justify-center",
                    answer.isCorrect && "bg-green-500 border-green-500 text-white"
                  )}>
                    {answer.isCorrect && <Check size={12} />}
                  </div>
                )}
                <span className={answer.isCorrect ? "font-medium" : ""}>
                  {answer.answerText}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {explainText && (
        <div className="bg-gray-50 p-3 rounded-md mt-3 text-sm">
          <div className="font-medium mb-1">Giải thích:</div>
          <p>{explainText}</p>
        </div>
      )}
    </div>
  );
};

export default TestQuestionEditor;
