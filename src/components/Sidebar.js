'use client';

import { useState } from 'react';
import Link from 'next/link';
import { LayoutDashboard, FileText, Plus, TrendingUp, Settings } from 'lucide-react';

export default function Sidebar() {
  const [activeItem, setActiveItem] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/' },
    { id: 'quizzes', label: 'Quizzes', icon: FileText, href: '/quizzes' },
    { id: 'create', label: 'Create Quiz', icon: Plus, href: '/create' },
    { id: 'results', label: 'Results', icon: TrendingUp, href: '/results' },
    { id: 'settings', label: 'Settings', icon: Settings, href: '/settings' },
  ];

  return (
    <aside className="w-64 bg-zinc-900 dark:bg-zinc-950 text-white fixed left-0 top-0 h-full border-r border-zinc-800 flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">Q</span>
          </div>
          <span className="font-semibold text-lg">Quiz Maker</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  onClick={() => setActiveItem(item.id)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    activeItem === item.id
                      ? 'bg-blue-600 text-white'
                      : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-zinc-800">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center">
            <span className="text-sm font-medium">AD</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">User</p>
            <p className="text-xs text-zinc-400 truncate">user@example.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
