export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/dashboard',
          '/profil',
          '/reservations',
          '/messages',
          '/notifications',
          '/parametres',
          '/kyc',
          '/favoris',
          '/alertes',
        ],
      },
    ],
    sitemap: 'https://maison-plus-frontend-35xo.vercel.app/sitemap.xml',
  };
}