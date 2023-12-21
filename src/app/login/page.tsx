"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import React, { useCallback } from "react";

const Login = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const { data: session, status } = useSession();

  const onSubmit = useCallback(
    async (e: any) => {
      e.preventDefault();
      const res = await signIn("credentials", {
        email,
        password,
      });
      console.log(res);
    },
    [email, password],
  );

  return session ? (
    <div>
      Logged in <button onClick={() => signOut()}>Logout</button>
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
