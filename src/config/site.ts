/**
 * Site configuration
 */
export const siteConfig = {
  name: 'PDFeditz',
  description: 'Professional PDF tools by AkshHQ. Merge, split, compress, convert, and edit PDFs locally in your browser without uploading documents.',
  url: 'https://pdfeditz.akshhq.com',
  ogImage: '/images/og-image.png',
  links: {
    github: 'https://github.com/akshhq/PDFeditor',
  },
  creator: 'AkshHQ',
  keywords: [
    'PDF tools',
    'PDF editor',
    'merge PDF',
    'split PDF',
    'compress PDF',
    'convert PDF',
    'free PDF tools',
    'online PDF editor',
    'browser-based PDF',
    'private PDF processing',
  ],
  // SEO-related settings
  seo: {
    titleTemplate: '%s | PDFeditz',
    defaultTitle: 'PDFeditz - Private PDF Tools by AkshHQ',
    locale: 'en_US',
  },
};

/**
 * Navigation configuration
 */
export const navConfig = {
  mainNav: [
    { title: 'Home', href: '/' },
    { title: 'Tools', href: '/tools' },
    { title: 'About', href: '/about' },
    { title: 'FAQ', href: '/faq' },
  ],
  footerNav: [
    { title: 'Privacy', href: '/privacy' },
    { title: 'Contact', href: '/contact' },
  ],
};
