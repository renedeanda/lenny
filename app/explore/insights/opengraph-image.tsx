import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Curated Insights from Lenny\'s Podcast';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#000000',
          backgroundImage: 'radial-gradient(circle at 25% 25%, #1a1a1a 0%, #000000 50%)',
          fontFamily: 'monospace',
        }}
      >
        {/* Decorative elements */}
        <div
          style={{
            position: 'absolute',
            top: 40,
            left: 40,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: '#ffb347',
            }}
          />
          <span style={{ color: '#ffb347', fontSize: 20, letterSpacing: 4 }}>
            CURATED INSIGHTS
          </span>
        </div>

        {/* Main title */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '0 60px',
          }}
        >
          <h1
            style={{
              fontSize: 72,
              fontWeight: 'bold',
              color: '#ffb347',
              margin: 0,
              lineHeight: 1.1,
              textAlign: 'center',
            }}
          >
            Verified Quotes
          </h1>
          <p
            style={{
              fontSize: 32,
              color: '#b3b3b3',
              marginTop: 20,
              maxWidth: 800,
              textAlign: 'center',
              lineHeight: 1.4,
            }}
          >
            Hand-curated insights from Lenny&apos;s Podcast
          </p>
        </div>

        {/* Features row */}
        <div
          style={{
            display: 'flex',
            gap: 40,
            marginTop: 40,
          }}
        >
          {['Search', 'Filter by Zone', 'Save Favorites'].map((feature) => (
            <div
              key={feature}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '12px 24px',
                border: '2px solid #333',
                color: '#808080',
                fontSize: 20,
              }}
            >
              {feature}
            </div>
          ))}
        </div>

        {/* Footer branding */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <span style={{ color: '#ffb347', fontSize: 24, letterSpacing: 2 }}>
            LENNY.PRODUCTBUILDER.NET
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
