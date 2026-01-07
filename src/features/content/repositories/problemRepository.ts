/**
 * Problem Repository
 *
 * 試験（Problem）のAPIインターフェース層
 */

import { Problem, Question } from '../types';

/**
 * APIレスポンス型
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  timestamp: string;
}

/**
 * ページング情報
 */
export interface PaginationParams {
  page: number;
  limit: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

/**
 * ページング結果
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Problem検索フィルタ
 */
export interface ProblemFilter {
  subject?: string;
  year?: number;
  university?: string;
  status?: 'draft' | 'published' | 'archived';
  creatorId?: string;
  isPublic?: boolean;
}

/**
 * Problem作成リクエスト
 */
export interface CreateProblemRequest {
  title: string;
  subject: string;
  year: number;
  university: string;
  isPublic?: boolean;
  level?: number;
  keywords?: string[];
}

/**
 * Problem更新リクエスト
 */
export interface UpdateProblemRequest {
  title?: string;
  subject?: string;
  year?: number;
  university?: string;
  status?: 'draft' | 'published' | 'archived';
  isPublic?: boolean;
  level?: number;
  keywords?: string[];
}

/**
 * ProblemRepository インターフェース
 */
export interface IProblemRepository {
  // CRUD操作
  getById(id: string): Promise<Problem>;
  create(request: CreateProblemRequest): Promise<Problem>;
  update(id: string, request: UpdateProblemRequest): Promise<Problem>;
  delete(id: string): Promise<void>;

  // リスト取得
  list(
    pagination: PaginationParams,
    filter?: ProblemFilter
  ): Promise<PaginatedResponse<Problem>>;
  listByCreator(
    creatorId: string,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<Problem>>;
  listPublished(pagination: PaginationParams): Promise<PaginatedResponse<Problem>>;

  // 検索
  search(keyword: string, pagination: PaginationParams): Promise<PaginatedResponse<Problem>>;

  // 操作
  publish(id: string): Promise<Problem>;
  archive(id: string): Promise<Problem>;
  duplicate(id: string): Promise<Problem>;

  // バルク操作
  deleteMultiple(ids: string[]): Promise<void>;
  updateMultiple(updates: Array<{ id: string; data: UpdateProblemRequest }>): Promise<Problem[]>;
}

/**
 * ProblemRepository 実装クラス
 */
export class ProblemRepository implements IProblemRepository {
  private baseUrl = '/api/problems';
  private cache = new Map<string, Problem>();
  private cacheExpiry = new Map<string, number>();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5分

  /**
   * キャッシュから取得
   */
  private getFromCache(key: string): Problem | null {
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
  private saveToCache(key: string, value: Problem): void {
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
   * APIリクエストを実行（エラーハンドリング付き）
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

  async getById(id: string): Promise<Problem> {
    // キャッシュを確認
    const cached = this.getFromCache(id);
    if (cached) return cached;

    // APIから取得
    const problem = await this.request<Problem>('GET', `/${id}`);
    this.saveToCache(id, problem);
    return problem;
  }

  async create(request: CreateProblemRequest): Promise<Problem> {
    const problem = await this.request<Problem>('POST', '', request);
    this.saveToCache(problem.id, problem);
    return problem;
  }

  async update(id: string, request: UpdateProblemRequest): Promise<Problem> {
    const problem = await this.request<Problem>('PUT', `/${id}`, request);
    this.saveToCache(id, problem);
    return problem;
  }

  async delete(id: string): Promise<void> {
    await this.request<void>('DELETE', `/${id}`);
    this.cache.delete(id);
    this.cacheExpiry.delete(id);
  }

  async list(
    pagination: PaginationParams,
    filter?: ProblemFilter
  ): Promise<PaginatedResponse<Problem>> {
    const params = new URLSearchParams();
    params.append('page', String(pagination.page));
    params.append('limit', String(pagination.limit));
    if (pagination.sort) params.append('sort', pagination.sort);
    if (pagination.order) params.append('order', pagination.order);

    if (filter) {
      if (filter.subject) params.append('subject', filter.subject);
      if (filter.year) params.append('year', String(filter.year));
      if (filter.university) params.append('university', filter.university);
      if (filter.status) params.append('status', filter.status);
      if (filter.creatorId) params.append('creatorId', filter.creatorId);
      if (filter.isPublic !== undefined) params.append('isPublic', String(filter.isPublic));
    }

    return this.request<PaginatedResponse<Problem>>(
      'GET',
      `?${params.toString()}`
    );
  }

  async listByCreator(
    creatorId: string,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<Problem>> {
    return this.list(pagination, { creatorId });
  }

  async listPublished(pagination: PaginationParams): Promise<PaginatedResponse<Problem>> {
    return this.list(pagination, { status: 'published' });
  }

  async search(keyword: string, pagination: PaginationParams): Promise<PaginatedResponse<Problem>> {
    const params = new URLSearchParams();
    params.append('keyword', keyword);
    params.append('page', String(pagination.page));
    params.append('limit', String(pagination.limit));

    return this.request<PaginatedResponse<Problem>>(
      'GET',
      `/search?${params.toString()}`
    );
  }

  async publish(id: string): Promise<Problem> {
    const problem = await this.request<Problem>('POST', `/${id}/publish`);
    this.saveToCache(id, problem);
    return problem;
  }

  async archive(id: string): Promise<Problem> {
    const problem = await this.request<Problem>('POST', `/${id}/archive`);
    this.saveToCache(id, problem);
    return problem;
  }

  async duplicate(id: string): Promise<Problem> {
    const problem = await this.request<Problem>('POST', `/${id}/duplicate`);
    this.saveToCache(problem.id, problem);
    return problem;
  }

  async deleteMultiple(ids: string[]): Promise<void> {
    await this.request<void>('POST', '/delete-multiple', { ids });
    ids.forEach((id) => {
      this.cache.delete(id);
      this.cacheExpiry.delete(id);
    });
  }

  async updateMultiple(
    updates: Array<{ id: string; data: UpdateProblemRequest }>
  ): Promise<Problem[]> {
    const problems = await this.request<Problem[]>('POST', '/update-multiple', { updates });
    problems.forEach((problem) => {
      this.saveToCache(problem.id, problem);
    });
    return problems;
  }
}

/**
 * グローバルRepositoryインスタンス
 */
let problemRepositoryInstance: ProblemRepository | null = null;

/**
 * ProblemRepositoryインスタンスの取得
 */
export function getProblemRepository(): ProblemRepository {
  if (!problemRepositoryInstance) {
    problemRepositoryInstance = new ProblemRepository();
  }
  return problemRepositoryInstance;
}
