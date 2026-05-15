export default async function sitemap() {
  const baseUrl = 'https://maison-plus-frontend-35xo.vercel.app';

  // Pages statiques
  const pages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/annonces`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
    { url: `${baseUrl}/recherche`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.8 },
    { url: `${baseUrl}/inscription`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/connexion`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/estimation`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/simulation-credit`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/marche`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/premium`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/a-propos`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/cgu`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/confidentialite`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ];

  // Annonces dynamiques
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://maison-plus-backend.onrender.com/api'}/annonces?limite=100`);
    const data = await response.json();
    const annonces = (data.annonces || []).map((a) => ({
      url: `${baseUrl}/annonces/${a.id}`,
      lastModified: new Date(a.updated_at || a.created_at),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));
    return [...pages, ...annonces];
  } catch {
    return pages;
  }
}