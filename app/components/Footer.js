"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";

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

  if (hideFooter) return null;

  return (
    <footer>
      <div className="footer-container">
        
        {/* Upper Grid Section */}
        <div className="footer-grid">
          
          {/* Column 1: Brand & Tagline */}
          <div className="footer-col brand-col">
            <h2 className="footer-brand-title">
              BreedLy <span className="paw">🐾</span>
            </h2>
            <p className="footer-brand-desc">
              Your thoughtful, AI-powered companion to understanding dog breeds, personalized care schedules, and dog behavioral analysis.
            </p>
            <div className="footer-social-links">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <i className="fa-brands fa-instagram"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <i className="fa-brands fa-twitter"></i>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <i className="fa-brands fa-facebook-f"></i>
              </a>
            </div>
          </div>

          {/* Column 2: Discover */}
          <div className="footer-col">
            <h3>Discover</h3>
            <ul className="footer-col-links">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/breeds">Breeds</Link></li>
              <li><Link href="/breed-selector">Breed Quiz</Link></li>
              <li><Link href="/puphub">PupHub AI Tools</Link></li>
            </ul>
          </div>

          {/* Column 3: Care & Guidance */}
          <div className="footer-col">
            <h3>Care Guides</h3>
            <ul className="footer-col-links">
              <li><Link href="/food-guide">Nutrition & Diet</Link></li>
              <li><Link href="/health-guide">Health & Vet</Link></li>
              <li><Link href="/training-guide">Training Methods</Link></li>
              <li><Link href="/care-grooming">Coat Grooming</Link></li>
            </ul>
          </div>

          {/* Column 4: Support & Contact */}
          <div className="footer-col">
            <h3>Get in Touch</h3>
            <ul className="footer-col-links">
              <li><Link href="/community">Community Stories</Link></li>
              <li><Link href="/contact">Support / Contact</Link></li>
              <li className="footer-contact-info">📧 hello@breedly.com</li>
            </ul>
          </div>

        </div>

        {/* Divider Line */}
        <hr className="footer-divider" />

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p className="copyright">
            © {new Date().getFullYear()} BreedLy. All rights reserved.
          </p>
          <p className="footer-heart-msg">
            Made with <span className="heart-icon">🤎</span> for dogs everywhere.
          </p>
        </div>

      </div>
    </footer>
  );
}
