import type { Metadata } from "next";
import { Geist, Geist_Mono, Cinzel, Lato } from "next/font/google";
import { Pinyon_Script } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cinzel = Cinzel({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "600"],
});

const pinyonScript = Pinyon_Script({
  variable: "--font-script",
  subsets: ["latin"],
  weight: ["400"],
});

const lato = Lato({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
});

export const metadata: Metadata = {
  title: "XV Años - Aurora Guadalupe",
  description: "Celebremos juntos los XV años de Aurora Guadalupe Cabrera Galaviz - 20 de Diciembre 2025",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${cinzel.variable} ${pinyonScript.variable} ${lato.variable} bg-mint-50 text-mint-900 font-body antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
