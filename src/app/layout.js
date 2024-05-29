"use client";

import {Inter} from "next/font/google";
import "./globals.css";
import {useEffect} from "react";
import {init} from "../lib/firebase/init";

const inter = Inter({subsets: ["latin"]});

export default function RootLayout({children}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header>
          <img src="/logo.svg" alt="bleu and white circle logo icon" />
          <nav>
            <a href="/signin">Sign in</a>
            <a href="/">Book</a>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
