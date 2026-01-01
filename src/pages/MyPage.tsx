import {
  Container,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useAuth, useLogout } from '@/features/auth/hooks/useAuth';
import { useUserProfile } from '@/features/user/hooks/useUser';
import { useAppBarAction } from '@/contexts/AppBarActionContext';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ProfileHeader } from '@/components/page/MyPage/ProfileHeader';
import { ProfileEditFormData } from '@/components/page/MyPage/ProfileEditForm';
import { AccountSettingsAccordion } from '@/components/page/MyPage/AccountSettingsAccordion';
import { CompletedProblems } from '@/components/page/MyPage/CompletedProblems';
import { LikedProblems } from '@/components/page/MyPage/LikedProblems';
import { CommentedProblems } from '@/components/page/MyPage/CommentedProblems';
import { PostedProblems } from '@/components/page/MyPage/PostedProblems';


export function MyPage() {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const { data: profile } = useUserProfile(user?.id || '');
  const logoutMutation = useLogout();
  const {
    setEnableAppBarActions,
    isEditMode,
    setIsEditMode,
    setHasUnsavedChanges,
    setOnSave,
  } = useAppBarAction();
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // アコーディオン展開状態
  const [expandedAccordion, setExpandedAccordion] = useState<string | false>(false);

  // プロフィール編集フォーム状態
  const [editForm, setEditForm] = useState<ProfileEditFormData>({
    displayName: user?.displayName || '',
    username: user?.username || '',
    email: user?.email || '',
    universities: profile?.university ? [profile.university] : [],
    faculties: profile?.faculty ? [profile.faculty] : [],
    academicField: profile?.field || '',
    academicSystem: undefined,
    language: profile?.language || '',
  });

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        navigate('/login');
      },
    });
  };

  const handleAccordionChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedAccordion(isExpanded ? panel : false);
  };

  // TopMenuBar の Edit 切り替えと同期
  useEffect(() => {
    // プロフィール編集アコーディオンが開いている場合のみ isEditMode を監視
    if (expandedAccordion === 'profile') {
      setIsEditingProfile(isEditMode);
    }
  }, [isEditMode, expandedAccordion]);

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

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        {/* プロフィールヘッダー */}
        <ProfileHeader
          user={user}
          onLogout={handleLogout}
          onNavigateAdmin={() => navigate('/admin')}
          isLoggingOut={logoutMutation.isPending}
        />

        {/* YouTube風の横スクロール: 学習済 */}
        <CompletedProblems />

        {/* YouTube風の横スクロール: 高評価 */}
        <LikedProblems />

        {/* YouTube風の横スクロール: コメント */}
        <CommentedProblems />

        {/* 投稿セクション */}
        <PostedProblems />

        {/* アコーディオン形式の設定パネル */}
        <AccountSettingsAccordion
          expandedAccordion={expandedAccordion}
          onAccordionChange={handleAccordionChange}
          isEditingProfile={isEditingProfile}
          editForm={editForm}
          onFormChange={setEditForm}
          user={user}
          profile={profile}
          setEnableAppBarActions={setEnableAppBarActions}
          setIsEditMode={setIsEditMode}
          setHasUnsavedChanges={setHasUnsavedChanges}
          setOnSave={setOnSave}
        />
      </Box>
    </Container>
  );
}

export default MyPage;
