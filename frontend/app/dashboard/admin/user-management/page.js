"use client";
import { ChevronLeft, ChevronRight, Edit, Eye, Filter, Search, Trash2, Users, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { deleteUserById, fetchAllUsers, updateUserRole } from '../../../../lib/api';

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
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(10);

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
    setCurrentPage(1); // Reset to first page when filters change
  }, [search, users, roleFilter]);

  // Calculate pagination values
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const handlePageChange = (page) => {
    if (page === '...' || page === currentPage) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageSizeChange = (newPageSize) => {
    setUsersPerPage(parseInt(newPageSize));
    setCurrentPage(1); // Reset to first page when changing page size
  };

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

      setUsers(users.filter(user => user._id !== selectedUser._id));
      setShowDeleteModal(false);
      setSelectedUser(null);
      

      setSuccessMessage(`${selectedUser.name} has been successfully deleted.`);
      setShowSuccessModal(true);
      

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
      setCurrentPage(1); // Reset to first page when refreshing
    } catch (err) {
      setUsers([]);
      setFilteredUsers([]);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">User Management</h1>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
        <div className="flex flex-col gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm sm:text-base"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
            <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm sm:text-base" onClick={refreshUsers}>
              Refresh
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm sm:text-base">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 text-sm sm:text-base"
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
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-500">Total Users</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">{users.length}</p>
            </div>
            <Users className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-500">Farmers</p>
              <p className="text-lg sm:text-2xl font-bold text-green-600">{users.filter(u => u.role === 'farmer').length}</p>
            </div>
            <Users className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-500">Buyers</p>
              <p className="text-lg sm:text-2xl font-bold text-purple-600">{users.filter(u => u.role === 'buyer').length}</p>
            </div>
            <Users className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-500">Admins</p>
              <p className="text-lg sm:text-2xl font-bold text-teal-600">{users.filter(u => u.role === 'admin').length}</p>
            </div>
            <Users className="w-6 h-6 sm:w-8 sm:h-8 text-teal-600" />
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">All Users</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentUsers.map((user, idx) => (
                <tr key={user._id || idx}>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-teal-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-xs sm:text-sm">
                          {user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2)}
                        </span>
                      </div>
                      <div className="ml-3 sm:ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-xs sm:text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 bg-${user.role === 'admin' ? 'teal' : user.role === 'buyer' ? 'purple' : 'green'}-100 text-${user.role === 'admin' ? 'teal' : user.role === 'buyer' ? 'purple' : 'green'}-800 text-xs rounded-full`}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      Active
                    </span>
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <button 
                        className="text-blue-600 hover:text-blue-900 p-1"
                        onClick={() => handleViewUser(user)}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        className="text-green-600 hover:text-green-900 p-1"
                        onClick={() => handleEditUser(user)}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-900 p-1"
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
      {totalPages > 1 && (
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="text-xs sm:text-sm text-gray-700">
                Showing <span className="font-medium">{startIndex + 1}</span> to <span className="font-medium">{Math.min(endIndex, filteredUsers.length)}</span> of{' '}
                <span className="font-medium">{filteredUsers.length}</span> results
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm text-gray-500">Show:</span>
                <select
                  value={usersPerPage}
                  onChange={(e) => handlePageSizeChange(e.target.value)}
                  className="px-2 py-1 border border-gray-300 rounded text-xs sm:text-sm focus:ring-2 focus:ring-teal-500"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span className="text-xs sm:text-sm text-gray-500">per page</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm text-gray-500">Go to page:</span>
                <input
                  type="number"
                  min="1"
                  max={totalPages}
                  value={currentPage}
                  onChange={(e) => {
                    const page = parseInt(e.target.value);
                    if (page >= 1 && page <= totalPages) {
                      handlePageChange(page);
                    }
                  }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const page = parseInt(e.target.value);
                      if (page >= 1 && page <= totalPages) {
                        handlePageChange(page);
                      }
                    }
                  }}
                  className="w-16 px-2 py-1 border border-gray-300 rounded text-xs sm:text-sm focus:ring-2 focus:ring-teal-500 text-center"
                  placeholder="Page #"
                />
                <span className="text-xs sm:text-sm text-gray-500">of {totalPages}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <button 
                className={`px-2 sm:px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-1 text-xs sm:text-sm ${
                  currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Previous</span>
              </button>
              
              {getPageNumbers().map((page, index) => (
                <button
                  key={index}
                  className={`px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm ${
                    page === currentPage
                      ? 'bg-teal-600 text-white'
                      : page === '...'
                      ? 'px-2 py-2 text-gray-500 cursor-default'
                      : 'border border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => handlePageChange(page)}
                  disabled={page === '...'}
                >
                  {page}
                </button>
              ))}
              
              <button 
                className={`px-2 sm:px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-1 text-xs sm:text-sm ${
                  currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View User Modal */}
                      {showViewModal && selectedUser && (
          <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowViewModal(false)} />
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white rounded-lg p-4 sm:p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base sm:text-lg font-semibold">User Profile</h3>
              <button onClick={() => setShowViewModal(false)}>
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Name</label>
                <p className="text-sm sm:text-base text-gray-900">{selectedUser.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Email</label>
                <p className="text-sm sm:text-base text-gray-900">{selectedUser.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Role</label>
                <p className="text-sm sm:text-base text-gray-900 capitalize">{selectedUser.role}</p>
              </div>
              {selectedUser.phone && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Phone</label>
                  <p className="text-sm sm:text-base text-gray-900">{selectedUser.phone}</p>
                </div>
              )}
              {selectedUser.location && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Location</label>
                  <p className="text-sm sm:text-base text-gray-900">{selectedUser.location}</p>
                </div>
              )}
              {selectedUser.bio && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Bio</label>
                  <p className="text-sm sm:text-base text-gray-900">{selectedUser.bio}</p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-gray-700">Joined</label>
                <p className="text-sm sm:text-base text-gray-900">
                  {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : '-'}
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 text-sm sm:text-base"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
                      {showEditModal && selectedUser && (
          <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowEditModal(false)} />
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white rounded-lg p-4 sm:p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base sm:text-lg font-semibold">Edit User Role</h3>
              <button onClick={() => setShowEditModal(false)}>
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">User</label>
                <p className="text-sm sm:text-base text-gray-900">{selectedUser.name} ({selectedUser.email})</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Current Role</label>
                <p className="text-sm sm:text-base text-gray-900 capitalize">{selectedUser.role}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">New Role</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 text-sm sm:text-base"
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
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateRole}
                disabled={loading || newRole === selectedUser.role}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 text-sm sm:text-base"
              >
                {loading ? 'Updating...' : 'Update Role'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete User Modal */}
                      {showDeleteModal && selectedUser && (
          <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowDeleteModal(false)} />
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white rounded-lg p-4 sm:p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base sm:text-lg font-semibold text-red-600">Delete User</h3>
              <button onClick={() => setShowDeleteModal(false)}>
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <p className="text-sm sm:text-base text-gray-700">
                Are you sure you want to delete <strong>{selectedUser.name}</strong>?
              </p>
              <p className="text-xs sm:text-sm text-gray-500">
                This action cannot be undone. The user will be permanently removed from the system.
              </p>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUserConfirm}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 text-sm sm:text-base"
              >
                {loading ? 'Deleting...' : 'Delete User'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Notification Modal */}
                      {showSuccessModal && (
          <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowSuccessModal(false)} />
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white rounded-lg p-4 sm:p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-center mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-base sm:text-lg font-semibold text-green-600 mb-2">Success!</h3>
              <p className="text-sm sm:text-base text-gray-700">{successMessage}</p>
            </div>
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => setShowSuccessModal(false)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm sm:text-base"
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