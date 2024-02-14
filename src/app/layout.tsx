import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./styles/globals.css";
import { cn } from "./lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Be Mine <3",
  description: "Please",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, 'h-screen bg-rose-100')}>{children}</body>
    </html>
  );
}
