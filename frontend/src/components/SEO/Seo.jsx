import { Helmet } from 'react-helmet-async';

const SEO = ({
  title,
  description,
  keywords,
  ogImage,
  ogUrl,
  canonicalUrl,
  structuredData,
  noIndex = false,
  additionalMeta = []
}) => {
  const siteTitle = 'Energen';
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const siteDescription =
    description ||
    'Energen delivers reliable commercial and residential solar energy systems across Kenya, including Nairobi, Umoja, Donholm, Pipeline, Imara Daima, Kiambu, Thika, Congo, Wajir, and Isiolo. From solar panel installation and hybrid inverters to lithium battery storage and off-grid solar solutions, Energen provides efficient, affordable, and dependable renewable energy systems for homes, businesses, and rural communities across Kenya, backed by professional installation and ongoing support.';
  const siteKeywords =
    keywords ||
    'solar energy Kenya, solar installation Nairobi, renewable energy Kenya, solar panels Kenya, battery storage Kenya, solar installation Umoja, solar power Donholm, solar energy Pipeline Nairobi, solar installer Imara Daima, solar panels Kiambu, solar installation Thika, solar power Congo Nairobi, solar installation Wajir, solar panels Isiolo, off-grid solar Kenya, hybrid solar inverter Kenya, lithium battery solar Kenya, affordable solar panels Kenya, solar backup power Kenya, Energen solar Kenya';
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const baseUrl = import.meta.env.VITE_SITE_URL || origin || 'https://www.energen.co.ke';
  const defaultImage = ogImage || `${baseUrl}/logo.png`;
  const canonical = canonicalUrl || `${baseUrl}${typeof window !== 'undefined' ? window.location.pathname : ''}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={siteDescription} />
      <meta name="keywords" content={siteKeywords} />
      <meta name="author" content="Energen" />
      <meta name="robots" content={noIndex ? 'noindex, nofollow' : 'index, follow'} />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <link rel="canonical" href={canonical} />

      <meta property="og:type" content="website" />
      <meta property="og:url" content={ogUrl || canonical} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={siteDescription} />
      <meta property="og:image" content={defaultImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={siteTitle} />
      <meta property="og:locale" content="en_US" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={ogUrl || canonical} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={siteDescription} />
      <meta name="twitter:image" content={defaultImage} />
      <meta name="twitter:image:alt" content="Energen solar energy solutions" />

      <meta name="theme-color" content="#0052FF" />
      <meta name="msapplication-TileColor" content="#0052FF" />

      {additionalMeta.map((meta, index) => (
        <meta key={index} {...meta} />
      ))}

      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;