import { NextSeo, ProductJsonLd, OrganizationJsonLd } from 'next-seo';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  product?: {
    name: string;
    image: string;
    description: string;
    brand: string;
    price: number;
    currency: string;
    availability: 'InStock' | 'OutOfStock';
    sku: string;
  };
}

export function SEO({ title, description, image, url, product }: SEOProps) {
  const siteTitle = title ? `${title} | Li-Lo` : 'Li-Lo | Rare & Ultra Premium Sneakers';
  const siteDescription = description || 'Discover the most exclusive and rare sneaker collection. Ultra premium footwear for true collectors.';
  const siteImage = image || 'https://li-lo.com/og-image.jpg';
  const siteUrl = url || 'https://li-lo.com';

  return (
    <>
      <NextSeo
        title={siteTitle}
        description={siteDescription}
        canonical={siteUrl}
        openGraph={{
          url: siteUrl,
          title: siteTitle,
          description: siteDescription,
          images: [
            {
              url: siteImage,
              width: 1200,
              height: 630,
              alt: siteTitle,
            },
          ],
          site_name: 'Li-Lo',
          type: product ? 'product' : 'website',
        }}
        twitter={{
          handle: '@lilo_sneakers',
          site: '@lilo_sneakers',
          cardType: 'summary_large_image',
        }}
        additionalMetaTags={[
          {
            name: 'viewport',
            content: 'width=device-width, initial-scale=1, maximum-scale=5',
          },
          {
            name: 'keywords',
            content: 'rare sneakers, premium sneakers, exclusive footwear, limited edition, collector sneakers, luxury sneakers, Li-Lo',
          },
          {
            name: 'author',
            content: 'Li-Lo',
          },
          {
            property: 'og:locale',
            content: 'en_US',
          },
          {
            property: 'og:locale:alternate',
            content: 'fr_FR',
          },
        ]}
      />

      {product && (
        <ProductJsonLd
          productName={product.name}
          images={[product.image]}
          description={product.description}
          brand={product.brand}
          offers={[
            {
              price: product.price.toString(),
              priceCurrency: product.currency,
              availability: `https://schema.org/${product.availability}`,
              url: siteUrl,
              seller: {
                name: 'Li-Lo',
              },
            },
          ]}
          sku={product.sku}
          aggregateRating={{
            ratingValue: '4.8',
            reviewCount: '89',
          }}
        />
      )}

      <OrganizationJsonLd
        type="Corporation"
        name="Li-Lo"
        url="https://li-lo.com"
        logo="https://li-lo.com/logo.png"
        contactPoint={[
          {
            telephone: '+33-1-23-45-67-89',
            contactType: 'customer service',
            availableLanguage: ['English', 'French'],
            areaServed: ['US', 'FR', 'EU'],
          },
        ]}
        sameAs={[
          'https://www.instagram.com/lilo_sneakers',
          'https://www.twitter.com/lilo_sneakers',
          'https://www.facebook.com/lilo_sneakers',
        ]}
        address={{
          streetAddress: '123 Fashion Street',
          addressLocality: 'Paris',
          postalCode: '75001',
          addressCountry: 'FR',
        }}
      />
    </>
  );
}