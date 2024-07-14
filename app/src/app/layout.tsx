import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import FirebaseInitialize from "@/app/_components/firebase/FirebaseInitialize";
import AuthProvider from "@/app/_components/firebase/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <FirebaseInitialize>
          <AuthProvider>{children}</AuthProvider>
        </FirebaseInitialize>
      </body>
    </html>
  );
}
