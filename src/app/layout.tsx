import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import LayoutWrapper from '@/components/layout-wrapper';
import { AuthProvider } from '@/contexts/auth-context';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'OpenBroker LOS',
  description: 'Mortgage Loan Origination System',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none"><path d="M6 14V38a3 3 0 003 3h30a3 3 0 003-3V18a3 3 0 00-3-3H25l-3-4H9a3 3 0 00-3 3z" stroke="%23000" stroke-width="2.5" stroke-linejoin="round"/><circle cx="16" cy="28" r="3" fill="%23000"/><circle cx="24" cy="28" r="3" fill="%23000"/><circle cx="32" cy="28" r="3" fill="%23000"/><line x1="19" y1="28" x2="21" y2="28" stroke="%23000" stroke-width="2" stroke-linecap="round"/><line x1="27" y1="28" x2="29" y2="28" stroke="%23000" stroke-width="2" stroke-linecap="round"/><path d="M35 28l3 0" stroke="%23000" stroke-width="2" stroke-linecap="round"/><path d="M36 25.5l2.5 2.5-2.5 2.5" stroke="%23000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <AuthProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
