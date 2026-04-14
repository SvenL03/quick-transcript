import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "quick-transcript",
  description: "Drop audio. Get text.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#FAFAFA] text-[#111827] antialiased">{children}</body>
    </html>
  );
}
