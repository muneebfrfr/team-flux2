// src/app/page.tsx
"use client";

import {
  Box,
  Button,
  Container,
  Typography,
  Link as MuiLink,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import prisma from "@/lib/db";

export default async function Home() {
  const users = await prisma.users.findMany();

  return (
    <Container
      sx={{
        display: "flex",
        minHeight: "100vh",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 4,
        py: 8,
      }}
    >
      <Image
        src="/next.svg"
        alt="Next.js logo"
        width={180}
        height={38}
        priority
        style={{ filter: "invert(1)" }}
      />

      <Box>
        <Typography variant="h6" gutterBottom>
          Get started by editing <code>src/app/page.tsx</code>
        </Typography>
        <Typography variant="body1">
          Save and see your changes instantly.
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        <Button
          variant="contained"
          color="primary"
          href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          startIcon={
            <Image
              src="/vercel.svg"
              alt="Vercel logo"
              width={20}
              height={20}
              style={{ filter: "invert(1)" }}
            />
          }
        >
          Deploy Now
        </Button>
        <Button
          variant="outlined"
          href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
        >
          Read our docs
        </Button>
      </Box>

      <Box
        component="footer"
        sx={{ display: "flex", gap: 4, flexWrap: "wrap", mt: 8 }}
      >
        <MuiLink component={Link} href="/api-docs" underline="hover">
          API Documentation
        </MuiLink>
        <MuiLink component={Link} href="/api/auth/signin" underline="hover">
          Sign In
        </MuiLink>
        <MuiLink component={Link} href="/dashboard" underline="hover">
          Dashboard
        </MuiLink>
      

         <MuiLink component={Link} href="/signup" underline="hover">
          Signup
        </MuiLink>
      </Box>
    </Container>
  );
}
