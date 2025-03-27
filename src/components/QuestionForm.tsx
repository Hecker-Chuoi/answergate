
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Question } from '@/services/testService';
import { Trash, Plus } from 'lucide-react';
import { toast } from 'sonner';

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
  const [content, setContent] = useState(initialData?.content || '');
  const [options, setOptions] = useState<string[]>(initialData?.options || ['', '']);
  const [answer, setAnswer] = useState<number>(initialData?.answer || 0);
  const [explanation, setExplanation] = useState(initialData?.explanation || '');

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleRemoveOption = (index: number) => {
    if (options.length <= 2) {
      toast.error('Câu hỏi phải có ít nhất 2 lựa chọn');
      return;
    }
    
    const newOptions = [...options];
    newOptions.splice(index, 1);
    
    // Adjust answer if necessary
    if (answer === index) {
      setAnswer(0);
    } else if (answer > index) {
      setAnswer(answer - 1);
    }
    
    setOptions(newOptions);
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!content.trim()) {
      toast.error('Vui lòng nhập nội dung câu hỏi');
      return;
    }
    
    // Check if all options have content
    for (let i = 0; i < options.length; i++) {
      if (!options[i].trim()) {
        toast.error(`Vui lòng nhập nội dung cho lựa chọn ${i + 1}`);
        return;
      }
    }
    
    const question: Question = {
      ...(initialData?.questionId ? { questionId: initialData.questionId } : {}),
      content,
      options,
      answer,
      explanation,
      ...(initialData?.testId ? { testId: initialData.testId } : {})
    };
    
    onSubmit(question);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="content">Nội dung câu hỏi <span className="text-red-500">*</span></Label>
        <Textarea
          id="content"
          className="mt-1 h-24"
          placeholder="Nhập nội dung câu hỏi"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-2">
          <Label>Các lựa chọn <span className="text-red-500">*</span></Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddOption}
            className="flex items-center gap-1"
          >
            <Plus size={16} />
            Thêm lựa chọn
          </Button>
        </div>
        
        <div className="space-y-3">
          {options.map((option, index) => (
            <div key={index} className="flex gap-3 items-center">
              <div className="flex-grow relative">
                <Input
                  placeholder={`Lựa chọn ${index + 1}`}
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  required
                />
                <div className="absolute right-2 top-0 bottom-0 flex items-center">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveOption(index)}
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                  >
                    <Trash size={16} />
                  </Button>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id={`answer-${index}`}
                  name="answer"
                  checked={answer === index}
                  onChange={() => setAnswer(index)}
                  className="h-4 w-4 text-blue-600"
                />
                <Label htmlFor={`answer-${index}`} className="text-sm font-normal cursor-pointer">
                  Đáp án đúng
                </Label>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <Label htmlFor="explanation">Giải thích (tùy chọn)</Label>
        <Textarea
          id="explanation"
          className="mt-1 h-24"
          placeholder="Nhập giải thích cho đáp án (nếu có)"
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
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
