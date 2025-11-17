'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Home, BarChart2, LogIn, LogOut } from 'lucide-react';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { useAuth, useUser } from '@/firebase';
import { signOut } from 'firebase/auth';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';

const navItems = [
  { href: '/', label: 'New Quiz', icon: Home },
  { href: '/progress', label: 'My Progress', icon: BarChart2, private: true },
];

export function SidebarNav() {
  const pathname = usePathname();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  return (
    <>
      <nav className="flex-1 overflow-y-auto p-2">
        <SidebarMenu>
          {navItems.map((item) => {
            if (item.private && !user) return null;
            const isActive = pathname === item.href;
            return (
              <SidebarMenuItem key={item.label}>
                <Link href={item.href}>
                  <SidebarMenuButton
                    isActive={isActive}
                    tooltip={item.label}
                    className="justify-start"
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </nav>
      <SidebarFooter>
        <SidebarSeparator />
        <div className="p-2 flex flex-col gap-2">
        {isUserLoading ? (
            <div className="flex items-center gap-2">
                <Avatar><AvatarFallback>?</AvatarFallback></Avatar>
                <div className="flex flex-col">
                    <span className="text-sm font-medium">Loading...</span>
                </div>
            </div>
          ) : user ? (
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
                <AvatarFallback>{user.displayName?.charAt(0) || user.email?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-medium truncate">{user.displayName || user.email}</span>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="h-auto p-0 justify-start text-xs text-muted-foreground">
                  <LogOut className="mr-1 h-3 w-3" />
                  Sign Out
                </Button>
              </div>
            </div>
          ) : (
            <Link href="/login" passHref>
              <SidebarMenuButton className="justify-start">
                <LogIn className="h-5 w-5" />
                <span>Login</span>
              </SidebarMenuButton>
            </Link>
          )}
        </div>
      </SidebarFooter>
    </>
  );
}
