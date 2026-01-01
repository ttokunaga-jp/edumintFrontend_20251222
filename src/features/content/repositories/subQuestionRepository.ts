/**
 * SubQuestion Repository
 *
 * 小問（SubQuestion）のAPIインターフェース層（形式別）
 */

import {
  SubQuestion,
  SelectionSubQuestion,
  MatchingSubQuestion,
  OrderingSubQuestion,
  EssaySubQuestion,
} from '../types';
import { ApiResponse, PaginationParams, PaginatedResponse } from './problemRepository';

/**
 * SubQuestion検索フィルタ
 */
export interface SubQuestionFilter {
  questionId?: string;
  questionTypeId?: number;
  format?: 0 | 1;
  difficultySince?: number;
  difficultyUpto?: number;
}

/**
 * SubQuestion作成リクエスト（基本）
 */
export interface CreateSubQuestionRequest {
  questionId: string;
  subQuestionNumber: number;
  questionTypeId: number;
  content: string;
  format: 0 | 1;
  difficulty?: number;
  keywords?: string[];
}

/**
 * SubQuestion更新リクエスト（基本）
 */
export interface UpdateSubQuestionRequest {
  subQuestionNumber?: number;
  content?: string;
  format?: 0 | 1;
  difficulty?: number;
  keywords?: string[];
}

/**
 * 選択問題リクエスト
 */
export interface CreateSelectionSubQuestionRequest extends CreateSubQuestionRequest {
  options: Array<{ content: string; isCorrect: boolean }>;
}

/**
 * マッチング問題リクエスト
 */
export interface CreateMatchingSubQuestionRequest extends CreateSubQuestionRequest {
  pairs: Array<{ question: string; answer: string }>;
}

/**
 * 並び替え問題リクエスト
 */
export interface CreateOrderingSubQuestionRequest extends CreateSubQuestionRequest {
  items: Array<{ text: string; correctOrder: number }>;
}

/**
 * 記述問題リクエスト
 */
export interface CreateEssaySubQuestionRequest extends CreateSubQuestionRequest {
  answers: Array<{ sampleAnswer: string; gradingCriteria: string; pointValue: number }>;
}

/**
 * SubQuestionRepository インターフェース
 */
export interface ISubQuestionRepository {
  // CRUD操作
  getById(id: string): Promise<SubQuestion>;
  create(request: CreateSubQuestionRequest): Promise<SubQuestion>;
  update(id: string, request: UpdateSubQuestionRequest): Promise<SubQuestion>;
  delete(id: string): Promise<void>;

  // リスト取得
  listByQuestion(
    questionId: string,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<SubQuestion>>;
  list(
    pagination: PaginationParams,
    filter?: SubQuestionFilter
  ): Promise<PaginatedResponse<SubQuestion>>;

  // 形式別操作
  updateSelection(
    id: string,
    options: Array<{ content: string; isCorrect: boolean }>
  ): Promise<SelectionSubQuestion>;
  updateMatching(
    id: string,
    pairs: Array<{ question: string; answer: string }>
  ): Promise<MatchingSubQuestion>;
  updateOrdering(
    id: string,
    items: Array<{ text: string; correctOrder: number }>
  ): Promise<OrderingSubQuestion>;
  updateEssay(
    id: string,
    answers: Array<{ sampleAnswer: string; gradingCriteria: string; pointValue: number }>
  ): Promise<EssaySubQuestion>;

  // 操作
  duplicate(id: string): Promise<SubQuestion>;
  addKeyword(subQuestionId: string, keyword: string): Promise<SubQuestion>;
  removeKeyword(subQuestionId: string, keywordId: string): Promise<SubQuestion>;
  reorder(questionId: string, items: Array<{ id: string; newOrder: number }>): Promise<SubQuestion[]>;

  // バルク操作
  deleteMultiple(ids: string[]): Promise<void>;
  updateMultiple(
    updates: Array<{ id: string; data: UpdateSubQuestionRequest }>
  ): Promise<SubQuestion[]>;
}

/**
 * SubQuestionRepository 実装クラス
 */
export class SubQuestionRepository implements ISubQuestionRepository {
  private baseUrl = '/api/sub-questions';
  private cache = new Map<string, SubQuestion>();
  private cacheExpiry = new Map<string, number>();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5分

  /**
   * キャッシュから取得
   */
  private getFromCache(key: string): SubQuestion | null {
    const expiry = this.cacheExpiry.get(key);
    if (!expiry || Date.now() > expiry) {
      this.cache.delete(key);
      this.cacheExpiry.delete(key);
      return null;
    }
    return this.cache.get(key) || null;
  }

  /**
   * キャッシュに保存
   */
  private saveToCache(key: string, value: SubQuestion): void {
    this.cache.set(key, value);
    this.cacheExpiry.set(key, Date.now() + this.CACHE_TTL);
  }

  /**
   * キャッシュをクリア
   */
  private clearCache(): void {
    this.cache.clear();
    this.cacheExpiry.clear();
  }

  /**
   * APIリクエストを実行
   */
  private async request<T>(
    method: string,
    endpoint: string,
    data?: unknown
  ): Promise<T> {
    try {
      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (data) {
        options.body = JSON.stringify(data);
      }

      const response = await fetch(`${this.baseUrl}${endpoint}`, options);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `HTTP ${response.status}`);
      }

      const apiResponse: ApiResponse<T> = await response.json();
      if (!apiResponse.success) {
        throw new Error(apiResponse.error?.message || 'Unknown error');
      }

