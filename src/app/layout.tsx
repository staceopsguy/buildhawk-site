import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";

const suisse = Inter({
  variable: "--font-suisse",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "BuildHawk · Precision Estimating. Disciplined Delivery.",
  description:
    "BuildHawk is a back-end partner for builders, developers and owner-builders. We protect profit margins, control project costs and strengthen construction execution from tender through completion.",
  icons: {
    icon: "/brand/favicon-32.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${suisse.variable} h-full`}>
      <body className="min-h-full bg-bh-white text-bh-black antialiased">
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
