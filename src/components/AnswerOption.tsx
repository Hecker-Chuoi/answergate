
import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface AnswerOptionProps {
  id: string;
  text: string;
  isSelected: boolean;
  onSelect: (id: string) => void;
  optionLetter: string;
}

const AnswerOption = ({ id, text, isSelected, onSelect, optionLetter }: AnswerOptionProps) => {
  return (
    <div
      className={cn(
        "option-card group",
        isSelected && "selected"
      )}
      onClick={() => onSelect(id)}
    >
      <div className="flex items-start space-x-4">
        <div className={cn(
          "flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium border-2 transition-all duration-300 ease-out",
          isSelected 
            ? "bg-primary border-primary text-white" 
            : "border-muted-foreground/30 text-muted-foreground group-hover:border-primary/70"
        )}>
          {optionLetter}
        </div>
        
        <div className="flex-grow pt-1">
          <p className="text-foreground text-base">{text}</p>
        </div>
        
        {isSelected && (
          <div className="flex-shrink-0 text-primary">
            <Check className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
};

export default AnswerOption;
