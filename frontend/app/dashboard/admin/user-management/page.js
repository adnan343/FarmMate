"use client";
import { Edit, Eye, Filter, Search, Trash2, Users, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { fetchAllUsers, updateUserRole, deleteUserById } from '../../../../lib/api';

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newRole, setNewRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    async function getUsers() {
      try {
        const data = await fetchAllUsers();
        setUsers(data);
        setFilteredUsers(data);
      } catch (err) {
        setUsers([]);
        setFilteredUsers([]);
      }
    }
    getUsers();
  }, []);

  useEffect(() => {
    let filtered = users;
    if (roleFilter !== 'All Roles') {
      filtered = filtered.filter(user => user.role.toLowerCase() === roleFilter.toLowerCase());
    }
    if (search) {
      filtered = filtered.filter(user => user.name.toLowerCase().includes(search.toLowerCase()));
    }
    setFilteredUsers(filtered);
  }, [search, users, roleFilter]);

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setShowEditModal(true);
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleUpdateRole = async () => {
    if (!selectedUser || !newRole) return;
    
    setLoading(true);
    try {
      await updateUserRole(selectedUser._id, newRole);
      // Update the user in the local state
      setUsers(users.map(user => 
        user._id === selectedUser._id ? { ...user, role: newRole } : user
      ));
      setShowEditModal(false);
      setSelectedUser(null);
      setNewRole('');
    } catch (error) {
      alert('Failed to update user role: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUserConfirm = async () => {
    if (!selectedUser) return;
    
    setLoading(true);
    try {
      await deleteUserById(selectedUser._id);
      // Remove the user from the local state
      setUsers(users.filter(user => user._id !== selectedUser._id));
      setShowDeleteModal(false);
      setSelectedUser(null);
      
      // Show success message
      setSuccessMessage(`${selectedUser.name} has been successfully deleted.`);
      setShowSuccessModal(true);
      
      // Auto-dismiss after 3 seconds
      setTimeout(() => {
        setShowSuccessModal(false);
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      alert('Failed to delete user: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const refreshUsers = async () => {
    try {
      const data = await fetchAllUsers();
      setUsers(data);
      let filtered = data;
      if (roleFilter !== 'All Roles') {
        filtered = filtered.filter(user => user.role.toLowerCase() === roleFilter.toLowerCase());
      }
      if (search) {
        filtered = filtered.filter(user => user.name.toLowerCase().includes(search.toLowerCase()));
      }
      setFilteredUsers(filtered);
    } catch (err) {
      setUsers([]);
      setFilteredUsers([]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50" onClick={refreshUsers}>
              Refresh
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
            >
              <option>All Roles</option>
              <option>Farmer</option>
              <option>Buyer</option>
              <option>Admin</option>
            </select>
          </div>
        </div>
      </div>

      {/* User Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Farmers</p>
              <p className="text-2xl font-bold text-green-600">{users.filter(u => u.role === 'farmer').length}</p>
            </div>
            <Users className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Buyers</p>
              <p className="text-2xl font-bold text-purple-600">{users.filter(u => u.role === 'buyer').length}</p>
            </div>
            <Users className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Admins</p>
              <p className="text-2xl font-bold text-teal-600">{users.filter(u => u.role === 'admin').length}</p>
            </div>
            <Users className="w-8 h-8 text-teal-500" />
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">All Users</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user, idx) => (
                <tr key={user._id || idx}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium">
                          {user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2)}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 bg-${user.role === 'admin' ? 'teal' : user.role === 'buyer' ? 'purple' : 'green'}-100 text-${user.role === 'admin' ? 'teal' : user.role === 'buyer' ? 'purple' : 'green'}-800 text-xs rounded-full`}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button 
                        className="text-blue-600 hover:text-blue-900"
                        onClick={() => handleViewUser(user)}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        className="text-green-600 hover:text-green-900"
                        onClick={() => handleEditUser(user)}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-900"
                        onClick={() => handleDeleteUser(user)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredUsers.length}</span> of{' '}
            <span className="font-medium">{users.length}</span> results
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              Previous
            </button>
            <button className="px-3 py-2 bg-teal-600 text-white rounded-lg">1</button>
            <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">2</button>
            <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">3</button>
            <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* View User Modal */}
      {showViewModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">User Profile</h3>
              <button onClick={() => setShowViewModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Name</label>
                <p className="text-gray-900">{selectedUser.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Email</label>
                <p className="text-gray-900">{selectedUser.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Role</label>
                <p className="text-gray-900 capitalize">{selectedUser.role}</p>
              </div>
              {selectedUser.phone && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Phone</label>
                  <p className="text-gray-900">{selectedUser.phone}</p>
                </div>
              )}
              {selectedUser.location && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Location</label>
                  <p className="text-gray-900">{selectedUser.location}</p>
                </div>
              )}
              {selectedUser.bio && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Bio</label>
                  <p className="text-gray-900">{selectedUser.bio}</p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-gray-700">Joined</label>
                <p className="text-gray-900">
                  {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : '-'}
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Edit User Role</h3>
              <button onClick={() => setShowEditModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">User</label>
                <p className="text-gray-900">{selectedUser.name} ({selectedUser.email})</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Current Role</label>
                <p className="text-gray-900 capitalize">{selectedUser.role}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">New Role</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                >
                  <option value="farmer">Farmer</option>
                  <option value="buyer">Buyer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateRole}
                disabled={loading || newRole === selectedUser.role}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Update Role'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete User Modal */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-red-600">Delete User</h3>
              <button onClick={() => setShowDeleteModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <p className="text-gray-700">
                Are you sure you want to delete <strong>{selectedUser.name}</strong>?
              </p>
              <p className="text-sm text-gray-500">
                This action cannot be undone. The user will be permanently removed from the system.
              </p>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUserConfirm}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? 'Deleting...' : 'Delete User'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Notification Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-green-600 mb-2">Success!</h3>
              <p className="text-gray-700">{successMessage}</p>
            </div>
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => setShowSuccessModal(false)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 