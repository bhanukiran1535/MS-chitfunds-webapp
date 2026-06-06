import { useNavigate } from 'react-router-dom';
import { CheckCircle, AlertTriangle } from 'lucide-react';

const STATUS = {
  upcoming:  { dot: 'bg-gray-300',    label: 'Upcoming',  text: 'text-gray-500'    },
  pending:   { dot: 'bg-amber-400',   label: 'Pending',   text: 'text-amber-700'   },
  paid:      { dot: 'bg-emerald-500', label: 'Paid',      text: 'text-emerald-700' },
  due:       { dot: 'bg-red-500',     label: 'Due Now',   text: 'text-red-700'     },
  completed: { dot: 'bg-indigo-400',  label: 'Completed', text: 'text-indigo-600'  },
};

export const GroupCard = ({ group }) => {
  const navigate = useNavigate();

  const getGroupStatus = () => {
    if (group.groupStatus === 'completed' || group.status === 'completed') return 'completed';
    return group.groupStatus || 'active';
  };

  const groupStatus = getGroupStatus();
  const isCompleted = groupStatus === 'completed';
  const payStatus = isCompleted ? 'completed' : (group.myPaymentStatus || 'upcoming');
  const s = STATUS[payStatus] || STATUS.upcoming;

  const progressValue = Math.min(group.currentMonth || 0, group.tenure || 0);
  const progressPct = group.tenure ? Math.round((progressValue / group.tenure) * 100) : 0;

  const startMonth = group.startMonth
    ? new Date(group.startMonth).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
    : '—';

  const monthlyShare = group.shareAmount && group.tenure
    ? Math.round(group.shareAmount / group.tenure)
    : 0;

  const isUnclaimedPayout = isCompleted && !group.preBookedMonth;

  const handleClick = () => {
    navigate(`/user/group/${group._id}/details`, { state: { group } });
  };

  return (
    <div
      className={`bg-white rounded-xl border flex flex-col transition-shadow relative overflow-hidden
        ${isCompleted
          ? 'border-gray-200/60 shadow-none grayscale opacity-75 hover:opacity-90 hover:grayscale-0 transition-all'
          : 'border-gray-200/80 shadow-[0_1px_4px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]'
        }`}
    >
      {/* Completed stamp overlay */}
      {isCompleted && (
        <div className="absolute top-3 right-3 z-10">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-100 border border-indigo-300 text-indigo-700 text-[10px] font-bold rounded-md tracking-wide">
            <CheckCircle size={9} />
            COMPLETED
          </span>
        </div>
      )}

      {/* Unclaimed payout banner */}
      {isUnclaimedPayout && (
        <div className="px-5 py-2 bg-amber-50 border-b border-amber-200 flex items-center gap-2">
          <AlertTriangle size={12} className="text-amber-600 shrink-0" />
          <p className="text-[11px] font-semibold text-amber-700">
            Payout Unclaimed — contact admin to claim your final payout
          </p>
        </div>
      )}

      <div className="px-5 pt-5 pb-4 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Group No.</p>
            <p className="text-[22px] font-bold text-gray-900 leading-none">{group.groupNo}</p>
            <p className="text-[11px] text-gray-400 mt-1">Started {startMonth}</p>
          </div>
          <span className={`inline-flex items-center gap-1.5 text-[12px] font-semibold ${s.text} ${isCompleted ? 'mt-6' : ''}`}>
            <span className={`w-[7px] h-[7px] rounded-full shrink-0 ${s.dot}`} />
            {s.label}
          </span>
        </div>
      </div>

      <div className="px-5 py-4 flex-1 space-y-3">
        <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
          <div>
            <p className="text-[11px] text-gray-400 mb-0.5">Chit Value</p>
            <p className="text-[14px] font-semibold text-gray-900">₹{(group.shareAmount || 0).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-[11px] text-gray-400 mb-0.5">Monthly Share</p>
            <p className="text-[14px] font-semibold text-gray-900">₹{monthlyShare.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-[11px] text-gray-400 mb-0.5">Tenure</p>
            <p className="text-[14px] font-semibold text-gray-900">{group.tenure} months</p>
          </div>
          <div>
            <p className="text-[11px] text-gray-400 mb-0.5">Payout Month</p>
            {isUnclaimedPayout ? (
              <p className="text-[13px] font-semibold text-amber-600 flex items-center gap-1">
                <AlertTriangle size={11} />
                Unclaimed
              </p>
            ) : (
              <p className="text-[14px] font-semibold text-gray-900">
                {group.preBookedMonth || '—'}
              </p>
            )}
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[12px] mb-1.5">
            <span className="text-gray-400">Progress</span>
            <span className={`font-semibold ${isCompleted ? 'text-gray-400' : 'text-indigo-600'}`}>
              {progressValue}/{group.tenure}
            </span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${isCompleted ? 'bg-gray-400' : 'bg-indigo-500'}`}
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      <div className="px-5 pb-5">
        <button
          onClick={handleClick}
          className={`w-full py-2 rounded-lg text-[13px] font-semibold transition-colors ${
            isCompleted
              ? 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              : payStatus === 'due' || payStatus === 'pending'
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {isCompleted ? 'View Details' : (payStatus === 'due' || payStatus === 'pending') ? 'Pay Now' : 'View Details'}
        </button>
      </div>
    </div>
  );
};
