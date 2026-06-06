import { useState, useEffect, useRef } from 'react';
import {
  Bell, LayoutDashboard, Users, Activity, Settings, LogOut,
  ChevronDown, ChevronLeft, ChevronRight, Shield,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../lib/api';
import ProfileDropdown from './ProfileDropdown';

const TYPE_LABEL = {
  join_group: 'Join Group',
  leave_group: 'Leave Group',
  confirm_cash_payment: 'Cash Payment',
  month_prebook: 'Payout Prebook',
  payment_confirmation: 'Payment',
};

const STATUS_DOT = {
  pending:  'bg-amber-400',
  approved: 'bg-emerald-500',
  rejected: 'bg-red-400',
};

const relativeTime = (dateStr) => {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  if (isNaN(diff)) return '';
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

const SideNavItem = ({ icon, label, active, badge, onClick, collapsed }) => (
  <button
    onClick={onClick}
    title={collapsed ? label : undefined}
    className={`relative w-full flex items-center py-2 rounded-md text-[13px] font-medium transition-colors ${
      collapsed ? 'justify-center px-2' : 'justify-between px-3'
    } ${active ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'}`}
  >
    <span className={`flex items-center ${collapsed ? '' : 'gap-2.5'}`}>
      {icon}
      {!collapsed && <span>{label}</span>}
    </span>
    {!collapsed && badge > 0 && (
      <span className="text-[10px] font-bold bg-indigo-600 text-white px-1.5 py-0.5 rounded-full min-w-[18px] text-center leading-4">
        {badge}
      </span>
    )}
    {collapsed && badge > 0 && (
      <span className="absolute top-1 right-1 w-[6px] h-[6px] bg-indigo-500 rounded-full" />
    )}
  </button>
);

export const AppLayout = ({ children, pageTitle = 'Overview', activeView, onNavClick }) => {
  const { user, logout } = useAuth();
  const [notifCount, setNotifCount] = useState(0);
  const [showProfile, setShowProfile] = useState(false);
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem('sidebar-collapsed') === 'true');
  const [showBell, setShowBell] = useState(false);
  const [bellNotifs, setBellNotifs] = useState([]);
  const [bellLoading, setBellLoading] = useState(false);
  const bellRef = useRef(null);
  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  const toggleCollapse = () => {
    setCollapsed(prev => {
      const next = !prev;
      localStorage.setItem('sidebar-collapsed', String(next));
      return next;
    });
  };

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

  const openBell = async () => {
    setShowBell(prev => !prev);
    if (!showBell && bellNotifs.length === 0) {
      setBellLoading(true);
      try {
        const data = await apiFetch(`${API_BASE}/request/my`, { showToast: false });
        if (Array.isArray(data.requests)) {
          const sorted = [...data.requests]
            .sort((a, b) => new Date(b.timestamp || b.createdAt) - new Date(a.timestamp || a.createdAt))
            .slice(0, 10);
          setBellNotifs(sorted);
          setNotifCount(sorted.filter(r => r.status === 'pending').length);
        }
      } catch {}
      finally { setBellLoading(false); }
    }
  };

  useEffect(() => {
    if (!showBell) return;
    const handler = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) setShowBell(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showBell]);

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
    { id: 'groups',        icon: <LayoutDashboard size={15} />, label: 'Overview'      },
    { id: 'notifications', icon: <Bell size={15} />,            label: 'Notifications', badge: notifCount },
    { id: 'activity',      icon: <Activity size={15} />,        label: 'Activity'       },
  ];

  const adminNavItems = [
    { id: 'dashboard', icon: <LayoutDashboard size={15} />, label: 'Dashboard' },
    { id: 'groups',    icon: <Users size={15} />,            label: 'Groups'    },
    { id: 'members',   icon: <Users size={15} />,            label: 'Members'   },
  ];

  const navItems = user.isAdmin ? adminNavItems : userNavItems;
  const sidebarW = collapsed ? 'w-14' : 'w-56';

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ fontFamily: "'Inter', system-ui, sans-serif", background: '#f7f8fa' }}
    >
      {/* ─── Sidebar ──────────────────────────────────── */}
      <aside className={`${sidebarW} bg-[#111827] flex flex-col shrink-0 transition-all duration-200`}>
        <div className={`h-14 flex items-center border-b border-white/5 ${collapsed ? 'justify-center px-2' : 'px-5'}`}>
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-7 h-7 rounded bg-indigo-600 flex items-center justify-center text-white text-[11px] font-black tracking-tight select-none shrink-0">
              MS
            </div>
            {!collapsed && (
              <span className="text-[14px] font-semibold text-white tracking-tight whitespace-nowrap">ChitFund</span>
            )}
          </div>
        </div>

        <nav className="flex-1 py-5 px-2 space-y-0.5 overflow-y-auto">
          {user.isAdmin && !collapsed && (
            <p className="px-3 mb-2 mt-1 text-[10px] font-semibold uppercase tracking-widest text-gray-600">
              Admin Panel
            </p>
          )}
          {navItems.map((item) => (
            <SideNavItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              active={activeView === item.id}
              badge={item.badge}
              collapsed={collapsed}
              onClick={() => onNavClick?.(item.id)}
            />
          ))}
        </nav>

        <div className="p-2 border-t border-white/5 space-y-0.5">
          <SideNavItem icon={<Settings size={15} />}  label="Settings"  collapsed={collapsed} />
          <SideNavItem icon={<LogOut size={15} />}    label="Sign out"  collapsed={collapsed} onClick={logout} />
          <button
            onClick={toggleCollapse}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="w-full flex items-center justify-center py-2 text-gray-600 hover:text-gray-400 transition-colors rounded-md hover:bg-white/5 mt-1"
          >
            {collapsed
              ? <ChevronRight size={14} />
              : <ChevronLeft size={14} />}
          </button>
        </div>
      </aside>

      {/* ─── Main area ────────────────────────────────── */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
        <header className="h-14 bg-white border-b border-gray-200/80 flex items-center justify-between px-7 shrink-0">
          <div className="flex items-center gap-2 text-[13px] text-gray-500 font-medium">
            {user.isAdmin && <Shield size={14} className="text-indigo-500" />}
            <span>{pageTitle}</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Bell dropdown */}
            <div ref={bellRef} className="relative">
              <button
                onClick={openBell}
                className="relative h-8 w-8 flex items-center justify-center rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                aria-label="Notifications"
              >
                <Bell size={16} />
                {notifCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-rose-500 rounded-full" />
                )}
              </button>

              {showBell && (
                <div className="absolute right-0 top-10 w-80 bg-white rounded-xl border border-gray-200/80 shadow-[0_8px_32px_rgba(0,0,0,0.12)] z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                    <p className="text-[13px] font-semibold text-gray-900">Notifications</p>
                    {notifCount > 0 && (
                      <span className="text-[10px] font-bold bg-rose-100 text-rose-600 px-1.5 py-0.5 rounded-full">
                        {notifCount} pending
                      </span>
                    )}
                  </div>

                  <div className="max-h-72 overflow-y-auto">
                    {bellLoading ? (
                      <div className="py-8 text-center text-[12px] text-gray-400">Loading…</div>
                    ) : bellNotifs.length === 0 ? (
                      <div className="py-8 text-center text-[12px] text-gray-400">No notifications yet</div>
                    ) : (
                      bellNotifs.map((n) => (
                        <div
                          key={n._id}
                          className="px-4 py-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50/40 transition-colors"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-[12px] font-semibold text-gray-800">
                              {TYPE_LABEL[n.type] || n.type?.replace(/_/g, ' ')}
                            </p>
                            <span className={`flex items-center gap-1 text-[11px] font-semibold ${
                              n.status === 'approved' ? 'text-emerald-700'
                              : n.status === 'rejected' ? 'text-red-600'
                              : 'text-amber-700'
                            }`}>
                              <span className={`w-[5px] h-[5px] rounded-full ${STATUS_DOT[n.status] || 'bg-amber-400'}`} />
                              {n.status?.charAt(0).toUpperCase() + n.status?.slice(1)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-gray-400">
                            {n.amount && <span>₹{n.amount.toLocaleString()}</span>}
                            {n.monthName && <span>· {n.monthName}</span>}
                            <span className="ml-auto">{relativeTime(n.timestamp || n.createdAt)}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <button
                    onClick={() => { setShowBell(false); onNavClick?.('notifications'); }}
                    className="w-full px-4 py-2.5 text-center text-[12px] font-semibold text-indigo-600 hover:text-indigo-800 border-t border-gray-100 hover:bg-indigo-50/40 transition-colors"
                  >
                    View all notifications →
                  </button>
                </div>
              )}
            </div>

            {/* Profile */}
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
