import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Finne OS — Next-Generation AI Assistant Banking Console",
  description: "Secure customer onboarding, branch analytics, and retail banking dashboard.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
