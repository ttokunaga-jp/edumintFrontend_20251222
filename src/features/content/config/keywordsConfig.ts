/**
 * Keywords preset configuration
 *
 * 主要科目・トピックのキーワードプリセット
 */

export interface KeywordPreset {
  category: string;
  keywords: string[];
}

export const KEYWORD_PRESETS: KeywordPreset[] = [
  {
    category: '数学',
    keywords: [
      '微積分',
      '線形代数',
      '確率統計',
      '複素数',
      '三角関数',
      '対数',
      '指数関数',
      '数列',
      '幾何',
      '方程式',
    ],
  },
  {
    category: '物理',
    keywords: [
      '力学',
      '熱力学',
      '電磁気学',
      '光学',
      '波動',
      '原子物理',
      '相対性理論',
      'エネルギー',
      '運動',
      'ニュートン',
    ],
  },
  {
    category: '化学',
    keywords: [
      '有機化学',
      '無機化学',
      '反応速度',
      '平衡',
      '酸塩基',
      'モル計算',
      '化学結合',
      '電子配置',
      'イオン',
      '化学式',
    ],
  },
  {
    category: 'プログラミング',
    keywords: [
      'アルゴリズム',
      'データ構造',
      'ソート',
      'サーチ',
      '再帰',
      'グラフ',
      '動的計画法',
      'Python',
      'JavaScript',
      'C++',
    ],
  },
  {
    category: '英語',
    keywords: [
      '文法',
      '発音',
      '語彙',
      '読解',
      '作文',
      '会話',
      '時制',
      '冠詞',
      'イディオム',
      '過去形',
    ],
  },
  {
    category: '日本語',
    keywords: [
      '文法',
      '漢字',
      '古文',
      '漢文',
      '敬語',
      '副詞',
      '助詞',
      '接続詞',
      '活用',
      '読解',
    ],
  },
];

export function getKeywordsByCategory(category: string): string[] {
  const preset = KEYWORD_PRESETS.find((p) => p.category === category);
  return preset?.keywords || [];
}

export function getAllKeywords(): string[] {
  return KEYWORD_PRESETS.reduce((acc, preset) => [...acc, ...preset.keywords], []);
}

export function getKeywordCategories(): string[] {
  return KEYWORD_PRESETS.map((p) => p.category);
}
