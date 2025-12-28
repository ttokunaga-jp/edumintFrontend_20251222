import React from 'react';

export interface MaintenancePageProps {
  title?: string;
  message?: string;
  className?: string;
}

const MaintenancePage: React.FC<MaintenancePageProps> = ({
  title = 'メンテナンス中です',
  message = '現在システムメンテナンスを実施しています。しばらく時間をおいてから再度お試しください。',
  className = '',
}) => {
  return (
    <div className={`min-h-[60vh] flex items-center justify-center bg-gray-50 ${className}`}>
      <div className={undefined}>
        <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
          <span className={undefined}>🛠️</span>
        </div>
        <h1 className={undefined}>{title}</h1>
        <p className={undefined}>{message}</p>
      </div>
    </div>
  );
};

export default MaintenancePage;
