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
          <div className="min-h-[100dvh] flex flex-col">
            {/* Header / Navbar */}
            <NavbarWrapper>
              <TrisquelNavbar />
            </NavbarWrapper>

            {/* Main Content */}
            <main className="flex-1 container mx-auto p-4 md:p-8">
              {children}
            </main>

            {/* Footer */}
            <footer className="py-6 px-4 text-center text-xs text-slate-400 border-t border-slate-100 bg-white mt-auto pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
              <p>© {new Date().getFullYear()} Agroservicios El Trisquel - O'Higgins</p>
            </footer>
          </div>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
