"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import ListItemButton from "@mui/material/ListItemButton";
import HomeIcon from "@mui/icons-material/Home";
import LaptopIcon from "@mui/icons-material/Laptop";
import DataArrayIcon from '@mui/icons-material/DataArray';
import ArticleIcon from "@mui/icons-material/Article";
import { useTheme } from "@mui/material/styles";
import route from "@/route";
import DashboardLoader from "@/components/common/DashboardLoader";
interface SidebarProps {
  open: boolean;
  width?: number;
  onClose: () => void;
}
export default function Sidebar({ open, width = 240 }: SidebarProps) {
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  const [loading, setLoading] = useState(false);

  const handleNavigate = (path: string) => {
    if (path === pathname) return;
    setLoading(true);
    router.push(path);
  };

  useEffect(() => {
    setLoading(false);
  }, [pathname]);

  return (
    <>
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
            background: `linear-gradient(to bottom, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
            color: theme.palette.brand.contrastText,
          },
        }}
      >
        <Box p={4}></Box>
        <Divider sx={{ borderColor: "rgba(255,255,255,0.2)" }} />
        <List>
          <ListItem disablePadding>
            <ListItemButton
              sx={{ color: theme.palette.brand.main }}
              onClick={() => handleNavigate(route.dashboard)}
            >
              <ListItemIcon sx={{ color: theme.palette.brand.main }}>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton
              sx={{ color: theme.palette.brand.main }}
              onClick={() => handleNavigate(route.projects)}
            >
              <ListItemIcon sx={{ color: theme.palette.brand.main }}>
                <LaptopIcon />
              </ListItemIcon>
              <ListItemText primary="Projects" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton
              sx={{ color: theme.palette.brand.main }}
              onClick={() => handleNavigate(route.deprecations)}
            >
              <ListItemIcon sx={{ color: theme.palette.brand.main }}>
                <ArticleIcon />
              </ListItemIcon>
              <ListItemText primary="Deprecation Tracker" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton
              sx={{ color: theme.palette.brand.main }}
              onClick={() => handleNavigate(route.technicalDebt)}
            >
              <ListItemIcon sx={{ color: theme.palette.brand.main }}>
                <DataArrayIcon />
              </ListItemIcon>
              <ListItemText primary="Technical Debt" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      {loading && <DashboardLoader />}
    </>
  );
}
