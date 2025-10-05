import type { Metadata } from "next";
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ToastManagerProvider } from "@/components/ui/use-toast";
import { ThemeProvider } from "@/contexts/ThemeContext";

const geistSans = GeistSans;
const geistMono = GeistMono;

export const metadata: Metadata = {
  title: {
    default: "DeliveryNext",
    template: "%s | DeliveryNext",
  },
  description: "Plataforma moderna de delivery para restaurantes e clientes.",
  metadataBase: new URL(process.env.NEXTAUTH_URL || "http://localhost:3000"),
  applicationName: "DeliveryNext",
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <ToastManagerProvider>
            {children}
            <Toaster />
          </ToastManagerProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
