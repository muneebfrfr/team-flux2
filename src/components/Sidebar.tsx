'use client';

import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Box,
  ListItemButton,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import Link from 'next/link';

interface SidebarProps {
  open: boolean;
  width?: number;
  onClose: () => void;
}

export default function Sidebar({ open, width = 240, onClose }: SidebarProps) {
  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      sx={{
        width,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width,
          boxSizing: 'border-box',
          background: 'linear-gradient(to bottom, #764ba2, #667eea)',
          color: '#fff',
        },
      }}
    >
      <Box p={2}>
        <Typography variant="h6" fontWeight="bold">
          Menu
        </Typography>
      </Box>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)' }} />
      <List>
        <ListItem disablePadding>
          {/* ✅ Modern Next.js Link structure */}
          <Link href="/dashboard" style={{ width: '100%', textDecoration: 'none' }}>
            <ListItemButton onClick={onClose}>
              <ListItemIcon sx={{ color: '#fff' }}>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItemButton>
          </Link>
        </ListItem>
      </List>
    </Drawer>
  );
}
