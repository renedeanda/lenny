import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Browse Topics - Lenny's Podcast PM Philosophy",
  description: "Browse 36 curated product management topics from Lenny's Podcast. AI strategy, leadership, growth, product-market fit, execution, and more.",
  openGraph: {
    title: "Browse Topics - Lenny's Podcast PM Philosophy",
    description: "Browse 36 curated product management topics from Lenny's Podcast.",
    url: 'https://lenny.productbuilder.net/topics',
    siteName: "Lenny's Podcast PM Philosophy",
    type: 'website',
  },
  alternates: {
    canonical: 'https://lenny.productbuilder.net/topics',
  },
};

export default function TopicsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
