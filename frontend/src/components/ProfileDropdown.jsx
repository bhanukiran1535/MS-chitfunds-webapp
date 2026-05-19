import { LogOut, User as UserIcon, Settings } from "lucide-react";
import { useState } from 'react';
import "./ProfileDropdown.css";
import { AccountSettingsModal } from './AccountSettingsModal';

const ProfileDropdown = ({ user, onLogout }) => {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <>
      <div className="profile-dropdown">
        <div className="profile-header">
          <UserIcon className="profile-icon" />
          <div className="profile-details">
            <p className="profile-alias">{`${user.firstName}${user.lastName ? ` ${user.lastName}` : ''}`}</p>
            <p className="profile-email">{user.email}</p>
          </div>
        </div>
        <div className="profile-actions">
          <button className="profile-button" onClick={() => setShowSettings(true)}>
            <Settings size={16} />
            Settings
          </button>
          <button className="profile-button logout" onClick={onLogout}>
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>

      <AccountSettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </>
  );
};

export default ProfileDropdown;
