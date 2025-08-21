"use client";
import { ArrowLeft, Check, CheckCircle, Clock, Edit, MessageCircle, Reply, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export default function AdminQAPage() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [answeringQuestion, setAnsweringQuestion] = useState(null);
  const [editingAnswer, setEditingAnswer] = useState(null);
  const [deleting, setDeleting] = useState({});
  const [answerText, setAnswerText] = useState("");
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [selectedFarmerId, setSelectedFarmerId] = useState(null);

  useEffect(() => {
    fetchQuestions();
    getCurrentAdmin();
  }, []);

  const getCurrentAdmin = () => {
    const cookies = document.cookie.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=');
      acc[key] = value;
      return acc;
    }, {});
    setCurrentAdmin(cookies.userId);
  };

  const fetchQuestions = async () => {
    setLoading(true);
    const res = await fetch("http://localhost:5000/api/qa/admin", { credentials: "include" });
    const data = await res.json();
    if (data.success) setQuestions(data.data);
    setLoading(false);
  };

  const handleAnswerQuestion = async (questionId) => {
    if (!answerText.trim()) return;
    const res = await fetch(`http://localhost:5000/api/qa/${questionId}/answer`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ answer: answerText }),
    });
    if (res.ok) {
      setAnsweringQuestion(null);
      setAnswerText("");
      fetchQuestions();
    } else {
      alert("Failed to answer question");
    }
  };

  const handleEditAnswer = async (questionId, updatedAnswer) => {
    const res = await fetch(`http://localhost:5000/api/qa/${questionId}/answer/edit`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ answer: updatedAnswer }),
    });
    if (res.ok) {
      setEditingAnswer(null);
      fetchQuestions();
    } else {
      alert("Failed to edit answer");
    }
  };

  const handleDeleteAnswer = async (questionId) => {
    if (!confirm("Are you sure you want to delete this answer?")) return;
    setDeleting({ ...deleting, [questionId]: true });
    const res = await fetch(`http://localhost:5000/api/qa/${questionId}/answer`, {
      method: "DELETE",
      credentials: "include",
    });
    setDeleting({ ...deleting, [questionId]: false });
    if (res.ok) fetchQuestions();
    else alert("Failed to delete answer");
  };

  const farmers = useMemo(() => {
    const map = new Map();
    for (const qa of questions) {
      const farmer = qa.farmer || {};
      const id = farmer._id || farmer.id;
      if (!id) continue;
      if (!map.has(id)) {
        map.set(id, {
          id,
          name: farmer.name || "Unknown",
          email: farmer.email || "",
          questions: [],
        });
      }
      map.get(id).questions.push(qa);
    }
    return Array.from(map.values());
  }, [questions]);

  const selectedFarmer = useMemo(
    () => farmers.find((f) => f.id === selectedFarmerId) || null,
    [farmers, selectedFarmerId]
  );

  const sourceQuestions = selectedFarmer ? selectedFarmer.questions : [];
  const unanswered = sourceQuestions.filter(q => q.status !== 'answered');
  const answered = sourceQuestions.filter(q => q.status === 'answered');

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Q&A Management</h1>

      {!selectedFarmer && (
        <div className="bg-white rounded shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Farmers with Questions</h2>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : farmers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No questions have been asked yet.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {farmers.map((farmer) => {
                const total = farmer.questions.length;
                const a = farmer.questions.filter(q => q.status === 'answered').length;
                const p = total - a;
                return (
                  <button
                    key={farmer.id}
                    onClick={() => setSelectedFarmerId(farmer.id)}
                    className="text-left border rounded-lg p-4 hover:shadow focus:outline-none focus:ring"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-gray-900">{farmer.name}</div>
                        <div className="text-sm text-gray-600">{farmer.email}</div>
                      </div>
                      <div className="text-sm text-gray-500">{total} question{total !== 1 ? 's' : ''}</div>
                    </div>
                    <div className="mt-3 flex items-center gap-3 text-xs">
                      <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-800">Pending: {p}</span>
                      <span className="px-2 py-1 rounded bg-green-100 text-green-800">Answered: {a}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {selectedFarmer && (
        <>
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => setSelectedFarmerId(null)}
              className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4" /> Back to farmers
            </button>
          </div>

          <div className="bg-white rounded shadow p-6 mb-8">
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Questions from {selectedFarmer.name}</h2>
              <div className="text-sm text-gray-600">{selectedFarmer.email}</div>
            </div>
            <h3 className="text-md font-semibold mb-4">Unanswered Questions</h3>
            {loading ? (
              <div className="text-center py-8">Loading questions...</div>
            ) : unanswered.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No unanswered questions.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {unanswered.map((qa) => (
                  <div key={qa._id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-yellow-600" />
                        <span className="px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-800">Pending</span>
                        <span className="text-xs text-gray-500">{new Date(qa.createdAt).toLocaleDateString()}</span>
                      </div>
                      <button
                        onClick={() => setAnsweringQuestion(qa)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <Reply className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="mb-3">
                      <h4 className="font-semibold text-gray-900 mb-2">Question:</h4>
                      <p className="text-gray-700 whitespace-pre-line">{qa.question}</p>
                    </div>
                    {answeringQuestion?._id === qa._id && (
                      <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                        <h5 className="font-semibold text-blue-900 mb-2">Answer:</h5>
                        <textarea
                          value={answerText}
                          onChange={(e) => setAnswerText(e.target.value)}
                          className="border rounded p-2 w-full mb-2"
                          rows="4"
                          placeholder="Write your answer here..."
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAnswerQuestion(qa._id)}
                            className="bg-green-600 text-white px-3 py-1 rounded text-sm"
                          >
                            <Check className="w-4 h-4 inline mr-1" />
                            Submit Answer
                          </button>
                          <button
                            onClick={() => {
                              setAnsweringQuestion(null);
                              setAnswerText("");
                            }}
                            className="bg-gray-600 text-white px-3 py-1 rounded text-sm"
                          >
                            <X className="w-4 h-4 inline mr-1" />
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded shadow p-6">
            <h3 className="text-md font-semibold mb-4">Answered Questions</h3>
            {loading ? (
              <div className="text-center py-8">Loading questions...</div>
            ) : answered.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No answered questions yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {answered.map((qa) => (
                  <div key={qa._id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-800">Answered</span>
                        <span className="text-xs text-gray-500">{new Date(qa.createdAt).toLocaleDateString()}</span>
                      </div>
                      {qa.admin?._id === currentAdmin && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingAnswer(qa)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteAnswer(qa._id)}
                            disabled={deleting[qa._id]}
                            className="text-red-600 hover:text-red-800"
                          >
                            {deleting[qa._id] ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="mb-3">
                      <h4 className="font-semibold text-gray-900 mb-2">Question:</h4>
                      <p className="text-gray-700 whitespace-pre-line">{qa.question}</p>
                    </div>
                    {editingAnswer?._id === qa._id ? (
                      <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                        <h5 className="font-semibold text-blue-900 mb-2">Edit Answer:</h5>
                        <textarea
                          value={editingAnswer.answer}
                          onChange={(e) => setEditingAnswer({...editingAnswer, answer: e.target.value})}
                          className="border rounded p-2 w-full mb-2"
                          rows="4"
                          placeholder="Edit your answer here..."
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditAnswer(qa._id, editingAnswer.answer)}
                            className="bg-green-600 text-white px-3 py-1 rounded text-sm"
                          >
                            <Check className="w-4 h-4 inline mr-1" />
                            Save
                          </button>
                          <button
                            onClick={() => setEditingAnswer(null)}
                            className="bg-gray-600 text-white px-3 py-1 rounded text-sm"
                          >
                            <X className="w-4 h-4 inline mr-1" />
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : qa.answer ? (
                      <div className="bg-green-50 border-l-4 border-green-400 p-4">
                        <h5 className="font-semibold text-green-900 mb-2">Answer:</h5>
                        <p className="text-green-800 whitespace-pre-line">{qa.answer}</p>
                        <div className="mt-2 text-sm text-green-600">
                          Answered by {qa.admin?.name || 'Admin'} on {new Date(qa.answeredAt).toLocaleDateString()}
                        </div>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}