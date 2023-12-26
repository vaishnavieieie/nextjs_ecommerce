"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import React, { useCallback } from "react";
import { useRouter } from "next/navigation";

const Login = (req: any) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const { data: session, status } = useSession();
  console.log(session);
  const router = useRouter();

  const onSubmit = useCallback(
    async (e: any) => {
      console.log("Submit");
      e.preventDefault();
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      console.log("Result: ", res);
      if (res?.error) {
        console.log("Error");
        window.alert("Invalid Credentials");
        // router.back();
      } else {
        console.log("Success");
        // window.alert("Invalid Credentials");
      }
    },
    [email, password],
  );

  return session ? (
    <div>
      Logged in as {session?.user?.email}
      <button onClick={() => signOut()}>Logout</button>
    </div>
  ) : (
    <>
      <div>Login</div>
      <form onSubmit={onSubmit}>
        <input
          className="text-black"
          type="text"
          placeholder="email"
          name={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          name={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </>
  );
};

export default Login;
