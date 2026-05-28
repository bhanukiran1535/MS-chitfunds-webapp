import React from "react";
import {
  ArrowLeft,
  Info,
  LogOut,
  Calendar,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
  { id: "1",  month: "Jan 2025", status: "paid",     amount: 10000, paidOn: "Jan 5, 2025",  mode: "UPI" },
  { id: "2",  month: "Feb 2025", status: "paid",     amount: 10000, paidOn: "Feb 3, 2025",  mode: "Auto-debit" },
  { id: "3",  month: "Mar 2025", status: "paid",     amount: 10000, paidOn: "Mar 4, 2025",  mode: "UPI" },
  { id: "4",  month: "Apr 2025", status: "paid",     amount: 10000, paidOn: "Apr 2, 2025",  mode: "Bank Transfer" },
  { id: "5",  month: "May 2025", status: "paid",     amount: 10000, paidOn: "May 5, 2025",  mode: "UPI" },
  { id: "6",  month: "Jun 2025", status: "winner",   amount: 12000, paidOn: "Jun 1, 2025",  mode: "UPI",   payout: 116400, premium: true },
  { id: "7",  month: "Jul 2025", status: "paid",     amount: 12000, paidOn: "Jul 4, 2025",  mode: "Auto-debit", premium: true },
  { id: "8",  month: "Aug 2025", status: "paid",     amount: 12000, paidOn: "Aug 2, 2025",  mode: "UPI" },
  { id: "9",  month: "Sep 2025", status: "due",      amount: 12000 },
  { id: "10", month: "Oct 2025", status: "upcoming", amount: 12000 },
  { id: "11", month: "Nov 2025", status: "upcoming", amount: 12000 },
  { id: "12", month: "Dec 2025", status: "upcoming", amount: 12000 },
];

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

function StatusPill({ status }: { status: MonthData["status"] }) {
  if (status === "paid")
    return (
      <span className="inline-flex items-center gap-1.5 text-[13px] text-emerald-700 font-medium">
        <span className="w-[7px] h-[7px] rounded-full bg-emerald-500 shrink-0" />
        Paid
      </span>
    );
  if (status === "winner")
    return (
      <span className="inline-flex items-center gap-1.5 text-[13px] text-amber-700 font-semibold">
        <span className="w-[7px] h-[7px] rounded-full bg-amber-500 shrink-0" />
        Paid · Winner
      </span>
    );
  if (status === "due")
    return (
      <span className="inline-flex items-center gap-1.5 text-[13px] text-red-600 font-semibold">
        <span className="w-[7px] h-[7px] rounded-full bg-red-500 shrink-0" />
        Due
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1.5 text-[13px] text-gray-400 font-medium">
      <span className="w-[7px] h-[7px] rounded-full bg-gray-300 shrink-0" />
      Upcoming
    </span>
  );
}

