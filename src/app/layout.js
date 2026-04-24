import { Geist } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import { LangueProvider } from '../context/LangueContext';
import { Toaster } from 'react-hot-toast';

const geist = Geist({ subsets: ['latin'] });

export const metadata = {
  title: 'Maison+ | Location et Vente Immobilière',
  description: 'La plateforme de référence pour la location et vente immobilière au Burkina Faso',
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