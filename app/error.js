"use client";

export default function Error({ error, reset }) {
  return (
    <main>
      <h1>Somthing went wrong!</h1>
      <p>{error.message}</p>
      <button onClick={reset}>Try again</button>
    </main>
  );
}
