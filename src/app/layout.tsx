import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ค้นหาคำพิพากษาฎีกา | Legal Search",
  description: "ระบบค้นหาข้อมูลทางกฎหมาย - คำพิพากษาฎีกา",
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