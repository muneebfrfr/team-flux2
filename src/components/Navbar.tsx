"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import DropdownItem, { LogoutDropdownItem } from "./DropdownItem";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";

import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";

import { useTheme } from "@mui/material/styles";
import { useRouter } from "next/navigation";

interface NavbarProps {
  onToggleSidebar: () => void;
}

export default function Navbar({ onToggleSidebar }: NavbarProps) {
  const { data: session } = useSession();
  const theme = useTheme();
  const router = useRouter();

  const [notifAnchorEl, setNotifAnchorEl] = useState<null | HTMLElement>(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState<null | HTMLElement>(
    null
  );

  const handleNotifOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotifAnchorEl(event.currentTarget);
  };

  const handleNotifClose = () => {
    setNotifAnchorEl(null);
  };

  const handleProfileOpen = (event: React.MouseEvent<HTMLElement>) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileAnchorEl(null);
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backgroundColor: theme.palette.brand.main,
        color: theme.palette.brand.contrastText,
        borderBottom: `1px solid ${theme.palette.divider}`,
        zIndex: (t) => t.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Left section */}
        <Box display="flex" alignItems="center" gap={2}>
          <IconButton onClick={onToggleSidebar} sx={{ color: "inherit" }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" fontWeight="bold">
            Team Flux
          </Typography>
        </Box>

        {/* Right section */}
        <Box display="flex" alignItems="center" gap={2}>
          <IconButton onClick={handleNotifOpen} sx={{ color: "inherit" }}>
            <NotificationsIcon />
          </IconButton>
          <Menu
            anchorEl={notifAnchorEl}
            open={Boolean(notifAnchorEl)}
            onClose={handleNotifClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem disabled>No new notifications</MenuItem>
          </Menu>

          <IconButton onClick={handleProfileOpen} sx={{ color: "inherit" }}>
            <AccountCircleIcon />
          </IconButton>
          <Menu
            anchorEl={profileAnchorEl}
            open={Boolean(profileAnchorEl)}
            onClose={handleProfileClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <Box px={2} py={1.5}>
              <Typography variant="body2" color="textSecondary">
                Signed in as
              </Typography>
              <Typography variant="subtitle2">
                {session?.user?.name ?? session?.user?.email ?? "User"}
              </Typography>
            </Box>
            <Divider />
            <DropdownItem
              onClick={() => {
                handleProfileClose();
                router.push("/dashboard/profile");
              }}
            >
              Profile
            </DropdownItem>

            {/* ✅ Direct logout dropdown item */}
            <LogoutDropdownItem />
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
