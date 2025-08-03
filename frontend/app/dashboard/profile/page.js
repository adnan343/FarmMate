'use client';

import { Calendar, Edit, Mail, MapPin, Save, Shield, User, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProfilePage() {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    role: '',
    phone: '',
    location: '',
    joinDate: '',
    bio: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Get user data from API and cookies
    const getUserData = async () => {
      try {
        const cookies = document.cookie.split(';').reduce((acc, cookie) => {
          const [key, value] = cookie.trim().split('=');
          acc[key] = value;
          return acc;
        }, {});

        const userId = cookies.userId;
        
        if (userId) {
          // Fetch user data from API
          const response = await fetch(`http://localhost:5000/api/users/${userId}`);
          if (response.ok) {
            const result = await response.json();
            if (result.success) {
              const apiUserData = result.data;
              const userData = {
                name: apiUserData.name || cookies.userName || 'User Name',
                email: apiUserData.email || cookies.userEmail || 'user@farmmate.com',
                role: apiUserData.role || cookies.role || 'user',
                phone: apiUserData.phone || cookies.userPhone || '+1 (555) 123-4567',
                location: apiUserData.location || cookies.userLocation || 'Farm Location',
                joinDate: cookies.joinDate || new Date(apiUserData.createdAt).toLocaleDateString(),
                bio: apiUserData.bio || cookies.userBio || 'No bio available'
              };
              setUserData(userData);
              setEditedData(userData);
            } else {
              console.error('API returned error:', result.msg);
            }
          } else {
            console.error('Failed to fetch user data:', response.status);
          }
        } else {
          // Fallback to cookies only
          const userData = {
            name: cookies.userName || 'User Name',
            email: cookies.userEmail || 'user@farmmate.com',
            role: cookies.role || 'user',
            phone: cookies.userPhone || '+1 (555) 123-4567',
            location: cookies.userLocation || 'Farm Location',
            joinDate: cookies.joinDate || new Date().toLocaleDateString(),
            bio: cookies.userBio || 'No bio available'
          };
          setUserData(userData);
          setEditedData(userData);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Fallback to cookies only
        const cookies = document.cookie.split(';').reduce((acc, cookie) => {
          const [key, value] = cookie.trim().split('=');
          acc[key] = value;
          return acc;
        }, {});

        const userData = {
          name: cookies.userName || 'User Name',
          email: cookies.userEmail || 'user@farmmate.com',
          role: cookies.role || 'user',
          phone: cookies.userPhone || '+1 (555) 123-4567',
          location: cookies.userLocation || 'Farm Location',
          joinDate: cookies.joinDate || new Date().toLocaleDateString(),
          bio: cookies.userBio || 'No bio available'
        };
        setUserData(userData);
        setEditedData(userData);
      } finally {
        setIsLoading(false);
      }
    };

    getUserData();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedData({ ...userData });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData({ ...userData });
  };

  const handleSave = async () => {
    try {
      // Get user ID from cookies
      const cookies = document.cookie.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        acc[key] = value;
        return acc;
      }, {});
      
      const userId = cookies.userId;
      
      if (!userId) {
        throw new Error('User ID not found');
      }

      // Make API call to update user data
      const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editedData.name,
          email: editedData.email,
          phone: editedData.phone,
          location: editedData.location,
          bio: editedData.bio
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Failed to update profile');
      }

      const result = await response.json();
      
      if (result.success) {
        setUserData(editedData);
        setIsEditing(false);
        
        // Update cookies with new data
        document.cookie = `userName=${editedData.name}; path=/`;
        document.cookie = `userEmail=${editedData.email}; path=/`;
        document.cookie = `userPhone=${editedData.phone}; path=/`;
        document.cookie = `userLocation=${editedData.location}; path=/`;
        document.cookie = `userBio=${editedData.bio}; path=/`;
        
        // Show success message
        alert('Profile updated successfully!');
      } else {
        throw new Error(result.msg || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  const handleInputChange = (field, value) => {
    setEditedData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'farmer':
        return 'Farmer';
      case 'buyer':
        return 'Buyer';
      case 'admin':
        return 'Administrator';
      default:
        return role;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'farmer':
        return 'bg-green-100 text-green-800';
      case 'buyer':
        return 'bg-blue-100 text-blue-800';
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
        <p className="text-gray-600">Manage your account information and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-center mb-6">
              <div className="w-24 h-24 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {isEditing ? editedData.name : userData.name}
              </h2>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(userData.role)}`}>
                <Shield className="w-4 h-4 mr-1" />
                {getRoleDisplayName(userData.role)}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="w-4 h-4 mr-3 text-gray-400" />
                <span>{isEditing ? editedData.email : userData.email}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-3 text-gray-400" />
                <span>Joined {userData.joinDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-teal-600 bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                ) : (
                  <p className="text-gray-900">{userData.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={editedData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                ) : (
                  <p className="text-gray-900">{userData.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editedData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                ) : (
                  <p className="text-gray-900">{userData.phone}</p>
                )}
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                ) : (
                  <div className="flex items-center text-gray-900">
                    <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                    {userData.location}
                  </div>
                )}
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                {isEditing ? (
                  <textarea
                    value={editedData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <p className="text-gray-900">{userData.bio}</p>
                )}
              </div>
            </div>
          </div>

          {/* Account Settings */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Settings</h3>
            <div className="space-y-4">
              <button className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                Change Password
              </button>
              <button className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                Notification Preferences
              </button>
              <button className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 