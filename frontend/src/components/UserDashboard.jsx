import { useEffect, useState } from 'react';
import { Users } from 'lucide-react';
import { GroupCard } from './GroupCard';
import { RequestNotifications } from './RequestNotifications';
import { ChitValueBanner } from './ChitValueBanner';
import { AppLayout } from './AppLayout';
import { apiFetch } from '../lib/api';

const StatCard = ({ label, value, sub, color = 'default' }) => {
  const valueColor = { default: 'text-gray-900', indigo: 'text-indigo-600', amber: 'text-amber-600', red: 'text-red-600' }[color];
  return (
    <div className="bg-white rounded-xl border border-gray-200/80 shadow-[0_1px_4px_rgba(0,0,0,0.04)] px-5 py-4">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-2">{label}</p>
      <p className={`text-[26px] font-bold tabular-nums leading-none ${valueColor}`}>{value}</p>
      {sub && <p className="text-[12px] text-gray-400 mt-2">{sub}</p>}
    </div>
  );
};

const TABS = [
  { id: 'groups', label: 'My Groups' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'activity', label: 'Activity' },
];

export const UserDashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState('groups');
  const [stats, setStats] = useState({ activeGroups: 0, totalPaid: 0, upcomingPayments: 0, pendingRequests: 0 });
  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  const [groups, setGroups] = useState([]);
  const [monthRecords, setMonthRecords] = useState([]);
  const [mergedGroups, setMergedGroups] = useState([]);
  const [prebookStats, setPrebookStats] = useState({ sent: 0, approved: 0 });
  const [lastPaymentDate, setLastPaymentDate] = useState(null);

  useEffect(() => {
    const fetchMyGroups = async () => {
      try {
        const data = await apiFetch(`${API_BASE}/group/my`, { showToast: false });
        if (data.success) {
          const groupsWithShare = data.groups.map(group => {
            const userInfo = group.members?.[0] || {};
            return {
              ...group,
              shareAmount: userInfo.shareAmount || 0,
              hasPrebooked: userInfo.hasPrebooked || false,
              preBookedMonth: userInfo.preBookedMonth || null,
              extraMonthlyPayment: userInfo.extraMonthlyPayment || 0
            };
          });
          setGroups(groupsWithShare);
        }
      } catch (err) { setGroups([]); }
    };
    fetchMyGroups();
  }, []);

  useEffect(() => {
    const fetchMonthData = async () => {
      try {
        const groupIds = groups.map(g => g._id);
        const data = await apiFetch(`${API_BASE}/month/my`, { method: 'POST', body: { groupIds }, showToast: false });
        if (data.success) setMonthRecords(data.months);
      } catch (err) { setMonthRecords([]); }
    };
    if (groups.length > 0) fetchMonthData();
  }, [groups]);

  useEffect(() => {
    const computeStatsAndGroups = async () => {
      const now = new Date();
      const currentMonthValue = now.getFullYear() * 12 + now.getMonth();
      const computedGroups = groups.map(group => {
        const start = new Date(group.startMonth);
        const startMonthValue = start.getFullYear() * 12 + start.getMonth();
        const monthsPassed = currentMonthValue - startMonthValue + 1;
        let groupStatus = 'upcoming';
        if (monthsPassed > 0 && monthsPassed <= group.tenure) groupStatus = 'active';
        else if (monthsPassed > group.tenure) groupStatus = 'completed';
        const currentMonth = Math.max(0, monthsPassed);
        const groupMonths = monthRecords.filter(m => m.groupId === group._id);
        let myPaymentStatus = 'upcoming';
        if (currentMonth > 0) {
          const pastMonths = groupMonths.filter(m => {
            const [monthName, year] = m.monthName.split(' ');
            const monthIndex = new Date(`${monthName} 1, ${year}`).getMonth();
            const monthValue = parseInt(year) * 12 + monthIndex;
            return monthValue <= currentMonthValue;
          });
          if (pastMonths.some(m => m.status === 'due')) myPaymentStatus = 'due';
          else if (pastMonths.some(m => m.status === 'pending')) myPaymentStatus = 'pending';
          else myPaymentStatus = 'paid';
        }
        const nextDue = groupMonths.find(m => m.status === 'due' || m.status === 'pending')?.monthName;
        return { ...group, currentMonth, myPaymentStatus, groupStatus, nextPaymentDue: nextDue || null };
      });
      setMergedGroups(computedGroups);
      const activeGroups = computedGroups.filter(g => g.groupStatus === 'active').length;
      const totalPaid = monthRecords.filter(m => m.status === 'paid').reduce((sum, m) => sum + (m.amount || 0), 0);
      const upcomingPayments = monthRecords.filter(m => m.status === 'due' || m.status === 'pending').length;
      let pendingRequests = 0;
      try {
        const data = await apiFetch(`${API_BASE}/request/my`, { showToast: false });
        if (data.success) pendingRequests = data.requests.filter(req => req.status === 'pending').length;
      } catch (err) {}
      setStats({ activeGroups, totalPaid, upcomingPayments, pendingRequests });
    };
    computeStatsAndGroups();
  }, [monthRecords]);

  useEffect(() => {
    const fetchPrebookStats = async () => {
      try {
        const data = await apiFetch(`${API_BASE}/request/my`, { showToast: false });
        if (data.success && Array.isArray(data.requests)) {
          const prebooks = data.requests.filter(r => r.type === 'month_prebook');
          setPrebookStats({ sent: prebooks.length, approved: prebooks.filter(r => r.status === 'approved').length });
        }
      } catch { setPrebookStats({ sent: 0, approved: 0 }); }
    };
    fetchPrebookStats();
  }, []);

  useEffect(() => {
    const paidMonths = monthRecords.filter(m => m.status === 'paid');
    if (paidMonths.length > 0) {
      const latest = paidMonths.reduce((a, b) => new Date(a.paymentDate) > new Date(b.paymentDate) ? a : b);
      setLastPaymentDate(latest.paymentDate);
    } else {
      setLastPaymentDate(null);
    }
  }, [monthRecords]);

  const computeNetSavings = () => {
    let totalPaid = 0;
    monthRecords.forEach((m) => {
      if (m.status === 'paid') {
        const group = groups.find(g => g._id === m.groupId);
        if (group) totalPaid += group.shareAmount / group.tenure || 0;
      }
    });
    return totalPaid;
  };

  const netSavings = computeNetSavings();
  const totalAmountPaid = monthRecords.filter(m => m.status === 'paid').reduce((sum, m) => sum + (m.amount || 0), 0);
  const firstName = user?.firstName || '';

  return (
    <AppLayout pageTitle="Overview">
      <div className="max-w-5xl mx-auto px-7 py-8 space-y-7 pb-20">
        <div>
          <h1 className="text-[22px] font-semibold text-gray-900 tracking-tight">
            Welcome back, {firstName}
          </h1>
          <p className="text-[13px] text-gray-500 mt-0.5">
            Your financial snapshot — {new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
          </p>
        </div>

        <ChitValueBanner />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Active Groups" value={stats.activeGroups} sub={`${groups.length} total enrolled`} />
          <StatCard
            label="Current Savings"
            value={`₹${netSavings.toLocaleString()}`}
            sub="Net across all groups"
            color={netSavings >= 0 ? 'indigo' : 'red'}
          />
          <StatCard
            label="Upcoming Payments"
            value={stats.upcomingPayments}
            sub="Due or pending"
            color={stats.upcomingPayments > 0 ? 'amber' : 'default'}
          />
          <StatCard
            label="Pending Requests"
            value={stats.pendingRequests}
            sub="Awaiting admin review"
            color={stats.pendingRequests > 0 ? 'red' : 'default'}
          />
        </div>

        <div>
          <div className="flex items-center border-b border-gray-200">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-4 py-2.5 text-[13px] font-medium transition-colors ${
                  activeTab === tab.id ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
                {tab.id === 'notifications' && stats.pendingRequests > 0 && (
                  <span className="ml-1.5 text-[10px] font-bold bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded-full">
                    {stats.pendingRequests}
                  </span>
                )}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-indigo-600 rounded-t" />
                )}
              </button>
            ))}
          </div>

          <div className="mt-6">
            {activeTab === 'groups' && (
              mergedGroups.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                  <Users className="mx-auto mb-3 opacity-40" size={32} />
                  <p className="text-[14px]">No groups yet. Request to join a group from your admin.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mergedGroups.map((group) => (
                    <GroupCard key={group._id} group={group} />
                  ))}
                </div>
              )
            )}

            {activeTab === 'notifications' && <RequestNotifications />}

            {activeTab === 'activity' && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-xl border border-gray-200/80 px-5 py-4 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-2">Total Paid</p>
                    <p className="text-[24px] font-bold text-gray-900 tabular-nums">₹{totalAmountPaid.toLocaleString()}</p>
                    <p className="text-[12px] text-gray-500 mt-1">Across all active groups</p>
                  </div>
                  <div className="bg-white rounded-xl border border-gray-200/80 px-5 py-4 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-2">Prebook Requests</p>
                    <p className="text-[24px] font-bold text-gray-900 tabular-nums">{prebookStats.sent}</p>
                    <p className="text-[12px] text-gray-500 mt-1">
                      {prebookStats.approved} approved · {prebookStats.sent - prebookStats.approved} pending
                    </p>
                  </div>
                  <div className="bg-white rounded-xl border border-gray-200/80 px-5 py-4 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-2">Last Payment</p>
                    <p className="text-[24px] font-bold text-gray-900 tabular-nums">
                      {lastPaymentDate
                        ? new Date(lastPaymentDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
                        : '—'}
                    </p>
                    <p className="text-[12px] text-gray-500 mt-1">
                      {lastPaymentDate
                        ? new Date(lastPaymentDate).toLocaleDateString('en-IN', { year: 'numeric' })
                        : 'No payments yet'}
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200/80 shadow-[0_1px_4px_rgba(0,0,0,0.04)] overflow-hidden">
                  <div className="px-5 py-3.5 border-b border-gray-100">
                    <h3 className="text-[14px] font-semibold text-gray-900">Enrolled Groups</h3>
                  </div>
                  <div
                    className="grid px-5 py-2 bg-gray-50/70 border-b border-gray-100 text-[11px] font-semibold text-gray-400 uppercase tracking-wider"
                    style={{ gridTemplateColumns: '1fr 5rem 7rem 7rem' }}
                  >
                    <span>Group</span>
                    <span>Progress</span>
                    <span className="text-right">Share / mo</span>
                    <span className="text-right">Status</span>
                  </div>
                  {groups.length === 0 ? (
                    <div className="px-5 py-8 text-center text-[13px] text-gray-400">No groups enrolled.</div>
                  ) : (
                    groups.map(group => {
                      const mg = mergedGroups.find(g => g._id === group._id) || group;
                      const st = mg.myPaymentStatus || 'upcoming';
                      const dotColor = { paid: 'bg-emerald-500', due: 'bg-amber-500', pending: 'bg-amber-400', upcoming: 'bg-gray-300', completed: 'bg-indigo-400' }[st] || 'bg-gray-300';
                      const textColor = { paid: 'text-emerald-700', due: 'text-amber-700', pending: 'text-amber-700', upcoming: 'text-gray-500', completed: 'text-indigo-600' }[st] || 'text-gray-500';
                      return (
                        <div
                          key={group._id}
                          className="grid px-5 py-3 border-b border-gray-100 last:border-b-0 items-center hover:bg-gray-50/40 transition-colors text-[13px]"
                          style={{ gridTemplateColumns: '1fr 5rem 7rem 7rem' }}
                        >
                          <div>
                            <p className="font-semibold text-gray-800">Group {group.groupNo}</p>
                            <p className="text-[12px] text-gray-400">
                              {new Date(group.startMonth).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                            </p>
                          </div>
                          <span className="text-gray-600">{mg.currentMonth || 0}/{group.tenure}</span>
                          <span className="text-right font-semibold text-gray-900">
                            ₹{((group.shareAmount || 0) / (group.tenure || 1)).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                          </span>
                          <span className={`flex items-center justify-end gap-1.5 font-medium ${textColor}`}>
                            <span className={`w-[6px] h-[6px] rounded-full shrink-0 ${dotColor}`} />
                            {st.charAt(0).toUpperCase() + st.slice(1)}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};
