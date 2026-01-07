import { z } from 'zod';

/**
 * ProblemViewEditPage の Zod Schema 定義
 * 
 * これは「Source of Truth」として機能します。
 * - 型定義（TypeScript型推論）
 * - バリデーションルール
 * - デフォルト値生成
 * が一つのスキーマから導出されます。
 */

// ============ Enums ============

export const AllowedQuestionTypeIds = [0, 1, 2, 3, 4, 10, 11, 12, 13, 14] as const;

export const QuestionTypeEnum = z.number().int().refine((v) => (AllowedQuestionTypeIds as readonly number[]).includes(v), {
  message: 'Invalid question type ID',
});

// Keep legacy labels for compatibility; prefer using i18n helpers at runtime
export const QuestionTypeLabels: Record<number, string> = {
  0: '単一選択',
  1: '複数選択',
  2: '正誤判定',
  3: '組み合わせ',
  4: '順序並べ替え',
  10: '記述式',
  11: '証明問題',
  12: 'コード記述',
  13: '翻訳',
  14: '数値計算',
};

export const DifficultyEnum = z.enum(['0', '1', '2']);
export const DifficultyLabels: Record<string, string> = {
  '0': '基礎',
  '1': '標準',
  '2': '応用',
};

// ============ フォーマット別スキーマ ============

// 選択肢（ID 1/2/3用）
const SelectionOptionSchema = z.object({
  id: z.string().optional().default(''),
  content: z.string().min(1, '選択肢テキストは必須です'),
  isCorrect: z.boolean(),
});

// マッチング（ID 4用）
const MatchingPairSchema = z.object({
  id: z.string().optional().default(''),
  question: z.string().min(1, '左側のテキストは必須です'),
  answer: z.string().min(1, '右側のテキストは必須です'),
});

// 並び替え（ID 5用）
const OrderingItemSchema = z.object({
  id: z.string().optional().default(''),
  text: z.string().min(1, '順序項目は必須です'),
  correctOrder: z.number().int().positive(),
});

// 記述系（ID 10-14用）
const EssayAnswerSchema = z.object({
  id: z.string().optional().default(''),
  sampleAnswer: z.string().min(1, 'サンプル答案は必須です'),
  gradingCriteria: z.string().optional().default(''),
  pointValue: z.number().int().nonnegative(),
});

// ============ 小問スキーマ（ネスト対応） ============

export const SubQuestionSchema = z.object({
  id: z.string().optional().default(''),
  subQuestionNumber: z.number().int().positive(),
  questionTypeId: QuestionTypeEnum,
  questionContent: z.string().min(1, '問題文は必須です'),
  format: z.number().int().optional().default(0), // 0: Markdown, 1: LaTeX (legacy)
  answerContent: z.string().optional().default(''), // 「解答解説」として使用（解答例と解説を統合）
  explanation: z.string().optional().default(''), // 互換性のため保持（UI には表示しない）
  keywords: z.array(z.object({
    id: z.string().optional().default(''),
    keyword: z.string(),
  })).min(1, 'キーワードは1つ以上設定してください').optional().default([]),

  // フォーマット別データ（discriminated union に拡張可能）
  options: z.array(SelectionOptionSchema).optional().default([]),
  pairs: z.array(MatchingPairSchema).optional().default([]),
  items: z.array(OrderingItemSchema).optional().default([]),
  answers: z.array(EssayAnswerSchema).optional().default([]),
});

export type SubQuestion = z.infer<typeof SubQuestionSchema>;

// ============ 大問スキーマ ============

export const QuestionSchema = z.object({
  id: z.string().optional().default(''),
  questionNumber: z.number().int().positive(),
  questionContent: z.string().min(1, '大問内容は必須です'),
  level: DifficultyEnum.optional().default('2'),
  keywords: z.array(z.object({
    id: z.string().optional().default(''),
    keyword: z.string(),
  })).min(1, 'キーワードは1つ以上設定してください').optional().default([]),

  // ネストされた小問配列（useFieldArray対応）
  subQuestions: z.array(SubQuestionSchema),
});

export type Question = z.infer<typeof QuestionSchema>;

// ============ 試験スキーマ（ルート） ============

export const ExamSchema = z.object({
  id: z.string().optional().default(''),
  examName: z.string().min(1, '試験名は必須です'),
  examYear: z.number().int().positive(),
  examType: z.number().int().min(0).max(2).optional().default(0),
  universityName: z.string().optional().default(''),
  facultyName: z.string().optional().default(''),
  teacherName: z.string().optional().default(''),
  subjectName: z.string().optional().default(''),
  durationMinutes: z.number().int().optional().default(60),
  majorType: z.number().int().optional().default(0),
  academicFieldName: z.string().optional().default(''),
  academicFieldId: z.number().int().optional(),
  // ID fields for normalized relations (optional during transition)
  universityId: z.number().int().optional(),
  facultyId: z.number().int().optional(),
  teacherId: z.number().int().optional(),
  subjectId: z.number().int().optional(),
  questions: z.array(QuestionSchema),
  isPublic: z.boolean().optional().default(false),
});

export type ExamFormValues = z.infer<typeof ExamSchema>;

// ============ 構造確認用（Content緩和版）スキーマ ============

const StructureOptionSchema = z.object({
  id: z.string().optional().default(''),
  content: z.string().optional().default(''), // 構造確認時は必須としない
  isCorrect: z.boolean(),
});

export const StructureSubQuestionSchema = SubQuestionSchema.extend({
  questionContent: z.string().optional().default(''), // 構造確認時は必須としない
  answerContent: z.string().optional().default(''),
  options: z.array(StructureOptionSchema).optional().default([]),
});

export const StructureQuestionSchema = QuestionSchema.extend({
  questionContent: z.string().optional().default(''), // 構造確認時は必須としない
  subQuestions: z.array(StructureSubQuestionSchema),
});

export const StructureExamSchema = ExamSchema.extend({
  questions: z.array(StructureQuestionSchema),
});

// ============ デフォルト値生成ロジック ============

export const createDefaultSubQuestion = (index: number): SubQuestion => ({
  id: `temp-sq-${Date.now()}-${index}`,
  subQuestionNumber: index + 1,
  questionTypeId: 0,
  questionContent: '',
  format: 0,
  answerContent: '',
  explanation: '',
  keywords: [],
  options: [
    { id: `temp-opt-${Date.now()}-0`, content: '', isCorrect: true },
    { id: `temp-opt-${Date.now()}-1`, content: '', isCorrect: false },
  ],
});

export const createDefaultQuestion = (index: number): Question => ({
  id: `temp-q-${Date.now()}-${index}`,
  questionNumber: index + 1,
  questionContent: '',
  level: '1',
  keywords: [],
  subQuestions: [createDefaultSubQuestion(0)],
  // StructureConfirmationSchemaのために、初期状態でエラーにならないようダミーを入れるか、Schema側で緩和しているので空でOK
});

export const createDefaultExam = (): ExamFormValues => ({
  id: `temp-exam-${Date.now()}`,
  examName: '',
  examYear: new Date().getFullYear(),
  examType: 0,
  universityName: '',
  facultyName: '',
  teacherName: '',
  subjectName: '',
  durationMinutes: 60,
  majorType: 0,
  academicFieldName: '',
  academicFieldId: undefined,
  universityId: undefined,
  facultyId: undefined,
  teacherId: undefined,
  subjectId: undefined,
  questions: [createDefaultQuestion(0)],
  isPublic: false,
});
