"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./BottomNav.module.css";
import { Home, Compass, MessageCircle, BookOpen, User } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", href: "/", icon: <Home size={24} /> },
    { name: "Discover", href: "/breeds", icon: <Compass size={24} /> },
    { name: "Community", href: "/community", icon: <MessageCircle size={24} /> },
    { name: "Guides", href: "/food-guide", icon: <BookOpen size={24} /> },
    { name: "Profile", href: "/profile", icon: <User size={24} /> },
  ];

  return (
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
            <span>{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
