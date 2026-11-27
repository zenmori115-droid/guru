import { BookOpen, Clock, FileEdit, Moon, Sun } from 'lucide-react';
import type { TabId } from '../types';

interface HeaderProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  historyCount: number;
  isDark: boolean;
  onToggleTheme: () => void;
}

export function Header({
  activeTab,
  onTabChange,
  historyCount,
  isDark,
  onToggleTheme,
}: HeaderProps) {
  const navItems: { id: TabId; label: string; icon: typeof FileEdit; badge?: number }[] = [
    { id: 'buat', label: 'Buat Laporan', icon: FileEdit },
    { id: 'riwayat', label: 'Riwayat', icon: Clock, badge: historyCount > 0 ? historyCount : undefined },
    { id: 'panduan', label: 'Panduan Singkat', icon: BookOpen },
  ];

  return (
    <header className="relative z-30 border-b border-[#2F6BFF]/12 bg-white/80 backdrop-blur-xl transition-colors duration-200 dark:border-[#3D8BFF]/18 dark:bg-[#060F29]/80 lg:sticky lg:top-0">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand lockup: glowing blue chat bubble + book/star SVG + name + tagline */}
        <button
          type="button"
          onClick={() => onTabChange('buat')}
          className="group flex items-center gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3D8BFF] rounded-xl"
        >
          <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2F6BFF] to-[#3D8BFF] text-white shadow-[0_0_22px_rgba(47,107,255,0.48)] transition-transform duration-200 group-hover:scale-[1.03]">
            <svg
              viewBox="0 0 28 28"
              fill="none"
              className="h-6 w-6"
              aria-hidden="true"
            >
              {/* Chat bubble silhouette */}
              <path
                d="M14 3.5C8.2 3.5 3.5 7.75 3.5 13C3.5 15.65 4.7 18.04 6.64 19.75L5.4 24.1C5.28 24.53 5.71 24.9 6.11 24.71L10.35 22.69C11.49 23.02 12.72 23.2 14 23.2C19.8 23.2 24.5 18.95 24.5 13.7C24.5 8.07 19.8 3.5 14 3.5Z"
                fill="currentColor"
                fillOpacity="0.18"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinejoin="round"
              />
              {/* Open book pages inside bubble */}
              <path
                d="M9.5 11.2C10.9 10.6 12.7 10.8 14 11.9C15.3 10.8 17.1 10.6 18.5 11.2V16.6C17.1 16 15.3 16.2 14 17.2C12.7 16.2 10.9 16 9.5 16.6V11.2Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14 11.9V17.1"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
              {/* Small guiding star */}
              <path
                d="M19.8 6.4L20.3 7.8L21.7 8.3L20.3 8.8L19.8 10.2L19.3 8.8L17.9 8.3L19.3 7.8L19.8 6.4Z"
                fill="#FF9F43"
              />
            </svg>
          </span>
          <div className="min-w-0">
            <div className="text-base font-extrabold tracking-tight text-[#0B1B3A] dark:text-[#EAF1FF] sm:text-lg whitespace-nowrap">
              LaporKu Guru
            </div>
            <p className="text-xs font-medium text-[#4A608A] dark:text-[#9DB2D9] whitespace-nowrap">
              Pesan jujur, tetap sopan.
            </p>
          </div>
        </button>

        {/* Desktop navigation tabs */}
        <nav aria-label="Navigasi utama" className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onTabChange(item.id)}
                className={`relative flex min-h-[42px] items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold whitespace-nowrap shrink-0 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3D8BFF] ${
                  isActive
                    ? 'bg-[#2F6BFF]/12 text-[#2F6BFF] dark:bg-[#2F6BFF]/22 dark:text-[#EAF1FF]'
                    : 'text-[#4A608A] hover:bg-[#2F6BFF]/6 hover:text-[#0B1B3A] dark:text-[#9DB2D9] dark:hover:bg-white/5 dark:hover:text-[#EAF1FF]'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-[#FF8A1F]' : ''}`} />
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span className="font-mono text-xs tabular-nums text-[#FF8A1F] dark:text-[#FF9F43]">
                    ({item.badge})
                  </span>
                )}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-4 -bottom-[13px] h-[2.5px] rounded-full bg-[#FF8A1F] shadow-[0_0_10px_rgba(255,138,31,0.75)]"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Theme toggle */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={isDark ? 'Beralih ke mode terang' : 'Beralih ke mode gelap'}
            title={isDark ? 'Mode Terang' : 'Mode Gelap'}
            className="flex min-h-[42px] min-w-[42px] items-center justify-center gap-2 rounded-xl border border-[#2F6BFF]/18 bg-white/70 px-3 text-sm font-medium text-[#2A4270] transition-all duration-200 hover:border-[#3D8BFF]/50 hover:text-[#2F6BFF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3D8BFF] dark:border-[#3D8BFF]/25 dark:bg-[#0D1E47]/70 dark:text-[#9DB2D9] dark:hover:border-[#7DB4FF]/50 dark:hover:text-[#EAF1FF]"
          >
            {isDark ? (
              <>
                <Sun className="h-4 w-4 text-[#FF9F43]" />
                <span className="hidden sm:inline whitespace-nowrap text-xs font-semibold">Terang</span>
              </>
            ) : (
              <>
                <Moon className="h-4 w-4 text-[#2F6BFF]" />
                <span className="hidden sm:inline whitespace-nowrap text-xs font-semibold">Gelap</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Mobile navigation tabs (non-sticky bar right under top bar) */}
      <nav
        aria-label="Navigasi seluler"
        className="grid grid-cols-3 border-t border-[#2F6BFF]/10 px-2 py-1.5 dark:border-[#3D8BFF]/15 md:hidden"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange(item.id)}
              className={`flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl px-2 py-2 text-xs font-semibold whitespace-nowrap transition-colors duration-200 ${
                isActive
                  ? 'bg-[#2F6BFF]/14 text-[#2F6BFF] dark:bg-[#2F6BFF]/25 dark:text-[#EAF1FF]'
                  : 'text-[#4A608A] dark:text-[#9DB2D9]'
              }`}
            >
              <Icon className={`h-3.5 w-3.5 shrink-0 ${isActive ? 'text-[#FF8A1F]' : ''}`} />
              <span className="truncate">{item.label}</span>
              {item.badge !== undefined && (
                <span className="font-mono text-[11px] tabular-nums text-[#FF8A1F]">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </header>
  );
}
