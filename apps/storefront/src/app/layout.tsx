import type { Metadata } from "next";
import { Inter, Cinzel } from "next/font/google";
import { ClientProviders } from "../components/ClientProviders";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-sans" 
});

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-serif"
});

export const metadata: Metadata = {
  title: "Satyabhama Designers | Premium Indian Saree Fashion",
  description: "Exquisite luxury sarees handwoven by master weavers. Experience the heritage of Kanjeevaram, Banarasi, and Chanderi craft.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${cinzel.variable}`}>
      <body className="bg-bg text-stone-200 min-h-screen flex flex-col font-sans">
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
