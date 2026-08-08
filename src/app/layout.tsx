import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MomEat",
  description: "Reservas programadas de alimentación.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="es" className={`${geist.variable} h-full`}>
      <body className="min-h-full bg-stone-50 font-sans text-stone-950 antialiased">
        {children}
      </body>
    </html>
  );
}
