import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Drawer,
  Box,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Person as PersonIcon,
} from '@mui/icons-material';

interface SettingsSliderProps {
  isOpen: boolean;
  onClose: () => void;
}

// Edumintロゴ SVGコンポーネント
const EdumintLogo = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="4"
      y="8"
      width="5"
      height="12"
      rx="1"
      fill="currentColor"
      opacity="0.8"
    />
    <rect x="10" y="6" width="5" height="14" rx="1" fill="currentColor" />
    <rect
      x="16"
      y="10"
      width="5"
      height="10"
      rx="1"
      fill="currentColor"
      opacity="0.6"
    />
  </svg>
);

export default function SettingsSlider({
  isOpen,
  onClose,
}: SettingsSliderProps) {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <Drawer
      anchor="left"
      open={isOpen}
      onClose={onClose}
      sx={{
        zIndex: 900,
        '& .MuiDrawer-paper': {
          width: 280,
          marginTop: '64px',
          height: 'calc(100vh - 64px)',
          zIndex: 900,
        },
      }}
    >
      <Box
        role="presentation"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
      >
        {/* メニューリスト */}
        <List sx={{ flex: 1, pt: 0 }}>
          {/* HOME */}
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => handleNavigate('/')}
              sx={{
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, display: 'flex', justifyContent: 'center' }}>
                <EdumintLogo />
              </ListItemIcon>
              <ListItemText
                primary="HOME"
                primaryTypographyProps={{ variant: 'body2' }}
              />
            </ListItemButton>
          </ListItem>

          {/* CREATE */}
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => handleNavigate('/create')}
              sx={{
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <AddIcon sx={{ fontSize: 20 }} />
              </ListItemIcon>
              <ListItemText
                primary="CREATE"
                primaryTypographyProps={{ variant: 'body2' }}
              />
            </ListItemButton>
          </ListItem>

          {/* MYPAGE */}
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => handleNavigate('/mypage')}
              sx={{
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <PersonIcon sx={{ fontSize: 20 }} />
              </ListItemIcon>
              <ListItemText
                primary="MYPAGE"
                primaryTypographyProps={{ variant: 'body2' }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
}
