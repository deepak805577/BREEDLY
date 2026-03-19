"use client";

import Loader from "./Loader";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoaderClient() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (pathname === "/") {
      setLoading(true);
      const timer = setTimeout(() => setLoading(false), 2500);
      return () => clearTimeout(timer);
    } else {
      setLoading(false);
    }
  }, [pathname]);

  if (!loading || pathname !== "") return null; 

  return <Loader />;
}
