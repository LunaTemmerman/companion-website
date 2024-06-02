"use client";

import {signout} from "@/lib/firebase/authentication";
import {useEffect, useState} from "react";

export default function SignOut() {
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    async function handleSignOut() {
      const result = await signout();
      if (result.error) {
        setFeedback(result.error);
      } else {
        setFeedback(result.data);
      }
    }

    handleSignOut();
  }, []);

  return <main>{feedback ? <p>{feedback}</p> : <p>Signing out...</p>}</main>;
}
