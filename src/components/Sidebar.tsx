"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Box from "@mui/material/Box";
import ListItemButton from "@mui/material/ListItemButton";
import HomeIcon from "@mui/icons-material/Home";
import LaptopIcon from "@mui/icons-material/Laptop";
import DataArrayIcon from "@mui/icons-material/DataArray";
import ArticleIcon from "@mui/icons-material/Article";
import EventNoteIcon from "@mui/icons-material/EventNote";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import route from "@/route";
import DashboardLoader from "@/components/common/DashboardLoader";

interface SidebarProps {
  open?: boolean;
  width?: number;
  onClose: () => void;
}

const COLLAPSED_WIDTH = 60;

export default function Sidebar({ open=false, width = 240, onClose }: SidebarProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const router = useRouter();
  const pathname = usePathname();

  const [loading, setLoading] = useState(false);

  const handleNavigate = (path: string) => {
    if (path === pathname) {
      if (isMobile) onClose();
      return;
    }
    setLoading(true);
    router.push(path);
    if (isMobile) onClose();
  };

  useEffect(() => {
    setLoading(false);
  }, [pathname]);

  return (
    <>
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        anchor="left"
        open={open}
        onClose={onClose}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          width: open || isMobile ? width : COLLAPSED_WIDTH,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: open || isMobile ? width : COLLAPSED_WIDTH,
            transition: "width 0.3s ease",
            overflowX: "hidden",
            boxSizing: "border-box",
            background: `linear-gradient(to bottom, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
            color: theme.palette.brand.contrastText,
          },
        }}
      >
        <Box p={open ? 4 : 4} />
        <List>
          {[
            { text: "Home", icon: <HomeIcon />, path: route.dashboard },
            { text: "Sessions", icon: <EventNoteIcon />, path: route.sessions },
            { text: "Projects", icon: <LaptopIcon />, path: route.projects },
            {
              text: "Deprecation",
              icon: <ArticleIcon />,
              path: route.deprecations,
            },
            {
              text: "TechnicalDebt",
              icon: <DataArrayIcon />,
              path: route.technicalDebt,
            },
          ].map((item) => (
            <ListItem key={item.text} disablePadding sx={{ display: "block" }}>
              <ListItemButton
                onClick={() => handleNavigate(item.path)}
                sx={{
                  color: theme.palette.brand.main,
                  minHeight: 48,
                  justifyContent: open || isMobile ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    color: theme.palette.brand.main,
                    minWidth: 0,
                    mr: open || isMobile ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {(open || isMobile) && <ListItemText primary={item.text} />}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      {loading && <DashboardLoader />}
    </>
  );
}
