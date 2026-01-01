import { useEffect, useRef, useCallback, useState } from 'react';

/**
 * useDebounce
 *
 * 指定時間内の連続呼び出しを1回にまとめる Hook
 */
export const useDebounce = <T,>(value: T, delay: number = 300): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

/**
 * useDebouncedCallback
 *
 * コールバック関数をデバウンスする Hook
 */
export const useDebouncedCallback = <T extends (...args: any[]) => void>(
  callback: T,
  delay: number = 300
): T => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  return useCallback(
    ((...args: any[]) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    }) as T,
    [callback, delay]
  );
};

/**
 * useLocalStorage
 *
 * localStorage をリアクティブに操作する Hook
 */
export const useLocalStorage = <T,>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Failed to read from localStorage:', error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error('Failed to write to localStorage:', error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue];
};

/**
 * usePrevious
 *
 * 前のレンダリングの値を取得する Hook
 */
export const usePrevious = <T,>(value: T): T | undefined => {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};

/**
 * useAsync
 *
 * 非同期処理の状態管理 Hook
 */
interface UseAsyncState<T> {
  status: 'idle' | 'pending' | 'success' | 'error';
  data: T | null;
  error: Error | null;
}

export const useAsync = <T,>(
  asyncFunction: () => Promise<T>,
  immediate: boolean = true
): UseAsyncState<T> & { execute: () => Promise<void> } => {
  const [state, setState] = useState<UseAsyncState<T>>({
    status: 'idle',
    data: null,
    error: null,
  });

  const execute = useCallback(async () => {
    setState({ status: 'pending', data: null, error: null });
    try {
      const result = await asyncFunction();
      setState({ status: 'success', data: result, error: null });
    } catch (error) {
      setState({ status: 'error', data: null, error: error as Error });
    }
  }, [asyncFunction]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { ...state, execute };
};

/**
 * useKeyboardShortcut
 *
 * キーボードショートカットを処理する Hook
 * Ctrl+S（保存）など
 */
export const useKeyboardShortcut = (
  shortcuts: Record<string, (e: KeyboardEvent) => void>
): void => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+S / Cmd+S
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        shortcuts['save']?.(e);
      }

      // Ctrl+B / Cmd+B
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        shortcuts['bold']?.(e);
      }

      // Ctrl+I / Cmd+I
      if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
        e.preventDefault();
        shortcuts['italic']?.(e);
      }

      // Ctrl+Z / Cmd+Z (undo)
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        shortcuts['undo']?.(e);
      }

      // Ctrl+Y / Cmd+Y (redo)
      if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        shortcuts['redo']?.(e);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
};

/**
 * useUndo
 *
 * Undo/Redo機能を提供する Hook
 */
interface UseUndoState<T> {
  present: T;
  past: T[];
  future: T[];
}

export const useUndo = <T,>(
  initialState: T
): UseUndoState<T> & {
  setState: (state: T) => void;
  undo: () => void;
  redo: () => void;
} => {
  const [state, setState] = useState<UseUndoState<T>>({
    present: initialState,
    past: [],
    future: [],
  });

  const setPresent = useCallback((newValue: T) => {
    setState((prevState) => ({
      past: [...prevState.past, prevState.present],
      present: newValue,
      future: [],
    }));
  }, []);

  const undo = useCallback(() => {
    setState((prevState) => {
      if (prevState.past.length === 0) return prevState;

      const newPresent = prevState.past[prevState.past.length - 1];
      const newPast = prevState.past.slice(0, -1);

      return {
        past: newPast,
        present: newPresent,
        future: [prevState.present, ...prevState.future],
      };
    });
  }, []);

  const redo = useCallback(() => {
    setState((prevState) => {
      if (prevState.future.length === 0) return prevState;

      const newPresent = prevState.future[0];
      const newFuture = prevState.future.slice(1);

      return {
        past: [...prevState.past, prevState.present],
        present: newPresent,
        future: newFuture,
      };
    });
  }, []);

  return { ...state, setState: setPresent, undo, redo };
};
