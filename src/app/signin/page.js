"use client";

import {signin} from "@/lib/firebase/authentication";
import {useRouter} from "next/navigation";
import {useState} from "react";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {data, error} = await signin(email, pwd);
    if (!error) {
      router.push("/");
    } else {
      setError(error);
    }
  };
  return (
    <main>
      <h1>Sign in</h1>
      <p>Welcome back!</p>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="pwd">Password</label>
        <input
          type="password"
          id="pwd"
          name="pwd"
          required
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
        />
        <p>
          Don&apos;t have an account yet?{" "}
          <a className="sober" href="/signup">
            Sign up
          </a>
        </p>
        <button type="submit">Submit</button>
      </form>
    </main>
  );
}
