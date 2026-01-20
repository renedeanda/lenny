import type { Metadata, Viewport } from "next";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";
import Footer from "@/components/Footer";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "The PM Philosophy Map | Discover Your Product Philosophy",
  description: "Discover your PM philosophy through 7 questions, 303 episodes of Lenny's Podcast, and real debates from the world's best product leaders. Built from actual transcripts.",
  keywords: ["product management", "PM philosophy", "product strategy", "Lenny's Podcast", "product thinking", "product leadership"],
  authors: [{ name: "René DeAnda", url: "https://github.com/renedeanda" }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "The PM Philosophy Map",
    description: "Every PM navigates the universe differently. Discover your philosophy through 303 episodes of Lenny's Podcast.",
    siteName: "The PM Philosophy Map",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "The PM Philosophy Map",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The PM Philosophy Map",
    description: "Discover your PM philosophy through 303 episodes of Lenny's Podcast 🔥",
    images: ["/og-image.png"],
    creator: "@lennysan",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className="font-sans antialiased cursor-none">
        <CustomCursor />
        {children}
        <Footer />
      </body>
    </html>
  );
}
