"use client";

import "./home.css";
import {onAuthStateChanged} from "firebase/auth";
import {auth} from "./state/firebase/init";
import {collection, onSnapshot, query, where} from "firebase/firestore";
import {useEffect, useRef, useState} from "react";

export default function Home() {
  const [users, setUsers] = useState([]);
  const [patient, setPatient] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [date, setDate] = useState("");
  const userId = useRef("");
  const [error, setError] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        userId.current = user.uid;
        try {
          const q = query(collection(db, "users"), where("id", "!=", user.uid));
          onSnapshot(q, (querySnapshot) => {
            const urs = [];
            querySnapshot.forEach((doc) => {
              urs.push(doc.data());
            });
            setUsers(urs);
            setLoading(false);
          });
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        // Redirect to signin
      }
    });

    return () => unsubscribe();
  }, []);

  const handleAddAppointment = async (event) => {
    event.preventDefault();
    setError([]);

    const errs = [];
    if (!date) {
      errs.push("Please select a date");
    }
    if (!startTime) {
      errs.push(`Please select a start time`);
    }
    if (!endTime) {
      errs.push(`Please select an end time`);
    }
    if (!description) {
      errs.push(`Please enter a description`);
    }

    if (errs.length === 0) {
      try {
        const docRef = await addDoc(collection(db, "appointments"), {
          patient,
          visitor: userId.current,
          description,
          start: startTime,
          end: endTime,
          date,
        });
        if (docRef) {
          setPatient("");
          setDescription("");
          setStartTime("");
          setEndTime("");
        } else {
          setError(["Something went wrong"]);
        }
      } catch (error) {
        console.error("Error adding appointment:", error);
        setError(["Something went wrong"]);
      }
    } else {
      setError(errs);
    }
  };
  return (
    <main>
      <h1>Book a visit to your loved ones</h1>
      <p>They receive your bookings in their tablet application.</p>
      <form onSubmit={handleAddAppointment}>
        {error.length > 0 &&
          error.map((err, index) => (
            <p key={index} className="error">
              {err}
            </p>
          ))}
        <div>
          <label htmlFor="title">Title</label>
          <input type="text" id="title" name="title" required />
        </div>

        <div>
          <label htmlFor="description">Description</label>
          <textarea id="description" name="description" required></textarea>
        </div>

        <div>
          <label htmlFor="date">Date</label>
          <input type="date" id="date" name="date" required />
        </div>

        <div>
          <label htmlFor="start-time">Start Time</label>
          <input type="time" id="start-time" name="start-time" required />
        </div>

        <div>
          <label htmlFor="end-time">End Time</label>
          <input type="time" id="end-time" name="end-time" required />
        </div>

        <button type="submit">Submit</button>
      </form>
    </main>
  );
}
