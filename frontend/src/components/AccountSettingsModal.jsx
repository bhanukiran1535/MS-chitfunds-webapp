import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, CheckCircle, Shield } from 'lucide-react';
import { apiFetch } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import './AccountSettingsModal.css';

export const AccountSettingsModal = ({ isOpen, onClose }) => {
  const { user, updateUser } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [notificationSuccess, setNotificationSuccess] = useState('');
  const [notificationError, setNotificationError] = useState('');

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      notificationPreferences: {
        emailUpdates: true,
        appAlerts: true
      }
    }
  });

  useEffect(() => {
    if (isOpen && user) {
      reset({
        notificationPreferences: {
          emailUpdates: user.notificationPreferences?.emailUpdates ?? true,
          appAlerts: user.notificationPreferences?.appAlerts ?? true,
        }
      });
      setNotificationSuccess('');
      setNotificationError('');
      setPasswordError('');
      setPasswordSuccess('');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    }
  }, [isOpen, reset, user]);

  const handleClose = () => {
    onClose();
    setNotificationSuccess('');
    setNotificationError('');
    setPasswordError('');
    setPasswordSuccess('');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const onSaveNotifications = async (formData) => {
    setIsSaving(true);
    setNotificationSuccess('');
    setNotificationError('');

    try {
      const payload = {
        notificationPreferences: {
          emailUpdates: formData.notificationPreferences.emailUpdates,
          appAlerts: formData.notificationPreferences.appAlerts,
        }
      };

      const data = await apiFetch(`${import.meta.env.VITE_API_BASE_URL}/user/settings`, {
        method: 'PUT',
        body: payload,
      });

      updateUser(data.user);
      setNotificationSuccess('Notification settings updated successfully.');
    } catch (err) {
      setNotificationError(err.message || 'Unable to update notification preferences.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    const { currentPassword, newPassword, confirmPassword } = passwordData;
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('All password fields are required.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }

    setPasswordLoading(true);
    try {
      await apiFetch(`${import.meta.env.VITE_API_BASE_URL}/user/change-password`, {
        method: 'POST',
        body: {
          currentPassword,
          newPassword,
        },
      });
      setPasswordSuccess('Password changed successfully.');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPasswordError(err.message || 'Unable to change password.');
    } finally {
      setPasswordLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="settings-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="settings-modal-title">
      <div className="settings-modal-content">
        <button className="settings-close-btn" onClick={handleClose} aria-label="Close settings"><X /></button>
        <div className="settings-modal-header">
          <div>
            <h2 id="settings-modal-title">Account Settings</h2>
            <p>Manage notification preferences and change your password securely.</p>
          </div>
          <div className="settings-header-icon"><Shield /></div>
        </div>

        <div className="settings-form">
          <div className="settings-grid">
            <label className="full-width disabled-field">
              Name
              <input type="text" value={`${user.firstName}${user.lastName ? ` ${user.lastName}` : ''}`} disabled />
            </label>
            <label className="full-width disabled-field">
              Email Address
              <input type="email" value={user.email || ''} disabled />
            </label>
          </div>

          <div className="settings-divider">Notification Preferences</div>

          <form onSubmit={handleSubmit(onSaveNotifications)} className="settings-form-inner">
            <div className="settings-toggle-group">
              <label className="settings-toggle">
                <div>
                  <span>Email updates</span>
                  <p>Receive email summaries and reminders.</p>
                </div>
                <input type="checkbox" {...register('notificationPreferences.emailUpdates')} />
                <span className="toggle-switch"></span>
              </label>

              <label className="settings-toggle">
                <div>
                  <span>App alerts</span>
                  <p>Show activity and payment alerts in the dashboard.</p>
                </div>
                <input type="checkbox" {...register('notificationPreferences.appAlerts')} />
                <span className="toggle-switch"></span>
              </label>
            </div>

            {notificationError && <div className="settings-status error">{notificationError}</div>}
            {notificationSuccess && <div className="settings-status success">{notificationSuccess}</div>}

            <div className="settings-actions">
              <button type="submit" className="primary-btn" disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save notification settings'} <CheckCircle />
              </button>
            </div>
          </form>

          <div className="settings-divider">Change Password</div>
          <form className="settings-form-inner" onSubmit={handlePasswordChange} noValidate>
            <div className="settings-grid">
              <label>
                Current Password
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                />
              </label>
              <label>
                New Password
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                />
              </label>
              <label>
                Confirm Password
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                />
              </label>
            </div>

            {passwordError && <div className="settings-status error">{passwordError}</div>}
            {passwordSuccess && <div className="settings-status success">{passwordSuccess}</div>}

            <div className="settings-actions">
              <button type="submit" className="primary-btn" disabled={passwordLoading}>
                {passwordLoading ? 'Updating...' : 'Change password'} <CheckCircle />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
