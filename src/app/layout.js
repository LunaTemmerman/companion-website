"use client";

import {Inter} from "next/font/google";
import "./globals.css";
import {useEffect} from "react";
import {init} from "./state/firebase/init";

const inter = Inter({subsets: ["latin"]});

export default function RootLayout({children}) {
  useEffect(() => {
    init();
  });
  return (
    <html lang="en">
      <body className={inter.className}>
        <header>
          <img src="/logo.svg" alt="bleu and white circle logo icon" />
          <nav>
            <a href="/login">Login</a>
            <a href="/book">Book</a>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
