import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Astrology App - Web Panel",
  description: "Test your astrology mobile app on the web",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
