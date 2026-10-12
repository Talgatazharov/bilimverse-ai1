import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BILIMVERSE AI — Білім әлеміне саяхат',
  description: '1–4 сынып оқушыларына арналған қазақ тіліндегі интерактивті AI білім беру game-платформасы.',
  icons: {
    icon: '/ui/logo-shanyrak.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="kk" className="dark">
      <body className="bg-game-deep text-slate-100 antialiased selection:bg-amber-500 selection:text-slate-950">
        {children}
      </body>
    </html>
  );
}
