import { useState, useEffect } from 'react';
import { Bell, LayoutDashboard, Users, Wallet, Activity, Settings, LogOut, ChevronDown, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../lib/api';
import ProfileDropdown from './ProfileDropdown';

const SideNavItem = ({ icon, label, active, badge, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-[13px] font-medium transition-colors ${
      active ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
    }`}
  >
    <span className="flex items-center gap-2.5">{icon}{label}</span>
    {badge > 0 && (
      <span className="text-[10px] font-bold bg-indigo-600 text-white px-1.5 py-0.5 rounded-full min-w-[18px] text-center leading-4">
        {badge}
      </span>
    )}
  </button>
);

export const AppLayout = ({ children, pageTitle = 'Overview' }) => {
  const { user, logout } = useAuth();
  const [notifCount, setNotifCount] = useState(0);
  const [showProfile, setShowProfile] = useState(false);
  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (!user) return;
    let canceled = false;
    const fetchCount = async () => {
      try {
        const data = await apiFetch(`${API_BASE}/request/my`, { showToast: false });
        if (!canceled && Array.isArray(data.requests)) {
          setNotifCount(data.requests.filter(r => r.status === 'pending').length);
        }
      } catch {}
    };
    fetchCount();
    return () => { canceled = true; };
  }, [user, API_BASE]);

  useEffect(() => {
    if (!showProfile) return;
    const close = () => setShowProfile(false);
    window.addEventListener('click', close, { once: true });
    return () => window.removeEventListener('click', close);
  }, [showProfile]);

  if (!user) return null;

  const initials = `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase() || 'U';
  const displayName = `${user.firstName}${user.lastName ? ` ${user.lastName}` : ''}`;

  const userNavItems = [
    { icon: <LayoutDashboard size={15} />, label: 'Dashboard', active: true },
    { icon: <Users size={15} />, label: 'My Groups' },
    { icon: <Wallet size={15} />, label: 'Payments' },
    { icon: <Activity size={15} />, label: 'Prebook Requests' },
    { icon: <Bell size={15} />, label: 'Notifications', badge: notifCount },
  ];

  const adminNavItems = [
    { icon: <LayoutDashboard size={15} />, label: 'Dashboard', active: true },
    { icon: <Users size={15} />, label: 'Groups' },
    { icon: <Users size={15} />, label: 'Members' },
    { icon: <Wallet size={15} />, label: 'Collections' },
  ];

  const navItems = user.isAdmin ? adminNavItems : userNavItems;

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ fontFamily: "'Inter', system-ui, sans-serif", background: '#f7f8fa' }}
    >
      <aside className="w-56 bg-[#111827] flex flex-col shrink-0">
        <div className="h-14 flex items-center px-5 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-indigo-600 flex items-center justify-center text-white text-[11px] font-black tracking-tight select-none">
              MS
            </div>
            <span className="text-[14px] font-semibold text-white tracking-tight">ChitFund</span>
          </div>
        </div>

        <nav className="flex-1 py-5 px-3 space-y-0.5 overflow-y-auto">
          {user.isAdmin && (
            <p className="px-3 mb-2 mt-1 text-[10px] font-semibold uppercase tracking-widest text-gray-600">
              Admin Panel
            </p>
          )}
          {navItems.map((item) => (
            <SideNavItem key={item.label} {...item} />
          ))}
        </nav>

        <div className="p-3 border-t border-white/5 space-y-0.5">
          <SideNavItem icon={<Settings size={15} />} label="Settings" />
          <SideNavItem icon={<LogOut size={15} />} label="Sign out" onClick={logout} />
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-14 bg-white border-b border-gray-200/80 flex items-center justify-between px-7 shrink-0">
          <div className="flex items-center gap-2 text-[13px] text-gray-500 font-medium">
            {user.isAdmin && <Shield size={14} className="text-indigo-500" />}
            <span>{pageTitle}</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              className="relative h-8 w-8 flex items-center justify-center rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Notifications"
            >
              <Bell size={16} />
              {notifCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-rose-500 rounded-full" />
              )}
            </button>
            <div
              className="relative flex items-center gap-2.5 cursor-pointer select-none"
              onClick={e => { e.stopPropagation(); setShowProfile(s => !s); }}
            >
              <div className="h-7 w-7 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 text-[10px] font-semibold shrink-0">
                {initials}
              </div>
              <div className="hidden sm:block leading-none">
                <div className="text-[13px] font-medium text-gray-800">{displayName}</div>
                <div className="text-[11px] text-gray-400 mt-0.5">{user.isAdmin ? 'Admin' : 'Member'}</div>
              </div>
              <ChevronDown size={13} className="text-gray-400" />
              {showProfile && <ProfileDropdown user={user} onLogout={logout} />}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
};
