// app/layout.jsx
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
});

export const metadata = {
  title: 'Webhook AI Interview - Portfolio Project',
  description: 'AI-powered interview orchestration workflow with n8n, Groq, and modern AI.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  );
}