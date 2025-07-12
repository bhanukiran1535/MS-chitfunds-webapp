
import { useState } from 'react';
import { Users, DollarSign, Calendar, AlertCircle, Plus, Settings } from 'lucide-react';
import { AdminRequests } from './AdminRequests';
import { GroupManagement } from './GroupManagement';
import './AdminDashboard.css';
import { CreateGroupForm } from './CreateGroupForm';
import { AddMemberForm } from './AddMemberForm';

export const AdminDashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState('requests');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showAddMemberForm, setAddMemberForm] = useState(false);

  // Mock admin stats
  const [stats] = useState({
    totalGroups: 5,
    totalMembers: 87,
    pendingRequests: 12,
    monthlyCollection: 435000
  });

  return (
    <div className="admin-dashboard">
      {/* Admin Welcome Section */}
      <div className="welcome-section admin">
        <h2 className="welcome-title">Admin Dashboard</h2>
        <p className="welcome-subtitle">
          Manage chit fund groups, members, and approve requests
        </p>
      </div>

      {/* Admin Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Total Groups</span>
            <Calendar className="stat-icon" />
          </div>
          <div className="stat-value blue">{stats.totalGroups}</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Total Members</span>
            <Users className="stat-icon" />
          </div>
          <div className="stat-value green">{stats.totalMembers}</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Pending Requests</span>
            <AlertCircle className="stat-icon" />
          </div>
          <div className="stat-value red">{stats.pendingRequests}</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Monthly Collection</span>
            <DollarSign className="stat-icon" />
          </div>
          <div className="stat-value purple">
            ₹{stats.monthlyCollection.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Admin Actions */}
      <div className="admin-actions">
        <button
          className="action-btn primary"
          onClick={() => setShowCreateForm(true)}
        >
          <Plus className="btn-icon" />
          Create New Group
        </button>
        {showCreateForm && (
          <CreateGroupForm onClose={() => setShowCreateForm(false)} />
        )}

        <button
          className="action-btn secondary"
          onClick={() => setAddMemberForm(true)}
        >
          <Users className="btn-icon" />
          Add Member
        </button>
        {showAddMemberForm && (
            <AddMemberForm onClose={() => setAddMemberForm(false)} />
        )}

        <button className="action-btn secondary">
          <Settings className="btn-icon" />
          Settings
        </button>
      </div>

      {/* Admin Content Tabs */}
      <div className="tabs-container">
        <div className="tabs-list">
          <button
            className={`tab ${activeTab === "requests" ? "active" : ""}`}
            onClick={() => setActiveTab("requests")}
          >
            Pending Requests
          </button>
          <button
            className={`tab ${activeTab === "groups" ? "active" : ""}`}
            onClick={() => setActiveTab("groups")}
          >
            Group Management
          </button>
          <button
            className={`tab ${activeTab === "members" ? "active" : ""}`}
            onClick={() => setActiveTab("members")}
          >
            Member Management
          </button>
        </div>

        <div className="tab-content">
          {activeTab === "requests" && <AdminRequests />}
          {activeTab === "groups" && <GroupManagement />}
          {activeTab === "members" && (
            <div className="placeholder-card">
              <div className="card-header">
                <h2 className="card-title">Member Management</h2>
                <p className="card-subtitle">
                  Manage all members across groups
                </p>
              </div>
              <div className="card-content">
                <p className="placeholder-text">
                  Member management interface coming soon...
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
