import React, { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Wallet,
  Bell,
  Settings,
  LogOut,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ChevronRight,
  TrendingUp,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export function Dashboard() {
  const [activeTab, setActiveTab] = useState("groups");

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans text-slate-900 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0F172A] text-slate-300 flex flex-col transition-all duration-300 border-r border-slate-800 hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <div className="flex items-center gap-2 text-white font-semibold text-lg tracking-tight">
            <div className="w-8 h-8 rounded bg-indigo-600 flex items-center justify-center text-white">
              <span className="font-bold">M</span>
            </div>
            MS ChitFund
          </div>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          <NavItem icon={<LayoutDashboard size={18} />} label="Dashboard" active />
          <NavItem icon={<Users size={18} />} label="My Groups" />
          <NavItem icon={<Wallet size={18} />} label="Payments" />
          <NavItem icon={<Activity size={18} />} label="Prebook Requests" />
          <NavItem icon={<Bell size={18} />} label="Notifications" badge="2" />
        </nav>

        <div className="p-4 border-t border-slate-800">
          <NavItem icon={<Settings size={18} />} label="Settings" />
          <NavItem icon={<LogOut size={18} />} label="Logout" />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-10 shrink-0 sticky top-0 z-10">
          <div className="flex items-center text-slate-500">
            <span className="text-sm font-medium">Overview</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search groups..."
                className="h-9 w-64 rounded-md border border-slate-200 bg-slate-50 pl-9 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>
            <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 border-l border-slate-200 pl-4 ml-2">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-semibold text-slate-900">Priya Sharma</div>
                <div className="text-xs text-slate-500">Regular Member</div>
              </div>
              <Avatar className="h-9 w-9 border border-slate-200 cursor-pointer hover:ring-2 hover:ring-indigo-500 hover:ring-offset-2 transition-all">
                <AvatarImage src="https://i.pravatar.cc/150?u=priya" />
                <AvatarFallback className="bg-indigo-100 text-indigo-700 font-medium">PS</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6 lg:p-10 max-w-6xl mx-auto space-y-8 pb-20">
            {/* Welcome Section */}
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">Welcome back, Priya</h1>
              <p className="text-slate-500 mt-1 text-sm lg:text-base">Here's your financial snapshot for today.</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              <StatCard
                title="Active Groups"
                value="3"
                icon={<Users size={20} className="text-blue-600" />}
                trend="+1 this month"
                trendUp={true}
              />
              <StatCard
                title="Current Savings"
                value="₹24,500"
                icon={<Wallet size={20} className="text-emerald-600" />}
                trend="₹4,500 saved this month"
                trendUp={true}
              />
              <StatCard
                title="Upcoming Payments"
                value="2"
                icon={<Clock size={20} className="text-amber-600" />}
                trend="Due in 5 days"
                trendUp={false}
                alert={true}
              />
              <StatCard
                title="Pending Requests"
                value="1"
                icon={<Activity size={20} className="text-indigo-600" />}
                trend="Prebook request under review"
                trendUp={true}
              />
            </div>

            {/* Main Tabs Area */}
            <Tabs defaultValue="groups" className="w-full mt-8" onValueChange={setActiveTab}>
              <div className="flex items-center justify-between border-b border-slate-200 pb-px">
                <TabsList className="bg-transparent p-0 h-auto gap-6 justify-start w-auto">
                  <TabsTrigger
                    value="groups"
                    className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 rounded-none px-0 pb-3 pt-2 font-medium text-slate-500 hover:text-slate-700"
                  >
                    My Groups
                  </TabsTrigger>
                  <TabsTrigger
                    value="notifications"
                    className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 rounded-none px-0 pb-3 pt-2 font-medium text-slate-500 hover:text-slate-700 flex items-center gap-2"
                  >
                    Notifications
                    <Badge className="h-5 px-1.5 bg-indigo-100 text-indigo-700 hover:bg-indigo-100 rounded-full text-xs font-semibold">
                      2
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger
                    value="activity"
                    className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 rounded-none px-0 pb-3 pt-2 font-medium text-slate-500 hover:text-slate-700"
                  >
                    Activity Summary
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Groups Tab Content */}
              <TabsContent value="groups" className="mt-6 outline-none focus:ring-0">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <GroupCard
                    groupNo="5"
                    chitValue="1,20,000"
                    tenure="12"
                    monthlyShare="10,000"
                    progress={40}
                    status="paid"
                    currentMonth={5}
                  />
                  <GroupCard
                    groupNo="8"
                    chitValue="60,000"
                    tenure="10"
                    monthlyShare="6,000"
                    progress={70}
                    status="due"
                    currentMonth={7}
                  />
                  <GroupCard
                    groupNo="12"
                    chitValue="2,40,000"
                    tenure="24"
                    monthlyShare="10,000"
                    progress={12.5}
                    status="upcoming"
                    currentMonth={3}
                  />
                </div>
              </TabsContent>

              {/* Notifications Tab Content */}
              <TabsContent value="notifications" className="mt-6 outline-none focus:ring-0">
                <Card className="border border-slate-200 shadow-sm rounded-xl overflow-hidden">
                  <div className="divide-y divide-slate-100">
                    <NotificationItem
                      title="Prebook Request Approved"
                      message="Your prebook request for Group 5 - June 2025 has been approved by the foreman."
                      time="2 hours ago"
                      type="success"
                      isNew
                    />
                    <NotificationItem
                      title="Upcoming Payment Reminder"
                      message="Monthly installment of ₹6,000 for Group 8 is due on 15th Oct."
                      time="Yesterday"
                      type="warning"
                      isNew
                    />
                    <NotificationItem
                      title="New Group Invitation"
                      message="You have been invited to join Group 15 (Chit Value: ₹5,00,000). Review details."
                      time="Oct 10, 2024"
                      type="info"
                    />
                    <NotificationItem
                      title="Payment Successful"
                      message="We received your payment of ₹10,000 for Group 5."
                      time="Oct 5, 2024"
                      type="success"
                    />
                  </div>
                </Card>
              </TabsContent>

              {/* Activity Summary Tab Content */}
              <TabsContent value="activity" className="mt-6 outline-none focus:ring-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <Card className="border border-slate-200 shadow-sm rounded-xl">
                    <CardContent className="p-6">
                      <div className="text-sm font-medium text-slate-500 mb-1">Total Amount Paid</div>
                      <div className="text-3xl font-bold text-slate-900">₹84,000</div>
                      <div className="text-sm text-emerald-600 flex items-center gap-1 mt-2 font-medium">
                        <TrendingUp size={14} /> Across all active groups
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border border-slate-200 shadow-sm rounded-xl">
                    <CardContent className="p-6">
                      <div className="text-sm font-medium text-slate-500 mb-1">Prebook Requests</div>
                      <div className="text-3xl font-bold text-slate-900">2</div>
                      <div className="text-sm text-slate-500 mt-2">1 Approved, 1 Pending</div>
                    </CardContent>
                  </Card>
                  <Card className="border border-slate-200 shadow-sm rounded-xl">
                    <CardContent className="p-6">
                      <div className="text-sm font-medium text-slate-500 mb-1">Last Payment Date</div>
                      <div className="text-3xl font-bold text-slate-900">Oct 5</div>
                      <div className="text-sm text-slate-500 mt-2">₹10,000 for Group 5</div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="border border-slate-200 shadow-sm rounded-xl">
                  <CardHeader>
                    <CardTitle className="text-lg">Recent Transactions</CardTitle>
                    <CardDescription>Your latest payments and payouts</CardDescription>
                  </CardHeader>
                  <div className="px-6 pb-6">
                    <div className="space-y-4">
                      <TransactionItem
                        title="Monthly Installment - Group 5"
                        date="Oct 5, 2024"
                        amount="-₹10,000"
                        status="Completed"
                      />
                      <TransactionItem
                        title="Monthly Installment - Group 8"
                        date="Sep 15, 2024"
                        amount="-₹6,000"
                        status="Completed"
                      />
                      <TransactionItem
                        title="Monthly Installment - Group 12"
                        date="Sep 10, 2024"
                        amount="-₹10,000"
                        status="Completed"
                      />
                      <TransactionItem
                        title="Prize Payout - Group 3 (Closed)"
                        date="Aug 20, 2024"
                        amount="+₹97,000"
                        status="Completed"
                        isCredit
                      />
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}

