import {
  Container,
  Box,
  Avatar,
  Typography,
  Button,
  Card,
  CardContent,
  Stack,
  CircularProgress,
  Alert,
  useTheme,
  TextField,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import CreateIcon from '@mui/icons-material/Create';
import { useAuth, useLogout } from '@/features/auth/hooks/useAuth';
import { useUserProfile } from '@/features/user/hooks/useUser';
import { useNavigate } from 'react-router-dom';

export function MyPage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { user, isLoading } = useAuth();
  const { data: profile } = useUserProfile(user?.id || '');
  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        navigate('/login');
      },
    });
  };

  if (isLoading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container>
        <Alert severity="warning" sx={{ mt: 4 }}>
          ログインしてください
        </Alert>
      </Container>
    );
  }

  // 仮のカードコンポーネント（横スクロール用）
  const ScrollCard = ({ title, subtitle }: { title: string; subtitle?: string }) => (
    <Card
      sx={{
        minWidth: 280,
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
        },
      }}
    >
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="textSecondary">
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        {/* Profile Header */}
        <Card sx={{ mb: 6, borderRadius: '16px', boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                    bgcolor: theme.palette.primary.main,
                    fontSize: '2.5rem',
                    fontWeight: 700,
                    color: '#ffffff',
                  }}
                >
                  {user.username?.charAt(0).toUpperCase() || 'U'}
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                    {user.displayName || user.username}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
                    @{user.username}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {user.email}
                  </Typography>
                  {user.role === 'admin' && (
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        display: 'inline-block', 
                        mt: 1,
                        backgroundColor: theme.palette.error.main,
                        color: '#ffffff',
                        px: 1,
                        py: 0.5,
                        borderRadius: '8px',
                        fontWeight: 600,
                      }}
                    >
                      管理者
                    </Typography>
                  )}
                </Box>
              </Box>
              <Stack spacing={1}>
                {user.role === 'admin' && (
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/admin')}
                  >
                    管理画面へ
                  </Button>
                )}
                <Button
                  variant="contained"
                  color="error"
                  endIcon={<LogoutIcon />}
                  onClick={handleLogout}
                  disabled={logoutMutation.isPending}
                >
                  ログアウト
                </Button>
              </Stack>
            </Box>
          </CardContent>
        </Card>

        {/* Horizontal Scroll Sections */}
        <Stack spacing={6}>
          {/* 学習履歴セクション */}
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                📚 学習履歴
              </Typography>
              <Typography variant="caption" color="textSecondary">
                最近の学習内容
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                overflowX: 'auto',
                pb: 1,
                '&::-webkit-scrollbar': {
                  height: '4px',
                },
                '&::-webkit-scrollbar-track': {
                  background: 'transparent',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: theme.palette.action.hover,
                  borderRadius: '2px',
                },
              }}
            >
              <ScrollCard title="数学の基礎" subtitle="2024年12月15日" />
              <ScrollCard title="英文法-時制" subtitle="2024年12月14日" />
              <ScrollCard title="物理-運動力学" subtitle="2024年12月13日" />
              <ScrollCard title="歴史-江戸時代" subtitle="2024年12月12日" />
            </Box>
          </Box>

          {/* 高評価セクション */}
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                👍 お気に入り
              </Typography>
              <Typography variant="caption" color="textSecondary">
                高評価した問題
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                overflowX: 'auto',
                pb: 1,
                '&::-webkit-scrollbar': {
                  height: '4px',
                },
                '&::-webkit-scrollbar-track': {
                  background: 'transparent',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: theme.palette.action.hover,
                  borderRadius: '2px',
                },
              }}
            >
              <ScrollCard title="化学-化学結合" subtitle="難度: 中級" />
              <ScrollCard title="地理-気候変動" subtitle="難度: 上級" />
              <ScrollCard title="生物-細胞分裂" subtitle="難度: 中級" />
            </Box>
          </Box>

          {/* 投稿した問題セクション */}
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                ✏️ 作成した問題
              </Typography>
              <Button 
                variant="contained" 
                size="small"
                startIcon={<CreateIcon />}
                onClick={() => navigate('/problem/create')}
              >
                新規作成
              </Button>
            </Box>
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                overflowX: 'auto',
                pb: 1,
                '&::-webkit-scrollbar': {
                  height: '4px',
                },
                '&::-webkit-scrollbar-track': {
                  background: 'transparent',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: theme.palette.action.hover,
                  borderRadius: '2px',
                },
              }}
            >
              <ScrollCard title="確率論の基礎" subtitle="2024年11月10日公開" />
              <ScrollCard title="記述式問題集" subtitle="2024年10月25日公開" />
            </Box>
          </Box>

          {/* 個人情報編集セクション */}
          <Box sx={{ mt: 4, pt: 4, borderTop: `1px solid ${theme.palette.divider}` }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              ⚙️ プロフィール編集
            </Typography>
            <Stack spacing={2} sx={{ maxWidth: '500px' }}>
              <TextField
                label="表示名"
                defaultValue={user.displayName || ''}
                fullWidth
                variant="outlined"
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '10px',
                  },
                }}
              />
              <TextField
                label="ユーザー名"
                defaultValue={user.username}
                disabled
                fullWidth
                variant="outlined"
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '10px',
                  },
                }}
              />
              <TextField
                label="メールアドレス"
                defaultValue={user.email}
                disabled
                fullWidth
                variant="outlined"
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '10px',
                  },
                }}
              />
              <Button variant="contained" sx={{ mt: 2 }}>
                変更を保存
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Container>
  );
}

export default MyPage;
