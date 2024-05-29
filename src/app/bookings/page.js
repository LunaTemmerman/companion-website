"use client";

import {auth} from "@/lib/firebase/init";
import {onAuthStateChanged} from "firebase/auth";
import {collection, onSnapshot, query, where} from "firebase/firestore";
import {useRouter} from "next/navigation";
import {useEffect, useRef, useState} from "react";

export default function Bookings() {
  const [loading, setLoading] = useState(true);
  const [visits, setVisits] = useState([]);
  const [error, setError] = useState("");
  const userId = useRef(null);

  const router = useRouter();
  useEffect(() => {
    setLoading(true);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/signin");
      } else {
        userId.current = user.uid;
        try {
        } catch (error) {
          console.error("Error fetching user data:", error);
          setError(error);
        }
      }
    });
    return unsubscribe;
  }, []);
  return (
    <main>
      {error && <p className="error">{error}</p>}
      <ul>
        {visits.length > 0 ? (
          visits.map((visit) => <li key={visit.id}></li>)
        ) : (
          <h1>No visits planned...</h1>
        )}
      </ul>
      <a href="/">Make a new booking</a>
    </main>
  );
}
