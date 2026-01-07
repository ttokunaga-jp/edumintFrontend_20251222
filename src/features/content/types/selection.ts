/**
 * Selection question type (ID: 0, 1, 2) - shifted to 0-based
 *
 * 0: Single choice
 * 1: Multiple choice
 * 2: True/False
 */

import { SubQuestion } from './problem';

export interface SelectionOption {
  id: string;
  content: string; // LaTeX/Markdown対応
  isCorrect: boolean;
  order?: number;
}

export interface SelectionSubQuestion extends SubQuestion {
  questionTypeId: 0 | 1 | 2;
  options: SelectionOption[];
}

export interface SelectionFormData {
  id: string;
  content: string;
  options: SelectionOption[];
} 

export interface SelectionValidation {
  isValid: boolean;
  errors: {
    content?: string[];
    options?: {
      [optionId: string]: string[];
    };
    correctAnswers?: string[];
  };
}
