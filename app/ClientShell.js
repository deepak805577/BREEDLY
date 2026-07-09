"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { App as CapacitorApp } from '@capacitor/app';
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Loader from "./components/Loader";

export default function ClientShell({ children }) {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    
    let backListener = null;
    
    const setupBackButton = async () => {
      try {
        backListener = await CapacitorApp.addListener('backButton', ({ canGoBack }) => {
          if (window.location.pathname === '/' || window.location.pathname === '/home') {
            CapacitorApp.exitApp();
          } else {
            router.back();
          }
        });
      } catch (e) {
        console.error("Capacitor App plugin error:", e);
      }
    };
    
    setupBackButton();

    return () => {
      if (backListener) {
        backListener.remove();
      }
    };
  }, [router]);

  if (!mounted) {
    return <Loader />;
  }

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