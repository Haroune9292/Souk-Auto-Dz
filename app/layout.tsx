import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/NAVBAR";
import Footer from "@/components/FOOTER";

export const metadata: Metadata = {
  title: "OuedKniss Car Classifieds",
  description: "Car classifieds platform built with Next.js and Supabase",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-gray-100 text-black antialiased">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}