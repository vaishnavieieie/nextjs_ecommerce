"use client";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function Home() {
  return (
    <div>
      Heloo <button onClick={() => signIn()}>Sign in</button>
    </div>
  );
}
