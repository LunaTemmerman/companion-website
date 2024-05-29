"use client";

import {signin, signup} from "@/lib/firebase/authentication";
import {useRouter} from "next/navigation";
import {useState} from "react";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [tel, setTel] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {data, error} = await signup(email, pwd, tel, first_name, last_name);
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
        <label htmlFor="first_name">First name</label>
        <input
          type="text"
          id="first_name"
          name="first_name"
          required
          value={first_name}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <label htmlFor="last_name">Last name</label>
        <input
          type="text"
          id="last_name"
          name="last_name"
          required
          value={last_name}
          onChange={(e) => setLastName(e.target.value)}
        />
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="tel">Telephone number</label>
        <input
          type="tel"
          id="tel"
          name="tel"
          required
          value={tel}
          onChange={(e) => setTel(e.target.value)}
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
          Already have an account?{" "}
          <a className="sober" href="/signin">
            Sign in
          </a>
        </p>
        <button type="submit">Submit</button>
      </form>
    </main>
  );
}
