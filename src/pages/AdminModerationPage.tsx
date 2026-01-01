import { Container, Box, Typography } from '@mui/material';

export function AdminModerationPage() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4">管理画面 - モデレーション</Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          このページは開発中です。
        </Typography>
      </Box>
    </Container>
  );
}

export default AdminModerationPage;
