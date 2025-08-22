'use client';

import { AlertCircle, Calendar, Lightbulb, Loader2, MapPin, RefreshCw, TrendingUp, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { acceptSuggestionAndCreateCrop, generateCropTimeline, getCropSuggestions, getStoredCropSuggestions, refreshCropSuggestions } from '../../../../lib/api';

export default function CropSuggestionsPage() {
  const [suggestions, setSuggestions] = useState([]);
  const [farmInfo, setFarmInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [farms, setFarms] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [accepting, setAccepting] = useState(false);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showAreaErrorModal, setShowAreaErrorModal] = useState(false);
  const [areaErrorMessage, setAreaErrorMessage] = useState('');
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [cropInput, setCropInput] = useState({
    variety: 'General',
    area: 1,
    unit: 'acres',
    plantingDate: '',
    expectedHarvestDate: '',
    estimatedYield: '',
    yieldUnit: 'kg',
    notes: ''
  });
  const [timelinePreview, setTimelinePreview] = useState([]);
  const [genLoading, setGenLoading] = useState(false);

  useEffect(() => {
    fetchUserAndFarms();
  }, []);

  useEffect(() => {
    if (selectedFarm) {
      fetchSuggestions();
    }
  }, [selectedFarm]);

  const fetchUserAndFarms = async () => {
    try {
      // Get user data from cookies
      const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
      };

      const userId = getCookie('userId');
      const userName = getCookie('userName');
      const userEmail = getCookie('userEmail');
      const role = getCookie('role');

      if (userId) {
        const userData = {
          _id: userId,
          name: userName,
          email: userEmail,
          role: role
        };
        setUser(userData);
        
        // Fetch user's farms
        const response = await fetch(`http://localhost:5000/api/farms/farmer/${userId}`, {
          credentials: 'include'
        });
        const data = await response.json();
        if (data.success && data.data.length > 0) {
          setFarms(data.data);
          setSelectedFarm(data.data[0]);
        } else {
          setError('No farms found. Please add a farm first.');
          setLoading(false);
        }
      } else {
        setError('User not authenticated');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching user and farms:', error);
      setError('Failed to load user data');
      setLoading(false);
    }
  };

  const fetchSuggestions = async () => {
    if (!selectedFarm) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // First try to get stored suggestions
      const storedResponse = await getStoredCropSuggestions(selectedFarm._id);
      setSuggestions(storedResponse.data);
      setFarmInfo(storedResponse.farmInfo);
      setLoading(false);
    } catch (error) {
      // If no stored suggestions, get new ones from API
      try {
        const response = await getCropSuggestions(selectedFarm._id);
        setSuggestions(response.data);
        setFarmInfo(response.farmInfo);
      } catch (apiError) {
        console.error('Error fetching suggestions:', apiError);
        setError(apiError.message || 'Failed to fetch crop suggestions');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRefreshSuggestions = async () => {
    if (!selectedFarm) return;
    
    setRefreshing(true);
    setError(null);
    
    try {
      const response = await refreshCropSuggestions(selectedFarm._id);
      setSuggestions(response.data);
      setFarmInfo(response.farmInfo);
    } catch (error) {
      console.error('Error refreshing suggestions:', error);
      setError(error.message || 'Failed to refresh suggestions');
    } finally {
      setRefreshing(false);
    }
  };

  const handleAcceptSuggestion = (suggestion) => {
    setSelectedSuggestion(suggestion);
    setShowAcceptModal(true);
  };

  const handleGenerateTimeline = async () => {
    if (!selectedFarm || !selectedSuggestion) return;
    try {
      setGenLoading(true);
      const payload = {
        suggestion: selectedSuggestion,
        plantingStartDate: cropInput.plantingDate || undefined,
      };
      const res = await generateCropTimeline(selectedFarm._id, payload);
      setTimelinePreview(res.data || []);
    } catch (e) {
      alert(e.message || 'Failed to generate timeline');
    } finally {
      setGenLoading(false);
    }
  };

  const handleConfirmAccept = async () => {
    if (!selectedFarm || !user || !selectedSuggestion) return;
    try {
      setAccepting(true);
      const payload = {
        farmerId: user._id,
        suggestion: selectedSuggestion,
        cropInput,
        timeline: timelinePreview,
      };
      await acceptSuggestionAndCreateCrop(selectedFarm._id, payload);
      setShowAcceptModal(false);
      setSelectedSuggestion(null);
      setTimelinePreview([]);
      alert('Crop created with timeline! You can manage it in Planting Calendar.');
    } catch (e) {
      setAreaErrorMessage(e.message || 'Failed to create crop');
      setShowAreaErrorModal(true);
    } finally {
      setAccepting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
        <span className="ml-2 text-gray-600">Loading crop suggestions...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Crop Suggestions</h1>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <div>
              <h3 className="text-lg font-semibold text-red-800">Error</h3>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Crop Suggestions</h1>
        <div className="flex items-center gap-4">
          {farms.length > 1 && (
            <select
              value={selectedFarm?._id || ''}
              onChange={(e) => {
                const farm = farms.find(f => f._id === e.target.value);
                setSelectedFarm(farm);
              }}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {farms.map(farm => (
                <option key={farm._id} value={farm._id}>
                  {farm.name}
                </option>
              ))}
            </select>
          )}
          <button 
            onClick={handleRefreshSuggestions}
            disabled={refreshing}
            className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {refreshing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            {refreshing ? 'Refreshing...' : 'Get New Suggestions'}
          </button>
        </div>
      </div>

      {/* Farm Info */}
      {farmInfo && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Farm Information</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Location</p>
              <p className="font-medium text-gray-900">{farmInfo.location}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Land Area</p>
              <p className="font-medium text-gray-900">{farmInfo.area}</p>
            </div>
          </div>
        </div>
      )}

      {/* AI Recommendations */}
      <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Lightbulb className="w-6 h-6 text-teal-600" />
          <h2 className="text-xl font-semibold text-gray-900">AI Recommendations</h2>
        </div>
        <p className="text-gray-600 mb-4">
          Based on your farm&apos;s location, soil conditions, and weather patterns, here are our top recommendations for this season.
        </p>
      </div>

      {/* Recommended Crops */}
      {suggestions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {suggestions.map((suggestion, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{suggestion.cropName}</h3>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  Recommended
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-600">Expected yield: {suggestion.expectedYield}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-gray-600">Planting window: {suggestion.plantingWindow}</span>
                </div>
                <div className="text-sm text-gray-600 mt-3">
                  <strong>Why this crop:</strong> {suggestion.reason}
                </div>
              </div>
              <button 
                onClick={() => handleAcceptSuggestion(suggestion)}
                className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Accept Suggestion
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-yellow-600" />
            <div>
              <h3 className="text-lg font-semibold text-yellow-800">No Suggestions Available</h3>
              <p className="text-yellow-700">Click &quot;Get New Suggestions&quot; to generate crop recommendations for your farm.</p>
            </div>
          </div>
        </div>
      )}

      {showAcceptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl w-full max-w-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Accept Suggestion: {selectedSuggestion?.cropName}</h3>
              <button className="p-2" onClick={() => setShowAcceptModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-blue-600 mb-4">✨ AI will automatically predict yield using Gemini API</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-600">Variety</label>
                  <input className="w-full border rounded px-3 py-2" value={cropInput.variety} onChange={(e)=>setCropInput({...cropInput, variety: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm text-gray-600">Area</label>
                    <input type="number" className="w-full border rounded px-3 py-2" value={cropInput.area} onChange={(e)=>setCropInput({...cropInput, area: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Unit</label>
                    <select className="w-full border rounded px-3 py-2" value={cropInput.unit} onChange={(e)=>setCropInput({...cropInput, unit: e.target.value})}>
                      <option value="acres">Acres</option>
                      <option value="hectares">Hectares</option>
                      <option value="square_meters">Square Meters</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm text-gray-600">Planting Date</label>
                    <input type="date" className="w-full border rounded px-3 py-2" value={cropInput.plantingDate} onChange={(e)=>setCropInput({...cropInput, plantingDate: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Expected Harvest</label>
                    <input type="date" className="w-full border rounded px-3 py-2" value={cropInput.expectedHarvestDate} onChange={(e)=>setCropInput({...cropInput, expectedHarvestDate: e.target.value})} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm text-gray-600">Estimated Yield</label>
                    <input type="number" className="w-full border rounded px-3 py-2" value={cropInput.estimatedYield} onChange={(e)=>setCropInput({...cropInput, estimatedYield: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Yield Unit</label>
                    <select className="w-full border rounded px-3 py-2" value={cropInput.yieldUnit} onChange={(e)=>setCropInput({...cropInput, yieldUnit: e.target.value})}>
                      <option value="kg">kg</option>
                      <option value="lb">lb</option>
                      <option value="tons">tons</option>
                      <option value="bushels">bushels</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Notes</label>
                  <textarea className="w-full border rounded px-3 py-2" rows={3} value={cropInput.notes} onChange={(e)=>setCropInput({...cropInput, notes: e.target.value})} />
                </div>
                <div className="flex gap-2">
                  <button onClick={handleGenerateTimeline} disabled={genLoading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    {genLoading ? 'Generating...' : 'Generate Timeline'}
                  </button>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Timeline Preview</h4>
                <div className="max-h-80 overflow-auto space-y-2">
                  {timelinePreview.length === 0 && (
                    <p className="text-sm text-gray-500">No timeline generated yet.</p>
                  )}
                  {timelinePreview.map((t, i) => (
                    <div key={i} className="border rounded p-2">
                      <p className="font-medium">{t.title}</p>
                      <p className="text-xs text-gray-500">{t.category}</p>
                      <p className="text-sm">{t.description}</p>
                      <p className="text-xs text-gray-500">{[t.startDate, t.endDate].filter(Boolean).join(' → ') || t.dueDate || ''}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button className="px-4 py-2 rounded border" onClick={()=>setShowAcceptModal(false)}>Cancel</button>
              <button onClick={handleConfirmAccept} disabled={accepting} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2">
                {accepting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Generating AI Prediction...
                  </>
                ) : (
                  'Save Crop'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Area Error Modal */}
      {showAreaErrorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-2 text-red-700">Area exceeds available land</h2>
            <p className="text-gray-700 mb-4">{areaErrorMessage}</p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowAreaErrorModal(false)}
                className="flex-1 bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Market Analysis */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Market Analysis</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">$2,500</p>
            <p className="text-sm text-gray-600">Rice per ton</p>
            <p className="text-xs text-green-600">+12% from last month</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">$1,800</p>
            <p className="text-sm text-gray-600">Wheat per ton</p>
            <p className="text-xs text-blue-600">+8% from last month</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">$45</p>
            <p className="text-sm text-gray-600">Tomatoes per kg</p>
            <p className="text-xs text-purple-600">+15% from last month</p>
          </div>
        </div>
      </div>

      {/* Seasonal Calendar */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Seasonal Planting Calendar</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Spring</h3>
            <p className="text-sm text-gray-600">Rice, Corn, Vegetables</p>
          </div>
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Summer</h3>
            <p className="text-sm text-gray-600">Cotton, Sugarcane</p>
          </div>
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Autumn</h3>
            <p className="text-sm text-gray-600">Wheat, Barley</p>
          </div>
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Winter</h3>
            <p className="text-sm text-gray-600">Mustard, Peas</p>
          </div>
        </div>
      </div>
    </div>
  );
} 