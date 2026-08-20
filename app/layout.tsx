import './globals.css';
import { LanguageProvider } from '@/lib/context/LanguageContext';
import Navbar from '@/components/NAVBAR'; // استيراد النافبار

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
          <Navbar /> {/* عرض النافبار هنا ليظهر في كل الصفحات */}
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}