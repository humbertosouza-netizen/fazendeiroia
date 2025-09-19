import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/use-toast";
import ChatFlutuante from "@/components/ChatFlutuante";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Portal de Fazendas",
  description: "Portal de Fazendas com assistente virtual Fazendeiro IA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <main className="min-h-screen">{children}</main>
        <Toaster />
        <ChatFlutuante />
      </body>
    </html>
  );
}
