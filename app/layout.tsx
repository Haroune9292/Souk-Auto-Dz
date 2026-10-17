import './globals.css';
import { LanguageProvider } from '@/lib/context/LanguageContext';
import Navbar from '@/components/NAVBAR'; // استيراد النافبار
import Footer from '@/components/FOOTER'; // 1. استيراد الفوتر هنا

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
      {/* 2. إضافة flex flex-col min-h-screen لضمان ثبات الفوتر في الأسفل */}
      <body className="flex flex-col min-h-screen bg-[#0B132B]">
        <LanguageProvider>
          <Navbar /> {/* عرض النافبار هنا ليظهر في كل الصفحات */}
          
          <main className="flex-grow">
            {children}
          </main>

          <Footer /> {/* 3. عرض الفوتر هنا ليظهر في أسفل كل الصفحات */}
        </LanguageProvider>
      </body>
    </html>
  );
}