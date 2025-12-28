// @ts-nocheck
import { useState } from 'react';
import { FileCode, FileText, Edit, ChevronDown, ChevronUp, Lock } from 'lucide-react';
import { MarkdownBlock } from '@/components/common/MarkdownBlock';
import { LatexBlock } from '@/components/common/LatexBlock';

export type AnswerBlockProps = {
  subQuestionNumber: number;
  answerContent: string;
  answerFormat: 0 | 1; // 0: markdown, 1: latex
  explanation?: string;
  explanationFormat?: 0 | 1;
  isLocked?: boolean; // 広告視聴前などでロックされているか
  canEdit?: boolean;
  canSwitchFormat?: boolean;
  defaultExpanded?: boolean;
  onAnswerChange?: (content: string) => void;
  onExplanationChange?: (content: string) => void;
  onFormatChange?: (type: 'answer' | 'explanation', format: 0 | 1) => void;
  onUnlock?: () => void;
  className?: string;
};

export function AnswerBlock({
  subQuestionNumber,
  answerContent,
  answerFormat,
  explanation,
  explanationFormat = 0,
  isLocked = false,
  canEdit = false,
  canSwitchFormat = false,
  defaultExpanded = false,
  onAnswerChange,
  onExplanationChange,
  onFormatChange,
  onUnlock,
  className = '',
}: AnswerBlockProps) {
  const [currentAnswerFormat, setCurrentAnswerFormat] = useState<0 | 1>(answerFormat);
  const [currentExplanationFormat, setCurrentExplanationFormat] = useState<0 | 1>(explanationFormat);
  const [isEditingAnswer, setIsEditingAnswer] = useState(false);
  const [isEditingExplanation, setIsEditingExplanation] = useState(false);
  const [editAnswerContent, setEditAnswerContent] = useState(answerContent);
  const [editExplanationContent, setEditExplanationContent] = useState(explanation || '');
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const handleAnswerFormatToggle = () => {
    const newFormat = currentAnswerFormat === 0 ? 1 : 0;
    setCurrentAnswerFormat(newFormat);
    onFormatChange?.('answer', newFormat);
  };

  const handleExplanationFormatToggle = () => {
    const newFormat = currentExplanationFormat === 0 ? 1 : 0;
    setCurrentExplanationFormat(newFormat);
    onFormatChange?.('explanation', newFormat);
  };

  const handleAnswerSave = () => {
    onAnswerChange?.(editAnswerContent);
    setIsEditingAnswer(false);
  };

  const handleExplanationSave = () => {
    onExplanationChange?.(editExplanationContent);
    setIsEditingExplanation(false);
  };

  if (isLocked) {
    return (
      <div className={`bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg p-6 border border-amber-200 ${className}`}>
        <div style={{
      display: "flex",
      alignItems: "center"
    }}>
          <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
            <Lock className={undefined} />
          </div>
          <div>
            <h4 className={undefined}>解答を見るには</h4>
            <p className={undefined}>
              30秒の動画広告を視聴してください
            </p>
          </div>
          {onUnlock && (
            <button
              onClick={onUnlock}
              className={undefined}
            >
              広告を見て解答を表示
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-blue-50 rounded-lg border border-blue-200 overflow-hidden ${className}`}>
      {/* ヘッダー */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
      display: "flex",
      alignItems: "center",
      paddingLeft: "1rem",
      paddingRight: "1rem"
    }}>
        <div style={{
      display: "flex",
      alignItems: "center",
      gap: "0.5rem"
    }}>
          {isExpanded ? (
            <ChevronUp className={undefined} />
          ) : (
            <ChevronDown className={undefined} />
          )}
          <span className={undefined}>
            ({subQuestionNumber}) の解答を{isExpanded ? '隠す' : '表示'}
          </span>
        </div>
        <span className={undefined}>
          {isExpanded ? '▲' : '▼'}
        </span>
      </button>

      {/* 解答コンテンツ */}
      {isExpanded && (
        <div style={{
      paddingLeft: "1rem",
      paddingRight: "1rem"
    }}>
          {/* 解答 */}
          <div>
            <div style={{
      display: "flex",
      alignItems: "center"
    }}>
              <span className={undefined}>解答</span>
              <div style={{
      display: "flex",
      gap: "0.5rem"
    }}>
                {canSwitchFormat && (
                  <button
                    onClick={handleAnswerFormatToggle}
                    style={{
      display: "flex",
      alignItems: "center",
      gap: "0.25rem"
    }}>
                    {currentAnswerFormat === 0 ? (
                      <>
                        <FileText className={undefined} />
                        <span className={undefined}>MD</span>
                      </>
                    ) : (
                      <>
                        <FileCode className={undefined} />
                        <span className={undefined}>LaTeX</span>
                      </>
                    )}
                  </button>
                )}
                {canEdit && (
                  <button
                    onClick={() => setIsEditingAnswer(true)}
                    className={undefined}
                    title="編集"
                  >
                    <Edit className={undefined} />
                  </button>
                )}
              </div>
            </div>

            {isEditingAnswer ? (
              <div className={undefined}>
                <textarea
                  value={editAnswerContent}
                  onChange={(e) => setEditAnswerContent(e.target.value)}
                  className={undefined}
                  placeholder={currentAnswerFormat === 0 ? 'Markdown形式で入力...' : 'LaTeX形式で入力...'} />
                <div style={{
      display: "flex",
      gap: "0.5rem"
    }}>
                  <button
                    onClick={handleAnswerSave}
                    style={{
      paddingLeft: "1rem",
      paddingRight: "1rem",
      paddingTop: "0.5rem",
      paddingBottom: "0.5rem"
    }}>
                    保存
                  </button>
                  <button
                    onClick={() => {
                      setEditAnswerContent(answerContent);
                      setIsEditingAnswer(false);
                    }
                    style={{
      paddingLeft: "1rem",
      paddingRight: "1rem",
      paddingTop: "0.5rem",
      paddingBottom: "0.5rem"
    }}>
                    キャンセル
                  </button>
                </div>
              </div>
            ) : (
              <div className={undefined}>
                {currentAnswerFormat === 0 ? (
                  <MarkdownBlock content={answerContent} className={undefined} />
                ) : (
                  <LatexBlock content={answerContent} displayMode={false} className={undefined} />
                )}
              </div>
            )}
          </div>

          {/* 解説 */}
          {explanation && (
            <div>
              <div style={{
      display: "flex",
      alignItems: "center"
    }}>
                <span className={undefined}>解説</span>
                <div style={{
      display: "flex",
      gap: "0.5rem"
    }}>
                  {canSwitchFormat && (
                    <button
                      onClick={handleExplanationFormatToggle}
                      style={{
      display: "flex",
      alignItems: "center",
      gap: "0.25rem"
    }}>
                      {currentExplanationFormat === 0 ? (
                        <>
                          <FileText className={undefined} />
                          <span className={undefined}>MD</span>
                        </>
                      ) : (
                        <>
                          <FileCode className={undefined} />
                          <span className={undefined}>LaTeX</span>
                        </>
                      )}
                    </button>
                  )}
                  {canEdit && (
                    <button
                      onClick={() => setIsEditingExplanation(true)}
                      className={undefined}
                      title="編集"
                    >
                      <Edit className={undefined} />
                    </button>
                  )}
                </div>
              </div>

              {isEditingExplanation ? (
                <div className={undefined}>
                  <textarea
                    value={editExplanationContent}
                    onChange={(e) => setEditExplanationContent(e.target.value)}
                    className={undefined}
                    placeholder={currentExplanationFormat === 0 ? 'Markdown形式で入力...' : 'LaTeX形式で入力...'} />
                  <div style={{
      display: "flex",
      gap: "0.5rem"
    }}>
                    <button
                      onClick={handleExplanationSave}
                      style={{
      paddingLeft: "1rem",
      paddingRight: "1rem",
      paddingTop: "0.5rem",
      paddingBottom: "0.5rem"
    }}>
                      保存
                    </button>
                    <button
                      onClick={() => {
                        setEditExplanationContent(explanation);
                        setIsEditingExplanation(false);
                      }
                      style={{
      paddingLeft: "1rem",
      paddingRight: "1rem",
      paddingTop: "0.5rem",
      paddingBottom: "0.5rem"
    }}>
                      キャンセル
                    </button>
                  </div>
                </div>
              ) : (
                <div className={undefined}>
                  {currentExplanationFormat === 0 ? (
                    <MarkdownBlock content={explanation} className={undefined} />
                  ) : (
                    <LatexBlock content={explanation} displayMode={false} className={undefined} />
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
