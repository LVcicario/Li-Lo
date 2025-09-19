import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://li-lo.com';

  // Static pages
  const staticPages = [
    '',
    '/sneakers',
    '/collections',
    '/exclusive',
    '/limited-edition',
    '/new-arrivals',
    '/about',
    '/contact',
    '/size-guide',
    '/shipping',
    '/returns',
    '/authenticity',
    '/privacy-policy',
    '/terms-of-service',
    '/cookie-policy',
    '/legal-notice',
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Add auth pages with lower priority
  const authPages = [
    '/auth/login',
    '/auth/register',
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.3,
  }));

  // Here you would fetch dynamic product pages from database
  // For now, returning static pages only
  const productPages: MetadataRoute.Sitemap = [];

  // In production, you would fetch products like:
  // const products = await getProducts();
  // const productPages = products.map(product => ({
  //   url: `${baseUrl}/sneakers/${product.slug}`,
  //   lastModified: product.updatedAt,
  //   changeFrequency: 'daily' as const,
  //   priority: 0.7,
  // }));

  return [...staticPages, ...authPages, ...productPages];
}