"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  Users,
  Settings,
  Sparkles,
} from "lucide-react";

type NavItem = {
  name: string;
  href: string;
  icon: React.ReactNode;
};

export default function MobileBottomNav() {
  const pathname = usePathname();

  const items: NavItem[] = [
    { name: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
    { name: "Anúncios", href: "/dashboard/anuncios", icon: <FileText className="h-5 w-5" /> },
    { name: "Leads", href: "/dashboard/leads", icon: <MessageSquare className="h-5 w-5" /> },
    { name: "Planos", href: "/planos", icon: <Sparkles className="h-5 w-5" /> },
    { name: "Config", href: "/dashboard/settings", icon: <Settings className="h-5 w-5" /> },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white shadow-lg"
      style={{ 
        paddingBottom: "max(env(safe-area-inset-bottom), 8px)",
        minHeight: "56px"
      }}
      aria-label="Navegação inferior"
   >
      <ul className="grid grid-cols-5 h-14">
        {items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <li key={item.name} className="flex">
              <Link
                href={item.href}
                className={`flex-1 flex flex-col items-center justify-center gap-0.5 text-[11px] transition-colors ${
                  isActive ? "text-green-700" : "text-gray-500 hover:text-gray-700"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                {item.icon}
                <span className="leading-none">{item.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}


