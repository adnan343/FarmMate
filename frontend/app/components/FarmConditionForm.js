'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Send, ArrowLeft, Lightbulb, AlertTriangle, CheckCircle } from 'lucide-react';
import FarmPhotoUpload from './FarmPhotoUpload.js';
import { createFarmCondition, getFarmsByFarmer } from '@/lib/api';

export default function FarmConditionForm({ farmerId, onCancel, onSuccess }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [farms, setFarms] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [formData, setFormData] = useState({
    farmId: '',
    weatherType: '',
    soilType: '',
    plantStatus: '',
    additionalNotes: ''
  });
  const [photo, setPhoto] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    getCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUserId) {
      fetchFarms();
    }
  }, [currentUserId]);

  // Refresh farms when window gains focus (user returns from farm profile page)
  useEffect(() => {
    const handleFocus = () => {
      if (currentUserId) {
        fetchFarms();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [currentUserId]);

  const getCurrentUser = () => {
    const cookies = document.cookie.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=');
      acc[key] = value;
      return acc;
    }, {});
    setCurrentUserId(cookies.userId);
  };

  const fetchFarms = async () => {
    try {
      const farmsData = await getFarmsByFarmer(currentUserId);
      setFarms(farmsData || []);
    } catch (error) {
      console.error('Error fetching farms:', error);
      // Fallback to empty array if API fails
      setFarms([]);
    }
  };

  // Function to refresh farms when returning from farm profile page
  const handleAddFarmClick = () => {
    // Store current form data in sessionStorage to restore when returning
    sessionStorage.setItem('farmConditionFormData', JSON.stringify(formData));
    sessionStorage.setItem('farmConditionFormPhoto', JSON.stringify(photo));
    router.push('/dashboard/farmer/farm-profile');
  };

  // Restore form data when component mounts (if returning from farm profile)
  useEffect(() => {
    const savedFormData = sessionStorage.getItem('farmConditionFormData');
    const savedPhoto = sessionStorage.getItem('farmConditionFormPhoto');
    
    if (savedFormData) {
      setFormData(JSON.parse(savedFormData));
      sessionStorage.removeItem('farmConditionFormData');
    }
    
    if (savedPhoto) {
      setPhoto(JSON.parse(savedPhoto));
      sessionStorage.removeItem('farmConditionFormPhoto');
    }
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.farmId) newErrors.farmId = 'Please select a farm';
    if (!formData.weatherType) newErrors.weatherType = 'Please select weather type';
    if (!formData.soilType) newErrors.soilType = 'Please select soil type';
    if (!formData.plantStatus) newErrors.plantStatus = 'Please select plant status';
    if (!photo) newErrors.photo = 'Please upload a photo';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      alert('Please fill in all required fields and upload a photo.');
      return;
    }

    setLoading(true);
    try {
      const reportData = {
        farmId: formData.farmId,
        photoUrl: photo.url, // In a real app, this would be the uploaded URL
        photoCaption: photo.caption,
        weatherType: formData.weatherType,
        soilType: formData.soilType,
        plantStatus: formData.plantStatus,
        additionalNotes: formData.additionalNotes
      };

      const response = await createFarmCondition(reportData);
      if (response.success) {
        onSuccess(response.data);
      } else {
        alert(`Failed to create report: ${response.msg}`);
      }
    } catch (error) {
      console.error('Error creating farm condition report:', error);
      alert(`Error creating report: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'urgent':
      case 'high':
        return <AlertTriangle className="w-5 h-5" />;
      case 'medium':
        return <Lightbulb className="w-5 h-5" />;
      case 'low':
        return <CheckCircle className="w-5 h-5" />;
      default:
        return <Lightbulb className="w-5 h-5" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={onCancel} 
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Reports
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Create Farm Condition Report</h1>
      </div>

      {/* Farm Selection */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Farm Selection</h2>
        {farms.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Farms Available</h3>
            <p className="text-gray-500 mb-4">You need to add a farm before creating condition reports.</p>
            <button
              type="button"
              onClick={handleAddFarmClick}
              className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add New Farm
            </button>
          </div>
        ) : (
          <div>
            <label htmlFor="farmId" className="block text-sm font-medium text-gray-700 mb-2">
              Select Farm <span className="text-red-500">*</span>
            </label>
            <select
              id="farmId"
              value={formData.farmId}
              onChange={(e) => handleInputChange('farmId', e.target.value)}
              className={`w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm ${
                errors.farmId ? 'border-red-500' : ''
              }`}
            >
              <option value="">Select a farm</option>
              {farms.map((farm) => (
                <option key={farm._id} value={farm._id}>
                  {farm.name}
                </option>
              ))}
            </select>
            {errors.farmId && <p className="mt-1 text-sm text-red-600">{errors.farmId}</p>}
            <div className="mt-3">
              <button
                type="button"
                onClick={handleAddFarmClick}
                className="text-sm text-teal-600 hover:text-teal-800 transition-colors"
              >
                + Add another farm
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Photo Upload */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <FarmPhotoUpload photo={photo} onPhotoChange={setPhoto} />
        {errors.photo && <p className="mt-1 text-sm text-red-600">{errors.photo}</p>}
      </div>

      {/* Condition Details */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Condition Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="weatherType" className="block text-sm font-medium text-gray-700 mb-2">
              Weather Type <span className="text-red-500">*</span>
            </label>
            <select
              id="weatherType"
              value={formData.weatherType}
              onChange={(e) => handleInputChange('weatherType', e.target.value)}
              className={`w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm ${
                errors.weatherType ? 'border-red-500' : ''
              }`}
            >
              <option value="">Select weather</option>
              <option value="sunny">Sunny</option>
              <option value="cloudy">Cloudy</option>
              <option value="rainy">Rainy</option>
              <option value="stormy">Stormy</option>
              <option value="foggy">Foggy</option>
              <option value="windy">Windy</option>
            </select>
            {errors.weatherType && <p className="mt-1 text-sm text-red-600">{errors.weatherType}</p>}
          </div>

          <div>
            <label htmlFor="soilType" className="block text-sm font-medium text-gray-700 mb-2">
              Soil Type <span className="text-red-500">*</span>
            </label>
            <select
              id="soilType"
              value={formData.soilType}
              onChange={(e) => handleInputChange('soilType', e.target.value)}
              className={`w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm ${
                errors.soilType ? 'border-red-500' : ''
              }`}
            >
              <option value="">Select soil type</option>
              <option value="sandy">Sandy</option>
              <option value="loamy">Loamy</option>
              <option value="clay">Clay</option>
              <option value="silt">Silt</option>
              <option value="chalky">Chalky</option>
              <option value="peaty">Peaty</option>
            </select>
            {errors.soilType && <p className="mt-1 text-sm text-red-600">{errors.soilType}</p>}
          </div>

          <div>
            <label htmlFor="plantStatus" className="block text-sm font-medium text-gray-700 mb-2">
              Plant Status <span className="text-red-500">*</span>
            </label>
            <select
              id="plantStatus"
              value={formData.plantStatus}
              onChange={(e) => handleInputChange('plantStatus', e.target.value)}
              className={`w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm ${
                errors.plantStatus ? 'border-red-500' : ''
              }`}
            >
              <option value="">Select plant status</option>
              <option value="healthy">Healthy</option>
              <option value="stressed">Stressed</option>
              <option value="diseased">Diseased</option>
              <option value="pest_infested">Pest Infested</option>
              <option value="nutrient_deficient">Nutrient Deficient</option>
              <option value="overwatered">Overwatered</option>
              <option value="underwatered">Underwatered</option>
            </select>
            {errors.plantStatus && <p className="mt-1 text-sm text-red-600">{errors.plantStatus}</p>}
          </div>
        </div>

        <div className="mt-4">
          <label htmlFor="additionalNotes" className="block text-sm font-medium text-gray-700 mb-2">
            Additional Notes
          </label>
          <textarea
            id="additionalNotes"
            rows="4"
            value={formData.additionalNotes}
            onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
            onFocus={(e) => {
              e.target.style.caretColor = '#059669';
              e.target.style.borderColor = '#059669';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#d1d5db';
            }}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 focus:ring-2 focus:ring-opacity-50 sm:text-sm resize-none"
            placeholder="Any additional observations or notes about the farm condition..."
          ></textarea>
        </div>
      </div>

      {/* AI Suggestions Preview */}
      {formData.weatherType && formData.soilType && formData.plantStatus && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">AI Suggestions Preview</h2>
          <div className="bg-gradient-to-r from-teal-50 to-green-50 rounded-lg p-4 border border-teal-200">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-5 h-5 text-teal-600" />
              <h3 className="font-semibold text-teal-800">Based on your inputs, AI suggests:</h3>
            </div>
            
            {/* This would be populated with actual AI suggestions after form submission */}
            <div className="space-y-2 text-sm text-teal-700">
              <p>• Weather: {formData.weatherType}</p>
              <p>• Soil: {formData.soilType}</p>
              <p>• Plants: {formData.plantStatus}</p>
              <p className="text-xs text-teal-600 mt-2">
                Submit the report to get detailed AI recommendations and action plan.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
          {loading ? 'Submitting...' : 'Submit Report'}
        </button>
      </div>
    </div>
  );
}
