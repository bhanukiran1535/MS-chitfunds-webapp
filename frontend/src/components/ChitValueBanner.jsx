import { useEffect, useState } from 'react';
import { Sparkles, Users, X, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { ConfirmDialog } from './ConfirmDialog';

export const ChitValueBanner = () => {
  const [bannerGroups, setBannerGroups] = useState([]);
  const [pendingAmounts, setPendingAmounts] = useState([]);
  const [confirm, setConfirm] = useState(null);
  const API = import.meta.env.VITE_API_BASE_URL;

  const fetchData = async () => {
    try {
      const [groupsRes, requestsRes] = await Promise.all([
        fetch(`${API}/group/allGroups?status=upcoming`, { credentials: 'include' }),
        fetch(`${API}/request/my`, { credentials: 'include' }),
      ]);
      const [groupsData, requestsData] = await Promise.all([groupsRes.json(), requestsRes.json()]);

      if (groupsData.success) {
        const enabled = (groupsData.groups || [])
          .filter(g => g.bannerEnabled)
          .slice(0, 3);
        setBannerGroups(enabled);
      }

      if (requestsData.success) {
        const amounts = (requestsData.requests || [])
          .filter(r => r.type === 'join_group' && r.status === 'pending')
          .map(r => r.amount);
        setPendingAmounts(amounts);
      }
    } catch (err) {
      console.error('Error fetching banner data:', err);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const requestToJoin = (group) => {
    const amount = group.chitValue;
    setConfirm({
      title: 'Request to Join',
      message: `Send a join request for the ₹${amount.toLocaleString()} chit group starting ${
        new Date(group.startMonth).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
      }? Your request will be reviewed by the admin.`,
      confirmLabel: 'Send Request',
      variant: 'info',
      onConfirm: async () => {
        setConfirm(null);
        try {
          const res = await fetch(`${API}/request/join`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ amount }),
          });
          const data = await res.json();
          if (data.success) {
            toast.success(data.message || 'Request submitted successfully.');
            setPendingAmounts(prev => [...prev, amount]);
          } else {
            toast.error(data.message || 'Failed to submit request.');
          }
        } catch {
          toast.error('Error sending join request. Please try again.');
        }
      },
    });
  };

  const withdrawRequest = (group) => {
    const amount = group.chitValue;
    setConfirm({
      title: 'Withdraw Request',
      message: `Withdraw your join request for ₹${amount.toLocaleString()}? You can resubmit later.`,
      confirmLabel: 'Withdraw',
      variant: 'warning',
      onConfirm: async () => {
        setConfirm(null);
        try {
          const res = await fetch(`${API}/request/withdraw`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ amount, type: 'join_group' }),
          });
          const data = await res.json();
          if (data.success) {
            toast.success(data.message || 'Request withdrawn.');
            setPendingAmounts(prev => prev.filter(a => a !== amount));
          } else {
            toast.error(data.message || 'Failed to withdraw request.');
          }
        } catch {
          toast.error('Error withdrawing request. Please try again.');
        }
      },
    });
  };

  if (bannerGroups.length === 0) return null;

  return (
    <>
      <div className="space-y-3">
        {bannerGroups.map((group) => {
          const isPending = pendingAmounts.includes(group.chitValue);
          const slotsRemaining = Math.max(0, group.tenure - (group.members?.length || 0));
          const startLabel = new Date(group.startMonth).toLocaleDateString('en-IN', {
            month: 'long',
            year: 'numeric',
          });

          return (
            <div
              key={group._id}
              className="relative overflow-hidden rounded-2xl border border-indigo-500/20"
              style={{
                background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 45%, #3730a3 100%)',
              }}
            >
              {/* Decorative blobs */}
              <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/5 blur-2xl pointer-events-none" />
              <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full bg-indigo-400/10 blur-2xl pointer-events-none" />

              <div className="relative px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-5">
                {/* Left: content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-indigo-300">
                      <Sparkles size={10} />
                      Promotional Offer
                    </span>
                    {slotsRemaining > 0 && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-300 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full">
                        <Users size={9} />
                        {slotsRemaining} slot{slotsRemaining !== 1 ? 's' : ''} left
                      </span>
                    )}
                    {slotsRemaining === 0 && (
                      <span className="text-[10px] font-bold text-red-300 bg-red-400/10 border border-red-400/20 px-2 py-0.5 rounded-full">
                        Full
                      </span>
                    )}
                  </div>

                  <p className="text-[28px] font-black text-white tracking-tight leading-none tabular-nums">
                    ₹{group.chitValue.toLocaleString()}
                  </p>

                  {group.bannerTagline ? (
                    <p className="text-[13px] text-indigo-200 mt-1.5 leading-snug">
                      {group.bannerTagline}
                    </p>
                  ) : null}

                  <p className="text-[12px] text-indigo-400 mt-1.5">
                    {group.tenure} months · Starts {startLabel}
                  </p>
                </div>

                {/* Right: CTA */}
                <div className="flex flex-col gap-2 shrink-0">
                  {isPending ? (
                    <>
                      <div className="px-5 py-2.5 bg-emerald-400/20 border border-emerald-400/30 text-emerald-300 text-[13px] font-semibold rounded-xl text-center whitespace-nowrap">
                        ✓ Request Pending
                      </div>
                      <button
                        onClick={() => withdrawRequest(group)}
                        className="flex items-center justify-center gap-1.5 px-5 py-2 bg-white/5 border border-white/10 text-red-300 text-[12px] font-semibold rounded-xl hover:bg-white/10 transition-colors whitespace-nowrap"
                      >
                        <X size={11} />
                        Cancel Request
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => requestToJoin(group)}
                      disabled={slotsRemaining === 0}
                      className="flex items-center justify-center gap-2 px-6 py-2.5 bg-white text-indigo-900 text-[13px] font-bold rounded-xl hover:bg-indigo-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap shadow-[0_2px_12px_rgba(255,255,255,0.15)]"
                    >
                      Request to Join
                      <ArrowRight size={13} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <ConfirmDialog
        isOpen={!!confirm}
        title={confirm?.title}
        message={confirm?.message}
        confirmLabel={confirm?.confirmLabel}
        variant={confirm?.variant}
        onConfirm={confirm?.onConfirm}
        onCancel={() => setConfirm(null)}
      />
    </>
  );
};
