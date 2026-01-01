import { useLocation } from 'react-router-dom';
import { TopMenuBar } from '@/components/common/TopMenuBar';

interface AppLayoutProps {
  children: React.ReactNode;
}

/**
 * AppLayout - Global responsive layout container
 * Uses Flexbox for reliable height and scroll management
 * Fully responsive - no hardcoded pixel values
 */
export function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const shouldShowTopMenuBar = !['/login', '/register'].includes(location.pathname);

  return (
    <div className="app-layout">
      {shouldShowTopMenuBar && (
        <div className="app-topbar">
          <TopMenuBar />
        </div>
      )}
      <main className="app-main">{children}</main>
    </div>
  );
}

export default AppLayout;
