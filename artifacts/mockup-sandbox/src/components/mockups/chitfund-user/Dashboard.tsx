import React, { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Wallet,
  Bell,
  Settings,
  LogOut,
  ChevronRight,
  Activity,
  ChevronDown,
  CircleDot,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export function Dashboard() {
  const [activeTab, setActiveTab] = useState<"groups" | "notifications" | "activity">("groups");

  return (
    <div className="flex h-screen bg-[#f7f8fa] overflow-hidden" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* Sidebar */}
      <aside className="w-56 bg-[#111827] flex flex-col shrink-0">
        {/* Logo */}
        <div className="h-14 flex items-center px-5 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-indigo-600 flex items-center justify-center text-white text-[11px] font-black tracking-tight">
              MS
            </div>
            <span className="text-[14px] font-semibold text-white tracking-tight">ChitFund</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-5 px-3 space-y-0.5 overflow-y-auto">
          <SideNavItem icon={<LayoutDashboard size={15} />} label="Dashboard" active />
          <SideNavItem icon={<Users size={15} />} label="My Groups" />
          <SideNavItem icon={<Wallet size={15} />} label="Payments" />
          <SideNavItem icon={<Activity size={15} />} label="Prebook Requests" />
          <SideNavItem icon={<Bell size={15} />} label="Notifications" badge={2} />
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-white/5 space-y-0.5">
          <SideNavItem icon={<Settings size={15} />} label="Settings" />
          <SideNavItem icon={<LogOut size={15} />} label="Sign out" />
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">

        {/* Topbar */}
        <header className="h-14 bg-white border-b border-gray-200/80 flex items-center justify-between px-7 shrink-0">
          <div className="flex items-center gap-2 text-[13px] text-gray-500 font-medium">
            <span>Overview</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative h-8 w-8 flex items-center justify-center rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
              <Bell size={16} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-rose-500 rounded-full" />
            </button>
            <div className="flex items-center gap-2.5 cursor-pointer group">
              <Avatar className="h-7 w-7 border border-gray-200">
                <AvatarFallback className="bg-indigo-100 text-indigo-700 text-[10px] font-semibold">PS</AvatarFallback>
              </Avatar>
              <div className="hidden sm:block">
                <div className="text-[13px] font-medium text-gray-800 leading-none">Priya Sharma</div>
                <div className="text-[11px] text-gray-400 mt-0.5">Member</div>
              </div>
              <ChevronDown size={13} className="text-gray-400 group-hover:text-gray-600" />
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-5xl mx-auto px-7 py-8 space-y-7 pb-20">

            {/* Page heading */}
            <div>
              <h1 className="text-[22px] font-semibold text-gray-900 tracking-tight">Welcome back, Priya</h1>
              <p className="text-[13px] text-gray-500 mt-0.5">Your financial snapshot — {new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</p>
            </div>

            {/* Stat row */}
            <div className="grid grid-cols-4 gap-4">
              <StatCard label="Active Groups" value="3" sub="2 with payments due" />
              <StatCard label="Current Savings" value="₹24,500" sub="Net across all groups" accent />
              <StatCard label="Upcoming Payments" value="2" sub="Due in 5 days" warn />
              <StatCard label="Pending Requests" value="1" sub="Prebook under review" />
            </div>

            {/* Tabs */}
            <div>
              <div className="flex items-center gap-0 border-b border-gray-200">
                {(["groups", "notifications", "activity"] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`relative px-4 py-2.5 text-[13px] font-medium transition-colors capitalize ${
                      activeTab === tab
                        ? "text-gray-900"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab === "groups" ? "My Groups" : tab === "notifications" ? "Notifications" : "Activity"}
                    {tab === "notifications" && (
                      <span className="ml-1.5 text-[10px] font-bold bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded-full">2</span>
                    )}
                    {activeTab === tab && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-indigo-600 rounded-t" />
                    )}
                  </button>
                ))}
              </div>

              <div className="mt-6">
                {activeTab === "groups" && (
                  <div className="grid grid-cols-3 gap-4">
                    <GroupCard groupNo="5"  chitValue="1,20,000" tenure={12} monthlyShare="10,000" progress={40} currentMonth={5} payStatus="paid" />
                    <GroupCard groupNo="8"  chitValue="60,000"   tenure={10} monthlyShare="6,000"  progress={70} currentMonth={7} payStatus="due" />
                    <GroupCard groupNo="12" chitValue="2,40,000" tenure={24} monthlyShare="10,000" progress={12} currentMonth={3} payStatus="upcoming" />
                  </div>
                )}

                {activeTab === "notifications" && (
                  <div className="bg-white rounded-xl border border-gray-200/80 shadow-[0_1px_4px_rgba(0,0,0,0.04)] divide-y divide-gray-100 overflow-hidden">
                    <NotifRow
                      type="success"
                      title="Prebook request approved"
                      body="Your prebook for Group 5 — June 2025 was approved by the foreman."
                      time="2h ago"
                      unread
                    />
                    <NotifRow
                      type="warning"
                      title="Payment due in 5 days"
                      body="₹6,000 installment for Group 8 is due on 15 Oct 2025."
                      time="Yesterday"
                      unread
                    />
                    <NotifRow
                      type="info"
                      title="Group invitation"
                      body="You've been invited to join Group 15 — Chit Value ₹5,00,000."
                      time="Oct 10"
                    />
                    <NotifRow
                      type="success"
                      title="Payment received"
                      body="₹10,000 for Group 5, October 2025 has been confirmed."
                      time="Oct 5"
                    />
                  </div>
                )}

                {activeTab === "activity" && (
                  <div className="space-y-5">
                    {/* Summary row */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-white rounded-xl border border-gray-200/80 px-5 py-4 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-2">Total Paid</p>
                        <p className="text-[24px] font-bold text-gray-900 tabular-nums">₹84,000</p>
                        <p className="text-[12px] text-gray-500 mt-1">Across all active groups</p>
                      </div>
                      <div className="bg-white rounded-xl border border-gray-200/80 px-5 py-4 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-2">Prebook Requests</p>
                        <p className="text-[24px] font-bold text-gray-900 tabular-nums">2</p>
                        <p className="text-[12px] text-gray-500 mt-1">1 approved · 1 pending</p>
                      </div>
                      <div className="bg-white rounded-xl border border-gray-200/80 px-5 py-4 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-2">Last Payment</p>
                        <p className="text-[24px] font-bold text-gray-900 tabular-nums">Oct 5</p>
                        <p className="text-[12px] text-gray-500 mt-1">₹10,000 · Group 5</p>
                      </div>
                    </div>

                    {/* Transactions */}
                    <div className="bg-white rounded-xl border border-gray-200/80 shadow-[0_1px_4px_rgba(0,0,0,0.04)] overflow-hidden">
                      <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="text-[14px] font-semibold text-gray-900">Recent Transactions</h3>
                      </div>
                      {/* Table header */}
                      <div className="grid px-5 py-2 bg-gray-50/70 border-b border-gray-100 text-[11px] font-semibold text-gray-400 uppercase tracking-wider"
                        style={{ gridTemplateColumns: "1fr 7rem 7rem 5rem" }}>
                        <span>Description</span>
                        <span>Date</span>
                        <span className="text-right">Amount</span>
                        <span className="text-right">Status</span>
                      </div>
                      {[
                        { desc: "Monthly Installment · Group 5",   date: "Oct 5, 2024",  amount: "−₹10,000", credit: false },
                        { desc: "Monthly Installment · Group 8",   date: "Sep 15, 2024", amount: "−₹6,000",  credit: false },
                        { desc: "Monthly Installment · Group 12",  date: "Sep 10, 2024", amount: "−₹10,000", credit: false },
                        { desc: "Prize Payout · Group 3 (closed)", date: "Aug 20, 2024", amount: "+₹97,000", credit: true  },
                      ].map((tx, i) => (
                        <div key={i} className="grid px-5 py-3 border-b border-gray-100 last:border-b-0 items-center hover:bg-gray-50/40 transition-colors text-[13px]"
                          style={{ gridTemplateColumns: "1fr 7rem 7rem 5rem" }}>
                          <div className="flex items-center gap-2.5">
                            <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${tx.credit ? "bg-emerald-50" : "bg-gray-100"}`}>
                              <ArrowUpRight size={12} className={tx.credit ? "text-emerald-600 rotate-180" : "text-gray-500"} />
                            </div>
                            <span className="font-medium text-gray-800">{tx.desc}</span>
                          </div>
                          <span className="text-gray-500">{tx.date}</span>
                          <span className={`text-right font-semibold tabular-nums ${tx.credit ? "text-emerald-600" : "text-gray-900"}`}>{tx.amount}</span>
                          <span className="text-right text-[11px] font-medium text-gray-400">Done</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SideNavItem({ icon, label, active, badge }: { icon: React.ReactNode; label: string; active?: boolean; badge?: number }) {
  return (
    <a href="#" className={`flex items-center justify-between px-3 py-2 rounded-md text-[13px] font-medium transition-colors ${
      active ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
    }`}>
      <span className="flex items-center gap-2.5">{icon}{label}</span>
      {badge !== undefined && (
        <span className="text-[10px] font-bold bg-indigo-600 text-white px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
          {badge}
        </span>
      )}
    </a>
  );
}

function StatCard({ label, value, sub, accent, warn }: { label: string; value: string; sub: string; accent?: boolean; warn?: boolean }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200/80 shadow-[0_1px_4px_rgba(0,0,0,0.04)] px-5 py-4">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-2">{label}</p>
      <p className={`text-[26px] font-bold tabular-nums leading-none ${accent ? "text-indigo-600" : warn ? "text-amber-600" : "text-gray-900"}`}>{value}</p>
      <p className="text-[12px] text-gray-400 mt-2">{sub}</p>
    </div>
  );
}

function GroupCard({ groupNo, chitValue, tenure, monthlyShare, progress, currentMonth, payStatus }: any) {
  const statusMap = {
    paid:     { dot: "bg-emerald-500", label: "Paid",     text: "text-emerald-700" },
    due:      { dot: "bg-amber-500",   label: "Due Now",  text: "text-amber-700"   },
    upcoming: { dot: "bg-gray-300",    label: "Upcoming", text: "text-gray-500"    },
  } as const;
  const s = statusMap[payStatus as keyof typeof statusMap];

  return (
    <div className="bg-white rounded-xl border border-gray-200/80 shadow-[0_1px_4px_rgba(0,0,0,0.04)] flex flex-col hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-shadow">
      <div className="px-5 pt-5 pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Group No.</p>
            <p className="text-[22px] font-bold text-gray-900 leading-none">{groupNo}</p>
          </div>
          <span className={`inline-flex items-center gap-1.5 text-[12px] font-semibold ${s.text}`}>
            <span className={`w-[7px] h-[7px] rounded-full ${s.dot}`} />{s.label}
          </span>
        </div>
      </div>

      <div className="px-5 py-4 flex-1 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-[11px] text-gray-400 mb-0.5">Chit Value</p>
            <p className="text-[14px] font-semibold text-gray-900">₹{chitValue}</p>
          </div>
          <div>
            <p className="text-[11px] text-gray-400 mb-0.5">Monthly Share</p>
            <p className="text-[14px] font-semibold text-gray-900">₹{monthlyShare}</p>
          </div>
          <div>
            <p className="text-[11px] text-gray-400 mb-0.5">Tenure</p>
            <p className="text-[14px] font-semibold text-gray-900">{tenure} months</p>
          </div>
          <div>
            <p className="text-[11px] text-gray-400 mb-0.5">Current Month</p>
            <p className="text-[14px] font-semibold text-gray-900">Month {currentMonth}</p>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[12px] mb-1.5">
            <span className="text-gray-400">Progress</span>
            <span className="font-semibold text-indigo-600">{progress}%</span>
          </div>
          <Progress value={progress} className="h-1 bg-gray-100 [&>div]:bg-indigo-500" />
        </div>
      </div>

      <div className="px-5 pb-5">
        <button className="w-full flex items-center justify-center gap-1 text-[13px] font-medium text-gray-600 border border-gray-200 rounded-lg py-2 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/40 transition-all">
          View Details <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

function NotifRow({ type, title, body, time, unread }: { type: "success" | "warning" | "info"; title: string; body: string; time: string; unread?: boolean }) {
  const accent = { success: "bg-emerald-500", warning: "bg-amber-500", info: "bg-indigo-500" }[type];
  return (
    <div className={`flex gap-4 px-5 py-4 hover:bg-gray-50/60 transition-colors ${unread ? "bg-indigo-50/20" : ""}`}>
      <div className={`w-0.5 rounded-full shrink-0 self-stretch ${unread ? accent : "bg-transparent"}`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-3 mb-0.5">
          <p className={`text-[13px] font-semibold ${unread ? "text-gray-900" : "text-gray-700"}`}>{title}</p>
          <span className="text-[11px] text-gray-400 whitespace-nowrap shrink-0">{time}</span>
        </div>
        <p className="text-[13px] text-gray-500 leading-relaxed">{body}</p>
      </div>
    </div>
  );
}
