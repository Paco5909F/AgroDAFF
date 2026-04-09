import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/auth-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AgroDAFF",
  description: "Sistema de Gestión Agropecuaria SaaS",
  manifest: "/manifest.json"
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

import { Toaster } from "@/components/ui/sonner"
import { AppNavbar } from "@/components/ui/app-navbar"

import { AutoLogout } from "@/components/auth/auto-logout"

import { NavbarWrapper } from "@/components/ui/navbar-wrapper"
import { MainLayoutWrapper } from "@/components/layout/main-layout-wrapper"
import { AIAssistantWidget } from "@/components/ui/ai-assistant-widget"
import { OfflineSyncManager } from "@/components/offline/sync-manager"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-transparent`}>
        <AuthProvider>
          <AutoLogout />
          <OfflineSyncManager />

          {/* Fixed Background Layer (Global) */}
          <div className="fixed inset-0 -z-50 w-full h-full">
            <img
              src="/images/bg-v2.png"
              alt="Background"
              className="w-full h-full object-cover object-center"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/85 via-white/50 to-transparent" />
          </div>

          <div className="min-h-screen flex flex-col overflow-x-hidden">
            {/* Header / Navbar */}
            <NavbarWrapper>
              <AppNavbar />
            </NavbarWrapper>

            {/* Main Content & Footer Handled by Wrapper */}
            <MainLayoutWrapper>
              {children}
            </MainLayoutWrapper>
          </div>
        </AuthProvider>
        <AIAssistantWidget />
        <Toaster />
      </body>
    </html>
  );
}
