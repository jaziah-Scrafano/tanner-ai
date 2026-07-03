import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tanner A.I.",
  description: "AI Budtender",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
