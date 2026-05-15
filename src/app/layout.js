import { Geist } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import { LangueProvider } from '../context/LangueContext';
import { Toaster } from 'react-hot-toast';

const geist = Geist({ subsets: ['latin'] });

export const metadata = {
  title: {
    default: 'Maison+ | Immobilier au Burkina Faso',
    template: '%s | Maison+'
  },
  description: 'La plateforme de référence pour la location, vente immobilière, hôtels, restaurants et marketplace au Burkina Faso. Trouvez votre maison, appartement, villa ou terrain à Ouagadougou et partout au Burkina.',
  keywords: [
    'immobilier Burkina Faso', 'location maison Ouagadougou',
    'vente terrain Burkina', 'appartement Ouagadougou',
    'villa Ouagadougou', 'hôtel Burkina Faso',
    'restaurant Ouagadougou', 'marketplace Burkina',
    'Maison+', 'immobilier Bobo-Dioulasso'
  ],
  authors: [{ name: 'Maison+', url: 'https://maison-plus-frontend-35xo.vercel.app' }],
  creator: 'Maison+',
  publisher: 'Maison+',
  metadataBase: new URL('https://maison-plus-frontend-35xo.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'fr_BF',
    url: 'https://maison-plus-frontend-35xo.vercel.app',
    siteName: 'Maison+',
    title: 'Maison+ | Immobilier au Burkina Faso',
    description: 'La plateforme de référence pour la location et vente immobilière au Burkina Faso.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Maison+ — Immobilier au Burkina Faso',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Maison+ | Immobilier au Burkina Faso',
    description: 'La plateforme de référence pour la location et vente immobilière au Burkina Faso.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'votre-code-verification-google',
  },
  category: 'real estate',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className={geist.className}>
        <AuthProvider>
          <LangueProvider>
            <Toaster position="top-right" />
            {children}
          </LangueProvider>
        </AuthProvider>
      </body>
    </html>
  );
}