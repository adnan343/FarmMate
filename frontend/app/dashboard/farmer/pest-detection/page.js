"use client";

import { useRef, useState, useEffect } from "react";
import { CheckCircle } from "lucide-react";

export default function PestDetectionPage() {
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [previewSrc, setPreviewSrc] = useState(null);
  const [analysis, setAnalysis] = useState({ pest: "", remedies: [], treatment: "" });
  const [history, setHistory] = useState([]);

  // Fetch detection history from backend
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/detections");
        const data = await res.json();
        setHistory(
          data.map((item) => ({
            name: item.pest,
            info: item.treatment,
            date: new Date(item.createdAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            }),
            status: "New",
            image: item.image || null, // Include image path
          }))
        );
      } catch (err) {
        console.error("Failed to fetch detection history:", err);
      }
    };
    fetchHistory();
  }, []);

  const handleButtonClick = () => fileInputRef.current.click();

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setPreviewSrc(URL.createObjectURL(file));
    setLoading(true);
    setAnalysis({ pest: "", remedies: [], treatment: "" });

    const formDataAI = new FormData();
    formDataAI.append("image", file);

    try {
      // Step 1: AI Analysis
      const response = await fetch("http://localhost:5000/api/pest-analyze", {
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

      const saveRes = await fetch("http://localhost:5000/api/detections", {
        method: "POST",
        body: formDataDB,
      });
      const savedItem = await saveRes.json();

      // Update local history immediately
      const formattedDate = new Date(savedItem.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });

      setHistory((prev) => [
        { 
          name: newAnalysis.pest, 
          info: newAnalysis.treatment, 
          date: formattedDate, 
          status: "New",
          image: savedItem.image || null 
        },
        ...prev,
      ]);
    } catch (error) {
      console.error(error);
      alert("Failed to analyze the image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Pest Detection</h1>
        <button
          className={`bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handleButtonClick}
          disabled={loading}
        >
          {loading ? "Analyzing..." : "Scan for Pests"}
        </button>
        <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: "none" }} accept="image/*" />
      </div>

      {/* Image Preview */}
      {previewSrc && (
        <div className="bg-white rounded-xl shadow-md p-4 w-full max-w-md mx-auto">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Uploaded Image Preview</h2>
          <img src={previewSrc} alt="Uploaded Preview" className="w-full h-auto object-contain rounded-lg border border-gray-200" />
        </div>
      )}

      {/* AI Analysis Result */}
      {analysis.pest && (
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl shadow-lg p-6 border border-green-200 animate-fade-in">
          <div className="flex items-center gap-4 mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-900">Analysis Result</h2>
          </div>

          {/* Detected Pest */}
          <div className="bg-white rounded-xl shadow p-4 mb-4 border-l-4 border-green-500">
            <h3 className="text-lg font-bold text-green-700 mb-2">Detected Pest</h3>
            <p className="text-gray-700">{analysis.pest}</p>
          </div>

          {/* Remedies */}
          <div className="bg-white rounded-xl shadow p-4 mb-4 border-l-4 border-yellow-500">
            <h3 className="text-lg font-bold text-yellow-700 mb-2">Remedies</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {analysis.remedies.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Suggested Treatment */}
          <div className="bg-white rounded-xl shadow p-4 border-l-4 border-blue-500">
            <h3 className="text-lg font-bold text-blue-700 mb-2">Suggested Treatment</h3>
            <p className="text-gray-700">{analysis.treatment}</p>
          </div>
        </div>
      )}

      {/* Detection History */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Detection History</h2>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {history.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-green-600 mt-1" />
                {item.image && (
                  <img
                    src={`http://localhost:5000${item.image}`}
                    alt={item.name}
                    className="w-16 h-16 rounded-lg border border-gray-300 object-cover"
                  />
                )}
                <div>
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-600">{item.info}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">{item.date}</p>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">{item.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
