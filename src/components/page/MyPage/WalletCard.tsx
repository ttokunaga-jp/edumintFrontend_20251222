// @ts-nocheck
import { useState } from 'react';
import { Wallet, TrendingUp, Download, ExternalLink } from 'lucide-react';

export type WalletBalance = {
  balance: number;
  currency: string;
  pendingEarnings: number;
  totalEarnings: number;
  lastUpdated: string;
};

export type WalletCardProps = {
  balance?: WalletBalance;
  isLoading?: boolean;
  onWithdraw?: () => void;
  className?: string;
  disableWithdrawal?: boolean; // Add disable prop for health-based disabling
};

export function WalletCard({ balance, isLoading = false, onWithdraw, className = '', disableWithdrawal = false }: WalletCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  if (isLoading) {
    return (
      <div className={`bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg p-6 text-white ${className} animate-pulse`}>
        <div className={undefined}></div>
        <div className={undefined}></div>
        <div className={undefined}></div>
      </div>
    );
  }

  if (!balance) {
    return (
      <div className={`bg-gradient-to-r from-gray-400 to-gray-500 rounded-xl shadow-lg p-6 text-white ${className}`}>
        <div style={{
      display: "flex",
      alignItems: "center",
      gap: "0.5rem"
    }}>
          <Wallet className={undefined} />
          <h3 className={undefined}>ウォレット</h3>
        </div>
        <p className={undefined}>
          ウォレット機能は準備中です
        </p>
        <div className={undefined}>
          Phase2でリリース予定
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg p-6 text-white ${className}`}>
      <div style={{
      display: "flex",
      alignItems: "center"
    }}>
        <div style={{
      display: "flex",
      alignItems: "center",
      gap: "0.5rem"
    }}>
          <Wallet className={undefined} />
          <h3 className={undefined}>ウォレット残高</h3>
        </div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className={undefined}
        >
          {showDetails ? '閉じる' : '詳細'}
        </button>
      </div>

      <div className={undefined}>
        <div className={undefined}>
          ¥{balance.balance.toLocaleString()}
        </div>
        <div className={undefined}>
          利用可能残高
        </div>
      </div>

      {showDetails && (
        <div className={undefined}>
          <div style={{
      display: "flex",
      alignItems: "center"
    }}>
            <span className={undefined}>保留中の収益</span>
            <span className={undefined}>¥{balance.pendingEarnings.toLocaleString()}</span>
          </div>
          <div style={{
      display: "flex",
      alignItems: "center"
    }}>
            <span className={undefined}>累計収益</span>
            <span className={undefined}>¥{balance.totalEarnings.toLocaleString()}</span>
          </div>
          <div style={{
      display: "flex",
      alignItems: "center"
    }}>
            <span className={undefined}>最終更新</span>
            <span className={undefined}>
              {new Date(balance.lastUpdated).toLocaleDateString('ja-JP')}
            </span>
          </div>
        </div>
      )}

      <div style={{
      gap: "0.75rem"
    }}>
        <button
          onClick={onWithdraw}
          disabled={balance.balance < 1000 || disableWithdrawal}
          style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.5rem",
      paddingLeft: "1rem",
      paddingRight: "1rem",
      paddingTop: "0.5rem",
      paddingBottom: "0.5rem"
    }}>
          <Download className={undefined} />
          <span className={undefined}>出金</span>
        </button>
        <button style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.5rem",
      paddingLeft: "1rem",
      paddingRight: "1rem",
      paddingTop: "0.5rem",
      paddingBottom: "0.5rem"
    }}>
          <TrendingUp className={undefined} />
          <span className={undefined}>統計</span>
        </button>
      </div>

      {balance.balance < 1000 && (
        <div className={undefined}>
          ※ 出金には最低¥1,000の残高が必要です
        </div>
      )}

      <a
        href="#"
        style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.25rem"
    }}>
        <span>収益について詳しく</span>
        <ExternalLink className={undefined} />
      </a>
    </div>
  );
}
