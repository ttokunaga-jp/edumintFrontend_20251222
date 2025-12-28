// @ts-nocheck
import { useState } from 'react';
import { Settings, ChevronDown, ChevronUp, Info } from 'lucide-react';

export type ProblemSettings = {
  autoGenerateQuestions: boolean; // 自動問題生成
  questionCount?: number; // 生成する問題数
  includeAnswers: boolean; // 解答を含める
  includeSolutions: boolean; // 解説を含める
  difficultyLevel: number; // 1: 基礎, 2: 応用, 3: 発展
  questionTypes: number[]; // 問題形式ID配列
  extractKeywords: boolean; // キーワード自動抽出
  isPublic: boolean; // 公開設定
};

export type ProblemSettingsBlockProps = {
  settings: ProblemSettings;
  onChange: (settings: ProblemSettings) => void;
  className?: string;
};

const difficultyOptions = [
  { value: 1, label: '基礎', description: '基本的な問題を生成' },
  { value: 2, label: '応用', description: '標準的な問題を生成' },
  { value: 3, label: '発展', description: '難易度の高い問題を生成' },
];

const questionTypeOptions = [
  { id: 1, name: '記述式' },
  { id: 2, name: '選択式' },
  { id: 3, name: '穴埋め' },
  { id: 4, name: '論述式' },
  { id: 5, name: '証明問題' },
  { id: 6, name: '数値計算式' },
];

export function ProblemSettingsBlock({ settings, onChange, className = '' }: ProblemSettingsBlockProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleToggle = (key: keyof ProblemSettings) => {
    onChange({
      ...settings,
      [key]: !settings[key as keyof typeof settings],
    });
  };

  const handleNumberChange = (key: keyof ProblemSettings, value: number) => {
    onChange({
      ...settings,
      [key]: value,
    });
  };

  const handleQuestionTypeToggle = (typeId: number) => {
    const currentTypes = settings.questionTypes || [];
    const newTypes = currentTypes.includes(typeId)
      ? currentTypes.filter(id => id !== typeId)
      : [...currentTypes, typeId];
    
    onChange({
      ...settings,
      questionTypes: newTypes,
    });
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ${className}`}>
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
      gap: "0.75rem"
    }}>
          <Settings className={undefined} />
          <div className={undefined}>
            <h3 className={undefined}>問題設定</h3>
            <p className={undefined}>生成オプションと公開設定</p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className={undefined} />
        ) : (
          <ChevronDown className={undefined} />
        )}
      </button>

      {/* コンテンツ */}
      {isExpanded && (
        <div className={undefined}>
          {/* AI生成設定 */}
          <div className={undefined}>
            <h4 style={{
      display: "flex",
      alignItems: "center",
      gap: "0.5rem"
    }}>
              <span>AI生成設定</span>
              <Info className={undefined} title="AIによる問題自動生成の設定" />
            </h4>

            {/* 自動生成オン/オフ */}
            <label style={{
      display: "flex",
      alignItems: "center"
    }}>
              <div className={undefined}>
                <div className={undefined}>自動問題生成</div>
                <div className={undefined}>
                  アップロードした資料からAIが問題を自動生成
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.autoGenerateQuestions}
                onChange={() => handleToggle('autoGenerateQuestions')}
                className={undefined}
              />
            </label>

            {/* 問題数（自動生成がオンの場合のみ） */}
            {settings.autoGenerateQuestions && (
              <div className={undefined}>
                <label className={undefined}>
                  生成する問題数
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={settings.questionCount || 5}
                  onChange={(e) => handleNumberChange('questionCount', parseInt(e.target.value) || 5)}
                  style={{
      paddingTop: "0.5rem",
      paddingBottom: "0.5rem"
    }} />
                <p className={undefined}>1〜20問の範囲で指定できます</p>
              </div>
            )}

            {/* 難易度レベル（自動生成がオンの場合のみ） */}
            {settings.autoGenerateQuestions && (
              <div className={undefined}>
                <label className={undefined}>
                  難易度レベル
                </label>
                <div style={{
      gap: "0.75rem"
    }}>
                  {difficultyOptions.map((option) => (
                    <label
                      key={option.value}
                      className={`flex flex-col p-3 border-2 rounded-lg cursor-pointer transition-all ${
                        settings.difficultyLevel === option.value
                          ? 'border-indigo-600 bg-indigo-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="difficulty"
                        value={option.value}
                        checked={settings.difficultyLevel === option.value}
                        onChange={() => handleNumberChange('difficultyLevel', option.value)}
                        className={undefined}
                      />
                      <span className={undefined}>{option.label}</span>
                      <span className={undefined}>{option.description}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* 問題形式（自動生成がオンの場合のみ） */}
            {settings.autoGenerateQuestions && (
              <div className={undefined}>
                <label className={undefined}>
                  問題形式（複数選択可）
                </label>
                <div style={{
      gap: "0.5rem"
    }}>
                  {questionTypeOptions.map((type) => (
                    <label
                      key={type.id}
                      className={`flex items-center gap-2 p-2 border rounded-lg cursor-pointer transition-all ${
                        settings.questionTypes?.includes(type.id)
                          ? 'border-indigo-600 bg-indigo-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={settings.questionTypes?.includes(type.id) || false}
                        onChange={() => handleQuestionTypeToggle(type.id)}
                        className={undefined}
                      />
                      <span className={undefined}>{type.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* コンテンツ設定 */}
          <div className={undefined}>
            <h4 className={undefined}>コンテンツ設定</h4>

            <label style={{
      display: "flex",
      alignItems: "center"
    }}>
              <div className={undefined}>
                <div className={undefined}>解答を含める</div>
                <div className={undefined}>
                  問題に対する解答を生成・表示
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.includeAnswers}
                onChange={() => handleToggle('includeAnswers')}
                className={undefined}
              />
            </label>

            <label style={{
      display: "flex",
      alignItems: "center"
    }}>
              <div className={undefined}>
                <div className={undefined}>解説を含める</div>
                <div className={undefined}>
                  解答の詳しい解説を生成・表示
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.includeSolutions}
                onChange={() => handleToggle('includeSolutions')}
                className={undefined}
                disabled={!settings.includeAnswers} />
            </label>

            <label style={{
      display: "flex",
      alignItems: "center"
    }}>
              <div className={undefined}>
                <div className={undefined}>キーワード自動抽出</div>
                <div className={undefined}>
                  問題から重要キーワードを自動抽出
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.extractKeywords}
                onChange={() => handleToggle('extractKeywords')}
                className={undefined}
              />
            </label>
          </div>

          {/* 公開設定 */}
          <div className={undefined}>
            <h4 className={undefined}>公開設定</h4>

            <label style={{
      display: "flex",
      alignItems: "center"
    }}>
              <div className={undefined}>
                <div className={undefined}>公開する</div>
                <div className={undefined}>
                  他のユーザーがこの問題を閲覧・検索できるようにする
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.isPublic}
                onChange={() => handleToggle('isPublic')}
                className={undefined}
              />
            </label>

            {!settings.isPublic && (
              <div className={undefined}>
                <p className={undefined}>
                  💡 非公開の場合、あなただけが閲覧できます。後から公開設定を変更することもできます。
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
