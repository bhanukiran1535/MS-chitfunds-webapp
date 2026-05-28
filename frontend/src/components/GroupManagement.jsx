import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Settings, Plus, Users } from 'lucide-react';
import { GroupDetailsView } from './GroupDetailsView';
import { apiFetch } from '../lib/api';

function calculateCurrentMonth(startDateISO) {
  const startDate = new Date(startDateISO);
  if (isNaN(startDate)) return 0;
  const now = new Date();
  const monthsPassed = (now.getFullYear() - startDate.getFullYear()) * 12 + (now.getMonth() - startDate.getMonth()) + 1;
  return monthsPassed > 0 ? monthsPassed : 0;
}

const STATUS_STYLE = {
  active:    { dot: 'bg-emerald-500', text: 'text-emerald-700' },
  upcoming:  { dot: 'bg-amber-400',   text: 'text-amber-700'   },
  completed: { dot: 'bg-gray-400',    text: 'text-gray-600'    },
};

export const GroupManagement = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const navigate = useNavigate();

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const statuses = ['active', 'upcoming'];
      const responses = await Promise.all(
        statuses.map(status =>
          apiFetch(`${import.meta.env.VITE_API_BASE_URL}/group/allGroups?status=${status}`, { showToast: false })
        )
      );
      setGroups(responses.flatMap(r => (r.success ? r.groups : [])));
    } catch (err) {
      setGroups([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchGroups(); }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200/80 shadow-[0_1px_4px_rgba(0,0,0,0.04)] px-5 py-10 text-center text-[13px] text-gray-400">
        Loading groups…
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200/80 shadow-[0_1px_4px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-[14px] font-semibold text-gray-900">Group Management</h2>
            <p className="text-[12px] text-gray-400 mt-0.5">Manage all chit fund groups and their members</p>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white text-[12px] font-semibold rounded-md hover:bg-indigo-700 transition-colors">
            <Plus size={13} />
            Create Group
          </button>
        </div>

        {groups.length === 0 ? (
          <div className="px-5 py-12 text-center text-[13px] text-gray-400">No groups found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/70">
                  <th className="px-5 py-2.5 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Group</th>
                  <th className="px-5 py-2.5 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Chit Value</th>
                  <th className="px-5 py-2.5 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Progress</th>
                  <th className="px-5 py-2.5 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Members</th>
                  <th className="px-5 py-2.5 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-2.5 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {groups.map((group) => {
                  const current = calculateCurrentMonth(group.startMonth);
                  const pct = group.tenure ? Math.min(Math.round((current / group.tenure) * 100), 100) : 0;
                  const st = STATUS_STYLE[group.status] || STATUS_STYLE.upcoming;
                  return (
                    <tr key={group._id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/40 transition-colors">
                      <td className="px-5 py-3.5">
                        <p className="font-semibold text-gray-800">Group {group.groupNo}</p>
                        <p className="text-[12px] text-gray-400">
                          Started {new Date(group.startMonth).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
                        </p>
                      </td>
                      <td className="px-5 py-3.5 font-semibold text-gray-900">
                        ₹{group.chitValue.toLocaleString()}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-[12px] text-gray-500 whitespace-nowrap">{current}/{group.tenure}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center gap-1.5 text-gray-700">
                          <Users size={13} className="text-gray-400" />
                          {group.members?.length || 0}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 font-semibold text-[12px] ${st.text}`}>
                          <span className={`w-[6px] h-[6px] rounded-full ${st.dot}`} />
                          {group.status.charAt(0).toUpperCase() + group.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedGroup(group)}
                            className="flex items-center gap-1 px-2.5 py-1 bg-white border border-gray-200 text-gray-700 text-[12px] font-semibold rounded-md hover:bg-gray-50 transition-colors"
                          >
                            <Eye size={12} />
                            View
                          </button>
                          <button
                            onClick={() => navigate(`/admin/group/${group._id}/manage`)}
                            className="flex items-center gap-1 px-2.5 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 text-[12px] font-semibold rounded-md hover:bg-indigo-100 transition-colors"
                          >
                            <Settings size={12} />
                            Manage
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedGroup && (
        <GroupDetailsView group={selectedGroup} onClose={() => setSelectedGroup(null)} />
      )}
    </>
  );
};
