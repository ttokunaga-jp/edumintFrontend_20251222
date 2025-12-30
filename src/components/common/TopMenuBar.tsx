import {
  AppBar,
  Toolbar,
  Typography,
  TextField,
  IconButton,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme,
  Avatar,
  Stack,
  InputAdornment,
  Tooltip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  Add as AddIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
} from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';

/**
 * TopMenuBar Component
 * グローバルナビゲーション (AppBar + Toolbar)
 * - ハンバーガーメニュー（左）
 * - ロゴ（Home へリンク）
 * - 検索バー
 * - 問題作成ボタン（右から3番目）
 * - 通知アイコン
 * - ユーザーアバター（MyPage へ直接遷移）
 */
export function TopMenuBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  // ナビゲーション項目
  const navItems = [
    { label: 'ホーム', path: '/' },
    user && { label: '問題作成', path: '/problem/create' },
    user && { label: 'マイページ', path: '/mypage' },
    user?.role === 'admin' && { label: '管理画面', path: '/admin' },
  ].filter(Boolean);

  // TopMenuBar を非表示にするパス
  const hideTopMenuBarPaths = ['/login', '/register'];
  const shouldHideTopMenuBar = hideTopMenuBarPaths.includes(location.pathname);

  if (shouldHideTopMenuBar) {
    return null;
  }

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#ffffff',
          color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          zIndex: 1300,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Toolbar
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          {/* ハンバーガーメニュー (左端) */}
          <IconButton
            color="inherit"
            onClick={() => setMobileMenuOpen(true)}
            sx={{ color: theme.palette.text.primary }}
          >
            <MenuIcon />
          </IconButton>

          {/* ロゴ */}
          <Box
            onClick={() => handleNavigation('/')}
            sx={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              minWidth: 'fit-content',
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: theme.palette.primary.main,
                fontSize: { xs: '1rem', sm: '1.25rem' },
              }}
            >
              EduMint
            </Typography>
          </Box>

          {/* 検索バー (デスクトップのみ) */}
          {!isMobile && (
            <Box component="form" onSubmit={handleSearch} sx={{ flex: 1, maxWidth: 500 }}>
              <TextField
                size="small"
                placeholder="キーワード、大学、教科を検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        type="submit"
                        size="small"
                        edge="end"
                        aria-label="search"
                      >
                        <SearchIcon sx={{ fontSize: '1.2rem' }} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  width: '100%',
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#f5f5f5',
                    borderRadius: '8px',
                    '& fieldset': {
                      borderColor: 'transparent',
                    },
                    '&:hover fieldset': {
                      borderColor: theme.palette.divider,
                    },
                  },
                }}
              />
            </Box>
          )}

          {/* 右側のメニュー */}
          <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
            {/* 問題作成ボタン（認証済みユーザーのみ） */}
            {user && !isMobile && (
              <Tooltip title="問題を作成">
                <IconButton
                  onClick={() => handleNavigation('/problem/create')}
                  sx={{
                    color: theme.palette.primary.main,
                    '&:hover': {
                      backgroundColor: theme.palette.mode === 'dark' 
                        ? 'rgba(77, 208, 225, 0.1)' 
                        : 'rgba(0, 188, 212, 0.1)',
                    },
                  }}
                >
                  <AddIcon />
                </IconButton>
              </Tooltip>
            )}

            {/* 通知アイコン */}
            {user && !isMobile && (
              <Tooltip title="通知">
                <IconButton
                  color="inherit"
                  aria-label="notifications"
                  sx={{
                    color: theme.palette.text.secondary,
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover,
                    },
                  }}
                >
                  <NotificationsIcon />
                </IconButton>
              </Tooltip>
            )}

            {/* ユーザーアバター / ログイン・登録ボタン */}
            {user ? (
              <Tooltip title="マイページ">
                <IconButton
                  onClick={() => handleNavigation('/mypage')}
                  sx={{
                    p: 0,
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover,
                      borderRadius: '50%',
                    },
                  }}
                >
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      backgroundColor: theme.palette.primary.main,
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: '#ffffff',
                    }}
                  >
                    {user.username?.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
              </Tooltip>
            ) : (
              !isMobile && (
                <Stack direction="row" spacing={1} sx={{ ml: 2 }}>
                  <IconButton
                    color="inherit"
                    onClick={() => handleNavigation('/login')}
                    sx={{
                      color: theme.palette.primary.main,
                      '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                      },
                    }}
                  >
                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 600 }}>
                      ログイン
                    </Typography>
                  </IconButton>
                  <IconButton
                    onClick={() => handleNavigation('/register')}
                    sx={{
                      backgroundColor: theme.palette.primary.main,
                      color: '#ffffff',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      '&:hover': {
                        backgroundColor: theme.palette.primary.dark,
                        boxShadow: '0 4px 12px rgba(0, 188, 212, 0.3)',
                      },
                    }}
                  >
                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 600 }}>
                      新規登録
                    </Typography>
                  </IconButton>
                </Stack>
              )
            )}
          </Stack>
        </Toolbar>
      </AppBar>

      {/* モバイルメニュー Drawer */}
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      >
        <Box
          sx={{
            width: 280,
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
          }}
        >
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              メニュー
            </Typography>
            <IconButton onClick={() => setMobileMenuOpen(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider />

          {/* 検索バー (モバイル) */}
          <Box sx={{ p: 2 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch(e as any);
                }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: theme.palette.mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.05)' 
                    : '#f5f5f5',
                  borderRadius: '8px',
                },
              }}
            />
          </Box>
          <Divider />

          <List sx={{ flex: 1 }}>
            {navItems.map((item: any) => (
              <ListItem key={item.path} disablePadding>
                <ListItemButton 
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover,
                    },
                  }}
                >
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          <Divider />

          {!user && (
            <Box sx={{ p: 2, display: 'flex', gap: 1, flexDirection: 'column' }}>
              <IconButton
                fullWidth
                onClick={() => handleNavigation('/login')}
                sx={{
                  color: theme.palette.primary.main,
                  border: `1px solid ${theme.palette.divider}`,
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
              >
                ログイン
              </IconButton>
              <IconButton
                fullWidth
                onClick={() => handleNavigation('/register')}
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: '#ffffff',
                  '&:hover': {
                    backgroundColor: theme.palette.primary.dark,
                  },
                }}
              >
                新規登録
              </IconButton>
            </Box>
          )}
        </Box>
      </Drawer>
    </>
  );
}

export default TopMenuBar;
