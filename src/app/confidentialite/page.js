import Navbar from '../../components/Navbar';

export const metadata = {
  title: 'Politique de Confidentialité',
  description: 'Politique de confidentialité et protection des données personnelles de Maison+.',
};

export default function Confidentialite() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Politique de Confidentialité</h1>
          <p className="text-gray-500 mb-8">Dernière mise à jour : Mai 2026</p>

          <div className="space-y-8 text-gray-700">

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-3">1. Données collectées</h2>
              <p className="leading-relaxed mb-3">Nous collectons les données suivantes :</p>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Informations d&apos;identité (nom, prénom, photo)</li>
                <li>Coordonnées (email, téléphone)</li>
                <li>Documents d&apos;identité (CNIB) pour la vérification KYC</li>
                <li>Informations de paiement (numéro Mobile Money)</li>
                <li>Données de navigation et d&apos;utilisation</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-3">2. Utilisation des données</h2>
              <p className="leading-relaxed mb-3">Vos données sont utilisées pour :</p>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Gérer votre compte et vos annonces</li>
                <li>Traiter vos paiements et transactions</li>
                <li>Vous envoyer des notifications relatives à votre activité</li>
                <li>Améliorer nos services</li>
                <li>Lutter contre la fraude</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-3">3. Protection des données</h2>
              <p className="leading-relaxed">
                Toutes vos données sont stockées de manière sécurisée sur des serveurs protégés.
                Nous utilisons le chiffrement SSL/TLS pour toutes les communications.
                Vos mots de passe sont stockés sous forme hashée et ne sont jamais accessibles.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-3">4. Partage des données</h2>
              <p className="leading-relaxed mb-3">
                Maison+ ne vend jamais vos données personnelles. Nous pouvons partager certaines
                informations avec :
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Les prestataires de paiement (Orange Money, Moov Money) pour traiter vos transactions</li>
                <li>Les autorités judiciaires si requis par la loi</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-3">5. Vos droits</h2>
              <p className="leading-relaxed mb-3">Vous disposez des droits suivants :</p>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Droit d&apos;accès à vos données</li>
                <li>Droit de rectification</li>
                <li>Droit à l&apos;effacement (droit à l&apos;oubli)</li>
                <li>Droit à la portabilité</li>
                <li>Droit d&apos;opposition</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-3">6. Cookies</h2>
              <p className="leading-relaxed">
                Maison+ utilise des cookies essentiels pour le fonctionnement de la plateforme.
                Ces cookies ne collectent pas de données personnelles à des fins publicitaires.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-3">7. Contact</h2>
              <p className="leading-relaxed">
                Pour exercer vos droits ou pour toute question :
                <a href="mailto:privacy@maisonplus.bf" className="text-blue-600 hover:underline ml-1">
                  privacy@maisonplus.bf
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}