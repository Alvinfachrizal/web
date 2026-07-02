import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: {
    template: '%s | SIMS Sekolah',
    default: 'SIMS — Sistem Informasi Manajemen Sekolah',
  },
  description:
    'Platform terpusat yang menghubungkan sekolah, guru, siswa, dan orang tua untuk kegiatan akademik, administrasi, dan komunikasi.',
  keywords: ['sistem informasi sekolah', 'manajemen sekolah', 'SIMS', 'e-learning', 'rapor digital'],
  authors: [{ name: 'SIMS Team' }],
  robots: 'noindex, nofollow', // internal app
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${plusJakarta.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
