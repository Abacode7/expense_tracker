import type { Metadata } from "next";
import { Bricolage_Grotesque, DM_Serif_Display } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});

const dmSerif = DM_Serif_Display({
  variable: "--font-dm-serif",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Expense Tracker",
  description: "Track your spending with elegance",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${bricolage.variable} ${dmSerif.variable} antialiased`}
        style={{ fontFamily: 'var(--font-bricolage), system-ui, sans-serif' }}
      >
        {children}
      </body>
    </html>
  );
}
