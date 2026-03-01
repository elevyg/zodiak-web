import type { Metadata } from "next";
import { PT_Sans, Rock_Salt } from "next/font/google";
import "./globals.css";

const rockSalt = Rock_Salt({
  subsets: ["latin"],
  variable: "--font-display",
  weight: "400"
});

const ptSans = PT_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  style: ["normal", "italic"],
  weight: ["400", "700"]
});

export const metadata: Metadata = {
  metadataBase: new URL("https://zodiak-web.vercel.app"),
  title: "ZODIAK",
  description: "Indumentaria artesanal para mujeres escaladoras, hecha en Patagonia."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${rockSalt.variable} ${ptSans.variable}`}>
      <body style={{ fontFamily: "var(--font-body)" }}>{children}</body>
    </html>
  );
}
