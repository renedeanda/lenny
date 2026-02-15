import { Metadata } from 'next';
import { BreadcrumbSchema } from '@/components/StructuredData';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://lenny.productbuilder.net';

export const metadata: Metadata = {
  title: 'Product Management Philosophy Quiz | Lenny\'s Podcast',
  description: 'Take a 10-question quiz to discover your product management philosophy. Are you a Growth Hacker, Visionary Builder, or Data Scientist? Based on insights from 294 Lenny\'s Podcast episodes.',
  keywords: [
    'product management quiz',
    'PM philosophy',
    'product leadership style',
    'Lenny\'s Podcast',
    'growth hacker',
    'product visionary',
    'product management personality',
    'Lenny Rachitsky'
  ],
  openGraph: {
    title: 'Discover Your PM Philosophy | Lenny\'s Podcast Quiz',
    description: 'Take a 10-question quiz to discover your product management philosophy. Based on insights from 294 podcast episodes.',
    url: `${baseUrl}/quiz`,
    siteName: "Lenny's Podcast PM Philosophy",
    images: [
      {
        url: `${baseUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Product Management Philosophy Quiz'
      }
    ],
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Discover Your PM Philosophy | Lenny\'s Podcast Quiz',
    description: 'Take a 10-question quiz to discover your product management philosophy.',
    images: [`${baseUrl}/og-image.png`]
  },
  alternates: {
    canonical: `${baseUrl}/quiz`
  }
};

export default function QuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Philosophy Quiz', url: '/quiz' },
        ]}
      />
      {children}
    </>
  );
}
