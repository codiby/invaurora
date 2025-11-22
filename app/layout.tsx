import type { Metadata } from "next";
import { Geist, Geist_Mono, Cinzel, Lato, MonteCarlo } from "next/font/google";
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
  display: "swap",
});

const lato = Lato({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
});

const montecarlo = MonteCarlo({
  variable: "--font-montecarlo",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "XV Años - Aurora Guadalupe",
  description:
    "Celebremos juntos los XV años de Aurora Guadalupe Cabrera Galaviz - 20 de Diciembre 2025",
  openGraph: {
    images: ["https://invaurora.vercel.app/images/IMG_2535.jpg"],
  },
};

const fonts = [geistSans, geistMono, cinzel, pinyonScript, lato, montecarlo];
const fontVariables = fonts.map((font) => font.variable).join(" ");

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${fontVariables} bg-mint-50 text-mint-900 font-body antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
