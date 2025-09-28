import type { Metadata } from "next";
import { Geist, GeistMono } from "geist/font";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ToastManagerProvider } from "@/components/ui/use-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = GeistMono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
        <ToastManagerProvider>
          {children}
          <Toaster />
        </ToastManagerProvider>
      </body>
    </html>
  );
}
