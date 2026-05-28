import React, { useState } from "react";
import {
  Users,
  Wallet,
  Bell,
  Settings,
  Plus,
  Search,
  Check,
  X,
  UserPlus,
  LayoutDashboard,
  LogOut,
  FolderOpen,
  ChevronDown,
  MoreHorizontal,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const pendingRequests = [
  { id: 1, name: "Priya Sharma",  initials: "PS", type: "Prebook Request",            details: "Group 5 · June 2025",  amount: null },
  { id: 2, name: "Amit Patel",    initials: "AP", type: "Cash Payment Confirmation",  details: "Group 3 · May 2025",   amount: "₹5,000" },
  { id: 3, name: "Sneha Iyer",    initials: "SI", type: "Leave Group Request",         details: "Group 8",              amount: null },
];

const groups = [
  { id: "G-001", name: "Alpha Savers",     chitValue: "₹1,00,000", members: "10/10", status: "active" },
  { id: "G-002", name: "Wealth Builders",  chitValue: "₹50,000",   members: "20/20", status: "active" },
  { id: "G-003", name: "Future Secure",    chitValue: "₹2,00,000", members: "12/20", status: "upcoming" },
  { id: "G-004", name: "Prosperity Fund",  chitValue: "₹5,00,000", members: "10/10", status: "completed" },
];

const members = [
  { id: "M-101", name: "Rahul Verma",   initials: "RV", phone: "+91 98765 43210", groups: ["G-001", "G-002"], status: "active" },
  { id: "M-102", name: "Anita Desai",   initials: "AD", phone: "+91 87654 32109", groups: ["G-001"],           status: "active" },
  { id: "M-103", name: "Vikram Singh",  initials: "VS", phone: "+91 76543 21098", groups: ["G-003"],           status: "active" },
  { id: "M-104", name: "Meera Reddy",   initials: "MR", phone: "+91 65432 10987", groups: ["G-002", "G-004"],  status: "active" },
  { id: "M-105", name: "Suresh Kumar",  initials: "SK", phone: "+91 54321 09876", groups: ["G-001"],           status: "defaulter" },
];

function StatusPill({ status }: { status: string }) {
  const map: Record<string, { dot: string; label: string; text: string }> = {
    active:     { dot: "bg-emerald-500", label: "Active",    text: "text-emerald-700" },
    upcoming:   { dot: "bg-blue-400",    label: "Upcoming",  text: "text-blue-700" },
    completed:  { dot: "bg-gray-300",    label: "Completed", text: "text-gray-500" },
    defaulter:  { dot: "bg-red-500",     label: "Defaulter", text: "text-red-600" },
  };
  const s = map[status] ?? map.active;
  return (
    <span className={`inline-flex items-center gap-1.5 text-[12px] font-semibold ${s.text}`}>
      <span className={`w-[7px] h-[7px] rounded-full ${s.dot} shrink-0`} />{s.label}
    </span>
  );
}

export function Dashboard() {
  const [activeTab, setActiveTab] = useState<"requests" | "groups" | "members">("requests");

  return (
    <div className="flex h-screen bg-[#f7f8fa] overflow-hidden" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* Sidebar */}
      <aside className="w-56 bg-[#111827] flex flex-col shrink-0">
        <div className="h-14 flex items-center px-5 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-indigo-600 flex items-center justify-center text-white text-[11px] font-black tracking-tight">
              MS
            </div>
            <span className="text-[14px] font-semibold text-white tracking-tight">ChitFund</span>
          </div>
        </div>

        <nav className="flex-1 py-5 px-3 space-y-0.5 overflow-y-auto">
          <p className="px-3 pt-1 pb-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-600">Overview</p>
          <SideItem icon={<LayoutDashboard size={15} />} label="Dashboard" active />

          <p className="px-3 pt-4 pb-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-600">Manage</p>
          <SideItem icon={<FolderOpen size={15} />} label="Groups" />
          <SideItem icon={<Users size={15} />} label="Members" />
          <SideItem icon={<Wallet size={15} />} label="Collections" />

          <p className="px-3 pt-4 pb-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-600">System</p>
          <SideItem icon={<Settings size={15} />} label="Settings" />
        </nav>

        <div className="p-3 border-t border-white/5">
          <SideItem icon={<LogOut size={15} />} label="Sign out" />
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">

        {/* Topbar */}
        <header className="h-14 bg-white border-b border-gray-200/80 flex items-center justify-between px-7 shrink-0">
          <h1 className="text-[15px] font-semibold text-gray-900">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <button className="relative h-8 w-8 flex items-center justify-center rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
              <Bell size={16} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-rose-500 rounded-full" />
            </button>
            <div className="flex items-center gap-2.5 cursor-pointer group">
              <Avatar className="h-7 w-7 border border-gray-200">
                <AvatarFallback className="bg-indigo-100 text-indigo-700 text-[10px] font-semibold">RK</AvatarFallback>
              </Avatar>
              <div className="hidden sm:block">
                <div className="text-[13px] font-medium text-gray-800 leading-none">Raj Kumar</div>
                <div className="text-[11px] text-gray-400 mt-0.5">Administrator</div>
              </div>
              <ChevronDown size={13} className="text-gray-400 group-hover:text-gray-600" />
            </div>
          </div>
        </header>

        {/* Scrollable content */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-5xl mx-auto px-7 py-8 space-y-7 pb-20">

            {/* Page header + actions */}
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-[22px] font-semibold text-gray-900 tracking-tight">Overview</h2>
                <p className="text-[13px] text-gray-500 mt-0.5">Manage groups, members, and review requests</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-8 text-[13px] font-medium border-gray-200 text-gray-600 shadow-none">
                  <Settings className="h-3.5 w-3.5 mr-1.5" />Settings
                </Button>
                <Button variant="outline" size="sm" className="h-8 text-[13px] font-medium border-gray-200 text-gray-600 shadow-none">
                  <UserPlus className="h-3.5 w-3.5 mr-1.5" />Add Member
                </Button>
                <Button size="sm" className="h-8 bg-indigo-600 hover:bg-indigo-700 text-white text-[13px] font-medium shadow-none">
                  <Plus className="h-3.5 w-3.5 mr-1.5" />New Group
                </Button>
              </div>
            </div>

            {/* Stat row */}
            <div className="grid grid-cols-4 gap-4">
              <StatCard label="Total Groups"      value="8"          sub="4 currently active" />
              <StatCard label="Total Members"     value="47"         sub="Across all groups"  />
              <StatCard label="Pending Requests"  value="3"          sub="Awaiting review"    warn />
              <StatCard label="Monthly Collection" value="₹1,85,000" sub="Current cycle"      accent />
            </div>

            {/* Tabs */}
            <div>
              <div className="flex items-center gap-0 border-b border-gray-200">
                {(["requests", "groups", "members"] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`relative px-4 py-2.5 text-[13px] font-medium transition-colors ${
                      activeTab === tab ? "text-gray-900" : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab === "requests" ? "Pending Requests" : tab === "groups" ? "Group Management" : "Member Management"}
                    {tab === "requests" && (
                      <span className="ml-1.5 text-[10px] font-bold bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">3</span>
                    )}
                    {activeTab === tab && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-indigo-600 rounded-t" />
                    )}
                  </button>
                ))}
              </div>

              <div className="mt-5">

                {/* Pending Requests */}
                {activeTab === "requests" && (
                  <div className="bg-white rounded-xl border border-gray-200/80 shadow-[0_1px_4px_rgba(0,0,0,0.04)] overflow-hidden">
                    <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
                      <h3 className="text-[14px] font-semibold text-gray-900">Action Required</h3>
                      <span className="text-[12px] text-gray-400">{pendingRequests.length} requests</span>
                    </div>
                    {/* Header row */}
                    <div className="grid px-5 py-2.5 bg-gray-50/70 border-b border-gray-100 text-[11px] font-semibold text-gray-400 uppercase tracking-wider"
                      style={{ gridTemplateColumns: "1.5fr 1.5fr 1fr 6rem 9rem" }}>
                      <span>Member</span>
                      <span>Request Type</span>
                      <span>Details</span>
                      <span className="text-right">Amount</span>
                      <span className="text-right">Actions</span>
                    </div>
                    {pendingRequests.map(req => (
                      <div key={req.id} className="grid px-5 py-3.5 border-b border-gray-100 last:border-b-0 items-center hover:bg-gray-50/40 transition-colors"
                        style={{ gridTemplateColumns: "1.5fr 1.5fr 1fr 6rem 9rem" }}>
                        <div className="flex items-center gap-2.5">
                          <Avatar className="h-7 w-7 border border-gray-100">
                            <AvatarFallback className="bg-indigo-50 text-indigo-600 text-[10px] font-semibold">{req.initials}</AvatarFallback>
                          </Avatar>
                          <span className="text-[13px] font-medium text-gray-900">{req.name}</span>
                        </div>
                        <span className="text-[13px] text-gray-600">{req.type}</span>
                        <span className="text-[13px] text-gray-400">{req.details}</span>
                        <span className="text-right text-[13px] font-semibold text-gray-800 tabular-nums">{req.amount ?? "—"}</span>
                        <div className="flex justify-end items-center gap-1.5">
                          <button className="h-7 px-2.5 flex items-center gap-1 text-[12px] font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-md transition-colors">
                            <Check size={12} />Approve
                          </button>
                          <button className="h-7 px-2.5 flex items-center gap-1 text-[12px] font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-md transition-colors">
                            <X size={12} />Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Group Management */}
                {activeTab === "groups" && (
                  <div className="bg-white rounded-xl border border-gray-200/80 shadow-[0_1px_4px_rgba(0,0,0,0.04)] overflow-hidden">
                    <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
                      <h3 className="text-[14px] font-semibold text-gray-900">All Groups</h3>
                      <div className="relative">
                        <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-gray-400" />
                        <input placeholder="Search groups..." className="h-8 w-52 pl-8 pr-3 text-[13px] border border-gray-200 rounded-lg bg-gray-50 outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all" />
                      </div>
                    </div>
                    <div className="grid px-5 py-2.5 bg-gray-50/70 border-b border-gray-100 text-[11px] font-semibold text-gray-400 uppercase tracking-wider"
                      style={{ gridTemplateColumns: "5rem 1fr 7rem 6rem 6rem 3rem" }}>
                      <span>ID</span><span>Name</span><span>Chit Value</span><span>Members</span><span>Status</span><span></span>
                    </div>
                    {groups.map(g => (
                      <div key={g.id} className="grid px-5 py-3.5 border-b border-gray-100 last:border-b-0 items-center hover:bg-gray-50/40 transition-colors text-[13px]"
                        style={{ gridTemplateColumns: "5rem 1fr 7rem 6rem 6rem 3rem" }}>
                        <span className="text-gray-400 font-medium">{g.id}</span>
                        <span className="font-medium text-gray-900">{g.name}</span>
                        <span className="font-semibold text-gray-800 tabular-nums">{g.chitValue}</span>
                        <span className="text-gray-500">{g.members}</span>
                        <StatusPill status={g.status} />
                        <button className="h-7 w-7 flex items-center justify-center rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                          <MoreHorizontal size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Member Management */}
                {activeTab === "members" && (
                  <div className="bg-white rounded-xl border border-gray-200/80 shadow-[0_1px_4px_rgba(0,0,0,0.04)] overflow-hidden">
                    <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
                      <h3 className="text-[14px] font-semibold text-gray-900">Member Directory</h3>
                      <div className="relative">
                        <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-gray-400" />
                        <input placeholder="Search by name or ID..." className="h-8 w-64 pl-8 pr-3 text-[13px] border border-gray-200 rounded-lg bg-gray-50 outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all" />
                      </div>
                    </div>
                    <div className="grid px-5 py-2.5 bg-gray-50/70 border-b border-gray-100 text-[11px] font-semibold text-gray-400 uppercase tracking-wider"
                      style={{ gridTemplateColumns: "5rem 1fr 9rem 9rem 5rem 5rem" }}>
                      <span>ID</span><span>Name</span><span>Contact</span><span>Groups</span><span>Status</span><span></span>
                    </div>
                    {members.map(m => (
                      <div key={m.id} className="grid px-5 py-3 border-b border-gray-100 last:border-b-0 items-center hover:bg-gray-50/40 transition-colors text-[13px]"
                        style={{ gridTemplateColumns: "5rem 1fr 9rem 9rem 5rem 5rem" }}>
                        <span className="text-gray-400 font-medium text-[11px]">{m.id}</span>
                        <div className="flex items-center gap-2.5">
                          <Avatar className="h-6 w-6 shrink-0">
                            <AvatarFallback className="bg-indigo-50 text-indigo-600 text-[9px] font-semibold">{m.initials}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-gray-900">{m.name}</span>
                        </div>
                        <span className="text-gray-500 text-[12px]">{m.phone}</span>
                        <div className="flex flex-wrap gap-1">
                          {m.groups.map(g => (
                            <span key={g} className="text-[11px] font-medium text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">{g}</span>
                          ))}
                        </div>
                        <StatusPill status={m.status} />
                        <button className="text-[12px] font-medium text-indigo-600 hover:text-indigo-700 hover:underline">
                          View
                        </button>
                      </div>
                    ))}
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

function SideItem({ icon, label, active }: { icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <a href="#" className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] font-medium transition-colors ${
      active ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
    }`}>
      {icon}{label}
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
