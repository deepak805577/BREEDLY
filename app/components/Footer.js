"use client";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  // 🚫 Hide footer on immersive flows
  const hideFooter =
    pathname.startsWith("/breed-selector") ||
    pathname.startsWith("/results") ||
    pathname.startsWith("/adoption-guide")||
    pathname.startsWith("/adoption-success")||
    pathname.startsWith("/breeds")||
    pathname.startsWith("/login")||
    pathname.startsWith("/my-dog")||
    pathname.startsWith("/food-guide")||
    pathname.startsWith("/health-guide")||
    pathname.startsWith("/training-guide")||
    pathname.startsWith("/care-grooming")||
    pathname.startsWith("/bark-analyzer")||
    pathname.startsWith("/pet-services")||
    pathname.startsWith("/detect-dog")||
    pathname.startsWith("/chat")||
    pathname.startsWith("/community")||
    pathname.startsWith("/profile");




    

    

  // ✅ IMPORTANT: stop rendering completely
  if (hideFooter) return null;

  return (
    <footer className={hideFooter ? "nav-hidden" : ""}>
      <div className="footer-container">
        <div className="footer-brand">
          <h2>BreedLy 🐾</h2>
          <p>Your trusted guide to dog breeds & care.</p>
        </div>

        <div className="footer-links">
          <a href="/">Home</a>
          <a href="/breeds">Breeds</a>
          <a href="/blog">Guides</a>
          <a href="/breed-selector">Breed Selector</a>
          <a href="/contact">Contact</a>
        </div>

        <p className="footer-contact">📧 hello@breedly.com</p>
        <p className="copyright">
          © {new Date().getFullYear()} BreedLy. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
