import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords, ogImage, ogType = 'website', canonicalUrl }) => {
  const siteTitle = "Dazzler Beauty | Luxury Nail Artistry & Beauty Academy Pune";
  const fullTitle = title ? `${title} | Dazzler Beauty` : siteTitle;
  const defaultDescription = "Dazzler Beauty in Pune offers luxurious nail art, professional cosmetics, and expert beauty courses. Elevate your style with our precision artistry.";
  const metaDescription = description || defaultDescription;
  const siteUrl = "https://dazzlerbeauty.in"; // Replace with actual domain if known

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      {canonicalUrl && <link rel="canonical" href={`${siteUrl}${canonicalUrl}`} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={ogImage || "/images/DazzlerBeauty.jpeg"} />
      <meta property="og:url" content={siteUrl + (canonicalUrl || "")} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={ogImage || "/images/DazzlerBeauty.jpeg"} />

      {/* Additional SEO Best Practices */}
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta charSet="UTF-8" />
    </Helmet>
  );
};

export default SEO;
