import { useEffect, useState } from 'react';
import { Plus, X, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { ConfirmDialog } from './ConfirmDialog';

const chitValues = [50000, 100000, 200000, 500000];

export const ChitValueBanner = () => {
  const [filteredChits, setFilteredChits] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [customAmount, setCustomAmount] = useState('');
  const [customAmountStr, setCustomAmountStr] = useState('');
  const [confirm, setConfirm] = useState(null);
  const API = import.meta.env.VITE_API_BASE_URL;

  const fetchData = async () => {
    try {
      const [groupsRes, requestsRes] = await Promise.all([
        fetch(`${API}/group/status/upcoming`, { credentials: 'include' }),
        fetch(`${API}/request/my`, { credentials: 'include' }),
      ]);
      const [groupsData, requestsData] = await Promise.all([groupsRes.json(), requestsRes.json()]);

      if (groupsData.success) {
        const upcomingGroups = groupsData.groups;
        const filtered = chitValues
          .map(val => {
            const group = upcomingGroups
              .filter(g => g.chitValue >= val)
              .sort((a, b) => new Date(a.startMonth) - new Date(b.startMonth))[0];
            if (!group) return null;
            return {
              chitValue: val,
              tenure: group.tenure,
              startMonth: new Date(group.startMonth).toLocaleString('default', { month: 'long', year: 'numeric' }),
            };
          })
          .filter(Boolean);
        setFilteredChits(filtered);
      }

      if (requestsData.success) {
        const joinRequests = requestsData.requests
          .filter(req => req.type === 'join_group' && req.status === 'pending')
          .map(req => req.amount);
        setMyRequests(joinRequests);
      }
    } catch (error) {
      console.error('Error fetching chit data:', error);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const requestToJoin = async (amount) => {
    setConfirm({
      title: 'Request to Join',
      message: `Send a join request for a ₹${Number(amount).toLocaleString()} chit group? Your request will be reviewed by the admin.`,
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
            setMyRequests(prev => [...prev, amount]);
          } else {
            toast.error(data.message || 'Failed to submit request.');
          }
        } catch {
          toast.error('Error sending join request. Please try again.');
        }
      },
    });
  };

  const withdrawRequest = async (amount) => {
    setConfirm({
      title: 'Withdraw Request',
      message: `Withdraw your join request for ₹${Number(amount).toLocaleString()}? You can submit a new request later.`,
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
            toast.success(data.message || 'Request withdrawn successfully.');
            setMyRequests(prev => prev.filter(a => a !== amount));
          } else {
            toast.error(data.message || 'Failed to withdraw request.');
          }
        } catch {
          toast.error('Error withdrawing request. Please try again.');
        }
      },
    });
  };

  const handleCustomRequest = () => {
    const amount = Number(customAmountStr);
    if (!amount || amount < 10000) {
      toast.error('Please enter a valid amount of ₹10,000 or more.');
      return;
    }
    requestToJoin(amount);
  };

  if (filteredChits.length === 0) return null;

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200/80 shadow-[0_1px_4px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-[14px] font-semibold text-gray-900">Available to Join</h3>
            <p className="text-[12px] text-gray-400 mt-0.5">Upcoming chit groups open for new members</p>
          </div>
        </div>

        <div className="flex gap-3 overflow-x-auto px-5 py-4 scrollbar-none">
          {filteredChits.map((item, index) => {
            const requested = myRequests.includes(item.chitValue);
            return (
              <div
                key={index}
                className="shrink-0 w-44 bg-gray-50 border border-gray-200/80 rounded-xl px-4 py-3.5 flex flex-col gap-3"
              >
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Chit Value</p>
                  <p className="text-[18px] font-bold text-gray-900 tabular-nums">₹{item.chitValue.toLocaleString()}</p>
                </div>
                <div className="space-y-1 text-[12px] text-gray-500">
                  <p>{item.tenure} months · {item.startMonth}</p>
                </div>
                {requested ? (
                  <div className="space-y-1.5">
                    <div className="w-full py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[12px] font-semibold rounded-md text-center">
                      Request Sent
                    </div>
                    <button
                      onClick={() => withdrawRequest(item.chitValue)}
                      className="w-full py-1.5 bg-white border border-red-200 text-red-600 text-[12px] font-semibold rounded-md hover:bg-red-50 transition-colors flex items-center justify-center gap-1"
                    >
                      <X size={11} />
                      Withdraw
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => requestToJoin(item.chitValue)}
                    className="w-full py-1.5 bg-indigo-600 text-white text-[12px] font-semibold rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center gap-1"
                  >
                    <Plus size={11} />
                    Request to Join
                  </button>
                )}
              </div>
            );
          })}

          {/* Custom amount card */}
          <div className="shrink-0 w-52 bg-gray-50 border border-gray-200/80 border-dashed rounded-xl px-4 py-3.5 flex flex-col gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Custom Amount</p>
              <p className="text-[13px] text-gray-500">Request any chit value</p>
            </div>
            <input
              type="number"
              placeholder="e.g. 600000"
              value={customAmountStr}
              onChange={e => { setCustomAmountStr(e.target.value); setCustomAmount(Number(e.target.value)); }}
              className="px-3 py-2 text-[13px] border border-gray-200 rounded-lg bg-white text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            {myRequests.includes(customAmount) ? (
              <div className="space-y-1.5">
                <div className="w-full py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[12px] font-semibold rounded-md text-center">
                  Request Sent
                </div>
                <button
                  onClick={() => withdrawRequest(customAmount)}
                  className="w-full py-1.5 bg-white border border-red-200 text-red-600 text-[12px] font-semibold rounded-md hover:bg-red-50 transition-colors flex items-center justify-center gap-1"
                >
                  <X size={11} />
                  Withdraw
                </button>
              </div>
            ) : (
              <button
                onClick={handleCustomRequest}
                className="w-full py-1.5 bg-indigo-600 text-white text-[12px] font-semibold rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center gap-1.5"
              >
                <ArrowRight size={11} />
                Request Amount
              </button>
            )}
          </div>
        </div>
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
