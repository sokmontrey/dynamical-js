import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dynamical",
  description: "2D position-based dynamics physics engine",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script src="https://kit.fontawesome.com/b71972c7cc.js" crossOrigin="anonymous"></script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <a href="https://github.com/sokmontrey/dynamical-js" 
          target="_blank" 
          rel="noopener noreferrer"
          className="absolute bottom-4 right-4 m-2 hover:text-[var(--acc-color)] hover:underline"
        >
          <i className="fa-brands fa-github"></i>
          <span className="ml-2">Dynamical</span>
        </a>
      </body>
    </html>
  );
}
