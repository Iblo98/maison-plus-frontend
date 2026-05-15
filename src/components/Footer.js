import Link from 'next/link';
import { Home } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8 px-4 mt-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Home className="text-blue-400" size={24} />
          <span className="text-xl font-bold">
            Maison<span className="text-green-400">+</span>
          </span>
        </div>
        <p className="text-gray-400 text-sm text-center mb-6">
          © 2026 MaisonPlus — La plateforme immobilière de confiance au Burkina Faso et en Afrique.
        </p>
        <div className="flex gap-6 justify-center flex-wrap text-sm text-gray-400">
          <Link href="/a-propos" className="hover:text-white transition">À propos</Link>
          <Link href="/cgu" className="hover:text-white transition">CGU</Link>
          <Link href="/confidentialite" className="hover:text-white transition">Confidentialité</Link>
          <Link href="/chat-support" className="hover:text-white transition">Support</Link>
          <Link href="/annonces" className="hover:text-white transition">Annonces</Link>
          <Link href="/estimation" className="hover:text-white transition">Estimation IA</Link>
        </div>
      </div>
    </footer>
  );
}