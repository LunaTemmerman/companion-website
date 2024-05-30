"use client";

import "./home.css";
import {addDoc, collection, onSnapshot, query, where} from "firebase/firestore";
import {useEffect, useRef, useState} from "react";
import {_onAuthStateChanged} from "@/lib/firebase/authentication";
import {auth, db} from "@/lib/firebase/init";
import {onAuthStateChanged} from "firebase/auth";
import {useRouter} from "next/navigation";

export default function Home() {
  const [users, setUsers] = useState([]);
  const [patient, setPatient] = useState("");
  const [visits, setVisits] = useState([]);
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [date, setDate] = useState("");
  const userId = useRef("");
  const [error, setError] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [confirm, setConfirm] = useState(false);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/signin");
      } else {
        userId.current = user.uid;
        try {
          let q = query(collection(db, "users"), where("id", "!=", user.uid));
          onSnapshot(q, (querySnapshot) => {
            const urs = [];
            querySnapshot.forEach((doc) => {
              urs.push({id: doc.id, ...doc.data()});
            });
            setUsers(urs);
          });
          q = query(
            collection(db, "appointments"),
            where("visitor", "==", user.uid)
          );
          onSnapshot(q, (querySnapshot) => {
            const vsts = [];
            querySnapshot.forEach((doc) => {
              vsts.push({id: doc.id, ...doc.data()});
            });
            console.log(vsts);
            setVisits(vsts);
            console.log(visits);
            setLoading(false);
          });
        } catch (err) {
          console.error("Error fetching user data:", err);
          setError([...error, err]);
        }
      }
    });
    return unsubscribe;
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
          date: new Date(date),
          status: "pending",
        });
        if (docRef) {
          setPatient("");
          setDescription("");
          setStartTime("");
          setEndTime("");
          setConfirm(true);
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
      {confirm ? (
        <h1>Your visit has been requested!</h1>
      ) : (
        <div>
          <h1>Book a visit to your loved ones</h1>
          <p>They receive your bookings in their tablet application.</p>
          <form onSubmit={handleAddAppointment}>
            {error.length > 0 &&
              error.map((err) => (
                <p key={err} className="error">
                  {err}
                </p>
              ))}
            <div>
              <label htmlFor="patient">Choose who you want to visit</label>
              <select
                value={patient}
                onChange={(e) => {
                  setPatient(e.target.value);
                }}
              >
                <option value={null}>Please select a patient</option>
                {users.length > 0 &&
                  users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.first_name + " " + user.last_name}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                required
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
              ></textarea>
            </div>

            <div>
              <label htmlFor="date">Date</label>
              <input
                type="date"
                id="date"
                name="date"
                required
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                }}
              />
            </div>

            <div>
              <label htmlFor="start-time">Start Time</label>
              <input
                type="time"
                id="start-time"
                name="start-time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="end-time">End Time</label>
              <input
                type="time"
                id="end-time"
                name="end-time"
                required
                value={endTime}
                onChange={(e) => {
                  setEndTime(e.target.value);
                }}
              />
            </div>

            <button type="submit">Submit</button>
          </form>
        </div>
      )}
      {visits.length > 0 ? (
        <ul>
          {visits.map((visit) => (
            <li key={visit.id} className="card">
              <p>{new Date(visit.date.seconds).toLocaleDateString()}</p>
              <p>
                {visit.start} - {visit.end}
              </p>
              <p>
                {users.find((user) => user.id === visit.patient).first_name}{" "}
                {users.find((user) => user.id === visit.patient).last_name}
              </p>
              <p>Status: {visit.status}</p>
            </li>
          ))}
        </ul>
      ) : (
        <h1>No visits planned...</h1>
      )}
    </main>
  );
}
