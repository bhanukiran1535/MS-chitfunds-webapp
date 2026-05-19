import React, { useEffect, useMemo, useState } from "react";
import { Clock, AlertCircle, Info, Users, DollarSign } from "lucide-react";
import './RequestNotifications.css';
import { apiFetch } from '../lib/api';

const typeIcon = {
  join_group: <Users className="notif-icon blue" />,
  leave_group: <AlertCircle className="notif-icon red" />,
  confirm_cash_payment: <DollarSign className="notif-icon green" />,
  month_prebook: <Clock className="notif-icon purple" />,
};

const statusText = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
};

const formatTimestamp = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Unknown time';
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
};

const isRecent = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;
  const msSince = Date.now() - date.getTime();
  return msSince <= 48 * 60 * 60 * 1000;
};

export const RequestNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const data = await apiFetch(`${API_BASE}/request/my`, { showToast: false });
        setNotifications(Array.isArray(data.requests) ? data.requests : []);
      } catch (err) {
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [API_BASE]);

  const sortedNotifications = useMemo(() => {
    return [...notifications]
      .map((notif) => ({
        ...notif,
        timestamp: new Date(notif.timestamp || notif.createdAt || Date.now()).toISOString(),
      }))
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [notifications]);

  const latestNotifications = useMemo(
    () => sortedNotifications.filter((notif) => isRecent(notif.timestamp)),
    [sortedNotifications]
  );

  const earlierNotifications = useMemo(
    () => sortedNotifications.filter((notif) => !isRecent(notif.timestamp)),
    [sortedNotifications]
  );

  if (loading) return <div className="notification-message">Loading notifications...</div>;
  if (notifications.length === 0) return <div className="empty-state">No notifications yet.</div>;

  const renderNotificationItem = (notif) => (
    <li key={notif._id} className={`notification-item notification-${notif.status}`}> 
      <div className="notification-badge-wrapper">
        <span className="notification-icon">{typeIcon[notif.type] || <Info className="type-icon gray" />}</span>
      </div>
      <div className="notification-content">
        <div className="notification-header">
          <span className="notification-title">{notif.type.replace(/_/g, ' ')}</span>
          <span className={`status-badge status-${notif.status}`}>{statusText[notif.status] || notif.status}</span>
        </div>
        <div className="notification-meta">
          {notif.amount && <span>Amount: ₹{notif.amount.toLocaleString()}</span>}
          {notif.monthName && <span>Month: {notif.monthName}</span>}
          <span>{formatTimestamp(notif.timestamp)}</span>
        </div>
      </div>
    </li>
  );

  return (
    <div className="notifications-card">
      <div className="card-header">
        <div className="header-content">
          <div>
            <h3 className="card-title">Notifications</h3>
            <p className="card-subtitle">Latest updates about your requests and payments.</p>
          </div>
        </div>
      </div>
      <div className="card-content">
        {latestNotifications.length > 0 && (
          <section className="notification-section">
            <div className="notification-section-header">
              <span>Latest</span>
              <span className="notification-section-count">{latestNotifications.length}</span>
            </div>
            <ul className="notifications-group">{latestNotifications.map(renderNotificationItem)}</ul>
          </section>
        )}

        {earlierNotifications.length > 0 && (
          <section className="notification-section">
            <div className="notification-section-header">
              <span>Earlier</span>
              <span className="notification-section-count">{earlierNotifications.length}</span>
            </div>
            <ul className="notifications-group">{earlierNotifications.map(renderNotificationItem)}</ul>
          </section>
        )}
      </div>
    </div>
  );
};
