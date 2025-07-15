"use client";

import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import ListItemButton from "@mui/material/ListItemButton";
import HomeIcon from "@mui/icons-material/Home";
import Link from "next/link";
import { useTheme } from "@mui/material/styles";

interface SidebarProps {
  open: boolean;
  width?: number;
  onClose: () => void;
}

export default function Sidebar({ open, width = 240}: SidebarProps) {
  const theme = useTheme();

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      sx={{
        width,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width,
          boxSizing: "border-box",
          background: `linear-gradient(to bottom, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`, // ✅ Use theme colors
          color: theme.palette.brand.contrastText,
        },
      }}
    >
      <Box p={4}></Box>
      <Divider sx={{ borderColor: "rgba(255,255,255,0.2)" }} />
      <List>
        {/* Home Link */}
        <ListItem disablePadding>
          <Link
            href="/dashboard"
            style={{ width: "100%", textDecoration: "none" }}
          >
            <ListItemButton sx={{ color: theme.palette.brand.main }}>
              <ListItemIcon sx={{ color: theme.palette.brand.main }}>
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
