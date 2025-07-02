import React, { useState } from 'react';
import Link from 'next/link';

export interface SidebarTab {
  id: string;
  label: string;
  icon: React.ElementType;
}

interface SidebarProps {
  tabs: SidebarTab[];
  activeTab: string;
  setActiveTab: (id: string) => void;
  user: { name: string; email: string; role: string };
}

const Sidebar: React.FC<SidebarProps> = ({ tabs, activeTab, setActiveTab, user }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile Hamburger */}
      <button
        className="fixed top-4 left-4 z-40 flex items-center justify-center w-10 h-10 rounded-lg bg-black/60 border border-white/20 text-white lg:hidden"
        onClick={() => setOpen(true)}
        aria-label="Open sidebar"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      {/* Sidebar Overlay (Mobile) */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      {/* Sidebar */}
      <aside
        className={`fixed z-40 top-0 left-0 h-full w-64 bg-black/80 border-r border-white/10 shadow-xl flex flex-col transition-transform duration-300 lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'} lg:static lg:flex lg:translate-x-0`}
        style={{ minHeight: '100vh' }}
      >
        {/* User Info */}
        <div className="flex flex-col items-center justify-center py-8 border-b border-white/10">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-2xl font-bold text-white mb-2">
            {user.name ? user.name[0].toUpperCase() : '?'}
          </div>
          <div className="text-white font-semibold text-lg mb-1">{user.name}</div>
          <div className="text-white/60 text-xs mb-1">{user.email}</div>
          <span className="badge badge-primary text-xs capitalize">{user.role}</span>
        </div>
        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-2 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all text-left
                  ${activeTab === tab.id
                    ? 'bg-purple-600/20 text-white shadow border border-purple-500/40'
                    : 'text-white/70 hover:text-white hover:bg-white/5 border border-transparent'}
                `}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </nav>
        {/* Close button (mobile) */}
        <button
          className="absolute top-4 right-4 z-50 lg:hidden text-white bg-black/40 rounded-full p-2 border border-white/20"
          onClick={() => setOpen(false)}
          aria-label="Close sidebar"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </aside>
    </>
  );
};

export default Sidebar; 