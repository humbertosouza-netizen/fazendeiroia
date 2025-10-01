"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { 
  LayoutDashboard, 
  BarChart3, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  ExternalLink,
  MoreVertical,
  User,
  Home,
  FileText,
  MessageSquare,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Image from "next/image";
import dynamic from "next/dynamic";

const MobileBottomNav = dynamic(() => import("@/components/MobileBottomNav"), { ssr: false });

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
      } else {
        router.push("/login");
      }
      setLoading(false);
    };

    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_OUT") {
          router.push("/login");
        } else if (session?.user) {
          setUser(session.user);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-green-50 to-white">
        <div className="animate-spin h-8 w-8 border-4 border-green-600 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  const menuItems = [
    { 
      name: "Dashboard", 
      href: "/dashboard", 
      icon: <LayoutDashboard className="h-5 w-5" /> 
    },
    { 
      name: "Anúncios", 
      href: "/dashboard/anuncios", 
      icon: <FileText className="h-5 w-5" /> 
    },
    { 
      name: "Leads", 
      href: "/dashboard/leads", 
      icon: <MessageSquare className="h-5 w-5" /> 
    },
    { 
      name: "Usuários", 
      href: "/dashboard/users", 
      icon: <Users className="h-5 w-5" /> 
    },
    { 
      name: "Planos", 
      href: "/planos", 
      icon: <Sparkles className="h-5 w-5" />,
      highlight: true
    },
    { 
      name: "Configurações", 
      href: "/dashboard/settings", 
      icon: <Settings className="h-5 w-5" /> 
    },
    {
      name: "Portal Externo",
      href: "/portal",
      icon: <ExternalLink className="h-5 w-5" />,
      external: true
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50 w-full max-w-full overflow-hidden">
      {/* Sidebar para desktop */}
      <aside className="hidden md:flex w-64 flex-col fixed inset-y-0 z-50">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
          <div className="px-4 py-5 flex items-center border-b">
            <div className="flex items-center gap-2">
              <span className="bg-gradient-to-br from-green-600 to-green-800 text-white p-2 rounded-lg flex items-center justify-center">
                <Image 
                  src="/images/fazendeiro-ia-logo.png" 
                  alt="Logo Fazendeiro IA" 
                  width={24} 
                  height={24} 
                  className="h-6 w-6 object-contain"
                  unoptimized
                />
              </span>
              <span className="text-lg font-semibold bg-gradient-to-r from-green-700 to-green-900 text-transparent bg-clip-text">
                Fazendeiro IA
              </span>
            </div>
          </div>
          <nav className="flex-1 px-2 py-4 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-2 text-sm rounded-md transition-colors ${
                  pathname === item.href && !item.external
                    ? 'bg-green-50 text-green-700'
                    : 'hover:bg-green-50'
                } ${item.external ? 'text-green-600' : ''} ${
                  item.highlight ? 'bg-gradient-to-r from-yellow-50 to-green-50 border border-yellow-200 font-semibold text-green-800' : ''
                }`}
                target={item.external ? "_blank" : undefined}
              >
                {item.icon}
                <span className="ml-3">{item.name}</span>
                {item.highlight && <span className="ml-auto text-xs bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full font-bold">40% OFF</span>}
                {item.external && <ExternalLink className="ml-auto h-3 w-3" />}
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t">
            <Button
              className="w-full flex items-center bg-green-700 hover:bg-green-800 text-white"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-gray-800 bg-opacity-75">
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white">
            <div className="flex items-center justify-between px-4 py-5 border-b">
              <div className="flex items-center gap-2">
                <span className="bg-gradient-to-br from-green-600 to-green-800 text-white p-1.5 rounded-lg flex items-center justify-center">
                  <Image 
                    src="/images/fazendeiro-ia-logo.png" 
                    alt="Logo Fazendeiro IA" 
                    width={20} 
                    height={20} 
                    className="h-5 w-5 object-contain"
                    unoptimized
                  />
                </span>
                <span className="text-lg font-semibold bg-gradient-to-r from-green-700 to-green-900 text-transparent bg-clip-text">
                  Fazendeiro IA
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-md text-gray-500 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="p-4 space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-2 text-sm rounded-md transition-colors ${
                    pathname === item.href && !item.external
                      ? 'bg-green-50 text-green-700'
                      : 'hover:bg-green-50'
                  } ${item.external ? 'text-green-600' : ''} ${
                    item.highlight ? 'bg-gradient-to-r from-yellow-50 to-green-50 border border-yellow-200 font-semibold text-green-800' : ''
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                  target={item.external ? "_blank" : undefined}
                >
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                  {item.highlight && <span className="ml-auto text-xs bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full font-bold">40% OFF</span>}
                  {item.external && <ExternalLink className="ml-auto h-3 w-3" />}
                </Link>
              ))}
            </nav>
            <div className="p-4 border-t">
              <Button
                className="w-full flex items-center bg-green-700 hover:bg-green-800 text-white"
                onClick={handleSignOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Header e conteúdo principal */}
      <div className="md:ml-64 flex-1 flex flex-col w-full max-w-full overflow-hidden">
        <header className="hidden md:block bg-white shadow-sm z-10 border-b border-gray-200">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              className="md:hidden p-2 rounded-md text-gray-500 hover:text-gray-600"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="p-1 rounded-full hover:bg-green-50">
                    <Avatar className="h-8 w-8 border border-green-200">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-green-700 text-white">
                        {user?.email?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/portal" target="_blank" className="flex cursor-pointer">
                      <ExternalLink className="mr-2 h-4 w-4 text-green-600" />
                      Portal Externo
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
        
        {/* Conteúdo principal */}
        <main
          className="flex-1 px-0 py-4 md:px-6 md:py-6 overflow-auto bg-gradient-to-b from-white to-gray-50 w-full max-w-full"
          style={{ paddingBottom: "calc(64px + max(env(safe-area-inset-bottom), 8px))" }}
        >
          {children}
        </main>
        {/* Navegação inferior mobile */}
        <MobileBottomNav />
      </div>
    </div>
  );
}