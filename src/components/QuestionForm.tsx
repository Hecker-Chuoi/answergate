
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Question, Answer } from '@/services/testService';
import { Trash, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface QuestionFormProps {
  initialData?: Question;
  onSubmit: (question: Question) => void;
  onCancel: () => void;
}

export const QuestionForm: React.FC<QuestionFormProps> = ({
  initialData,
  onSubmit,
  onCancel
}) => {
  const [questionText, setQuestionText] = useState(initialData?.questionText || '');
  const [explainText, setExplainText] = useState(initialData?.explainText || '');
  const [questionType, setQuestionType] = useState<'SINGLE_CHOICE' | 'MULTIPLE_CHOICES'>(
    initialData?.questionType || 'SINGLE_CHOICE'
  );
  const [answers, setAnswers] = useState<Answer[]>(
    initialData?.answers || [
      { answerText: '', isCorrect: true },
      { answerText: '', isCorrect: false }
    ]
  );

  const handleAddAnswer = () => {
    setAnswers([...answers, { answerText: '', isCorrect: false }]);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!questionText.trim()) {
      toast.error('Vui lòng nhập nội dung câu hỏi');
      return;
    }
    
    // Check if all answers have content
    for (let i = 0; i < answers.length; i++) {
      if (!answers[i].answerText.trim()) {
        toast.error(`Vui lòng nhập nội dung cho đáp án ${i + 1}`);
        return;
      }
    }
    
    // Check if there's at least one correct answer
    if (!answers.some(answer => answer.isCorrect)) {
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
    
    const question: Question = {
      ...(initialData?.questionId ? { questionId: initialData.questionId } : {}),
      questionText,
      explainText,
      questionType,
      answers
    };
    
    onSubmit(question);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="questionText">Nội dung câu hỏi <span className="text-red-500">*</span></Label>
        <Textarea
          id="questionText"
          className="mt-1 h-24"
          placeholder="Nhập nội dung câu hỏi"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="questionType">Loại câu hỏi <span className="text-red-500">*</span></Label>
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
      
      <div>
        <div className="flex justify-between items-center mb-2">
          <Label>Các đáp án <span className="text-red-500">*</span></Label>
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
            <div key={index} className="flex gap-3 items-center border p-3 rounded-md">
              <div className="flex-grow">
                <Input
                  placeholder={`Đáp án ${index + 1}`}
                  value={answer.answerText}
                  onChange={(e) => handleAnswerTextChange(index, e.target.value)}
                  required
                />
              </div>
              
              {questionType === 'SINGLE_CHOICE' ? (
                <div className="flex items-center gap-2">
                  <RadioGroup
                    value={answer.isCorrect ? "true" : "false"}
                    onValueChange={(value) => handleCorrectAnswerChange(index, value === "true")}
                    className="flex items-center"
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="true" id={`answer-${index}`} />
                      <Label htmlFor={`answer-${index}`} className="text-sm font-normal cursor-pointer">
                        Đáp án đúng
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Checkbox
                    id={`answer-${index}`}
                    checked={answer.isCorrect}
                    onCheckedChange={(checked) => handleCorrectAnswerChange(index, checked === true)}
                  />
                  <Label htmlFor={`answer-${index}`} className="text-sm font-normal cursor-pointer">
                    Đáp án đúng
                  </Label>
                </div>
              )}
              
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveAnswer(index)}
                className="text-red-500 hover:text-red-700 p-2"
              >
                <Trash size={16} />
              </Button>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <Label htmlFor="explainText">Giải thích (tùy chọn)</Label>
        <Textarea
          id="explainText"
          className="mt-1 h-24"
          placeholder="Nhập giải thích cho đáp án (nếu có)"
          value={explainText}
          onChange={(e) => setExplainText(e.target.value)}
        />
      </div>
      
      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Hủy
        </Button>
        <Button type="submit">
          {initialData ? 'Cập nhật' : 'Thêm mới'}
        </Button>
      </div>
    </form>
  );
};
