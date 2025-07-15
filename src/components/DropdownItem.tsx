"use client";

import Button from "@mui/material/Button";
import { signOut } from "next-auth/react";
import React from "react";

interface DropdownItemProps {
  onClick?: () => void;
  children: React.ReactNode;
  color?: string;
}

// ✅ Generic Dropdown Item
export default function DropdownItem({
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

// ✅ Prebuilt Logout Item (red button)
export function LogoutDropdownItem() {
  return (
    <DropdownItem
      onClick={() => signOut({ callbackUrl: "/login" })}
      color="error.main"
    >
      Logout
    </DropdownItem>
  );
}
