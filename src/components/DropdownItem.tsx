"use client";

import React from "react";
import Button from "@mui/material/Button";
import { signOut } from "next-auth/react";
import ThemeRegistry from "@/components/ThemeRegistry";

interface DropdownItemProps {
  onClick?: () => void;
  children: React.ReactNode;
  color?: string;
}

function DropdownItem({
  onClick,
  children,
  color = "text.primary",
}: DropdownItemProps) {
  return (
    <Button
      onClick={onClick}
      fullWidth
      variant="text"
      sx={{
        justifyContent: "flex-start",
        color,
        px: 2,
        py: 1,
        textTransform: "none",
        fontSize: "0.875rem",
      }}
    >
      {children}
    </Button>
  );
}

export function LogoutDropdownItem() {
  return (
    <ThemeRegistry>
      <DropdownItem
        onClick={() => signOut({ callbackUrl: "/login" })}
        color="error.main"
      >
        Logout
      </DropdownItem>
    </ThemeRegistry>
  );
}

export default function ThemedDropdownItem(props: DropdownItemProps) {
  return (
    <ThemeRegistry>
      <DropdownItem {...props} />
    </ThemeRegistry>
  );
}
