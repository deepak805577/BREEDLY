"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./BottomNav.module.css";
import { Home, Compass, MessageCircle, BookOpen, User, PawPrint } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", href: "/", icon: <Home size={22} /> },
    { name: "Discover", href: "/breeds", icon: <Compass size={22} /> },
    { name: "Community", href: "/community", icon: <MessageCircle size={22} /> },
    { name: "Guides", href: "/food-guide", icon: <BookOpen size={22} /> },
    { name: "Profile", href: "/profile", icon: <User size={22} /> },
  ];

  return (
    <div className={styles.bottomNavWrapper}>
      <nav className={styles.bottomNav}>
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`${styles.navItem} ${isActive ? styles.active : ""}`}
            >
              {item.icon}
              <span className={styles.navText}>{item.name}</span>
              {isActive && (
                <PawPrint size={10} className={styles.pawIndicator} fill="#B08968" />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
