"use client";

import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import ListItemButton from "@mui/material/ListItemButton";

import HomeIcon from "@mui/icons-material/Home";
import Link from "next/link";
import EventNoteIcon from "@mui/icons-material/EventNote";
import Project from "@mui/icons-material/Laptop";
import ArticleIcon from "@mui/icons-material/Article";
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
        "& .MuiDrawer-paper": {
          width,
          boxSizing: "border-box",
          background: "linear-gradient(to bottom, #764ba2, #667eea)",
          color: "#fff",
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
            <ListItemButton sx={{ color: "#fff" }}>
              <ListItemIcon sx={{ color: "#fff" }}>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItemButton>
          </Link>
        </ListItem>

        {/* Sessions Link */}
        <ListItem disablePadding>
          <Link
            href="/sessions"
            style={{ width: "100%", textDecoration: "none" }}
          >
            <ListItemButton sx={{ color: "#fff" }}>
              <ListItemIcon sx={{ color: "#fff" }}>
                <EventNoteIcon />
              </ListItemIcon>
              <ListItemText primary="Sessions" />
            </ListItemButton>
          </Link>
        </ListItem>

        {/* Project link */}
        <ListItem disablePadding>
          <Link
            href="/projects"
            style={{ width: "100%", textDecoration: "none" }}
          >
            <ListItemButton sx={{ color: "#fff" }}>
              <ListItemIcon sx={{ color: "#fff" }}>
                <Project />
              </ListItemIcon>
              <ListItemText primary="Projects" />
            </ListItemButton>
          </Link>
        </ListItem>

        {/* Technical dept link */}
        <ListItem disablePadding>
          <Link
            href="/technical-debt"
            style={{ width: "100%", textDecoration: "none" }}
          >
            <ListItemButton sx={{ color: "#fff" }}>
              <ListItemIcon sx={{ color: "#fff" }}>
                <ArticleIcon />
              </ListItemIcon>
              <ListItemText primary="Technical Debt" />
            </ListItemButton>
          </Link>
        </ListItem>
      </List>
    </Drawer>
  );
}
