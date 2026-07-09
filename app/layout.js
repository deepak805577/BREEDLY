
import "./globals.css";
import "leaflet/dist/leaflet.css";

import ClientShell from "./ClientShell";
import { AuthProvider } from "./context/AuthContext";
export const metadata = {
  title: "BreedLy – Find the Perfect Dog Breed for Your Lifestyle",
  icons: { icon: "/Breedly%20logo.png" },
  description:
    "BreedLy helps you discover the best dog breed for your lifestyle with expert guides on health, food, training, and responsible adoption.",
  keywords: [
    "dog breed selector",
    "dog breeds India",
    "dog care guide",
    "best dog for family",
    "puppy health and food"
  ],
  openGraph: {
    title: "BreedLy – Know About Paws",
    description:
      "Discover dog breeds, care guides, and find your perfect canine companion.",
    images: ["/Breedly%20logo.png"]
  }
};
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Fredoka+One&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AuthProvider>
          {/* ClientShell wraps all client-side interactive components */}
          <ClientShell>
            {children}
          </ClientShell>
        </AuthProvider>
      </body>
    </html>
  );
}