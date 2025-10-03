export function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://iet-csbs.vercel.app/#organization",
        "name": "Institute of Engineering & Technology, DAVV",
        "alternateName": "IET DAVV",
        "url": "https://iet-csbs.vercel.app",
        "logo": {
          "@type": "ImageObject",
          "url": "https://iet-csbs.vercel.app/favicon.ico"
        },
        "sameAs": [
          "https://www.ietdavv.edu.in"
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://iet-csbs.vercel.app/#website",
        "url": "https://iet-csbs.vercel.app",
        "name": "CSBS IET DAVV",
        "description": "Computer Science & Business Systems program at Institute of Engineering & Technology, DAVV Indore",
        "publisher": {
          "@id": "https://iet-csbs.vercel.app/#organization"
        },
        "inLanguage": "en-US"
      },
      {
        "@type": "Course",
        "@id": "https://iet-csbs.vercel.app/#course",
        "name": "Computer Science & Business Systems",
        "description": "A pioneering 4-year B.Tech program developed in collaboration with TCS, combining computer science fundamentals with business systems knowledge",
        "provider": {
          "@id": "https://iet-csbs.vercel.app/#organization"
        },
        "educationalLevel": "Undergraduate",
        "timeRequired": "P4Y", // 4 years in ISO 8601 duration format
        "occupationalCategory": "Computer Science, Business Systems, Software Engineering",
        "partner": {
          "@type": "Organization",
          "name": "Tata Consultancy Services",
          "alternateName": "TCS"
        }
      },
      {
        "@type": "WebPage",
        "@id": "https://iet-csbs.vercel.app/#webpage",
        "url": "https://iet-csbs.vercel.app",
        "name": "CSBS IET DAVV - Computer Science & Business Systems",
        "isPartOf": {
          "@id": "https://iet-csbs.vercel.app/#website"
        },
        "about": {
          "@id": "https://iet-csbs.vercel.app/#course"
        },
        "datePublished": "2024-01-01",
        "dateModified": new Date().toISOString().split('T')[0],
        "description": "Official website providing academic resources, notes, papers, and information for CSBS students at IET DAVV",
        "inLanguage": "en-US"
      }
    ]
  };

  return (
    <script 
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export default StructuredData;