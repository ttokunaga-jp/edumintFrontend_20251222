import { Box, Snackbar, Alert, Stack } from '@mui/material';
import { zIndex } from '@/theme/zIndex';
import { useNotification } from '@/contexts/NotificationContext';

/**
 * Notification Display Component
 * NotificationContext のすべての通知を表示します
 */
export function NotificationCenter() {
  const { notifications, removeNotification } = useNotification();

  return (
    <Stack
      spacing={1}
      sx={{
        position: 'fixed',
        top: 20,
        right: 20,
        zIndex: zIndex.notification,
        maxWidth: 400,
        pointerEvents: 'none',
      }}
    >
      {notifications.map((notification) => (
        <Snackbar
          key={notification.id}
          open={true}
          onClose={() => removeNotification(notification.id)}
          autoHideDuration={notification.duration}
          sx={{ pointerEvents: 'auto' }}
        >
          <Alert
            onClose={() => removeNotification(notification.id)}
            severity={notification.type === 'success' ? 'success' : 
                      notification.type === 'error' ? 'error' :
                      notification.type === 'warning' ? 'warning' : 'info'}
            sx={{ width: '100%' }}
            variant="filled"
          >
            {notification.message}
          </Alert>
        </Snackbar>
      ))}
    </Stack>
  );
}
