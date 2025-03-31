
import React, { useState, useEffect } from 'react';
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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface QuestionEditorItemProps {
  question: Question;
  onSave: (updatedQuestion: Question) => void;
  onDelete: () => void;
}

const QuestionEditorItem: React.FC<QuestionEditorItemProps> = ({
  question,
  onSave,
  onDelete
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [questionText, setQuestionText] = useState(question.questionText);
  const [explainText, setExplainText] = useState(question.explainText || '');
  const [questionType, setQuestionType] = useState<'SINGLE_CHOICE' | 'MULTIPLE_CHOICES'>(question.questionType);
  const [answers, setAnswers] = useState<Answer[]>([...question.answers]);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Reset form when question changes
  useEffect(() => {
    setQuestionText(question.questionText);
    setExplainText(question.explainText || '');
    setQuestionType(question.questionType);
    setAnswers([...question.answers]);
  }, [question]);

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
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset form to original values
    setQuestionText(question.questionText);
    setExplainText(question.explainText || '');
    setQuestionType(question.questionType);
    setAnswers([...question.answers]);
    setIsEditing(false);
  };
  
  const letterMap = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

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
                    placeholder={`Đáp án ${letterMap[index]}`}
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
          <Button variant="outline" onClick={handleCancel} className="flex items-center gap-1">
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
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsEditing(true)} 
            className="text-gray-500 hover:text-blue-500"
          >
            <Edit size={16} />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setConfirmDelete(true)} 
            className="text-gray-500 hover:text-red-500"
          >
            <Trash size={16} />
          </Button>
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
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-sm",
                  answer.isCorrect ? "bg-green-500 text-white" : "bg-gray-100 text-gray-700"
                )}>
                  {letterMap[index]}
                </div>
                <span className={answer.isCorrect ? "font-medium" : ""}>
                  {answer.answerText}
                </span>
              </div>
            </div>
            {answer.isCorrect && (
              <div className="text-green-600 text-xs font-medium px-2 py-1 bg-green-50 rounded-full">
                Đáp án đúng
              </div>
            )}
          </div>
        ))}
      </div>
      
      {explainText && (
        <div className="bg-gray-50 p-3 rounded-md mt-3 text-sm">
          <div className="font-medium mb-1">Giải thích:</div>
          <p>{explainText}</p>
        </div>
      )}

      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa câu hỏi</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa câu hỏi này không? Thao tác này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDelete(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={onDelete}>
              Xóa câu hỏi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuestionEditorItem;
