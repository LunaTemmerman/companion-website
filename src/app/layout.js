"use client";

import {Inter} from "next/font/google";
import "./globals.css";
import {useEffect, useRef, useState} from "react";
import {auth} from "@/lib/firebase/init";
import {onAuthStateChanged} from "firebase/auth";

const inter = Inter({subsets: ["latin"]});

export default function RootLayout({children}) {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setAuthenticated(false);
      } else {
        setAuthenticated(true);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.svg" sizes="any" />
      </head>
      <body className={inter.className}>
        <header>
          <img src="/logo.svg" alt="bleu and white circle logo icon" />
          <nav>
            {authenticated.current ? (
              <a href="/signout">Sign out</a>
            ) : (
              <a href="/signin">Sign in</a>
            )}
            <a href="/">Book</a>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
