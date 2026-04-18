import { ImageResponse } from 'next/og';
import { readFileSync } from 'fs';
import { join } from 'path';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  const logo = readFileSync(join(process.cwd(), 'public/images/logo.png'));
  const logoSrc = `data:image/png;base64,${logo.toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          background: '#2D6A4F',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img src={logoSrc} style={{ width: '80%', height: '80%', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
      </div>
    ),
    { ...size }
  );
}
