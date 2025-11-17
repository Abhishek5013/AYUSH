'use client';

import type { Metadata } from 'next';
import { usePathname } from 'next/navigation';
import './globals.css';
import { SidebarProvider, Sidebar, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { SidebarNav } from '@/components/common/sidebar-nav';
import { Toaster } from '@/components/ui/toaster';
import { AppLogo } from '@/components/common/app-logo';
import { FirebaseClientProvider } from '@/firebase';

// Since we're using a hook `usePathname`, we can't export metadata from here.
// We'll manage the title in the component itself.
// export const metadata: Metadata = {
//   title: 'QuizWise - AI Powered Quizzes',
//   description: 'Generate and take quizzes on any topic, with personalized feedback.',
// };

function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/signup';

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <div className="flex flex-col h-full">
          <div className="p-4">
            <AppLogo />
          </div>
          <SidebarNav />
        </div>
      </Sidebar>
      <SidebarInset>
        <div className="md:hidden p-2 flex items-center border-b">
          <SidebarTrigger />
          <div className="ml-4">
            <AppLogo />
          </div>
        </div>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <title>QuizWise - AI Powered Quizzes</title>
        <meta name="description" content="Generate and take quizzes on any topic, with personalized feedback." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <FirebaseClientProvider>
          <AppLayout>{children}</AppLayout>
        </FirebaseClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
