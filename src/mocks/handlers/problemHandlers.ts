import { http, HttpResponse } from 'msw';

const apiBase = (import.meta.env?.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '') ?? 'http://localhost:3000/api';
const withBase = (path: string) => `${apiBase}${path}`;

// Mock database for problems
const problems = [
  {
    id: 'exam-1',
    title: '微分積分学 - 第3章 演習問題',
    subject: '数学',
    university: '東京大学',
    faculty: '理学部',
    type: 'exercise',
    difficulty: 'standard',
    rating: 4.5,
    likes: 120,
    comments: 15,
    views: 450,
    author: { id: 'u1', name: '佐藤花子', avatar: '/avatars/u1.jpg' },
    createdAt: '2025-11-20T10:00:00Z',
    updatedAt: '2025-11-20T10:00:00Z',
    content: '関数の極限と連続性についての問題セットです。',
    description: '微分積分学の基礎となる極限と連続性について学習します。',
    tags: ['微分積分', '極限', '連続性', '証明'],
    isPublic: true,
    questions: [
      {
        id: 'q1',
        text: 'f(x) = x^2 の x=2 における連続性を証明せよ。',
        type: 'proof',
        points: 10,
      },
    ],
  },
  {
    id: 'exam-2',
    title: '線形代数 - 固有値と固有ベクトル',
    subject: '数学',
    university: '京都大学',
    faculty: '工学部',
    type: 'past_exam',
    difficulty: 'difficult',
    rating: 4.8,
    likes: 85,
    comments: 8,
    views: 320,
    author: { id: 'u2', name: '鈴木一郎', avatar: '/avatars/u2.jpg' },
    createdAt: '2025-11-21T14:30:00Z',
    updatedAt: '2025-11-21T14:30:00Z',
    content: '行列の対角化とジョルダン標準形に関する演習。',
    description: '固有値問題の理論と応用を学びます。',
    tags: ['線形代数', '固有値', '固有ベクトル', '対角化'],
    isPublic: true,
    questions: [
      {
        id: 'q1',
        text: '次の行列の固有値を求めよ。A = [[2,1],[1,2]]',
        type: 'calculation',
        points: 20,
      },
    ],
  },
  {
    id: 'exam-3',
    title: '力学 - 剛体の運動',
    subject: '物理学',
    university: '東京理科大学',
    faculty: '理学部',
    type: 'exercise',
    difficulty: 'standard',
    rating: 4.2,
    likes: 45,
    comments: 3,
    views: 180,
    author: { id: 'u3', name: '田中次郎', avatar: undefined },
    createdAt: '2025-11-22T09:00:00Z',
    updatedAt: '2025-11-22T09:00:00Z',
    content: '慣性モーメントの計算と回転運動の方程式。',
    description: '剛体の力学について学習します。',
    tags: ['力学', '剛体', '慣性モーメント', '回転運動'],
    isPublic: true,
    questions: [
      {
        id: 'q1',
        text: '半径Rの円盤の慣性モーメントを求めよ。',
        type: 'calculation',
        points: 15,
      },
    ],
  },
  {
    id: 'exam-4',
    title: '有機化学 - 反応機構',
    subject: '化学',
    university: '早稲田大学',
    faculty: '理工学部',
    type: 'exercise',
    difficulty: 'applied',
    rating: 4.6,
    likes: 92,
    comments: 12,
    views: 280,
    author: { id: 'u1', name: '佐藤花子', avatar: '/avatars/u1.jpg' },
    createdAt: '2025-11-23T11:00:00Z',
    updatedAt: '2025-11-23T11:00:00Z',
    content: 'SN1、SN2反応の反応機構と立体化学について学びます。',
    description: '求核置換反応の詳細な機構を理解します。',
    tags: ['有機化学', '反応機構', 'SN1', 'SN2', '立体化学'],
    isPublic: true,
    questions: [
      {
        id: 'q1',
        text: 'SN1反応とSN2反応の違いを説明せよ。',
        type: 'descriptive',
        points: 10,
      },
    ],
  },
];

