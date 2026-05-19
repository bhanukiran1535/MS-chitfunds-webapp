import { Calendar, DollarSign, Users, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './GroupCard.css';

export const GroupCard = ({ group }) => {
  const navigate = useNavigate();

  const getStatusClass = (status) => {
    switch (status) {
      case 'upcoming': return 'status-upcoming';
      case 'pending': return 'status-pending';
      case 'paid': return 'status-paid';
      case 'due': return 'status-due';
      default: return 'status-default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'upcoming': return 'Upcoming';
      case 'pending': return 'Payment Pending';
      case 'paid': return 'Paid';
      case 'due': return 'Payment Due';
      default: return 'Unknown';
    }
  };

  const getGroupStatus = () => {
    if (group.groupStatus === 'completed' || group.status === 'completed') {
      return 'completed';
    }
    if (group.groupStatus) {
      return group.groupStatus;
    }
    return 'active';
  };

  const groupStatus = getGroupStatus();
  const isCompleted = groupStatus === 'completed';
  const statusClass = isCompleted ? 'status-completed' : getStatusClass(group.myPaymentStatus);
  const statusText = isCompleted ? 'Completed' : getStatusText(group.myPaymentStatus);
  const progressValue = Math.min(group.currentMonth || 0, group.tenure || 0);
  const displayProgress = isCompleted ? `${group.tenure}/${group.tenure}` : `${progressValue}/${group.tenure}`;
  const actionType = isCompleted ? 'secondary' : (group.myPaymentStatus === 'due' || group.myPaymentStatus === 'pending' ? 'primary' : 'secondary');
  const actionLabel = isCompleted ? 'View Details' : (group.myPaymentStatus === 'due' || group.myPaymentStatus === 'pending' ? 'Pay Now' : 'View Details');

  const startMonth = new Date(group.startMonth).toLocaleString('default', {
    month: 'long',
    year: 'numeric'
  });

  const handleDetailsClick = () => {
    navigate(`/user/group/${group._id}/details`, { state: { group } });
  };
  return (
    <div className={`group-card${isCompleted ? ' completed' : ''}`}>
      {isCompleted && <div className="completed-stamp">Completed</div>}
      <div className="card-header">
        <div className="card-title-section">
          <h3 className="card-title">Group {group.groupNo}</h3>
          <p className="card-subtitle">Started: {startMonth}</p>
        </div>
        <div className={`status-badge ${statusClass}`}>
          {statusText}
        </div>
      </div>

      <div className="card-content">
        <div className="info-grid">
          <div className="info-item">
            <DollarSign className="info-icon green" />
            <span className="info-label">Value:</span>
            <span className="info-value">₹{group.shareAmount.toLocaleString()}</span>
          </div>

          <div className="info-item">
            <Calendar className="info-icon blue" />
            <span className="info-label">Tenure:</span>
            <span className="info-value">{group.tenure} months</span>
          </div>

          <div className="info-item">
            <Clock className="info-icon orange" />
            <span className="info-label">Progress:</span>
            <span className="info-value">{displayProgress}</span>
          </div>

          <div className="info-item">
            <Calendar className="info-icon purple" />
            <span className="info-label">Payout Month:</span>
            <span className="info-value">
              {group.preBookedMonth ? group.preBookedMonth : 'Not Claimed'}
            </span>
          </div>
        </div>

        <div className="card-actions">
          <button
            className={`action-btn ${actionType}`}
            onClick={handleDetailsClick}
          >
            {actionLabel}
          </button>
        </div>
      </div>
    </div>
  );
};