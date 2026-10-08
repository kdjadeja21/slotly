import type { Metadata } from "next";
import { Source_Sans_3 } from "next/font/google";
import { Header } from "@/app/header";
import "./globals.css";

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
});

export const metadata: Metadata = {
  title: "Slotly",
  description:
    "Slotly is a scheduling app. You share one link, and someone books a time with you.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${sourceSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <Header />
        {children}
      </body>
    </html>
  );
}
