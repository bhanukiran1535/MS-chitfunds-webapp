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
  Building,
  CheckCircle2,
  XCircle,
  MoreHorizontal,
  FolderOpen
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function Dashboard() {
  const [activeTab, setActiveTab] = useState("requests");

  const statCards = [
    { title: "Total Groups", value: "8", icon: FolderOpen, color: "text-blue-500" },
    { title: "Total Members", value: "47", icon: Users, color: "text-indigo-500" },
    { title: "Pending Requests", value: "3", icon: Bell, color: "text-amber-500" },
    { title: "Monthly Collection", value: "₹1,85,000", icon: Wallet, color: "text-emerald-500" },
  ];

  const pendingRequests = [
    { id: 1, name: "Priya Sharma", type: "Prebook Request", details: "Group 5, June 2025", amount: null },
    { id: 2, name: "Amit Patel", type: "Cash Payment Confirmation", details: "Group 3, May 2025", amount: "₹5,000" },
    { id: 3, name: "Sneha Iyer", type: "Leave Group Request", details: "Group 8", amount: null },
  ];

  const groups = [
    { id: "G-001", name: "Alpha Savers", chitValue: "₹1,00,000", members: "10/10", status: "active" },
    { id: "G-002", name: "Wealth Builders", chitValue: "₹50,000", members: "20/20", status: "active" },
    { id: "G-003", name: "Future Secure", chitValue: "₹2,00,000", members: "12/20", status: "upcoming" },
    { id: "G-004", name: "Prosperity Fund", chitValue: "₹5,00,000", members: "10/10", status: "completed" },
  ];

  const members = [
    { id: "M-101", name: "Rahul Verma", phone: "+91 9876543210", groups: ["G-001", "G-002"], status: "Active" },
    { id: "M-102", name: "Anita Desai", phone: "+91 8765432109", groups: ["G-001"], status: "Active" },
    { id: "M-103", name: "Vikram Singh", phone: "+91 7654321098", groups: ["G-003"], status: "Active" },
    { id: "M-104", name: "Meera Reddy", phone: "+91 6543210987", groups: ["G-002", "G-004"], status: "Active" },
    { id: "M-105", name: "Suresh Kumar", phone: "+91 5432109876", groups: ["G-001"], status: "Defaulter" },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
      case "Active":
        return <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-none">Active</Badge>;
      case "upcoming":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-none">Upcoming</Badge>;
      case "completed":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100 border-none">Completed</Badge>;
      case "Defaulter":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-none">Defaulter</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col hidden md:flex shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <Building className="h-6 w-6 text-indigo-400 mr-3" />
          <span className="font-bold text-lg text-white">MS ChitFund</span>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-2">
          <div className="px-3 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Overview
          </div>
          <button className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md bg-indigo-600 text-white">
            <LayoutDashboard className="mr-3 h-5 w-5" />
            Dashboard
          </button>
          
          <div className="px-3 mt-8 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Management
          </div>
          <button className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-slate-800 hover:text-white transition-colors">
            <FolderOpen className="mr-3 h-5 w-5" />
            Groups
          </button>
          <button className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-slate-800 hover:text-white transition-colors">
            <Users className="mr-3 h-5 w-5" />
            Members
          </button>
          <button className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-slate-800 hover:text-white transition-colors">
            <Wallet className="mr-3 h-5 w-5" />
            Collections
          </button>

          <div className="px-3 mt-8 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            System
          </div>
          <button className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-slate-800 hover:text-white transition-colors">
            <Settings className="mr-3 h-5 w-5" />
            Settings
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-slate-800 hover:text-white transition-colors text-slate-400">
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-10">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-slate-800">Admin Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="relative text-slate-500 hover:text-slate-700">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full border border-white"></span>
            </Button>
            <div className="h-8 w-px bg-slate-200"></div>
            <div className="flex items-center space-x-3 cursor-pointer">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-slate-700 leading-none">Raj Kumar</p>
                <p className="text-xs text-slate-500 mt-1">Administrator</p>
              </div>
              <Avatar className="h-9 w-9 border border-slate-200">
                <AvatarImage src="https://api.dicebear.com/7.x/initials/svg?seed=RK&backgroundColor=4f46e5" alt="Raj Kumar" />
                <AvatarFallback className="bg-indigo-100 text-indigo-700">RK</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto p-6 md:p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div>
                <h2 className="text-lg font-semibold text-slate-800">Overview</h2>
                <p className="text-sm text-slate-500">Manage your chitfund operations</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="outline" size="sm" className="hidden sm:flex">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
                <Button variant="secondary" size="sm">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Member
                </Button>
                <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Group
                </Button>
              </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {statCards.map((stat, i) => (
                <Card key={i} className="border-slate-200 shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium text-slate-500">{stat.title}</CardTitle>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-slate-800">{stat.value}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Tabs Area */}
            <Tabs defaultValue="requests" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 md:w-[600px] mb-6 p-1 bg-slate-100/80 rounded-lg border border-slate-200">
                <TabsTrigger value="requests" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  Pending Requests
                  <Badge className="ml-2 bg-red-100 text-red-700 hover:bg-red-100 border-none rounded-full px-1.5 h-5 min-w-5 flex items-center justify-center">3</Badge>
                </TabsTrigger>
                <TabsTrigger value="groups" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">Group Management</TabsTrigger>
                <TabsTrigger value="members" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">Member Management</TabsTrigger>
              </TabsList>
              
              <TabsContent value="requests" className="focus-visible:outline-none">
                <Card className="border-slate-200 shadow-sm overflow-hidden">
                  <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                    <CardTitle className="text-base font-semibold">Action Required</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-slate-50/80 hover:bg-slate-50/80">
                          <TableHead className="w-[200px]">Member</TableHead>
                          <TableHead>Request Type</TableHead>
                          <TableHead>Details</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pendingRequests.map((req) => (
                          <TableRow key={req.id}>
                            <TableCell className="font-medium text-slate-800">{req.name}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="font-normal text-slate-600 border-slate-200">
                                {req.type}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-slate-500">{req.details}</TableCell>
                            <TableCell className="text-slate-800 font-medium">{req.amount || "-"}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button size="sm" variant="outline" className="h-8 border-green-200 bg-green-50 hover:bg-green-100 hover:text-green-800 text-green-700">
                                  <Check className="h-4 w-4 mr-1" />
                                  Approve
                                </Button>
                                <Button size="sm" variant="outline" className="h-8 border-red-200 bg-red-50 hover:bg-red-100 hover:text-red-800 text-red-700">
                                  <X className="h-4 w-4 mr-1" />
                                  Reject
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="groups" className="focus-visible:outline-none">
                <Card className="border-slate-200 shadow-sm overflow-hidden">
                  <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4 flex flex-row items-center justify-between">
                    <CardTitle className="text-base font-semibold">All Groups</CardTitle>
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                      <Input placeholder="Search groups..." className="h-9 w-[250px] pl-9 text-sm bg-white" />
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-slate-50/80 hover:bg-slate-50/80">
                          <TableHead>Group No.</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Chit Value</TableHead>
                          <TableHead>Members</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {groups.map((group) => (
                          <TableRow key={group.id}>
                            <TableCell className="font-medium text-slate-600">{group.id}</TableCell>
                            <TableCell className="font-medium text-slate-900">{group.name}</TableCell>
                            <TableCell className="text-slate-700">{group.chitValue}</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Users className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
                                <span className="text-slate-600 text-sm">{group.members}</span>
                              </div>
                            </TableCell>
                            <TableCell>{getStatusBadge(group.status)}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-700">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="members" className="focus-visible:outline-none">
                <Card className="border-slate-200 shadow-sm overflow-hidden">
                  <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4 flex flex-row items-center justify-between">
                    <CardTitle className="text-base font-semibold">Member Directory</CardTitle>
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                      <Input placeholder="Search members by name or ID..." className="h-9 w-[300px] pl-9 text-sm bg-white" />
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-slate-50/80 hover:bg-slate-50/80">
                          <TableHead>Member ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Contact</TableHead>
                          <TableHead>Enrolled Groups</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {members.map((member) => (
                          <TableRow key={member.id}>
                            <TableCell className="font-medium text-slate-500 text-xs">{member.id}</TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <Avatar className="h-8 w-8 bg-indigo-50 text-indigo-700">
                                  <AvatarFallback className="text-xs">{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                </Avatar>
                                <span className="font-medium text-slate-900">{member.name}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-slate-500 text-sm">{member.phone}</TableCell>
                            <TableCell>
                              <div className="flex gap-1 flex-wrap">
                                {member.groups.map(g => (
                                  <Badge key={g} variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-slate-200 font-normal">
                                    {g}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell>{getStatusBadge(member.status)}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 font-medium">
                                View Profile
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

          </div>
        </div>
      </main>
    </div>
  );
}
