'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut, ChevronDown, ChevronRight, Leaf, User } from 'lucide-react';

export interface MenuItem {
  label: string;
  icon: React.ElementType;
  href?: string;
  badge?: number;
  children?: { label: string; icon: React.ElementType; href?: string; download?: string }[];
}

export interface MenuSection {
  title: string;
  items: MenuItem[];
}

interface SidebarProps {
  menuSections: MenuSection[];
  logo?: {
    label?: string;
    subtitle?: string;
  };
  profileCard?: {
    name: string;
    role: string;
    href: string;
  };
}

export default function Sidebar({ menuSections, logo, profileCard }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  const toggleMenu = (label: string) => {
    setExpandedMenus((prev) =>
      prev.includes(label) ? prev.filter((m) => m !== label) : [...prev, label]
    );
  };

  const isActive = (href?: string) => {
    if (!href) return false;
    return pathname === href || pathname.startsWith(href + '/');
  };

  const isChildActive = (item: MenuItem) => {
    if (item.children) {
      return item.children.some((child) => isActive(child.href));
    }
    return false;
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('trashure_token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

      if (token) {
        await fetch(`${apiUrl}/logout`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });
      }
    } catch {
      // Ignore error, proceed with local cleanup
    } finally {
      localStorage.removeItem('trashure_token');
      localStorage.removeItem('trashure_user');
      document.cookie = 'trashure_token=; path=/; max-age=0';
      router.push('/login');
    }
  };

  return (
    <aside className="fixed top-0 left-0 z-40 flex h-screen w-[260px] flex-col bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#22c55e] to-[#16a34a] shadow-md shadow-green-200">
          <Leaf className="h-5 w-5 text-white" strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="text-base font-extrabold tracking-tight text-[#16a34a]">
            {logo?.label || 'TRASHURE'}
          </h1>
          <p className="text-[10px] font-medium text-gray-400 -mt-0.5">
            {logo?.subtitle || 'Bank Sampah'}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1 sidebar-scrollbar">
        {menuSections.map((section, sectionIdx) => (
          <div key={sectionIdx} className={section.title ? 'mt-4 first:mt-0' : ''}>
            {section.title && (
              <p className="px-3 mb-1.5 text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                {section.title}
              </p>
            )}
            {section.items.map((item) => {
              const hasChildren = !!item.children;
              const isExpanded = expandedMenus.includes(item.label);
              const active = isActive(item.href) || isChildActive(item);

              if (hasChildren) {
                return (
                  <div key={item.label}>
                    <button
                      onClick={() => toggleMenu(item.label)}
                      className={`group flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-all duration-200 ${
                        active
                          ? 'text-[#16a34a] bg-green-50'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <item.icon className={`h-[18px] w-[18px] flex-shrink-0 ${active ? 'text-[#16a34a]' : 'text-gray-400 group-hover:text-gray-600'}`} strokeWidth={1.8} />
                      <span className="flex-1 text-left truncate">{item.label}</span>
                      {isExpanded ? (
                        <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
                      ) : (
                        <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
                      )}
                    </button>
                    {isExpanded && (
                      <div className="ml-4 mt-0.5 space-y-0.5 border-l-2 border-gray-100 pl-3">
                        {item.children!.map((child) => {
                          const childActive = child.href ? isActive(child.href) : false;
                          const isDownload = !!child.download;

                          if (isDownload) {
                            return (
                              <button
                                key={child.label}
                                onClick={() => {
                                  const token = localStorage.getItem('trashure_token') || '';
                                  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
                                  fetch(child.download!, {
                                    headers: { Authorization: `Bearer ${token}` },
                                  })
                                    .then((res) => res.blob())
                                    .then((blob) => {
                                      const url = window.URL.createObjectURL(blob);
                                      const a = document.createElement('a');
                                      a.href = url;
                                      a.download = `${child.label.toLowerCase().replace(/\s+/g, '-')}.pdf`;
                                      document.body.appendChild(a);
                                      a.click();
                                      window.URL.revokeObjectURL(url);
                                      document.body.removeChild(a);
                                    })
                                    .catch((err) => console.error('Download gagal:', err));
                                }}
                                className="w-full flex items-center gap-2 rounded-md px-2.5 py-1.5 text-[12.5px] font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-all duration-200"
                              >
                                <child.icon className="h-[15px] w-[15px] flex-shrink-0 text-gray-400" strokeWidth={1.8} />
                                <span className="flex-1 text-left">{child.label}</span>
                                <span className="text-[10px] font-semibold text-[#16a34a] bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/60">PDF</span>
                              </button>
                            );
                          }

                          return (
                            <Link
                              key={child.href}
                              href={child.href!}
                              className={`flex items-center gap-2 rounded-md px-2.5 py-1.5 text-[12.5px] font-medium transition-all duration-200 ${
                                childActive
                                  ? 'text-[#16a34a] bg-green-50'
                                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                              }`}
                            >
                              <child.icon className={`h-[15px] w-[15px] flex-shrink-0 ${childActive ? 'text-[#16a34a]' : 'text-gray-400'}`} strokeWidth={1.8} />
                              <span>{child.label}</span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.label}
                  href={item.href!}
                  className={`group flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-all duration-200 ${
                    active
                      ? 'bg-[#16a34a] text-white shadow-md shadow-green-200'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon
                    className={`h-[18px] w-[18px] flex-shrink-0 ${
                      active ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'
                    }`}
                    strokeWidth={1.8}
                  />
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.badge && (
                    <span className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${
                      active ? 'bg-white/20 text-white' : 'bg-red-100 text-red-600'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Profile Card (optional) */}
      {profileCard && (
        <div className="px-3 py-3 border-t border-gray-100">
          <Link
            href={profileCard.href}
            className="flex items-center gap-3 p-2 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer border border-transparent hover:border-gray-100"
          >
            <div className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-gradient-to-br from-[#22c55e] to-[#16a34a] flex-shrink-0">
              <User className="h-5 w-5 text-white" strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-bold text-gray-800 truncate leading-tight">
                {profileCard.name}
              </p>
              <p className="text-[12px] font-medium text-gray-400 truncate leading-tight mt-0.5">
                {profileCard.role}
              </p>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" />
          </Link>
        </div>
      )}

      {/* Logout Button */}
      <div className="border-t border-gray-100 px-3 py-3">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] font-semibold text-red-500 hover:bg-red-50 transition-colors duration-200"
        >
          <LogOut className="h-[18px] w-[18px]" strokeWidth={1.8} />
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  );
}
