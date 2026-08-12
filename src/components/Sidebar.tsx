"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Activity, 
  Users, 
  FileText, 
  LogOut, 
  Menu as MenuIcon, 
  User, 
  ChevronLeft,
  ChevronRight,
  MenuSquare,
  UserCog
} from "lucide-react";

// Helper to map string icon names to Lucide components
const IconMap: Record<string, any> = {
  Activity,
  Users,
  FileText,
  MenuSquare,
  UserCog
};

export default function Sidebar({ menus }: { menus: any[] }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/50 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-slate-200 transition-all duration-300 ease-in-out
          ${isCollapsed ? 'w-20' : 'w-64'} 
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          md:relative md:flex
        `}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Activity className="w-5 h-5 text-white" />
            </div>
            {!isCollapsed && (
              <span className="ml-3 text-xl font-bold text-slate-900 whitespace-nowrap overflow-hidden">
                Stunting Care
              </span>
            )}
          </div>
          
          {/* Desktop collapse toggle */}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 absolute -right-3 border border-slate-200"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <nav className="px-2 space-y-1">
            {menus.filter(m => !m.parent_id).map((menu) => {
              const Icon = IconMap[menu.icon] || Activity;
              const isActive = pathname === menu.url || pathname.startsWith(menu.url + '/');
              const subMenus = menus.filter(m => m.parent_id === menu.id);
              
              return (
                <div key={menu.id} className="space-y-1 group">
                  <Link
                    href={menu.url || "#"}
                    className={`
                      flex items-center px-2 py-2.5 text-sm font-medium rounded-lg transition-colors
                      ${isActive 
                        ? 'bg-blue-50 text-blue-700' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }
                      ${isCollapsed ? 'justify-center' : ''}
                    `}
                    title={isCollapsed ? menu.name : undefined}
                  >
                    <Icon className={`
                      flex-shrink-0 h-5 w-5
                      ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-500'}
                      ${isCollapsed ? '' : 'mr-3'}
                    `} />
                    {!isCollapsed && (
                      <span className="truncate flex-1">{menu.name}</span>
                    )}
                  </Link>

                  {/* Render Sub Menus on Hover */}
                  {!isCollapsed && subMenus.length > 0 && (
                    <div className="ml-8 border-l border-slate-200 pl-2 max-h-0 opacity-0 overflow-hidden group-hover:max-h-96 group-hover:opacity-100 transition-all duration-300 ease-in-out">
                      <div className="space-y-1 mt-1 pb-1">
                        {subMenus.map(subMenu => {
                          const SubIcon = IconMap[subMenu.icon] || Activity;
                          const isSubActive = pathname === subMenu.url;
                          return (
                            <Link
                              key={subMenu.id}
                              href={subMenu.url || "#"}
                              className={`
                                flex items-center px-2 py-2 text-sm font-medium rounded-lg transition-colors
                                ${isSubActive 
                                  ? 'text-blue-700 bg-blue-50/50' 
                                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                                }
                              `}
                            >
                              <SubIcon className={`flex-shrink-0 h-4 w-4 mr-2 ${isSubActive ? 'text-blue-600' : 'text-slate-400'}`} />
                              <span className="truncate">{subMenu.name}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-slate-200 p-4">
          <Link 
            href="/" 
            className={`flex items-center group ${isCollapsed ? 'justify-center' : ''}`}
            title={isCollapsed ? "Keluar" : undefined}
          >
            <div className="flex-shrink-0 h-9 w-9 rounded-full bg-slate-200 flex items-center justify-center">
              <User className="h-5 w-5 text-slate-500" />
            </div>
            {!isCollapsed && (
              <>
                <div className="ml-3 overflow-hidden">
                  <p className="text-sm font-medium text-slate-700 group-hover:text-slate-900 truncate">
                    Admin
                  </p>
                  <p className="text-xs font-medium text-slate-500 group-hover:text-slate-700">
                    Keluar
                  </p>
                </div>
                <LogOut className="ml-auto h-5 w-5 text-slate-400 group-hover:text-slate-500 flex-shrink-0" />
              </>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile top bar toggle button (rendered by parent layout) */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 z-30">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-slate-900">Stunting Care</span>
        </div>
        <button 
          onClick={() => setIsMobileOpen(true)}
          className="text-slate-500 hover:text-slate-900 focus:outline-none"
        >
          <MenuIcon className="h-6 w-6" />
        </button>
      </div>
    </>
  );
}
