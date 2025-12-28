// @ts-nocheck
import { Settings, Sparkles, FileText, Lock, Unlock } from 'lucide-react';
import { Badge } from '@/components/primitives/badge';
import { Button } from '@/components/primitives/button';

export interface GenerationSettings {
  autoGenerateQuestions: boolean;
  questionCount?: number;
  includeAnswers: boolean;
  includeSolutions: boolean;
  difficultyLevel: number;
  questionTypes: number[];
  extractKeywords: boolean;
  isPublic: boolean;
  useAdvancedAI: boolean;
  preserveFormatting: boolean;
  detectDiagrams: boolean;
  splitBySection: boolean;
  generatePracticeTests: boolean;
  optimizeForMobile: boolean;
}

export interface GenerationSettingsSummaryProps {
  settings: GenerationSettings;
  onEdit?: () => void;
  showEditButton?: boolean;
  className?: string;
}

const difficultyLabels = ['超基礎', '基礎', '標準', '応用', '発展', '最難関'];
const questionTypeLabels: Record<number, string> = {
  1: '記述式',
  2: '選択式',
  3: '論述式',
  4: '穴埋め式',
  5: '正誤判定',
  6: '数値計算',
  7: '証明問題',
  8: 'プログラミング',
};

export function GenerationSettingsSummary({
  settings,
  onEdit,
  showEditButton = true,
  className = '',
}: GenerationSettingsSummaryProps) {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 overflow-hidden ${className}`}>
      {/* ヘッダー */}
      <div style={{
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
          <Settings className={undefined} />
          <h3 className={undefined}>生成設定</h3>
        </div>
        {showEditButton && onEdit && (
          <Button variant="ghost" size="sm" onClick={onEdit} className={undefined}>
            編集
          </Button>
        )}
      </div>

      {/* 設定内容 */}
      <div className={undefined}>
        {/* AI生成設定 */}
        <div>
          <div style={{
      display: "flex",
      alignItems: "center",
      gap: "0.5rem"
    }}>
            <Sparkles className={undefined} />
            <h4 className={undefined}>AI生成</h4>
          </div>
          <div className={undefined}>
            <div style={{
      display: "flex",
      alignItems: "center"
    }}>
              <span className={undefined}>自動問題生成</span>
              <Badge variant={settings.autoGenerateQuestions ? 'default' : 'secondary'} className={undefined}>
                {settings.autoGenerateQuestions ? 'ON' : 'OFF'}
              </Badge>
            </div>
            {settings.autoGenerateQuestions && (
              <>
                <div style={{
      display: "flex",
      alignItems: "center"
    }}>
                  <span className={undefined}>生成数</span>
                  <span className={undefined}>{settings.questionCount || 5}問</span>
                </div>
                <div style={{
      display: "flex",
      alignItems: "center"
    }}>
                  <span className={undefined}>難易度</span>
                  <Badge variant="outline" className={undefined}>
                    {difficultyLabels[settings.difficultyLevel] || '標準'}
                  </Badge>
                </div>
              </>
            )}
          </div>
        </div>

        {/* 問題形式 */}
        {settings.questionTypes.length > 0 && (
          <div>
            <div style={{
      display: "flex",
      alignItems: "center",
      gap: "0.5rem"
    }}>
              <FileText className={undefined} />
              <h4 className={undefined}>問題形式</h4>
            </div>
            <div style={{
      display: "flex",
      gap: "0.25rem"
    }}>
              {settings.questionTypes.map(typeId => (
                <Badge key={typeId} variant="secondary" className={undefined}>
                  {questionTypeLabels[typeId] || `Type ${typeId}`}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* コンテンツ設定 */}
        <div>
          <h4 className={undefined}>コンテンツ</h4>
          <div className={undefined}>
            {settings.includeAnswers && (
              <div style={{
      display: "flex",
      alignItems: "center",
      gap: "0.5rem"
    }}>
                <div className={undefined} />
                <span>解答を含む</span>
              </div>
            )}
            {settings.includeSolutions && (
              <div style={{
      display: "flex",
      alignItems: "center",
      gap: "0.5rem"
    }}>
                <div className={undefined} />
                <span>解説を含む</span>
              </div>
            )}
            {settings.extractKeywords && (
              <div style={{
      display: "flex",
      alignItems: "center",
      gap: "0.5rem"
    }}>
                <div className={undefined} />
                <span>キーワード自動抽出</span>
              </div>
            )}
          </div>
        </div>

        {/* 高度な設定 */}
        {(settings.useAdvancedAI || settings.preserveFormatting || settings.detectDiagrams) && (
          <div>
            <h4 className={undefined}>高度な設定</h4>
            <div className={undefined}>
              {settings.useAdvancedAI && (
                <div style={{
      display: "flex",
      alignItems: "center",
      gap: "0.5rem"
    }}>
                  <div className={undefined} />
                  <span>高度なAIモデル使用</span>
                </div>
              )}
              {settings.preserveFormatting && (
                <div style={{
      display: "flex",
      alignItems: "center",
      gap: "0.5rem"
    }}>
                  <div className={undefined} />
                  <span>書式保持</span>
                </div>
              )}
              {settings.detectDiagrams && (
                <div style={{
      display: "flex",
      alignItems: "center",
      gap: "0.5rem"
    }}>
                  <div className={undefined} />
                  <span>図表検出</span>
                </div>
              )}
              {settings.splitBySection && (
                <div style={{
      display: "flex",
      alignItems: "center",
      gap: "0.5rem"
    }}>
                  <div className={undefined} />
                  <span>セクション分割</span>
                </div>
              )}
              {settings.optimizeForMobile && (
                <div style={{
      display: "flex",
      alignItems: "center",
      gap: "0.5rem"
    }}>
                  <div className={undefined} />
                  <span>モバイル最適化</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 公開設定 */}
        <div className={undefined}>
          <div style={{
      display: "flex",
      alignItems: "center"
    }}>
            <div style={{
      display: "flex",
      alignItems: "center",
      gap: "0.5rem"
    }}>
              {settings.isPublic ? (
                <Unlock className={undefined} />
              ) : (
                <Lock className={undefined} />
              )}
              <span className={undefined}>公開設定</span>
            </div>
            <Badge variant={settings.isPublic ? 'default' : 'secondary'} className={undefined}>
              {settings.isPublic ? '公開' : '非公開'}
            </Badge>
          </div>
        </div>
      </div>

      {/* 処理時間見積もり（オプション） */}
      {settings.autoGenerateQuestions && (
        <div style={{
      paddingLeft: "1rem",
      paddingRight: "1rem"
    }}>
          <div style={{
      display: "flex",
      gap: "0.5rem"
    }}>
            <div className={undefined}>
              <div className={undefined} />
            </div>
            <div className={undefined}>
              <p className={undefined}>
                推定処理時間:
                <span className={undefined}>
                  {settings.useAdvancedAI ? '3-5分' : '1-3分'}
                </span>
              </p>
              <p className={undefined}>
                バックグラウンドで処理されます
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
