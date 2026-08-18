import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";

// Manual de marca: Poppins Bold/SemiBold para títulos, Inter para texto.
const poppins = Poppins({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-body",
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
    <html
      lang="es"
      className={`${poppins.variable} ${inter.variable} h-full`}
    >
      <body className="min-h-full bg-cream font-body text-charcoal antialiased">
        {children}
      </body>
    </html>
  );
}
