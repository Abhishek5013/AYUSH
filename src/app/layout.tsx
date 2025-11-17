import type { Metadata } from 'next';
import './globals.css';
import { SidebarProvider, Sidebar, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { SidebarNav } from '@/components/common/sidebar-nav';
import { Toaster } from '@/components/ui/toaster';
import { AppLogo } from '@/components/common/app-logo';

export const metadata: Metadata = {
  title: 'QuizWise - AI Powered Quizzes',
  description: 'Generate and take quizzes on any topic, with personalized feedback.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
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
        <Toaster />
      </body>
    </html>
  );
}