      return apiResponse.data as T;
    } catch (error) {
      throw new Error(`API Request Error: ${error instanceof Error ? error.message : 'Unknown'}`);
    }
  }

  async getById(id: string): Promise<SubQuestion> {
    const cached = this.getFromCache(id);
    if (cached) return cached;

    const subQuestion = await this.request<SubQuestion>('GET', `/${id}`);
    this.saveToCache(id, subQuestion);
    return subQuestion;
  }

  async create(request: CreateSubQuestionRequest): Promise<SubQuestion> {
    const subQuestion = await this.request<SubQuestion>('POST', '', request);
    this.saveToCache(subQuestion.id, subQuestion);
    return subQuestion;
  }

  async update(id: string, request: UpdateSubQuestionRequest): Promise<SubQuestion> {
    const subQuestion = await this.request<SubQuestion>('PUT', `/${id}`, request);
    this.saveToCache(id, subQuestion);
    return subQuestion;
  }

  async delete(id: string): Promise<void> {
    await this.request<void>('DELETE', `/${id}`);
    this.cache.delete(id);
    this.cacheExpiry.delete(id);
  }

  async listByQuestion(
    questionId: string,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<SubQuestion>> {
    const params = new URLSearchParams();
    params.append('questionId', questionId);
    params.append('page', String(pagination.page));
    params.append('limit', String(pagination.limit));

    return this.request<PaginatedResponse<SubQuestion>>(
      'GET',
      `?${params.toString()}`
    );
  }

  async list(
    pagination: PaginationParams,
    filter?: SubQuestionFilter
  ): Promise<PaginatedResponse<SubQuestion>> {
    const params = new URLSearchParams();
    params.append('page', String(pagination.page));
    params.append('limit', String(pagination.limit));

    if (filter) {
      if (filter.questionId) params.append('questionId', filter.questionId);
      if (filter.questionTypeId) params.append('questionTypeId', String(filter.questionTypeId));
      if (filter.format !== undefined) params.append('format', String(filter.format));
      if (filter.difficultySince) params.append('difficultySince', String(filter.difficultySince));
      if (filter.difficultyUpto) params.append('difficultyUpto', String(filter.difficultyUpto));
    }

    return this.request<PaginatedResponse<SubQuestion>>(
      'GET',
      `?${params.toString()}`
    );
  }

  async updateSelection(
    id: string,
    options: Array<{ content: string; isCorrect: boolean }>
  ): Promise<SelectionSubQuestion> {
    const subQuestion = await this.request<SelectionSubQuestion>('PUT', `/${id}/selection`, {
      options,
    });
    this.saveToCache(id, subQuestion);
    return subQuestion;
  }

  async updateMatching(
    id: string,
    pairs: Array<{ question: string; answer: string }>
  ): Promise<MatchingSubQuestion> {
    const subQuestion = await this.request<MatchingSubQuestion>('PUT', `/${id}/matching`, {
      pairs,
    });
    this.saveToCache(id, subQuestion);
    return subQuestion;
  }

  async updateOrdering(
    id: string,
    items: Array<{ text: string; correctOrder: number }>
  ): Promise<OrderingSubQuestion> {
    const subQuestion = await this.request<OrderingSubQuestion>('PUT', `/${id}/ordering`, {
      items,
    });
    this.saveToCache(id, subQuestion);
    return subQuestion;
  }

  async updateEssay(
    id: string,
    answers: Array<{ sampleAnswer: string; gradingCriteria: string; pointValue: number }>
  ): Promise<EssaySubQuestion> {
    const subQuestion = await this.request<EssaySubQuestion>('PUT', `/${id}/essay`, {
      answers,
    });
    this.saveToCache(id, subQuestion);
    return subQuestion;
  }

  async duplicate(id: string): Promise<SubQuestion> {
    const subQuestion = await this.request<SubQuestion>('POST', `/${id}/duplicate`);
    this.saveToCache(subQuestion.id, subQuestion);
    return subQuestion;
  }

  async addKeyword(subQuestionId: string, keyword: string): Promise<SubQuestion> {
    const subQuestion = await this.request<SubQuestion>(
      'POST',
      `/${subQuestionId}/keywords`,
      { keyword }
    );
    this.saveToCache(subQuestionId, subQuestion);
    return subQuestion;
  }

  async removeKeyword(subQuestionId: string, keywordId: string): Promise<SubQuestion> {
    const subQuestion = await this.request<SubQuestion>(
      'DELETE',
      `/${subQuestionId}/keywords/${keywordId}`
    );
    this.saveToCache(subQuestionId, subQuestion);
    return subQuestion;
  }

  async reorder(
    questionId: string,
    items: Array<{ id: string; newOrder: number }>
  ): Promise<SubQuestion[]> {
    const subQuestions = await this.request<SubQuestion[]>('POST', '/reorder', {
      questionId,
      items,
    });

    subQuestions.forEach((sq) => {
      this.saveToCache(sq.id, sq);
    });

    return subQuestions;
  }

  async deleteMultiple(ids: string[]): Promise<void> {
    await this.request<void>('POST', '/delete-multiple', { ids });
    ids.forEach((id) => {
      this.cache.delete(id);
      this.cacheExpiry.delete(id);
    });
  }

  async updateMultiple(
    updates: Array<{ id: string; data: UpdateSubQuestionRequest }>
  ): Promise<SubQuestion[]> {
    const subQuestions = await this.request<SubQuestion[]>('POST', '/update-multiple', {
      updates,
    });
    subQuestions.forEach((sq) => {
      this.saveToCache(sq.id, sq);
    });
    return subQuestions;
  }
}

/**
 * グローバルRepositoryインスタンス
 */
let subQuestionRepositoryInstance: SubQuestionRepository | null = null;

/**
 * SubQuestionRepositoryインスタンスの取得
 */
export function getSubQuestionRepository(): SubQuestionRepository {
  if (!subQuestionRepositoryInstance) {
    subQuestionRepositoryInstance = new SubQuestionRepository();
  }
  return subQuestionRepositoryInstance;
}
