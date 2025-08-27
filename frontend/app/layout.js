import './globals.css';

export const metadata = {
  title: 'FarmMate - The Future of Farming',
  description: 'AI-powered farming platform with smart crop management and marketplace',
  icons: {
    icon: '/icon.svg',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
