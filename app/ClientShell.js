"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Loader from "./components/Loader";

export default function ClientShell({ children }) {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <Loader />
      <Navbar key={`nav-${pathname}`} />
      <main className="page-content" key={pathname}>
        {children}
      </main>
      <Footer />
    </>
  );
}