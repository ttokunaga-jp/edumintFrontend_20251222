import React, { useState, useEffect } from 'react';
import { Search, Bell, User, Menu, Plus } from 'lucide-react';
import { Button } from '@/components/primitives/button';

export interface TopMenuBarProps {
    currentUser?: any;
    currentPage?: string;
    onLogout?: () => void;
    onNavigate?: (page: any, problemId?: string) => void;
    onQueryChange?: (query: string) => void;
    onSearchSubmit?: () => void;
    onMenuClick?: () => void;
    onNotificationClick?: () => void;
    searchQuery?: string;
}

const SearchInput = ({
    value,
    onChange,
    onKeyDown,
    className
}: {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    className?: string;
}) => (
    <div className={`relative ${className}`}>
        <Search className={undefined} />
        <input
            type="text"
            value={value}
            placeholder="問題を検索..."
            style={{
      paddingTop: "0.5rem",
      paddingBottom: "0.5rem"
    }}
            onChange={onChange}
            onKeyDown={onKeyDown} />
    </div>
);

export default function TopMenuBar({
    currentUser,
    onLogout,
    onNavigate,
    onQueryChange,
    onSearchSubmit,
    onMenuClick,
    onNotificationClick,
    searchQuery = ""
}: TopMenuBarProps) {
    const user = currentUser;
    const [localQuery, setLocalQuery] = useState(searchQuery);

    useEffect(() => {
        setLocalQuery(searchQuery);
    }, [searchQuery]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setLocalQuery(val);
        onQueryChange?.(val);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            onSearchSubmit?.();
        }
    };

    return (
        <nav className={undefined}>
            <div style={{
      paddingLeft: "1rem",
      paddingRight: "1rem"
    }}>
                {/* Main Nav Row */}
                <div style={{
      display: "flex",
      alignItems: "center"
    }}>
                    {/* Left Section: Hamburger & Logo */}
                    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "0.5rem"
    }}>
                        <Button variant="ghost" size="icon" className={undefined} title="メニュー" data-trigger="menu-button" onClick={onMenuClick}>
                            <Menu className={undefined} />
                        </Button>
                        <div className={undefined} onClick={() => onNavigate?.('home')}>
                            <span className={undefined}>
                                Edumint
                            </span>
                        </div>
                    </div>

                    {/* Center Section: Search (Desktop only) */}
                    <div style={{
      justifyContent: "center"
    }}>
                        <SearchInput
                            className={undefined}
                            value={localQuery}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown} />
                    </div>

                    {/* Right Section: Actions */}
                    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "0.25rem"
    }}>
                        <Button
                            variant="ghost"
                            size="icon"
                            className={undefined}
                            onClick={() => onNavigate?.('problem-create')}
                            title="問題をアップロード"
                        >
                            <Plus className={undefined} />
                        </Button>

                        <Button variant="ghost" size="icon" className={undefined} data-trigger="notification-bell" onClick={onNotificationClick}>
                            <Bell className={undefined} />
                        </Button>

                        <div style={{
      display: "flex",
      alignItems: "center",
      gap: "0.5rem"
    }}>
                            <div className={undefined}>
                                <div className={undefined}>
                                    {user?.username || 'ゲストユーザー'}
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" className={undefined} onClick={() => onNavigate?.('my-page')}>
                                <User className={undefined} />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Mobile Search Row (visible only on small screens) */}
                <div className={undefined}>
                    <SearchInput
                        className={undefined}
                        value={localQuery}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown} />
                </div>
            </div>
        </nav>
    );
}

// named export for testing compatibility
export { TopMenuBar };
