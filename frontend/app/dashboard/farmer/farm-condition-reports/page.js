'use client';

import ConfirmDialog from '@/app/components/ConfirmDialog';
import FarmConditionForm from '@/app/components/FarmConditionForm';
import { useToast } from '@/app/components/ToastProvider';
import {
    deleteFarmCondition,
    getFarmConditionStats,
    getFarmerFarmConditions,
    updateFarmConditionStatus
} from '@/lib/api';
import {
    AlertTriangle,
    CheckCircle,
    Clock,
    DollarSign,
    Eye,
    Lightbulb,
    Plus,
    Trash2,
    TrendingDown,
    TrendingUp,
    X
} from 'lucide-react';
import { useEffect, useState } from 'react';

export default function FarmConditionReportsPage() {
  const [showForm, setShowForm] = useState(false);
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const toast = useToast();

  useEffect(() => {
    loadReports();
    loadStats();
  }, [currentPage]);

  const loadReports = async () => {
    try {
      const data = await getFarmerFarmConditions({ page: currentPage, limit: 10 });
      setReports(data.docs || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error('Error loading reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const data = await getFarmConditionStats();
      setStats(data.stats);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleReportSuccess = (newReport) => {
    setReports(prev => [newReport, ...prev]);
    setShowForm(false);
    loadStats();
  };

  const handleStatusUpdate = async (reportId, newStatus) => {
    try {
      await updateFarmConditionStatus(reportId, newStatus);
      setReports(prev => 
        prev.map(report => 
          report._id === reportId 
            ? { ...report, status: newStatus }
            : report
        )
      );
      loadStats();
      toast.success('Status updated');
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleDeleteReport = async (reportId) => {
    try {
      await deleteFarmCondition(reportId);
      setReports(prev => prev.filter(report => report._id !== reportId));
      loadStats();
      toast.success('Report deleted');
    } catch (error) {
      console.error('Error deleting report:', error);
      toast.error('Failed to delete report');
    }
  };
  const openConfirmDelete = (id) => setConfirmDeleteId(id);
  const closeConfirmDelete = () => setConfirmDeleteId(null);
  const confirmDelete = async () => {
    const id = confirmDeleteId;
    closeConfirmDelete();
    if (id) await handleDeleteReport(id);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'ignored': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlantStatusColor = (status) => {
    switch (status) {
      case 'healthy': return 'text-green-600';
      case 'stressed': return 'text-yellow-600';
      case 'diseased':
      case 'pest_infested':
      case 'nutrient_deficient':
      case 'overwatered':
      case 'underwatered':
        return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (showForm) {
    return (
      <FarmConditionForm
        farmerId="current-farmer-id"
        onCancel={() => setShowForm(false)}
        onSuccess={handleReportSuccess}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Farm Condition Reports</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Report
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Reports</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalReports || 0}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Urgent</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.urgentReports || 0}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">High Priority</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.highPriorityReports || 0}</p>
            </div>
            <TrendingDown className="w-8 h-8 text-orange-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.completedReports || 0}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.pendingReports || 0}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Reports</h2>
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading reports...</p>
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-8">
            <Lightbulb className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No reports yet. Create your first farm condition report!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden">
                    <img 
                      src={report.photo?.url || '/placeholder-farm.jpg'} 
                      alt="Farm condition" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                                         <p className="font-medium text-gray-900">
                       {report.farm?.name || 'Farm Report'}
                     </p>
                    <p className="text-sm text-gray-500">
                      {new Date(report.reportDate).toLocaleDateString()}
                    </p>
                    <p className={`text-sm ${getPlantStatusColor(report.plantStatus)}`}>
                      {report.plantStatus.replace('_', ' ')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex gap-2 mb-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(report.status)}`}>
                      {report.status.replace('_', ' ')}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(report.aiSuggestions?.priority)}`}>
                      {report.aiSuggestions?.priority}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedReport(report)}
                      className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4 text-gray-600" />
                    </button>
                    <select
                      value={report.status}
                      onChange={(e) => handleStatusUpdate(report._id, e.target.value)}
                      className="text-xs border border-gray-300 rounded px-2 py-1"
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="ignored">Ignored</option>
                    </select>
                    <button
                      onClick={() => openConfirmDelete(report._id)}
                      className="p-2 rounded-full bg-red-100 hover:bg-red-200 transition-colors"
                      title="Delete Report"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-3 py-1 text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Report Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 relative">
            <button
              onClick={() => setSelectedReport(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Report Details</h2>

            <div className="space-y-4">
              {/* Photo */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Farm Photo</h3>
                <img 
                  src={selectedReport.photo?.url || '/placeholder-farm.jpg'} 
                  alt="Farm condition" 
                  className="w-full h-64 object-cover rounded-lg"
                />
                {selectedReport.photo?.caption && (
                  <p className="text-sm text-gray-600 mt-2">{selectedReport.photo.caption}</p>
                )}
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Basic Information</h3>
                  <div className="space-y-2 text-sm">
                                         <p><strong>Farm:</strong> {selectedReport.farm?.name || 'N/A'}</p>
                    <p><strong>Date:</strong> {new Date(selectedReport.reportDate).toLocaleDateString()}</p>
                    <p><strong>Weather:</strong> {selectedReport.weatherType}</p>
                    <p><strong>Soil:</strong> {selectedReport.soilType}</p>
                    <p><strong>Plant Status:</strong> {selectedReport.plantStatus.replace('_', ' ')}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Status & Priority</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Status:</strong> 
                      <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getStatusColor(selectedReport.status)}`}>
                        {selectedReport.status.replace('_', ' ')}
                      </span>
                    </p>
                    <p><strong>Priority:</strong> 
                      <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getPriorityColor(selectedReport.aiSuggestions?.priority)}`}>
                        {selectedReport.aiSuggestions?.priority}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* AI Suggestions */}
              {selectedReport.aiSuggestions && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">AI Recommendations</h3>
                  <div className="bg-gradient-to-r from-teal-50 to-green-50 rounded-lg p-4 border border-teal-200">
                    <div className="flex items-center gap-2 mb-3">
                      <Lightbulb className="w-5 h-5 text-teal-600" />
                      <h4 className="font-semibold text-teal-800">AI Analysis</h4>
                    </div>
                    <p className="text-sm text-teal-700 mb-3">{selectedReport.aiSuggestions.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <h5 className="font-medium text-teal-800 mb-1">Recommendations</h5>
                        <ul className="space-y-1 text-teal-700">
                          {selectedReport.aiSuggestions.recommendations?.map((rec, index) => (
                            <li key={index} className="capitalize">• {rec.replace('_', ' ')}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium text-teal-800 mb-1">Timeline</h5>
                        <p className="text-teal-700 capitalize">{selectedReport.aiSuggestions.timeToImplement?.replace('_', ' ')}</p>
                      </div>
                      <div>
                        <h5 className="font-medium text-teal-800 mb-1">Estimated Cost</h5>
                        <div className="flex items-center gap-1 text-teal-700">
                          <DollarSign className="w-4 h-4" />
                          <span>{selectedReport.aiSuggestions.estimatedCost || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Additional Notes */}
              {selectedReport.additionalNotes && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Additional Notes</h3>
                  <p className="text-gray-700">{selectedReport.additionalNotes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Delete report confirmation */}
      <ConfirmDialog
        open={!!confirmDeleteId}
        title="Delete report?"
        description="This will permanently remove the report."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={closeConfirmDelete}
      />
    </div>
  );
}
