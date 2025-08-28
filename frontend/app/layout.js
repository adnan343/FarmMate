import { ToastProvider } from '@/app/components/ToastProvider';
import './globals.css';

export const metadata = {
  title: {
    default: 'FarmMate - The Future of Farming',
    template: '%s | FarmMate'
  },
  description: 'AI-powered farming platform with smart crop management, pest detection, and a thriving marketplace connecting farmers and buyers worldwide. Revolutionize your agriculture with FarmMate.',
  keywords: ['farming', 'agriculture', 'AI farming', 'crop management', 'pest detection', 'farm marketplace', 'smart farming', 'agricultural technology'],
  authors: [{ name: 'FarmMate Team' }],
  creator: 'FarmMate',
  publisher: 'FarmMate',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://farmmate.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://farmmate.com',
    title: 'FarmMate - The Future of Farming',
    description: 'AI-powered farming platform with smart crop management, pest detection, and a thriving marketplace connecting farmers and buyers worldwide.',
    siteName: 'FarmMate',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'FarmMate - AI-Powered Farming Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FarmMate - The Future of Farming',
    description: 'AI-powered farming platform with smart crop management, pest detection, and a thriving marketplace.',
    images: ['/og-image.jpg'],
    creator: '@farmmate',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  icons: {
    icon: '/icon.svg',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: '/apple-touch-icon-precomposed.png',
    },
  },
  manifest: '/manifest.json',
  category: 'technology',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
