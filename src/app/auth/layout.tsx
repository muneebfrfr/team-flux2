import type { Metadata } from "next";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export const metadata: Metadata = {
  title: "Auth | Team Flux",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box
      sx={{ display: "flex", position: "fixed", inset: 0, overflow: "hidden" }}
    >
      {/* Left Panel: Centered form content */}
      <Box
        sx={{
          flex: 1,
          backgroundColor: "#f0f2f5",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {children}
      </Box>

      {/* Right Panel: Branding */}
      <Box
        sx={{
          width: { xs: "0%", md: "50%" },
          background: "linear-gradient(to right, #764ba2, #667eea)",
          color: "#fff",
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          p: 5,
          textAlign: "center",
        }}
      >
        <Typography variant="h5" sx={{ mb: 2 }}>
          WELCOME TO
        </Typography>
        <Typography variant="h3" sx={{ fontWeight: 600, mb: 2 }}>
          Team Flux
        </Typography>
      </Box>
    </Box>
  );
}
