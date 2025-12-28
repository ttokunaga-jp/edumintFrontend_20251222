import React from 'react';

type Status = 'operational' | 'degraded' | 'outage' | 'maintenance';

export interface ServiceHealthBarProps {
  serviceName?: string;
  status?: Status;
  message?: string;
  cls?: string;
}

const statusColor: Record<Status, string> = {
  operational: "",
  degraded: "",
  outage: "",
  maintenance: "",
};

const ServiceHealthBar: React.FC<ServiceHealthBarProps> = ({
  serviceName = 'Service',
  status = 'operational',
  message,
}) => {
  return (
    <div >
      <div >{serviceName}</div>
      <div >
        {message ||
          (status === 'operational'
            ? 'All systems are operational.'
            : 'Service is experiencing issues.')}
      </div>
    </div>
  );
};

export default ServiceHealthBar;
