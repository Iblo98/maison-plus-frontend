import {
  Home, Building, Building2, Trees, Hotel, ShoppingBag,
  UtensilsCrossed, Music, Sofa, Shirt, Car, Tv, Dumbbell,
  Briefcase, Store, Warehouse, Tent, Coffee, Croissant,
  ChefHat, Flower, PartyPopper, Armchair, Utensils, Leaf
} from 'lucide-react';

export default function PlaceholderAnnonce({ categorie, sousType, className = '' }) {

  const getVisuel = () => {

    // Cérémonie
    if (categorie === 'ceremonie') {
      if (sousType?.includes('Chaise') || sousType?.includes('Table'))
        return { icon: Armchair, bg: 'from-rose-50 to-pink-100', couleur: 'text-rose-400', label: 'Location mobilier' };
      if (sousType?.includes('Tente') || sousType?.includes('Bâche'))
        return { icon: Tent, bg: 'from-amber-50 to-yellow-100', couleur: 'text-amber-400', label: 'Tentes & Bâches' };
      if (sousType?.includes('Sono') || sousType?.includes('Matériel'))
        return { icon: Music, bg: 'from-purple-50 to-violet-100', couleur: 'text-purple-400', label: 'Sono & Matériel' };
      if (sousType?.includes('Vaisselle') || sousType?.includes('Cuisine') || sousType?.includes('Traiteur') || sousType?.includes('Plats'))
        return { icon: ChefHat, bg: 'from-orange-50 to-amber-100', couleur: 'text-orange-400', label: 'Traiteur & Cuisine' };
      if (sousType?.includes('Décoration'))
        return { icon: Flower, bg: 'from-pink-50 to-rose-100', couleur: 'text-pink-400', label: 'Décoration' };
      return { icon: PartyPopper, bg: 'from-pink-50 to-rose-100', couleur: 'text-rose-400', label: 'Cérémonie' };
    }

    // Restaurant
    if (categorie === 'restaurant') {
      if (sousType?.includes('Fast'))
        return { icon: Utensils, bg: 'from-yellow-50 to-orange-100', couleur: 'text-orange-400', label: 'Fast-food' };
      if (sousType?.includes('Boulangerie'))
        return { icon: Croissant, bg: 'from-amber-50 to-yellow-100', couleur: 'text-amber-500', label: 'Boulangerie' };
      if (sousType?.includes('Traiteur'))
        return { icon: ChefHat, bg: 'from-green-50 to-teal-100', couleur: 'text-teal-500', label: 'Traiteur' };
      if (sousType?.includes('Maquis'))
        return { icon: Coffee, bg: 'from-red-50 to-orange-100', couleur: 'text-red-400', label: 'Maquis' };
      return { icon: UtensilsCrossed, bg: 'from-orange-50 to-red-100', couleur: 'text-orange-500', label: 'Restaurant' };
    }

    // Marketplace
    if (categorie === 'marketplace') {
      if (sousType?.includes('Électronique'))
        return { icon: Tv, bg: 'from-blue-50 to-indigo-100', couleur: 'text-blue-500', label: 'Électronique' };
      if (sousType?.includes('Mobilier'))
        return { icon: Sofa, bg: 'from-amber-50 to-yellow-100', couleur: 'text-amber-500', label: 'Mobilier' };
      if (sousType?.includes('Vêtements'))
        return { icon: Shirt, bg: 'from-pink-50 to-purple-100', couleur: 'text-pink-500', label: 'Vêtements' };
      if (sousType?.includes('Véhicule'))
        return { icon: Car, bg: 'from-gray-50 to-blue-100', couleur: 'text-gray-500', label: 'Véhicule' };
      if (sousType?.includes('Sport'))
        return { icon: Dumbbell, bg: 'from-green-50 to-emerald-100', couleur: 'text-green-500', label: 'Sport' };
      return { icon: ShoppingBag, bg: 'from-blue-50 to-indigo-100', couleur: 'text-blue-500', label: 'Objet' };
    }

    // Parcelle
    if (categorie === 'parcelle') {
      if (sousType?.includes('agricole'))
        return { icon: Leaf, bg: 'from-green-50 to-lime-100', couleur: 'text-green-500', label: 'Terrain agricole' };
      if (sousType?.includes('bâti'))
        return { icon: Building2, bg: 'from-orange-50 to-amber-100', couleur: 'text-orange-400', label: 'Terrain bâti' };
      return { icon: Trees, bg: 'from-green-50 to-emerald-100', couleur: 'text-green-500', label: 'Parcelle' };
    }

    // Hôtel
    if (categorie === 'hotel') {
      if (sousType?.includes('Auberge'))
        return { icon: Hotel, bg: 'from-indigo-50 to-blue-100', couleur: 'text-indigo-500', label: 'Auberge' };
      if (sousType?.includes('Résidence'))
        return { icon: Building, bg: 'from-blue-50 to-indigo-100', couleur: 'text-blue-500', label: 'Résidence' };
      if (sousType?.includes('Maison d\'hôtes'))
        return { icon: Home, bg: 'from-teal-50 to-green-100', couleur: 'text-teal-500', label: 'Maison d\'hôtes' };
      return { icon: Hotel, bg: 'from-blue-50 to-indigo-100', couleur: 'text-blue-500', label: 'Hôtel' };
    }

    // Maison
    if (categorie === 'maison') {
      if (sousType?.includes('Appartement'))
        return { icon: Building, bg: 'from-blue-50 to-blue-100', couleur: 'text-blue-500', label: 'Appartement' };
      if (sousType?.includes('Villa'))
        return { icon: Home, bg: 'from-green-50 to-teal-100', couleur: 'text-teal-500', label: 'Villa' };
      if (sousType?.includes('Immeuble'))
        return { icon: Building2, bg: 'from-gray-50 to-slate-100', couleur: 'text-gray-500', label: 'Immeuble' };
      if (sousType?.includes('Magasin'))
        return { icon: Store, bg: 'from-yellow-50 to-amber-100', couleur: 'text-amber-500', label: 'Magasin' };
      if (sousType?.includes('Kiosque'))
        return { icon: Store, bg: 'from-orange-50 to-yellow-100', couleur: 'text-orange-400', label: 'Kiosque' };
      if (sousType?.includes('Bureau'))
        return { icon: Briefcase, bg: 'from-indigo-50 to-blue-100', couleur: 'text-indigo-500', label: 'Bureau' };
      if (sousType?.includes('Entrepôt'))
        return { icon: Warehouse, bg: 'from-gray-50 to-slate-100', couleur: 'text-gray-500', label: 'Entrepôt' };
      return { icon: Home, bg: 'from-blue-50 to-blue-100', couleur: 'text-blue-500', label: 'Maison' };
    }

    return { icon: Home, bg: 'from-blue-50 to-blue-100', couleur: 'text-blue-400', label: 'Annonce' };
  };

  const visuel = getVisuel();
  const Icon = visuel.icon;

  return (
    <div className={`w-full h-full bg-gradient-to-br ${visuel.bg} flex flex-col items-center justify-center gap-3 ${className}`}>
      <div className={`w-16 h-16 rounded-2xl bg-white bg-opacity-60 flex items-center justify-center shadow-sm`}>
        <Icon size={36} className={visuel.couleur} />
      </div>
      <span className={`text-xs font-semibold ${visuel.couleur} bg-white bg-opacity-60 px-3 py-1 rounded-full`}>
        {visuel.label}
      </span>
    </div>
  );
}