import type { Metadata } from "next";
import './globals.css';

export const metadata: Metadata = {
  title: "Jacket's Club Dashboard",
  description: "Comprehensive jacket's club dashboard for inventory management",
};

// Root layout - minimal, locale-specific layouts are in [locale]/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
