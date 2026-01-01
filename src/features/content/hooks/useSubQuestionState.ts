/**
 * useSubQuestionState hook
 *
 * 小問単位の状態管理（形式別）
 */

import { useState, useCallback } from 'react';
import { SubQuestion, SubQuestionEditState } from '../types';
import {
  SelectionSubQuestion,
  SelectionOption,
} from '../types/selection';
import {
  MatchingSubQuestion,
  MatchingPair,
} from '../types/matching';
import {
  OrderingSubQuestion,
  OrderingItem,
} from '../types/ordering';
import {
  EssaySubQuestion,
  EssayAnswer,
} from '../types/essay';

export type SubQuestionStateType =
  | SelectionSubQuestion
  | MatchingSubQuestion
  | OrderingSubQuestion
  | EssaySubQuestion;

export interface UseSubQuestionStateReturn {
  state: SubQuestionEditState;
  updateContent: (content: string) => void;
  updateAnswerDescription: (description: string) => void;
  // Selection methods
  addOption?: (content: string) => void;
  updateOption?: (optionId: string, content: string, isCorrect: boolean) => void;
  removeOption?: (optionId: string) => void;
  // Matching methods
  addPair?: (question: string, answer: string) => void;
  updatePair?: (pairId: string, question: string, answer: string) => void;
  removePair?: (pairId: string) => void;
  // Ordering methods
  addItem?: (text: string) => void;
  updateItem?: (itemId: string, text: string, correctOrder: number) => void;
  removeItem?: (itemId: string) => void;
  reorderItems?: (items: OrderingItem[]) => void;
  // Essay methods
  addAnswer?: (sampleAnswer: string, gradingCriteria: string) => void;
  updateAnswer?: (answerId: string, sampleAnswer: string, gradingCriteria: string) => void;
  removeAnswer?: (answerId: string) => void;
  // Common methods
  markDirty: () => void;
  markClean: () => void;
  reset: (subQuestion: SubQuestionStateType) => void;
}

/**
 * 小問の状態を形式別に管理
 *
 * @param initialSubQuestion - 初期小問データ
 * @returns 小問状態管理オブジェクト
 */
