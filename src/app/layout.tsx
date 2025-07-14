import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ThemeRegistry from "@/components/ThemeRegistry";
import SessionWrapper from "@/components/SessionWrapper";
import { Toaster } from "react-hot-toast"; // ✅ Import Toaster

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Team Flux",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionWrapper>
          <ThemeRegistry>
            <Toaster position="bottom-left" /> 
            <main>{children}</main>
          </ThemeRegistry>
        </SessionWrapper>
      </body>
    </html>
  );
}