// Subcomponents

function NavItem({ icon, label, active, badge }: { icon: React.ReactNode; label: string; active?: boolean; badge?: string }) {
  return (
    <a
      href="#"
      className={`flex items-center justify-between px-3 py-2.5 rounded-lg mb-1 transition-colors ${
        active
          ? "bg-indigo-600/10 text-indigo-400 font-medium"
          : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
      }`}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      {badge && (
        <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </a>
  );
}

function StatCard({ title, value, icon, trend, trendUp, alert }: any) {
  return (
    <Card className="border border-slate-200 shadow-sm rounded-xl overflow-hidden group hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
          </div>
          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 group-hover:bg-white transition-colors">
            {icon}
          </div>
        </div>
        <div className={`mt-4 text-xs font-medium flex items-center gap-1.5 ${alert ? 'text-amber-600' : 'text-slate-500'}`}>
          {trendUp === true && <TrendingUp size={14} className="text-emerald-500" />}
          {trendUp === false && <TrendingUp size={14} className="text-amber-500 rotate-180" />}
          {trend}
        </div>
      </CardContent>
    </Card>
  );
}

function GroupCard({ groupNo, chitValue, tenure, monthlyShare, progress, status, currentMonth }: any) {
  return (
    <Card className="border border-slate-200 shadow-sm rounded-xl hover:shadow-md transition-all duration-200 group flex flex-col h-full relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <CardHeader className="p-5 pb-4 border-b border-slate-100 flex-row items-start justify-between space-y-0">
        <div>
          <div className="text-xs font-semibold tracking-wider text-slate-400 uppercase mb-1">Group No.</div>
          <CardTitle className="text-xl text-slate-900">{groupNo}</CardTitle>
        </div>
        <StatusBadge status={status} />
      </CardHeader>
      
      <CardContent className="p-5 flex-1">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-y-4 gap-x-2">
            <div>
              <div className="text-xs text-slate-500 mb-1">Chit Value</div>
              <div className="font-semibold text-slate-900">₹{chitValue}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-1">Monthly Share</div>
              <div className="font-semibold text-slate-900">₹{monthlyShare}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-1">Tenure</div>
              <div className="font-semibold text-slate-900">{tenure} Months</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-1">Current Month</div>
              <div className="font-semibold text-slate-900">Month {currentMonth}</div>
            </div>
          </div>

          <div className="pt-2">
            <div className="flex justify-between text-xs mb-1.5 font-medium">
              <span className="text-slate-500">Progress</span>
              <span className="text-indigo-600">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2 bg-slate-100" />
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-5 pt-0 mt-auto">
        <Button variant="outline" className="w-full justify-center shadow-sm border-slate-200 hover:bg-slate-50 hover:text-indigo-600 transition-colors">
          View Details <ChevronRight size={16} className="ml-1 opacity-70" />
        </Button>
      </CardFooter>
    </Card>
  );
}

function StatusBadge({ status }: { status: "paid" | "due" | "upcoming" | "pending" }) {
  if (status === "paid") {
    return (
      <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 px-2.5 py-0.5 rounded-full font-medium flex items-center gap-1 shadow-none">
        <CheckCircle2 size={12} /> Paid
      </Badge>
    );
  }
  if (status === "due") {
    return (
      <Badge className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 px-2.5 py-0.5 rounded-full font-medium flex items-center gap-1 shadow-none">
        <AlertTriangle size={12} /> Due Now
      </Badge>
    );
  }
  if (status === "upcoming") {
    return (
      <Badge className="bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200 px-2.5 py-0.5 rounded-full font-medium flex items-center gap-1 shadow-none">
        <Clock size={12} /> Upcoming
      </Badge>
    );
  }
  return null;
}

function NotificationItem({ title, message, time, type, isNew }: any) {
  const getIcon = () => {
    switch(type) {
      case 'success': return <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0"><CheckCircle2 size={20} /></div>;
      case 'warning': return <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 shrink-0"><AlertTriangle size={20} /></div>;
      default: return <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0"><Bell size={20} /></div>;
    }
  };

  return (
    <div className={`p-5 flex gap-4 hover:bg-slate-50 transition-colors ${isNew ? 'bg-indigo-50/30' : ''}`}>
      {getIcon()}
      <div className="flex-1">
        <div className="flex justify-between items-start mb-1">
          <h4 className={`font-semibold text-sm ${isNew ? 'text-slate-900' : 'text-slate-700'}`}>{title}</h4>
          <span className="text-xs text-slate-400 whitespace-nowrap">{time}</span>
        </div>
        <p className="text-sm text-slate-500 leading-relaxed">{message}</p>
      </div>
      {isNew && <div className="w-2 h-2 rounded-full bg-indigo-600 mt-1.5 shrink-0"></div>}
    </div>
  );
}

function TransactionItem({ title, date, amount, status, isCredit }: any) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isCredit ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'}`}>
          {isCredit ? <ArrowDownRight size={18} /> : <ArrowUpRight size={18} />}
        </div>
        <div>
          <div className="font-medium text-slate-900 text-sm">{title}</div>
          <div className="text-xs text-slate-500">{date}</div>
        </div>
      </div>
      <div className="text-right">
        <div className={`font-semibold ${isCredit ? 'text-emerald-600' : 'text-slate-900'}`}>{amount}</div>
        <div className="text-xs text-slate-500 mt-0.5">{status}</div>
      </div>
    </div>
  );
}
