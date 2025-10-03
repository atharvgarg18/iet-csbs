import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
}

export function SEO({ 
  title = "CSBS IET DAVV - Computer Science & Business Systems",
  description = "Pioneering 4-year B.Tech program in Computer Science & Business Systems developed with TCS at Institute of Engineering & Technology, DAVV Indore. Industry-aligned curriculum combining CS fundamentals with business systems.",
  image = "/favicon.ico",
  url = "https://iet-csbs.vercel.app",
  type = "website"
}: SEOProps) {
  useEffect(() => {
    // Set document title
    document.title = title;

    // Set or update meta tags
    const setMetaTag = (name: string, content: string, property = false) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;
      
      if (!meta) {
        meta = document.createElement('meta');
        if (property) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      
      meta.setAttribute('content', content);
    };

    // Basic meta tags
    setMetaTag('description', description);
    setMetaTag('keywords', 'CSBS, Computer Science, Business Systems, IET DAVV, TCS, Engineering, B.Tech, Indore, Admission, Notes, Papers');
    setMetaTag('author', 'CSBS IET DAVV');
    setMetaTag('robots', 'index, follow');
    setMetaTag('viewport', 'width=device-width, initial-scale=1.0');

    // Open Graph tags
    setMetaTag('og:title', title, true);
    setMetaTag('og:description', description, true);
    setMetaTag('og:image', image, true);
    setMetaTag('og:url', url, true);
    setMetaTag('og:type', type, true);
    setMetaTag('og:site_name', 'CSBS IET DAVV', true);

    // Twitter Card tags
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', title);
    setMetaTag('twitter:description', description);
    setMetaTag('twitter:image', image);

    // Additional SEO tags
    setMetaTag('theme-color', '#1e40af'); // primary color
    setMetaTag('msapplication-TileColor', '#1e40af');

    // Canonical link
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);

    // Manifest link for PWA
    let manifest = document.querySelector('link[rel="manifest"]') as HTMLLinkElement;
    if (!manifest) {
      manifest = document.createElement('link');
      manifest.setAttribute('rel', 'manifest');
      manifest.setAttribute('href', '/manifest.json');
      document.head.appendChild(manifest);
    }

  }, [title, description, image, url, type]);

  return null;
}

export default SEO;