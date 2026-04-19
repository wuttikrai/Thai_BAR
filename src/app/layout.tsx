import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ระบบค้นหาบทบรรณาธิการเนติ สมัยที่ 63 - สมัยที่ 78",
  description: "ระบบค้นหาบทบรรณาธิการเนติ สมัยที่ 63 - สมัยที่ 78",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className="min-h-screen bg-gray-50">
        {children}
      </body>
    </html>
  );
}