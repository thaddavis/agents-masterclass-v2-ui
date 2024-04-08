"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className="flex min-h-screen justify-center items-center p-24">
      <h1
        className="text-9xl cursor-pointer"
        onClick={() => {
          router.push("/agents");
        }}
      >
        Agents
      </h1>
    </main>
  );
}
