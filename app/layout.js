import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Traco",
  description: "Personal finance manager",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider proxyUrl="https://traco-six.vercel.app/__clerk">
      <html lang="en">
        <body className={`${inter.className} flex flex-col min-h-screen`}>
          <Header />

          <main className="flex-1 mt-16">{children}</main>

          <Toaster richColors />
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
