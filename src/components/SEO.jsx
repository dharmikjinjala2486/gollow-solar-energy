import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Enterprise-level SEO Component for GOL LOW
 * Dynamically handles document metadata, social preview cards, and JSON-LD structured data.
 */
export default function SEO({
  title,
  description,
  keywords,
  canonical,
  ogType = 'website',
  ogImage = 'https://www.gollowsolarenergy.com/android-chrome-512.png',
  schemaList = []
}) {
  const location = useLocation();
  const currentUrl = `https://www.gollowsolarenergy.com${location.pathname}`;

  useEffect(() => {
    // 1. Update Title
    if (title) {
      document.title = title;
    }

    // Helper function to update/create meta tag
    const updateMeta = (name, value, isProperty = false) => {
      if (!value) return;
      const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        if (isProperty) {
          el.setAttribute('property', name);
        } else {
          el.setAttribute('name', name);
        }
        document.head.appendChild(el);
      }
      el.setAttribute('content', value);
    };

    // Helper function to update/create link tag
    const updateLink = (rel, href) => {
      if (!href) return;
      let el = document.querySelector(`link[rel="${rel}"]`);
      if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', rel);
        document.head.appendChild(el);
      }
      el.setAttribute('href', href);
    };

    // 2. Standard Meta Tags
    updateMeta('description', description);
    updateMeta('keywords', keywords);
    updateMeta('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    updateMeta('author', 'GOL LOW Solar Energy Systems Rental');
    updateMeta('publisher', 'GOL LOW Solar Energy');
    updateMeta('language', 'English');
    updateLink('canonical', canonical || currentUrl);

    // 3. OpenGraph Tags (Facebook, LinkedIn, WhatsApp, Telegram)
    updateMeta('og:title', title, true);
    updateMeta('og:description', description, true);
    updateMeta('og:url', canonical || currentUrl, true);
    updateMeta('og:type', ogType, true);
    updateMeta('og:image', ogImage, true);
    updateMeta('og:site_name', 'GOL LOW Solar Energy', true);
    updateMeta('og:locale', 'en_US', true);

    // 4. Twitter Card Tags
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', title);
    updateMeta('twitter:description', description);
    updateMeta('twitter:image', ogImage);
    updateMeta('twitter:site', '@gollowsolar');
    updateMeta('twitter:creator', '@gollowsolar');

    // 5. JSON-LD Structured Data
    // Organization Schema
    const orgSchema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': 'https://www.gollowsolarenergy.com/#organization',
      'name': 'GOL LOW Solar Energy Systems Rental',
      'alternateName': 'GOL LOW',
      'url': 'https://www.gollowsolarenergy.com',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://www.gollowsolarenergy.com/android-chrome-512.png',
        'width': 512,
        'height': 512
      },
      'sameAs': [
        'https://linkedin.com/company/gollowsolar',
        'https://facebook.com/gollowsolar',
        'https://twitter.com/gollowsolar'
      ]
    };

    // LocalBusiness Schema (Dubai Headquarters & Operations UAE/India)
    const businessSchema = {
      '@context': 'https://schema.org',
      '@type': 'SolarEnergyNode' in window ? 'SolarEnergyBusiness' : 'LocalBusiness',
      '@id': 'https://www.gollowsolarenergy.com/#localbusiness',
      'name': 'GOL LOW Solar Energy Systems Rental',
      'image': 'https://www.gollowsolarenergy.com/android-chrome-512.png',
      'telephone': '+97143377881',
      'email': 'Hr@gollowsolarenergy.com',
      'url': 'https://www.gollowsolarenergy.com',
      'priceRange': '$$$',
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': 'Al Muraqqabat, Port Saeed',
        'addressLocality': 'Dubai',
        'addressRegion': 'Dubai',
        'postalCode': '00000',
        'addressCountry': 'AE'
      },
      'geo': {
        '@type': 'GeoCoordinates',
        'latitude': 25.2585252,
        'longitude': 55.3289066
      },
      'areaServed': [
        {
          '@type': 'AdministrativeArea',
          'name': 'United Arab Emirates'
        },
        {
          '@type': 'AdministrativeArea',
          'name': 'Dubai'
        },
        {
          '@type': 'AdministrativeArea',
          'name': 'Abu Dhabi'
        },
        {
          '@type': 'AdministrativeArea',
          'name': 'Sharjah'
        },
        {
          '@type': 'AdministrativeArea',
          'name': 'Ajman'
        },
        {
          '@type': 'AdministrativeArea',
          'name': 'Ras Al Khaimah'
        },
        {
          '@type': 'AdministrativeArea',
          'name': 'Fujairah'
        },
        {
          '@type': 'AdministrativeArea',
          'name': 'Umm Al Quwain'
        },
        {
          '@type': 'AdministrativeArea',
          'name': 'Al Ain'
        },
        {
          '@type': 'AdministrativeArea',
          'name': 'India'
        }
      ],
      'openingHoursSpecification': {
        '@type': 'OpeningHoursSpecification',
        'dayOfWeek': [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday'
        ],
        'opens': '08:00',
        'closes': '18:00'
      },
      'contactPoint': {
        '@type': 'ContactPoint',
        'telephone': '+971509876543',
        'contactType': 'technical support',
        'availableLanguage': ['en', 'ar', 'hi'],
        'contactOption': 'HearingImpairedSupported'
      }
    };

    // Breadcrumb schema based on routing path
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbItems = [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': 'https://www.gollowsolarenergy.com/'
      }
    ];

    let accruedPath = '';
    pathSegments.forEach((segment, idx) => {
      accruedPath += `/${segment}`;
      const name = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
      breadcrumbItems.push({
        '@type': 'ListItem',
        'position': idx + 2,
        'name': name,
        'item': `https://www.gollowsolarenergy.com${accruedPath}`
      });
    });

    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': breadcrumbItems
    };

    // Combine schemas
    const allSchemas = [orgSchema, businessSchema, breadcrumbSchema, ...schemaList];

    // Create script tag
    const scriptEl = document.createElement('script');
    scriptEl.type = 'application/ld+json';
    scriptEl.text = JSON.stringify(allSchemas);
    document.head.appendChild(scriptEl);

    return () => {
      // Clean up script tag on unmount
      if (document.head.contains(scriptEl)) {
        document.head.removeChild(scriptEl);
      }
    };
  }, [title, description, keywords, canonical, ogType, ogImage, schemaList, location.pathname, currentUrl]);

  return null;
}
