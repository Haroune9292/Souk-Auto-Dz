import './globals.css';
import { LanguageProvider } from '@/lib/context/LanguageContext';

export const metadata = {
  title: 'Souk Auto Dz',
  description: 'Algeria Car Classifieds Marketplace',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" dir="ltr">
      <body>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}