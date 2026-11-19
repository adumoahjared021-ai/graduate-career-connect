import type { Metadata, Viewport } from "next";
import "./globals.css";
import AppShell from "@/components/AppShell";
import PwaSetup from "@/components/PwaSetup";
import { AppProvider } from "@/lib/store";

export const metadata: Metadata = {
  title: "Graduate Career Connect",
  description:
    "Skills, opportunities and mentors for graduates making the move from university into work.",
  applicationName: "Graduate Career Connect",
  appleWebApp: {
    capable: true,
    title: "CareerConnect",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#134e45",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <AppProvider>
          <AppShell>{children}</AppShell>
        </AppProvider>
        <PwaSetup />
      </body>
    </html>
  );
}
