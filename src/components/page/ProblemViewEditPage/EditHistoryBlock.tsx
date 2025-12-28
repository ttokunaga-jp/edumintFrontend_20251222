// @ts-nocheck
import { useState } from 'react';
import { Clock, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { Button } from '@/components/primitives/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/primitives/card';
import { Badge } from '@/components/primitives/badge';
import { formatDate } from '@/shared/utils';

export interface EditHistory {
  id: string;
  version: number;
  changedBy: string;
  changedAt: string;
  changes: Record<string, any>;
  description?: string;
}

export interface EditHistoryBlockProps {
  history: EditHistory[];
  currentVersion: number;
  onRollback?: (version: number) => void;
  className?: string;
}

export default function EditHistoryBlock({
  history,
  currentVersion,
  onRollback,
  className = '',
}: EditHistoryBlockProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const displayedHistory = showAll ? history : history.slice(0, 5);

  const getChangeDescription = (changes: Record<string, any>): string => {
    const changeKeys = Object.keys(changes);
    if (changeKeys.length === 0) return '変更なし';
    if (changeKeys.length === 1) return `${changeKeys[0]}を変更`;
    return `${changeKeys.length}箇所を変更`;
  };

  return (
    <Card className={className}>
      <CardHeader className={undefined}>
        <div style={{
      display: "flex",
      alignItems: "center"
    }}>
          <div style={{
      display: "flex",
      alignItems: "center"
    }}>
            <Clock className={undefined} />
            <CardTitle className={undefined}>編集履歴</CardTitle>
            <Badge variant="outline">v{currentVersion}</Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            style={{
      display: "flex",
      alignItems: "center"
    }}>
            <span>{isExpanded ? '閉じる' : '表示'}</span>
            {isExpanded ? <ChevronUp className={undefined} /> : <ChevronDown className={undefined} />}
          </Button>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className={undefined}>
          {displayedHistory.length === 0 ? (
            <div className={undefined}>
              編集履歴はありません
            </div>
          ) : (
            <>
              {displayedHistory.map((item) => (
                <div
                  key={item.id}
                  className={`border border-gray-200 rounded-lg p-4 ${item.version === currentVersion ? 'bg-indigo-50 border-indigo-300' : 'bg-white'
                    }`}
                >
                  <div style={{
      display: "flex"
    }}>
                    <div style={{
      display: "flex",
      alignItems: "center"
    }}>
                      <Badge variant={item.version === currentVersion ? 'default' : 'secondary'}>
                        v{item.version}
                      </Badge>
                      {item.version === currentVersion && (
                        <Badge variant="default">現在のバージョン</Badge>
                      )}
                    </div>
                    {onRollback && item.version !== currentVersion && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onRollback(item.version)}
                        style={{
      display: "flex",
      alignItems: "center"
    }}>
                        <RotateCcw className={undefined} />
                        <span>復元</span>
                      </Button>
                    )}
                  </div>

                  <div className={undefined}>
                    <div className={undefined}>
                      {item.description || getChangeDescription(item.changes)}
                    </div>
                    <div style={{
      display: "flex",
      alignItems: "center"
    }}>
                      <span>編集者: {item.changedBy}</span>
                      <span>•</span>
                      <span>{formatDate(item.changedAt)}</span>
                    </div>
                  </div>

                  {/* 変更の詳細 */}
                  {Object.keys(item.changes).length > 0 && (
                    <div className={undefined}>
                      <div className={undefined}>
                        {Object.entries(item.changes).slice(0, 3).map(([key, value]) => (
                          <div key={key} style={{
      display: "flex"
    }}>
                            <span className={undefined}>{key}:</span>
                            <span className={undefined}>
                              {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                            </span>
                          </div>
                        ))}
                        {Object.keys(item.changes).length > 3 && (
                          <div className={undefined}>
                            他 {Object.keys(item.changes).length - 3} 件の変更...
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* もっと見るボタン */}
              {history.length > 5 && (
                <div className={undefined}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAll(!showAll)}
                  >
                    {showAll ? '一部を表示' : `すべて表示 (${history.length}件)`}
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      )}
    </Card>
  );
}

export { EditHistoryBlock };
