import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The PM Philosophy Map | Discover Your Product Thinking",
  description: "Navigate the Product Universe. Discover your PM philosophy through 303 episodes of Lenny's Podcast.",
  openGraph: {
    title: "The PM Philosophy Map",
    description: "Every PM is lost somewhere in the Product Universe",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "The PM Philosophy Map",
    description: "Every PM is lost somewhere in the Product Universe",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
