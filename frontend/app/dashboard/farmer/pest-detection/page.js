"use client";

import { AlertTriangle, Camera, CheckCircle, Clock, FileImage, Search, Sparkles, Upload, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function PestDetectionPage() {
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [previewSrc, setPreviewSrc] = useState(null);
  const [analysis, setAnalysis] = useState({ pest: "", remedies: [], treatment: "" });
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedDetection, setSelectedDetection] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch detection history from backend
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch("https://farmmate-production.up.railway.app/api/detections", {
          credentials: 'include'
        });
        if (!res.ok) {
          throw new Error('Failed to fetch history');
        }
        const data = await res.json();
        setHistory(
          data.map((item) => ({
            id: item._id,
            name: item.pest,
            info: item.treatment,
            date: new Date(item.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }),
            time: new Date(item.createdAt).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            status: "Detected",
            image: item.image || null,
            remedies: item.remedies || []
          }))
        );
      } catch (err) {
        console.error("Failed to fetch detection history:", err);
        setError("Failed to load detection history");
      }
    };
    fetchHistory();
  }, []);

  const handleButtonClick = () => fileInputRef.current.click();

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError("Please select a valid image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB");
      return;
    }

    setError("");
    setPreviewSrc(URL.createObjectURL(file));
    setIsAnalyzing(true);
    setAnalysis({ pest: "", remedies: [], treatment: "" });

    const formDataAI = new FormData();
    formDataAI.append("image", file);

    try {
      // Step 1: AI Analysis
      const response = await fetch("https://farmmate-production.up.railway.app/api/pest-analyze", {
        method: "POST",
        body: formDataAI,
      });

      if (!response.ok) throw new Error("AI analysis failed");
      const data = await response.json();
      const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No analysis text returned.";

      // Parse AI response
      const pestMatch = aiText.match(/\*\*1\. Detected Pest:\*\*(.*?)(?=\n\n|\*\*2)/s);
      const remediesMatch = aiText.match(/\*\*2\. Remedies:\*\*\n([\s\S]*?)(?=\n\n\*\*3|$)/);
      const treatmentMatch = aiText.match(/\*\*3\. Suggested Treatment:\*\*\n([\s\S]*)/);

      const newAnalysis = {
        pest: pestMatch ? pestMatch[1].trim() : "Not specified",
        remedies: remediesMatch
          ? remediesMatch[1].split(/\n\* /).map((r) => r.replace(/\*/g, "").trim()).filter(Boolean)
          : [],
        treatment: treatmentMatch ? treatmentMatch[1].trim() : "Not specified",
      };

      setAnalysis(newAnalysis);

      // Step 2: Save Detection to DB
      const formDataDB = new FormData();
      formDataDB.append("image", file);
      formDataDB.append("pest", newAnalysis.pest);
      formDataDB.append("remedies", JSON.stringify(newAnalysis.remedies));
      formDataDB.append("treatment", newAnalysis.treatment);

      const saveRes = await fetch("https://farmmate-production.up.railway.app/api/detections", {
        method: "POST",
        body: formDataDB,
        credentials: 'include'
      });
      
      if (!saveRes.ok) {
        throw new Error("Failed to save detection");
      }
      
      const savedItem = await saveRes.json();

      // Update local history immediately
      const formattedDate = new Date(savedItem.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      const formattedTime = new Date(savedItem.createdAt).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });

      setHistory((prev) => [
        { 
          id: savedItem._id,
          name: newAnalysis.pest, 
          info: newAnalysis.treatment, 
          date: formattedDate,
          time: formattedTime,
          status: "Detected",
          image: savedItem.image || null,
          remedies: newAnalysis.remedies
        },
        ...prev,
      ]);
    } catch (error) {
      console.error(error);
      setError("Failed to analyze the image. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearAnalysis = () => {
    setPreviewSrc(null);
    setAnalysis({ pest: "", remedies: [], treatment: "" });
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDetectionClick = (detection) => {
    setSelectedDetection(detection);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedDetection(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header Section */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Search className="w-6 h-6 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Pest Detection
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Upload an image of your crops to detect pests and get AI-powered treatment recommendations
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-center space-y-4">
            {!previewSrc ? (
              <div className="space-y-4">
                <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <Upload className="w-10 h-10 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Crop Image</h3>
                  <p className="text-gray-600 mb-4">Click to upload an image of your crops</p>
                </div>
                <button
                  onClick={handleButtonClick}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Camera className="w-4 h-4 inline mr-2" />
                  Choose Image
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  style={{ display: "none" }} 
                  accept="image/*" 
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative inline-block">
                  <img 
                    src={previewSrc} 
                    alt="Preview" 
                    className="w-48 h-48 object-cover rounded-lg border-2 border-green-200"
                  />
                  <button
                    onClick={clearAnalysis}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    ×
                  </button>
                </div>
                <button
                  onClick={handleButtonClick}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Change Image
                </button>
              </div>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-700">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm">{error}</span>
              </div>
            </div>
          )}

          {/* Analysis Loading */}
          {isAnalyzing && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-blue-700 text-sm">Analyzing image with AI...</span>
              </div>
            </div>
          )}
        </div>

        {/* Analysis Result */}
        {analysis.pest && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h2 className="text-xl font-bold text-gray-900">Analysis Complete</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {/* Detected Pest */}
              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <h3 className="font-semibold text-red-700">Detected Pest</h3>
                </div>
                <p className="text-gray-800">{analysis.pest}</p>
              </div>

              {/* Remedies */}
              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-yellow-600" />
                  <h3 className="font-semibold text-yellow-700">Remedies</h3>
                </div>
                <ul className="space-y-1">
                  {analysis.remedies.map((item, index) => (
                    <li key={index} className="text-gray-800 text-sm flex items-start gap-2">
                      <span className="w-1 h-1 bg-yellow-600 rounded-full mt-2 flex-shrink-0"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Treatment */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  <h3 className="font-semibold text-blue-700">Treatment</h3>
                </div>
                <p className="text-gray-800 text-sm">{analysis.treatment}</p>
              </div>
            </div>
          </div>
        )}

        {/* Detection History */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-600" />
              <h2 className="text-xl font-bold text-gray-900">Detection History</h2>
            </div>
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {history.length} detections
            </span>
          </div>

          {history.length === 0 ? (
            <div className="text-center py-8">
              <FileImage className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No detections yet. Upload an image to get started!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((item, idx) => (
                <div 
                  key={item.id || idx} 
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => handleDetectionClick(item)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.info}</p>
                      
                      {/* Remedies Preview */}
                      {item.remedies && item.remedies.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {item.remedies.slice(0, 3).map((remedy, index) => (
                            <span key={index} className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-md">
                              {remedy.length > 25 ? remedy.substring(0, 25) + '...' : remedy}
                            </span>
                          ))}
                          {item.remedies.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                              +{item.remedies.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {/* Date and Status */}
                    <div className="text-right ml-4 flex-shrink-0">
                      <p className="text-sm font-medium text-gray-900">{item.date}</p>
                      <p className="text-xs text-gray-500 mb-1">{item.time}</p>
                      <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        {item.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal for Detection Details */}
      {showModal && selectedDetection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Detection Details</h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Image */}
              {selectedDetection.image && (
                <div className="mb-4">
                  <img
                    src={`https://farmmate-production.up.railway.app${selectedDetection.image}`}
                    alt={selectedDetection.name}
                    className="w-full h-64 object-cover rounded-lg border border-gray-200"
                  />
                </div>
              )}

              {/* Pest Information */}
              <div className="mb-4">
                <h3 className="font-semibold text-gray-900 mb-2">Detected Pest</h3>
                <p className="text-gray-700">{selectedDetection.name}</p>
              </div>

              {/* Treatment Information */}
              <div className="mb-4">
                <h3 className="font-semibold text-gray-900 mb-2">Treatment Details</h3>
                <p className="text-gray-700">{selectedDetection.info}</p>
              </div>

              {/* All Remedies */}
              {selectedDetection.remedies && selectedDetection.remedies.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Remedies</h3>
                  <ul className="space-y-2">
                    {selectedDetection.remedies.map((remedy, index) => (
                      <li key={index} className="text-gray-700 text-sm flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-yellow-600 rounded-full mt-2 flex-shrink-0"></span>
                        {remedy}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Date and Time */}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Detected on {selectedDetection.date} at {selectedDetection.time}</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                    {selectedDetection.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
