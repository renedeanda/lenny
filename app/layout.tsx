import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";
import Footer from "@/components/Footer";
import GoogleAnalytics from "@/components/GoogleAnalytics";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Discover Your Product Philosophy | Lenny's Podcast",
  description: "Take a 10-question quiz and get podcast episode recommendations that match how you work as a PM. Built from 299 episodes of Lenny's Podcast with verified quotes.",
  keywords: ["product management", "PM philosophy", "product strategy", "Lenny's Podcast", "product thinking", "product leadership", "podcast recommendations"],
  authors: [{ name: "René DeAnda", url: "https://renedeanda.com" }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://lenny.productbuilder.net'),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Discover Your Product Philosophy",
    description: "Get podcast episode recommendations that match how you work. Based on 299 episodes of Lenny's Podcast.",
    siteName: "Product Philosophy Quiz",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Product Philosophy Quiz",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Discover Your Product Philosophy",
    description: "Find Lenny's Podcast episodes that match how you work 🔥",
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
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className="font-sans antialiased cursor-none">
        <Suspense fallback={null}>
          {gaId && <GoogleAnalytics gaId={gaId} />}
        </Suspense>
        <CustomCursor />
        {children}
        <Footer />
      </body>
    </html>
  );
}
