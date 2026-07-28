'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useNavMenu } from '../store/navMenuContext';

// ── Recursive sidebar item (supports nested children) ────────────────────────
function SidebarItem({ item, depth = 0 }) {
    const pathname = usePathname();
    const hasChildren = item.children && item.children.length > 0;

    // Active if exact match or starts with this URL (but not root '/')
    const isActive = pathname === item.url || (item.url && item.url !== '/' && pathname.startsWith(item.url));

    const [open, setOpen] = useState(isActive || false);

    const indentClass = depth === 0 ? 'pl-5' : depth === 1 ? 'pl-8' : 'pl-11';
    const textClass   = depth === 0 ? 'text-base font-medium' : 'text-[13.5px] font-normal';

    if (hasChildren) {
        return (
            <div>
                {/* Parent row — clicking toggles children */}
                <button
                    onClick={() => setOpen(o => !o)}
                    className={`w-full flex items-center justify-between py-2 ${indentClass} pr-3 rounded-lg transition-colors text-left
                        ${isActive ? 'text-black font-semibold' : 'text-gray-800 hover:text-black hover:bg-gray-50'} ${textClass}`}
                >
                    <span>{item.title}</span>
                    {open
                        ? <ChevronDown className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                        : <ChevronRight className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                    }
                </button>

                {/* Children */}
                {open && (
                    <div className="border-l border-gray-100 ml-7">
                        {item.children.map(child => (
                            <SidebarItem key={child.id || child.title} item={child} depth={depth + 1} />
                        ))}
                    </div>
                )}
            </div>
        );
    }

    return (
        <Link
            href={item.url || '/'}
            className={`flex items-center py-2 ${indentClass} pr-3 rounded-lg transition-colors
                ${isActive
                    ? 'font-bold text-black'
                    : 'text-gray-800 hover:text-black hover:bg-gray-50'
                } ${textClass}`}
        >
            <span>{item.title}</span>
        </Link>
    );
}

// ── Main sidebar ──────────────────────────────────────────────────────────────
export default function CategorySidebar() {
    let navItems = [];
    try {
        // useNavMenu is safe here — NavMenuProvider wraps the whole app in layout.jsx
        // eslint-disable-next-line react-hooks/rules-of-hooks
        navItems = useNavMenu();
    } catch {
        navItems = [];
    }

    return (
        <nav className="bg-white min-h-full pt-4 py-2 text-sm font-sans sidebar-nav">
            <style jsx>{`
                .sidebar-nav::-webkit-scrollbar { width: 4px; }
                .sidebar-nav::-webkit-scrollbar-track { background: transparent; }
                .sidebar-nav::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 4px; }
                .sidebar-nav::-webkit-scrollbar-thumb:hover { background: #9ca3af; }
            `}</style>

            {navItems.length === 0 ? (
                /* Skeleton shown when no menu is configured */
                <div className="space-y-3 px-5">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-5 bg-gray-100 animate-pulse rounded" />
                    ))}
                </div>
            ) : (
                <div className="space-y-0.5 pr-2">
                    {navItems.map(item => (
                        <SidebarItem key={item.id || item.title} item={item} depth={0} />
                    ))}
                </div>
            )}
        </nav>
    );
}