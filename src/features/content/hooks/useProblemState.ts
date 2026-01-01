/**
 * useProblemState hook
 *
 * 試験全体の状態管理
 */

import { useState, useCallback } from 'react';
import { Problem, Question, ProblemEditorState } from '../types';

export interface UseProblemStateReturn {
  state: ProblemEditorState;
  updateTitle: (title: string) => void;
  updateSubject: (subject: string) => void;
  updateYear: (year: number) => void;
  updateUniversity: (university: string) => void;
  addQuestion: (question: Question) => void;
  updateQuestion: (questionId: string, updates: Partial<Question>) => void;
  removeQuestion: (questionId: string) => void;
  reorderQuestions: (questions: Question[]) => void;
  markDirty: () => void;
  markClean: () => void;
  reset: (problem: Problem) => void;
  isDirty: boolean;
  problem: Problem;
}

/**
 * 試験全体の状態を管理
 *
 * @param initialProblem - 初期試験データ
 * @returns 試験状態管理オブジェクト
 */
export function useProblemState(initialProblem: Problem): UseProblemStateReturn {
  const [state, setState] = useState<ProblemEditorState>({
    problem: { ...initialProblem },
    isDirty: false,
    unsavedChanges: new Set(),
    lastSavedAt: new Date().toISOString(),
  });

  const updateTitle = useCallback((title: string) => {
    setState((prev) => {
      const unsavedChanges = new Set(prev.unsavedChanges);
      unsavedChanges.add('title');
      return {
        problem: { ...prev.problem, title },
        isDirty: true,
        unsavedChanges,
        lastSavedAt: prev.lastSavedAt,
      };
    });
  }, []);

  const updateSubject = useCallback((subject: string) => {
    setState((prev) => {
      const unsavedChanges = new Set(prev.unsavedChanges);
      unsavedChanges.add('subject');
      return {
        problem: { ...prev.problem, subject },
        isDirty: true,
        unsavedChanges,
        lastSavedAt: prev.lastSavedAt,
      };
    });
  }, []);

  const updateYear = useCallback((year: number) => {
    setState((prev) => {
      const unsavedChanges = new Set(prev.unsavedChanges);
      unsavedChanges.add('year');
      return {
        problem: { ...prev.problem, year },
        isDirty: true,
        unsavedChanges,
        lastSavedAt: prev.lastSavedAt,
      };
    });
  }, []);

  const updateUniversity = useCallback((university: string) => {
    setState((prev) => {
      const unsavedChanges = new Set(prev.unsavedChanges);
      unsavedChanges.add('university');
      return {
        problem: { ...prev.problem, university },
        isDirty: true,
        unsavedChanges,
        lastSavedAt: prev.lastSavedAt,
      };
    });
  }, []);

  const addQuestion = useCallback((question: Question) => {
    setState((prev) => {
      const unsavedChanges = new Set(prev.unsavedChanges);
      unsavedChanges.add(`question_add_${question.id}`);
      return {
        problem: {
          ...prev.problem,
          questions: [...prev.problem.questions, question],
        },
        isDirty: true,
        unsavedChanges,
        lastSavedAt: prev.lastSavedAt,
      };
    });
  }, []);

  const updateQuestion = useCallback((questionId: string, updates: Partial<Question>) => {
    setState((prev) => {
      const unsavedChanges = new Set(prev.unsavedChanges);
      unsavedChanges.add(`question_update_${questionId}`);
      return {
        problem: {
          ...prev.problem,
          questions: prev.problem.questions.map((q) =>
            q.id === questionId ? { ...q, ...updates } : q
          ),
        },
        isDirty: true,
        unsavedChanges,
        lastSavedAt: prev.lastSavedAt,
      };
    });
  }, []);

  const removeQuestion = useCallback((questionId: string) => {
    setState((prev) => {
      const unsavedChanges = new Set(prev.unsavedChanges);
      unsavedChanges.add(`question_remove_${questionId}`);
      return {
        problem: {
          ...prev.problem,
          questions: prev.problem.questions.filter((q) => q.id !== questionId),
        },
        isDirty: true,
        unsavedChanges,
        lastSavedAt: prev.lastSavedAt,
      };
    });
  }, []);

  const reorderQuestions = useCallback((questions: Question[]) => {
    setState((prev) => {
      const unsavedChanges = new Set(prev.unsavedChanges);
      unsavedChanges.add('questions_reorder');
      return {
        problem: {
          ...prev.problem,
          questions,
        },
        isDirty: true,
        unsavedChanges,
        lastSavedAt: prev.lastSavedAt,
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
      unsavedChanges: new Set(),
      lastSavedAt: new Date().toISOString(),
    }));
  }, []);

  const reset = useCallback((problem: Problem) => {
    setState({
      problem: { ...problem },
      isDirty: false,
      unsavedChanges: new Set(),
      lastSavedAt: new Date().toISOString(),
    });
  }, []);

  return {
    state,
    updateTitle,
    updateSubject,
    updateYear,
    updateUniversity,
    addQuestion,
    updateQuestion,
    removeQuestion,
    reorderQuestions,
    markDirty,
    markClean,
    reset,
    isDirty: state.isDirty,
    problem: state.problem,
  };
}
