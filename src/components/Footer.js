import Link from 'next/link';
import { Home } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-12 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Home size={20} className="text-blue-600" />
            <span className="font-bold text-blue-600">Maison</span>
            <span className="font-bold text-green-500">+</span>
            <span className="text-gray-400 text-sm ml-2">© 2026</span>
          </div>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link href="/a-propos" className="hover:text-blue-600 transition">À propos</Link>
            <Link href="/cgu" className="hover:text-blue-600 transition">CGU</Link>
            <Link href="/confidentialite" className="hover:text-blue-600 transition">Confidentialité</Link>
            <Link href="/chat-support" className="hover:text-blue-600 transition">Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}