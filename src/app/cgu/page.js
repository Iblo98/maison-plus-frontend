import Navbar from '../../components/Navbar';
import Link from 'next/link';

export const metadata = {
  title: 'Conditions Générales d\'Utilisation',
  description: 'Conditions générales d\'utilisation de la plateforme Maison+ au Burkina Faso.',
};

export default function CGU() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-12">

        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Conditions Générales d&apos;Utilisation</h1>
          <p className="text-gray-500 mb-8">Dernière mise à jour : Mai 2026</p>

          <div className="space-y-8 text-gray-700">

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-3">1. Présentation de Maison+</h2>
              <p className="leading-relaxed">
                Maison+ est une plateforme numérique de mise en relation entre vendeurs/propriétaires et acheteurs/locataires
                au Burkina Faso. La plateforme permet la publication et la consultation d&apos;annonces immobilières,
                d&apos;offres hôtelières, de services de restauration et de marketplace.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-3">2. Acceptation des conditions</h2>
              <p className="leading-relaxed">
                En utilisant Maison+, vous acceptez sans réserve les présentes conditions générales d&apos;utilisation.
                Si vous n&apos;acceptez pas ces conditions, vous ne pouvez pas utiliser la plateforme.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-3">3. Création de compte</h2>
              <p className="leading-relaxed mb-3">
                Pour accéder aux fonctionnalités complètes de Maison+, vous devez créer un compte.
                Vous êtes responsable de la confidentialité de vos identifiants.
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>L&apos;inscription est gratuite pour les particuliers et professionnels</li>
                <li>Vous devez fournir des informations exactes et à jour</li>
                <li>Un seul compte par personne physique est autorisé</li>
                <li>Vous devez avoir au moins 18 ans pour créer un compte</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-3">4. Publication d&apos;annonces</h2>
              <p className="leading-relaxed mb-3">
                Les utilisateurs peuvent publier des annonces dans les catégories disponibles.
                Toute annonce doit respecter les règles suivantes :
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Les informations doivent être exactes et vérifiables</li>
                <li>Les photos doivent correspondre au bien réel</li>
                <li>Le prix affiché doit être le prix réel</li>
                <li>Les annonces frauduleuses sont strictement interdites</li>
                <li>Maison+ se réserve le droit de supprimer toute annonce non conforme</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-3">5. Commissions et paiements</h2>
              <p className="leading-relaxed mb-3">
                Maison+ prélève une commission de <strong>5%</strong> sur chaque transaction effectuée via la plateforme.
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>L&apos;inscription et la publication d&apos;annonces sont gratuites (jusqu&apos;à 5 annonces)</li>
                <li>La commission est prélevée automatiquement lors du paiement</li>
                <li>Le vendeur reçoit 95% du montant de la transaction</li>
                <li>Les paiements sont sécurisés via Orange Money, Moov Money et Carte bancaire</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-3">6. Responsabilités</h2>
              <p className="leading-relaxed mb-3">
                Maison+ agit en tant qu&apos;intermédiaire et ne peut être tenu responsable :
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Des informations inexactes fournies par les utilisateurs</li>
                <li>Des transactions effectuées en dehors de la plateforme</li>
                <li>Des litiges entre acheteurs et vendeurs</li>
                <li>De la qualité des biens ou services proposés</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-3">7. Données personnelles</h2>
              <p className="leading-relaxed">
                Vos données personnelles sont collectées et traitées conformément à notre
                <Link href="/confidentialite" className="text-blue-600 hover:underline ml-1">
                  Politique de Confidentialité
                </Link>.
                Maison+ s&apos;engage à ne jamais vendre vos données à des tiers.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-3">8. Suspension et résiliation</h2>
              <p className="leading-relaxed">
                Maison+ se réserve le droit de suspendre ou supprimer tout compte qui ne respecte pas
                les présentes conditions, sans préavis ni remboursement.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-3">9. Droit applicable</h2>
              <p className="leading-relaxed">
                Les présentes conditions sont régies par le droit burkinabé. Tout litige sera soumis
                aux tribunaux compétents de Ouagadougou, Burkina Faso.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-3">10. Contact</h2>
              <p className="leading-relaxed">
                Pour toute question concernant ces conditions, contactez-nous à :
                <a href="mailto:contact@maisonplus.bf" className="text-blue-600 hover:underline ml-1">
                  contact@maisonplus.bf
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}