export const problemHandlers = [
  // Get all problems (simplified search/list)
  http.get(withBase('/problems'), () => {
    return HttpResponse.json(problems);
  }),

  // Search problems (useContent フックで使用)
  http.get(withBase('/search/problems'), ({ request }) => {
    const url = new URL(request.url);
    const keyword = url.searchParams.get('keyword') || '';
    const page = Number(url.searchParams.get('page') || '1');
    const limit = Number(url.searchParams.get('limit') || '20');
    const sortBy = url.searchParams.get('sortBy') || 'newest';

    // Additional filters
    const subjects = url.searchParams.getAll('subjects[]');
    const universities = url.searchParams.getAll('universities[]');
    const faculties = url.searchParams.getAll('faculties[]');
    const formats = url.searchParams.getAll('formats[]');
    const difficulty = url.searchParams.get('level');
    const professor = url.searchParams.get('professor');
    const year = url.searchParams.get('year');
    const fieldType = url.searchParams.get('fieldType');
    const duration = url.searchParams.get('duration');
    const period = url.searchParams.get('period');
    const isLearned = url.searchParams.get('isLearned') === 'true';
    const isHighRating = url.searchParams.get('isHighRating') === 'true';
    const isCommented = url.searchParams.get('isCommented') === 'true';
    const isPosted = url.searchParams.get('isPosted') === 'true';
    const language = url.searchParams.get('language');

    // キーワードでフィルター
    let filtered = problems;
    if (keyword.trim()) {
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(keyword.toLowerCase()) ||
          p.description?.toLowerCase().includes(keyword.toLowerCase())
      );
    }

    // Apply advanced filters
    if (subjects.length > 0) {
      const subjectMap: Record<string, string> = {
        math: '数学', physics: '物理学', chemistry: '化学', biology: '生物',
        english: '英語', history: '歴史', geography: '地理', japanese: '国語'
      };
      const targetSubjects = subjects.map(s => subjectMap[s] || s);
      filtered = filtered.filter(p => targetSubjects.some(t => p.subject.includes(t)));
    }

    if (universities.length > 0) {
      const uniMap: Record<string, string> = {
        tokyo: '東京大学', kyoto: '京都大学', osaka: '大阪大学',
        tohoku: '東北大学', keio: '慶應義塾大学', waseda: '早稲田大学'
      };
      const targetUnis = universities.map(u => uniMap[u] || u);
      filtered = filtered.filter(p => targetUnis.some(u => p.university.includes(u)));
    }

    if (faculties.length > 0) {
      filtered = filtered.filter(p => faculties.some(f => p.description?.includes(f)));
    }

    if (professor) {
      filtered = filtered.filter(p => p.author.name.includes(professor));
    }

    if (year) {
      filtered = filtered.filter(p => p.createdAt.includes(year));
    }

    if (fieldType) {
      filtered = filtered.filter(p => p.tags?.includes(fieldType));
    }

    if (difficulty) {
      if (difficulty === 'advanced') {
        filtered = filtered.filter(p => p.difficulty === 'difficult' || p.difficulty === 'applied');
      } else {
        filtered = filtered.filter(p => p.difficulty === difficulty);
      }
    }

    if (formats.length > 0) {
      // Mock logic: check if any question matches the format
      filtered = filtered.filter(p => p.questions?.some(q => formats.includes(q.type)));
    }

    if (duration) {
      // Mock logic: filter by views as a proxy for duration
      if (duration === 'short') filtered = filtered.filter(p => (p.views || 0) < 100);
      else if (duration === 'medium') filtered = filtered.filter(p => (p.views || 0) >= 100 && (p.views || 0) < 300);
      else if (duration === 'long') filtered = filtered.filter(p => (p.views || 0) >= 300);
    }

    if (period && period !== 'none') {
      const now = new Date();
      let cutoff = new Date(0);
      if (period === '1day') cutoff = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      else if (period === '1week') cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      else if (period === '1month') {
        const d = new Date();
        d.setMonth(d.getMonth() - 1);
        cutoff = d;
      }
      else if (period === '1year') {
        const d = new Date();
        d.setFullYear(d.getFullYear() - 1);
        cutoff = d;
      }
      
      if (period !== 'custom') {
        filtered = filtered.filter(p => new Date(p.createdAt) >= cutoff);
      }
    }

    if (isLearned) {
      // Mock: even IDs are learned
      filtered = filtered.filter(p => parseInt(p.id.replace('exam-', '')) % 2 === 0);
    }
    if (isHighRating) {
      filtered = filtered.filter(p => (p.rating || 0) >= 4.5);
    }
    if (isCommented) {
      filtered = filtered.filter(p => (p.comments || 0) > 0);
    }
    if (isPosted) {
      // Mock: odd IDs are posted
      filtered = filtered.filter(p => parseInt(p.id.replace('exam-', '')) % 2 !== 0);
    }
    if (language) {
      // Mock: assume all are 'ja' for now
      if (language !== 'ja') filtered = [];
    }

    // ソート
    if (sortBy === 'popular') {
      filtered = filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === 'recommended') {
      filtered = filtered.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    } else if (sortBy === 'views') {
      filtered = filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
    } else {
      // newest がデフォルト
      filtered = filtered.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    // ページネーション
    const total = filtered.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    // Map to response format (add authorName)
    const items = filtered.slice(startIndex, endIndex).map(p => ({
      ...p,
      authorName: p.author.name // Flatten for frontend
    }));

    return HttpResponse.json({
      data: items,
      total,
      page,
      limit,
      hasMore: endIndex < total,
    });
  }),

  // Get single problem by ID
  http.get(withBase('/problems/:id'), ({ params }) => {
    const { id } = params;
    const problem = problems.find((p) => p.id === id);
    if (!problem) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(problem);
  }),

  // Create new problem (mock)
  http.post(withBase('/problems'), async ({ request }) => {
    const newProblem = (await request.json()) as any;
    newProblem.id = `exam-${problems.length + 1}`;
    newProblem.createdAt = new Date().toISOString();
    problems.push(newProblem);
    return HttpResponse.json(newProblem, { status: 201 });
  }),

  // Update problem (mock)
  http.put(withBase('/problems/:id'), async ({ params, request }) => {
    const { id } = params;
    const updateData = (await request.json()) as any;
    const index = problems.findIndex((p) => p.id === id);
    if (index === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    problems[index] = { ...problems[index], ...updateData };
    return HttpResponse.json(problems[index]);
  }),
];
