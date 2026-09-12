import type {Metadata} from 'next';
import './globals.css';
import { ThemeProvider } from '@/providers/theme-provider';
import { AuthProvider } from '@/features/auth/auth-context';

export const metadata: Metadata = {
  title: 'CodeMart - Digital Marketplace',
  description: 'A high-performance digital marketplace for themes, templates, scripts, wireframes, and creative design assets.',
  openGraph: {
    title: 'CodeMart - Digital Marketplace',
    description: 'A high-performance digital marketplace for themes, templates, scripts, wireframes, and creative design assets.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CodeMart - Digital Marketplace',
    description: 'A high-performance digital marketplace for themes, templates, scripts, wireframes, and creative design assets.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className="dark h-full">
      <body className="min-h-full antialiased selection:bg-[#009f7f] selection:text-white transition-colors duration-200" suppressHydrationWarning>
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