export function useSubQuestionState(
  initialSubQuestion: SubQuestionStateType
): UseSubQuestionStateReturn {
  const [state, setState] = useState<SubQuestionEditState>({
    subQuestion: { ...initialSubQuestion },
    isDirty: false,
    unsavedFields: new Set(),
  });

  const updateContent = useCallback((content: string) => {
    setState((prev) => {
      const unsavedFields = new Set(prev.unsavedFields);
      unsavedFields.add('content');
      return {
        subQuestion: { ...prev.subQuestion, content },
        isDirty: true,
        unsavedFields,
      };
    });
  }, []);

  const updateAnswerDescription = useCallback((description: string) => {
    setState((prev) => {
      const unsavedFields = new Set(prev.unsavedFields);
      unsavedFields.add('answerDescription');
      return {
        subQuestion: { ...prev.subQuestion, answerDescription: description },
        isDirty: true,
        unsavedFields,
      };
    });
  }, []);

  // Selection用メソッド
  const addOption = useCallback((content: string) => {
    const subQ = state.subQuestion as SelectionSubQuestion;
    if (subQ.options === undefined) return;

    setState((prev) => {
      const unsavedFields = new Set(prev.unsavedFields);
      unsavedFields.add('options');
      const prevSubQ = prev.subQuestion as SelectionSubQuestion;
      return {
        subQuestion: {
          ...prevSubQ,
          options: [
            ...prevSubQ.options,
            {
              id: `option-${Date.now()}`,
              content,
              isCorrect: false,
              order: prevSubQ.options.length,
            },
          ],
        } as SelectionSubQuestion,
        isDirty: true,
        unsavedFields,
      };
    });
  }, [state.subQuestion]);

  const updateOption = useCallback(
    (optionId: string, content: string, isCorrect: boolean) => {
      const subQ = state.subQuestion as SelectionSubQuestion;
      if (subQ.options === undefined) return;

      setState((prev) => {
        const unsavedFields = new Set(prev.unsavedFields);
        unsavedFields.add('options');
        const prevSubQ = prev.subQuestion as SelectionSubQuestion;
        return {
          subQuestion: {
            ...prevSubQ,
            options: prevSubQ.options.map((opt) =>
              opt.id === optionId ? { ...opt, content, isCorrect } : opt
            ),
          } as SelectionSubQuestion,
          isDirty: true,
          unsavedFields,
        };
      });
    },
    [state.subQuestion]
  );

  const removeOption = useCallback((optionId: string) => {
    setState((prev) => {
      const unsavedFields = new Set(prev.unsavedFields);
      unsavedFields.add('options');
      const prevSubQ = prev.subQuestion as SelectionSubQuestion;
      return {
        subQuestion: {
          ...prevSubQ,
          options: prevSubQ.options.filter((opt) => opt.id !== optionId),
        } as SelectionSubQuestion,
        isDirty: true,
        unsavedFields,
      };
    });
  }, []);

  // Matching用メソッド
  const addPair = useCallback((question: string, answer: string) => {
    setState((prev) => {
      const unsavedFields = new Set(prev.unsavedFields);
      unsavedFields.add('pairs');
      const prevSubQ = prev.subQuestion as MatchingSubQuestion;
      return {
        subQuestion: {
          ...prevSubQ,
          pairs: [
            ...prevSubQ.pairs,
            {
              id: `pair-${Date.now()}`,
              question,
              answer,
              order: prevSubQ.pairs.length,
            },
          ],
        } as MatchingSubQuestion,
        isDirty: true,
        unsavedFields,
      };
    });
  }, []);

  const updatePair = useCallback(
    (pairId: string, question: string, answer: string) => {
      setState((prev) => {
        const unsavedFields = new Set(prev.unsavedFields);
        unsavedFields.add('pairs');
        const prevSubQ = prev.subQuestion as MatchingSubQuestion;
        return {
          subQuestion: {
            ...prevSubQ,
            pairs: prevSubQ.pairs.map((p) =>
              p.id === pairId ? { ...p, question, answer } : p
            ),
          } as MatchingSubQuestion,
          isDirty: true,
          unsavedFields,
        };
      });
    },
    []
  );

  const removePair = useCallback((pairId: string) => {
    setState((prev) => {
      const unsavedFields = new Set(prev.unsavedFields);
      unsavedFields.add('pairs');
      const prevSubQ = prev.subQuestion as MatchingSubQuestion;
      return {
        subQuestion: {
          ...prevSubQ,
          pairs: prevSubQ.pairs.filter((p) => p.id !== pairId),
        } as MatchingSubQuestion,
        isDirty: true,
        unsavedFields,
      };
    });
  }, []);

  // Ordering用メソッド
  const addItem = useCallback((text: string) => {
    setState((prev) => {
      const unsavedFields = new Set(prev.unsavedFields);
      unsavedFields.add('items');
      const prevSubQ = prev.subQuestion as OrderingSubQuestion;
      return {
        subQuestion: {
          ...prevSubQ,
          items: [
            ...prevSubQ.items,
            {
              id: `item-${Date.now()}`,
              text,
              correctOrder: prevSubQ.items.length,
            },
          ],
        } as OrderingSubQuestion,
        isDirty: true,
        unsavedFields,
      };
    });
  }, []);

  const updateItem = useCallback(
    (itemId: string, text: string, correctOrder: number) => {
      setState((prev) => {
        const unsavedFields = new Set(prev.unsavedFields);
        unsavedFields.add('items');
        const prevSubQ = prev.subQuestion as OrderingSubQuestion;
        return {
          subQuestion: {
            ...prevSubQ,
            items: prevSubQ.items.map((item) =>
              item.id === itemId ? { ...item, text, correctOrder } : item
            ),
          } as OrderingSubQuestion,
          isDirty: true,
          unsavedFields,
        };
      });
    },
    []
  );

  const removeItem = useCallback((itemId: string) => {
    setState((prev) => {
      const unsavedFields = new Set(prev.unsavedFields);
      unsavedFields.add('items');
      const prevSubQ = prev.subQuestion as OrderingSubQuestion;
      return {
        subQuestion: {
          ...prevSubQ,
          items: prevSubQ.items.filter((item) => item.id !== itemId),
        } as OrderingSubQuestion,
        isDirty: true,
        unsavedFields,
      };
    });
  }, []);

  const reorderItems = useCallback((items: OrderingItem[]) => {
    setState((prev) => {
      const unsavedFields = new Set(prev.unsavedFields);
      unsavedFields.add('items');
      const prevSubQ = prev.subQuestion as OrderingSubQuestion;
      return {
        subQuestion: {
          ...prevSubQ,
          items,
        } as OrderingSubQuestion,
        isDirty: true,
        unsavedFields,
      };
    });
  }, []);

  // Essay用メソッド
  const addAnswer = useCallback((sampleAnswer: string, gradingCriteria: string) => {
    setState((prev) => {
      const unsavedFields = new Set(prev.unsavedFields);
      unsavedFields.add('answers');
      const prevSubQ = prev.subQuestion as EssaySubQuestion;
      return {
        subQuestion: {
          ...prevSubQ,
          answers: [
            ...prevSubQ.answers,
            {
              id: `answer-${Date.now()}`,
              sampleAnswer,
              gradingCriteria,
              pointValue: 0,
            },
          ],
        } as EssaySubQuestion,
        isDirty: true,
        unsavedFields,
      };
    });
  }, []);

  const updateAnswer = useCallback(
    (answerId: string, sampleAnswer: string, gradingCriteria: string) => {
      setState((prev) => {
        const unsavedFields = new Set(prev.unsavedFields);
        unsavedFields.add('answers');
        const prevSubQ = prev.subQuestion as EssaySubQuestion;
        return {
          subQuestion: {
            ...prevSubQ,
            answers: prevSubQ.answers.map((ans) =>
              ans.id === answerId ? { ...ans, sampleAnswer, gradingCriteria } : ans
            ),
          } as EssaySubQuestion,
          isDirty: true,
          unsavedFields,
        };
      });
    },
    []
  );

  const removeAnswer = useCallback((answerId: string) => {
    setState((prev) => {
      const unsavedFields = new Set(prev.unsavedFields);
      unsavedFields.add('answers');
      const prevSubQ = prev.subQuestion as EssaySubQuestion;
      return {
        subQuestion: {
          ...prevSubQ,
          answers: prevSubQ.answers.filter((ans) => ans.id !== answerId),
        } as EssaySubQuestion,
        isDirty: true,
        unsavedFields,
      };
    });
  }, []);

  const markDirty = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isDirty: true,
    }));
  }, []);

  const markClean = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isDirty: false,
      unsavedFields: new Set(),
    }));
  }, []);

  const reset = useCallback((subQuestion: SubQuestionStateType) => {
    setState({
      subQuestion: { ...subQuestion },
      isDirty: false,
      unsavedFields: new Set(),
    });
  }, []);

  return {
    state,
    updateContent,
    updateAnswerDescription,
    addOption,
    updateOption,
    removeOption,
    addPair,
    updatePair,
    removePair,
    addItem,
    updateItem,
    removeItem,
    reorderItems,
    addAnswer,
    updateAnswer,
    removeAnswer,
    markDirty,
    markClean,
    reset,
  };
}
