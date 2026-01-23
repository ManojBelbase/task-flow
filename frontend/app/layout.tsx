import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Providers from "@/lib/providers";
import ClientLayout from "@/components/ClientLayout";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TaskFlow | Manage Tasks Efficiently",
  description: "A modern task management application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <ClientLayout>
            {children}
          </ClientLayout>
          {/* Toaster should be here or inside ClientLayout, usually here is fine */}
        </Providers>
      </body>
    </html>
  );
}