export function Details() {
  const completedPayments = months.filter(m => m.status === "paid" || m.status === "winner").length;
  const totalMonths = months.length;
  const progressPct = Math.round((completedPayments / totalMonths) * 100);

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-[#f7f8fa] font-sans" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

        {/* Top nav */}
        <header className="sticky top-0 z-10 bg-white border-b border-gray-200/80">
          <div className="max-w-5xl mx-auto px-6 h-14 flex items-center gap-3">
            <button className="h-8 w-8 flex items-center justify-center rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <nav className="flex items-center gap-1.5 text-sm text-gray-500">
              <span className="hover:text-gray-900 cursor-pointer transition-colors">My Groups</span>
              <span className="text-gray-300">/</span>
              <span className="text-gray-900 font-medium">Group 5</span>
            </nav>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-6 py-8 space-y-6">

          {/* Group summary card */}
          <div className="bg-white rounded-xl border border-gray-200/80 shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
            <div className="px-7 py-6 flex flex-col md:flex-row md:items-start gap-6 justify-between">

              {/* Left: group meta */}
              <div className="space-y-5">
                <div>
                  <div className="flex items-center gap-2.5 mb-1">
                    <h1 className="text-xl font-semibold text-gray-900">Group No. 5</h1>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">Active</span>
                  </div>
                  <div className="flex items-center gap-3 text-[13px] text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      Started Jan 2025
                    </span>
                    <span className="text-gray-200">·</span>
                    <span>12-month tenure</span>
                  </div>
                </div>

                <div className="flex items-start gap-10">
                  <div>
                    <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-1">Chit Value</p>
                    <p className="text-lg font-semibold text-gray-900">₹1,20,000</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-1">Monthly Share</p>
                    <p className="text-lg font-semibold text-gray-900">₹10,000 <span className="text-sm font-normal text-gray-400">/mo</span></p>
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-1">Member</p>
                    <div className="flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-bold">PS</span>
                      <span className="text-sm font-medium text-gray-900">Priya Sharma</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: progress */}
              <div className="w-full md:w-64 shrink-0 bg-gray-50 rounded-lg border border-gray-100 px-5 py-4">
                <div className="flex justify-between items-baseline mb-3">
                  <p className="text-[12px] text-gray-500 font-medium">Payment Progress</p>
                  <span className="text-sm font-bold text-indigo-600">{progressPct}%</span>
                </div>
                <Progress value={progressPct} className="h-1.5 bg-gray-200 [&>div]:bg-indigo-500" />
                <p className="text-[12px] text-gray-500 mt-3">
                  {completedPayments} of {totalMonths} payments completed
                </p>
                <div className="mt-3 pt-3 border-t border-gray-200 flex items-center gap-1.5 text-[12px] text-amber-700 font-medium">
                  <Info className="w-3.5 h-3.5 shrink-0" />
                  Sep 2025 payment is due
                </div>
              </div>
            </div>
          </div>

          {/* Payment schedule table */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[15px] font-semibold text-gray-900">Payment Schedule</h2>
              <div className="flex items-center gap-4 text-[12px] text-gray-500">
                <span className="flex items-center gap-1.5"><span className="w-[7px] h-[7px] rounded-full bg-emerald-500 inline-block" />Paid</span>
                <span className="flex items-center gap-1.5"><span className="w-[7px] h-[7px] rounded-full bg-red-500 inline-block" />Due</span>
                <span className="flex items-center gap-1.5"><span className="w-[7px] h-[7px] rounded-full bg-amber-400 inline-block" />Winner</span>
                <span className="flex items-center gap-1.5"><span className="w-[7px] h-[7px] rounded-full bg-gray-300 inline-block" />Upcoming</span>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200/80 shadow-[0_1px_4px_rgba(0,0,0,0.04)] overflow-hidden">

              {/* Column headers */}
              <div className="grid items-center px-5 py-2.5 border-b border-gray-100 bg-gray-50/70 text-[11px] font-semibold text-gray-400 uppercase tracking-wider select-none"
                style={{ gridTemplateColumns: "2.5rem 1fr 7.5rem 7.5rem 1fr 10rem" }}>
                <span>#</span>
                <span>Month</span>
                <span>Status</span>
                <span className="text-right">Amount</span>
                <span className="text-right pr-4">Payment Info</span>
                <span className="text-right">Action</span>
              </div>

              {/* Data rows */}
              {months.map((m, index) => {
                const isWinner = m.status === "winner";
                const isDue = m.status === "due";
                const isPaid = m.status === "paid" || isWinner;

                return (
                  <div
                    key={m.id}
                    className={`
                      grid items-center px-5 py-3.5 border-b border-gray-100 last:border-b-0 text-sm
                      transition-colors hover:bg-gray-50/60
                      ${isWinner ? "bg-amber-50/50 hover:bg-amber-50/70" : ""}
                      ${isDue ? "bg-red-50/30 hover:bg-red-50/50" : ""}
                    `}
                    style={{
                      gridTemplateColumns: "2.5rem 1fr 7.5rem 7.5rem 1fr 10rem",
                      borderLeft: isWinner ? "3px solid #f59e0b" : isDue ? "3px solid #f87171" : "3px solid transparent",
                    }}
                  >
                    {/* # */}
                    <span className="text-[12px] font-medium text-gray-300 tabular-nums">{index + 1}</span>

                    {/* Month */}
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900 text-[14px]">{m.month}</span>
                      {isWinner && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-100/70 px-1.5 py-0.5 rounded">
                          Prebooked ★
                        </span>
                      )}
                    </div>

                    {/* Status */}
                    <StatusPill status={m.status} />

                    {/* Amount */}
                    <div className="text-right">
                      <span className={`text-[14px] font-semibold tabular-nums ${isWinner ? "text-amber-700" : isDue ? "text-red-600" : "text-gray-900"}`}>
                        {fmt(m.amount)}
                      </span>
                      {m.premium && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="block text-[10px] text-indigo-500 font-medium cursor-help">+20% premium</span>
                          </TooltipTrigger>
                          <TooltipContent>Prebook premium applies from your win month onward</TooltipContent>
                        </Tooltip>
                      )}
                    </div>

                    {/* Payment info */}
                    <div className="text-right pr-4">
                      {isPaid && m.paidOn ? (
                        <div>
                          <span className="text-[13px] text-gray-600">{m.paidOn}</span>
                          <span className="block text-[11px] text-gray-400 font-medium mt-0.5">{m.mode}</span>
                        </div>
                      ) : isWinner && m.payout ? (
                        <div>
                          <span className="text-[13px] text-gray-600">{m.paidOn}</span>
                          <span className="block text-[12px] text-amber-700 font-semibold mt-0.5">
                            Payout {fmt(m.payout)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-300 text-sm">—</span>
                      )}
                    </div>

                    {/* Action */}
                    <div className="text-right">
                      {isDue && (
                        <Button
                          size="sm"
                          className="h-7 px-3.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[12px] font-medium shadow-none rounded-md"
                        >
                          Pay Now
                        </Button>
                      )}
                      {m.status === "upcoming" && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 px-3 text-[12px] font-medium text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md"
                            >
                              Pre-book
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-56 text-center leading-relaxed">
                            Guarantee this month's payout. A 20% premium applies to subsequent installments.
                          </TooltipContent>
                        </Tooltip>
                      )}
                      {(isPaid && !isWinner) && (
                        <span className="text-[12px] text-gray-300">—</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Leave group */}
          <div className="flex justify-center pt-4 pb-8">
            <button className="flex items-center gap-2 text-[13px] text-gray-400 hover:text-red-500 transition-colors">
              <LogOut className="w-3.5 h-3.5" />
              Request to leave group
            </button>
          </div>

        </main>
      </div>
    </TooltipProvider>
  );
}
