// app/breeds/[breed]/page.js
// ✅ Server component — NO "use client"
// Wraps the client component in Suspense so useParams()
// and useRouter() initialise safely in App Router (Next.js 14+)

import { Suspense } from "react";
import BreedDetailClient from "./BreedDetailClient";

export function generateStaticParams() {
  return [];
}

export default function BreedPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "60vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            fontFamily: "'DM Sans', sans-serif",
            color: "#9A9A9A",
          }}
        >
          <span style={{ fontSize: "2.5rem" }}>🐾</span>
          <p style={{ fontSize: "1rem" }}>Loading breed info…</p>
        </div>
      }
    >
      <BreedDetailClient />
    </Suspense>
  );
}