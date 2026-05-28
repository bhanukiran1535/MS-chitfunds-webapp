import React from "react";
import { 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Star, 
  Info, 
  LogOut,
  IndianRupee,
  Calendar,
  Wallet
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import "./_details.css";

interface MonthData {
  id: string;
  month: string;
  status: "paid" | "winner" | "due" | "upcoming";
  amount: number;
  paidOn?: string;
  mode?: string;
  payout?: number;
  premium?: boolean;
}

const months: MonthData[] = [
  { id: "1", month: "Jan 2025", status: "paid", amount: 10000, paidOn: "Jan 5, 2025", mode: "UPI" },
  { id: "2", month: "Feb 2025", status: "paid", amount: 10000, paidOn: "Feb 3, 2025", mode: "Auto-debit" },
  { id: "3", month: "Mar 2025", status: "paid", amount: 10000, paidOn: "Mar 4, 2025", mode: "UPI" },
  { id: "4", month: "Apr 2025", status: "paid", amount: 10000, paidOn: "Apr 2, 2025", mode: "Bank Transfer" },
  { id: "5", month: "May 2025", status: "paid", amount: 10000, paidOn: "May 5, 2025", mode: "UPI" },
  { id: "6", month: "Jun 2025", status: "winner", amount: 12000, payout: 116400, premium: true, paidOn: "Jun 1, 2025", mode: "UPI" },
  { id: "7", month: "Jul 2025", status: "paid", amount: 12000, premium: true, paidOn: "Jul 4, 2025", mode: "Auto-debit" },
  { id: "8", month: "Aug 2025", status: "paid", amount: 12000, paidOn: "Aug 2, 2025", mode: "UPI" },
  { id: "9", month: "Sep 2025", status: "due", amount: 12000 },
  { id: "10", month: "Oct 2025", status: "upcoming", amount: 12000 },
  { id: "11", month: "Nov 2025", status: "upcoming", amount: 12000 },
  { id: "12", month: "Dec 2025", status: "upcoming", amount: 12000 },
];

export function Details() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusConfig = (status: MonthData["status"]) => {
    switch (status) {
      case "paid":
        return {
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
          badge: <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">Paid</Badge>,
          border: "border-gray-200",
          bg: "bg-white",
        };
      case "winner":
        return {
          icon: <Star className="w-5 h-5 text-amber-500 fill-amber-500" />,
          badge: <Badge className="bg-gradient-to-r from-amber-400 to-amber-600 text-white border-none shadow-sm shadow-amber-200">WINNER</Badge>,
          border: "border-amber-300",
          bg: "bg-gradient-to-b from-amber-50/50 to-white",
        };
      case "due":
        return {
          icon: <AlertCircle className="w-5 h-5 text-red-500" />,
          badge: <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 font-semibold">DUE</Badge>,
          border: "border-red-300 due-pulse",
          bg: "bg-red-50/30",
        };
      case "upcoming":
        return {
          icon: <Clock className="w-5 h-5 text-blue-400" />,
          badge: <Badge variant="outline" className="bg-gray-50 text-gray-500 border-gray-200">Upcoming</Badge>,
          border: "border-dashed border-gray-200",
          bg: "bg-gray-50/50",
        };
    }
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-[#fafafa] font-sans pb-24">
        
        {/* Header Navigation */}
        <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4 shadow-sm">
          <div className="max-w-6xl mx-auto flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-100">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <nav className="flex text-sm font-medium text-gray-500">
              <span className="hover:text-gray-900 cursor-pointer transition-colors">My Groups</span>
              <span className="mx-2 text-gray-300">/</span>
              <span className="text-gray-900">Group 5</span>
            </nav>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          
          {/* Group Overview Section */}
          <section className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              
              <div className="space-y-4 flex-1">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                    Group No. 5
                    <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100">Active</Badge>
                  </h1>
                  <p className="text-gray-500 mt-1 flex items-center gap-4 text-sm sm:text-base">
                    <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Start: Jan 2025</span>
                    <span className="text-gray-300">•</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> 12-month tenure</span>
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-4 border-t border-gray-100">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Chit Value</p>
                    <p className="text-xl sm:text-2xl font-semibold text-gray-900">{formatCurrency(120000)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Share Amount</p>
                    <div className="flex items-baseline gap-1">
                      <p className="text-xl sm:text-2xl font-semibold text-gray-900">{formatCurrency(10000)}</p>
                      <span className="text-sm text-gray-500">/mo</span>
                    </div>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <p className="text-sm font-medium text-gray-500">Member Name</p>
                    <p className="text-lg font-medium text-gray-900 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">PS</span>
                      Priya Sharma
                    </p>
                  </div>
                </div>
              </div>

              {/* Progress Box */}
              <div className="w-full md:w-80 bg-gray-50 rounded-xl p-5 border border-gray-100">
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Payment Progress</p>
                    <p className="font-semibold text-gray-900">8 of 12 completed</p>
                  </div>
                  <span className="text-2xl font-bold text-indigo-600">67%</span>
                </div>
                <Progress value={67} className="h-2.5 bg-gray-200 [&>div]:bg-indigo-600" />
                <p className="text-xs text-gray-500 mt-3 text-center flex items-center justify-center gap-1.5">
                  <Info className="w-3.5 h-3.5" /> Next payment due in 5 days
                </p>
              </div>

            </div>
          </section>

          {/* Timeline / Grid */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Payment Timeline</h2>
              <div className="flex items-center gap-3 text-sm">
                <span className="flex items-center gap-1.5 text-gray-500"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div> Paid</span>
                <span className="flex items-center gap-1.5 text-gray-500"><div className="w-2.5 h-2.5 rounded-full bg-red-500"></div> Due</span>
                <span className="flex items-center gap-1.5 text-gray-500"><div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div> Upcoming</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {months.map((m, index) => {
                const config = getStatusConfig(m.status);
                const isWinner = m.status === "winner";
                
                return (
                  <Card 
                    key={m.id} 
                    className={`relative overflow-hidden transition-all duration-200 ${config.bg} ${config.border} ${isWinner ? 'winner-card transform hover:-translate-y-1' : 'hover:shadow-md'}`}
                  >
                    <CardHeader className="pb-3 px-5 pt-5 flex flex-row items-center justify-between space-y-0">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 z-10">
                          {config.icon}
                        </div>
                        <div>
                          <CardTitle className="text-lg font-bold text-gray-900 z-10 relative">{m.month}</CardTitle>
                          <CardDescription className="text-xs font-medium z-10 relative mt-0.5 text-gray-500">
                            Month {index + 1}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="z-10 relative">
                        {config.badge}
                      </div>
                    </CardHeader>
                    
                    <CardContent className="px-5 pb-5 pt-2 relative z-10">
                      <div className="space-y-4">
                        
                        {/* Amount */}
                        <div className="flex justify-between items-baseline">
                          <span className="text-sm text-gray-500">Share Amount</span>
                          <span className={`text-lg font-bold ${m.premium ? 'text-indigo-600' : 'text-gray-900'}`}>
                            {formatCurrency(m.amount)}
                            {m.premium && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Info className="w-3.5 h-3.5 inline ml-1.5 text-indigo-400 cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent>Includes 20% premium after winning</TooltipContent>
                              </Tooltip>
                            )}
                          </span>
                        </div>

                        {/* Winner Specific Data */}
                        {isWinner && m.payout && (
                          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-amber-200/50 mt-2 flex justify-between items-center shadow-sm">
                            <span className="text-sm font-semibold text-amber-900 flex items-center gap-1.5">
                              <Wallet className="w-4 h-4 text-amber-600" />
                              Total Payout
                            </span>
                            <span className="text-lg font-bold text-amber-700">{formatCurrency(m.payout)}</span>
                          </div>
                        )}

                        {/* Status Footer / Actions */}
                        <div className="pt-4 border-t border-gray-100/60 mt-4 min-h-[44px] flex items-center justify-between">
                          {m.status === "paid" || m.status === "winner" ? (
                            <div className="w-full flex justify-between items-center text-xs text-gray-500">
                              <span>Paid on {m.paidOn}</span>
                              <span className="bg-gray-100 px-2 py-1 rounded font-medium">{m.mode}</span>
                            </div>
                          ) : m.status === "due" ? (
                            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-sm shadow-indigo-200 transition-all hover:shadow-md">
                              Pay Now • {formatCurrency(m.amount)}
                            </Button>
                          ) : (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="outline" className="w-full bg-white border-dashed hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 transition-colors text-gray-600">
                                  Request to Pre-book
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs text-center leading-relaxed">
                                <p>Guarantee your win this month by pre-booking. A 20% premium will apply to subsequent months.</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </div>

                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* Footer Actions */}
          <div className="pt-12 flex justify-center pb-8">
            <Button variant="ghost" className="text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors gap-2">
              <LogOut className="w-4 h-4" />
              Request to Leave Group
            </Button>
          </div>

        </main>
      </div>
    </TooltipProvider>
  );
}
