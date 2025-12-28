// @ts-nocheck
import { FileText, Eye, Heart, MessageCircle, TrendingUp, Award } from 'lucide-react';

export type UserStats = {
  totalProblems: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  avgLikesPerProblem: number;
  rank?: string;
};

export type UserStatsCardsProps = {
  stats: UserStats;
  isLoading?: boolean;
  cls?: string;
};

export function UserStatsCards({ stats, isLoading = false, }: UserStatsCardsProps) {
  const cards = [
    {
      icon: FileText,
      label: '投稿数',
      value: stats.totalProblems,
      color: "",
      bgColor: "",
    },
    {
      icon: Eye,
      label: '総閲覧数',
      value: stats.totalViews.toLocaleString(),
      color: "",
      bgColor: "",
    },
    {
      icon: Heart,
      label: '総いいね数',
      value: stats.totalLikes.toLocaleString(),
      color: "",
      bgColor: "",
    },
    {
      icon: MessageCircle,
      label: '総コメント数',
      value: stats.totalComments.toLocaleString(),
      color: "",
      bgColor: "",
    },
    {
      icon: TrendingUp,
      label: '平均いいね/問題',
      value: stats.avgLikesPerProblem.toFixed(1),
      color: "",
      bgColor: "",
    },
  ];

  if (stats.rank) {
    cards.push({
      icon: Award,
      label: 'ランク',
      value: stats.rank,
      color: "",
      bgColor: "",
    });
  }

  if (isLoading) {
    return (
      <div >
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} >
            <div ></div>
            <div ></div>
            <div ></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div >
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            
          >
            <div >
              <Icon  />
            </div>
            <div >{card.label}</div>
            <div >{card.value}</div>
          </div>
        );
      })}
    </div>
  );
}
