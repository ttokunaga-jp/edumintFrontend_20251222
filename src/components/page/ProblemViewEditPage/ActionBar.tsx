import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button, Stack } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { zIndex } from '@/theme/zIndex';

interface ActionBarProps {
  isEditMode: boolean;
  isSaving?: boolean;
  onSave?: () => void;
  onCancel?: () => void;
  onEdit?: () => void;
}

export const ActionBar: React.FC<ActionBarProps> = ({
  isEditMode,
  isSaving = false,
  onSave,
  onCancel,
  onEdit,
}) => {
  const { t } = useTranslation();
  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        bgcolor: 'background.paper',
        borderTop: 1,
        borderColor: 'divider',
        p: 2,
        zIndex: zIndex.actionBar,
      }}
    >
      <Stack direction="row" justifyContent="center" spacing={2}>
        {isEditMode ? (
          <>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={onSave}
              disabled={isSaving}
              sx={{ minWidth: 120 }}
            >
              {isSaving ? t('common.saving') : t('common.save')}
            </Button>
            <Button
              variant="outlined"
              startIcon={<CancelIcon />}
              onClick={onCancel}
              disabled={isSaving}
              sx={{ minWidth: 120 }}
            >
              {t('common.cancel')}
            </Button>
          </>
        ) : (
          <Button
            variant="contained"
            onClick={onEdit}
            sx={{ minWidth: 120 }}
          >
            {t('common.edit')}
          </Button>
        )}
      </Stack>
    </Box>
  );
};
