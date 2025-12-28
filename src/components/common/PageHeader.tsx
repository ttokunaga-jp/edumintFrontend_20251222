import React from 'react';

export interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  cls?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, description, actions, }) => {
  return (
    <div >
      <div>
        <h1 >{title}</h1>
        {description && <p >{description}</p>}
      </div>
      {actions && <div style={{
      display: "",
      alignItems: "center",
      gap: "0.5rem"
    }>{actions}</div>}
    </div>
  );
};

export default PageHeader;
