import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/auth-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Trisquel App",
  description: "Sistema de Gestión Agropecuaria",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0",
  icons: {
    icon: "/images/logo.png",
    apple: "/images/logo.png",
  },
};

import { Toaster } from "@/components/ui/sonner"
import { TrisquelNavbar } from "@/components/ui/trisquel-navbar"

import { AutoLogout } from "@/components/auth/auto-logout"

import { NavbarWrapper } from "@/components/ui/navbar-wrapper"
import { MainLayoutWrapper } from "@/components/layout/main-layout-wrapper"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <AutoLogout />

          {/* Fixed Background Layer - Solves mobile scroll issues */}
          <div
            className="fixed inset-0 -z-10 h-full w-full bg-cover bg-bottom bg-no-repeat"
            style={{
              backgroundImage: `linear-gradient(to bottom, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.4) 60%, rgba(255, 255, 255, 0.1) 100%), url('/images/field_background.png')`
            }}
          />

          <div className="min-h-screen flex flex-col overflow-x-hidden">
            {/* Header / Navbar */}
            <NavbarWrapper>
              <TrisquelNavbar />
            </NavbarWrapper>

            {/* Main Content & Footer Handled by Wrapper */}
            <MainLayoutWrapper>
              {children}
            </MainLayoutWrapper>
          </div>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
