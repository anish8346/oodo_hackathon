"use client";

import Link from "next/link";

export default function AuthErrorPage() {
  return (
    <div style={{ maxWidth: "400px", margin: "100px auto", textAlign: "center" }}>
      <h1>Authentication Error</h1>
      <p>Something went wrong with your sign in attempt.</p>
      <Link href="/auth/signin">Back to Sign In</Link>
    </div>
  );
}
