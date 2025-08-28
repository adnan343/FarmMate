"use client";

import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';

export default function PlantingCalendarPage() {
  const [user, setUser] = useState(null);
  const [farms, setFarms] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [crops, setCrops] = useState([]);
  const [selectedCropId, setSelectedCropId] = useState('');
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);

  const [viewDate, setViewDate] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });
  const [selectedDate, setSelectedDate] = useState(null);
  const [showTasks, setShowTasks] = useState(false);

  const monthName = useMemo(() => viewDate.toLocaleString('default', { month: 'long', year: 'numeric' }), [viewDate]);
  const startOfMonth = useMemo(() => new Date(viewDate.getFullYear(), viewDate.getMonth(), 1), [viewDate]);
  const endOfMonth = useMemo(() => new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0), [viewDate]);
  const startWeekday = useMemo(() => (startOfMonth.getDay() + 6) % 7, [startOfMonth]); // Monday=0
  const daysInMonth = useMemo(() => endOfMonth.getDate(), [endOfMonth]);

  const calendarCells = useMemo(() => {
    const cells = [];
    for (let i = 0; i < startWeekday; i += 1) {
      const date = new Date(startOfMonth);
      date.setDate(date.getDate() - (startWeekday - i));
      cells.push({ date, inCurrentMonth: false });
    }
    for (let d = 1; d <= daysInMonth; d += 1) {
      cells.push({ date: new Date(viewDate.getFullYear(), viewDate.getMonth(), d), inCurrentMonth: true });
    }
    while (cells.length < 42) {
      const last = cells[cells.length - 1].date;
      const next = new Date(last);
      next.setDate(next.getDate() + 1);
      cells.push({ date: next, inCurrentMonth: next.getMonth() === viewDate.getMonth() });
    }
    return cells;
  }, [startWeekday, startOfMonth, daysInMonth, viewDate]);

  const cropsForSelectedFarm = useMemo(() => {
    return crops.filter(c => !selectedFarm || c.farm._id === selectedFarm._id);
  }, [crops, selectedFarm]);

  const addMonths = (base, delta) => {
    const d = new Date(base);
    d.setMonth(d.getMonth() + delta);
    d.setDate(1);
    return d;
  };

  const ymd = (d) => {
    if (!d) return '';
    // Handle both Date objects and date strings
    let dd;
    if (d instanceof Date) {
      dd = d;
    } else {
      // For date strings, create date in local timezone to avoid timezone shifts
      const [year, month, day] = d.split('-').map(Number);
      dd = new Date(year, month - 1, day);
    }
    const y = dd.getFullYear();
    const m = String(dd.getMonth() + 1).padStart(2, '0');
    const day = String(dd.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const occursOn = (task, cellDate) => {
    const c = ymd(cellDate);
    if (task.dueDate) {
      const taskDueYmd = ymd(task.dueDate);
      const matches = taskDueYmd === c;
      if (matches) {
        console.log(`Task "${task.title}" matches due date:`, { taskDueYmd, cellDate: c, task });
      }
      return matches;
    }
    const s = task.startDate ? new Date(task.startDate) : null;
    const e = task.endDate ? new Date(task.endDate) : null;
    if (s && e) {
      // Compare dates using ymd to avoid timezone issues
      const startYmd = ymd(s);
      const endYmd = ymd(e);
      const cellYmd = ymd(cellDate);
      const matches = startYmd <= cellYmd && cellYmd <= endYmd;
      if (matches) {
        console.log(`Task "${task.title}" matches date range:`, { startYmd, endYmd, cellDate: cellYmd, task });
      }
      return matches;
    }
    if (s && !e) {
      const startYmd = ymd(s);
      const matches = startYmd === c;
      if (matches) {
        console.log(`Task "${task.title}" matches start date:`, { startYmd, cellDate: c, task });
      }
      return matches;
    }
    return false;
  };

  const categoryStyle = (cat) => {
    switch (cat) {
      case 'watering':
      case 'irrigation':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'fertilizing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'weeding':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'pest_control':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'harvest':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'planting':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  useEffect(() => {
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
      return null;
    };
    const userId = getCookie('userId');
    const role = getCookie('role');
    const userName = getCookie('userName');
    const userEmail = getCookie('userEmail');
    if (userId) {
      setUser({ _id: userId, role, name: userName, email: userEmail });
      fetchFarms(userId);
      fetchCrops(userId);
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedFarm && crops.length > 0) {
      const firstCrop = crops.find(c => c.farm._id === selectedFarm._id) || crops[0];
      if (firstCrop) setSelectedCropId(firstCrop._id);
    }
  }, [selectedFarm, crops]);

  const fetchTimeline = useCallback(async (cropId) => {
    const res = await fetch(`https://farmmate-production.up.railway.app/api/crops/${cropId}/timeline`, { credentials: 'include' });
    const data = await res.json();
    if (data.success) {
      console.log('Timeline data:', data.data);
      // Log the selected crop's planting date for debugging
      const selectedCrop = crops.find(c => c._id === selectedCropId);
      if (selectedCrop) {
        console.log('Selected crop planting date:', selectedCrop.plantingDate);
        console.log('Selected crop planting date (parsed):', new Date(selectedCrop.plantingDate));
      }
      setTimeline(data.data);
    }
  }, [crops, selectedCropId]);

  useEffect(() => {
    if (selectedCropId) fetchTimeline(selectedCropId);
  }, [selectedCropId, fetchTimeline]);

  const fetchFarms = async (farmerId) => {
    try {
      const res = await fetch(`https://farmmate-production.up.railway.app/api/farms/farmer/${farmerId}`, { credentials: 'include' });
      const data = await res.json();
      if (data.success) {
        setFarms(data.data);
        if (data.data.length > 0) setSelectedFarm(data.data[0]);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchCrops = async (farmerId) => {
    const res = await fetch(`https://farmmate-production.up.railway.app/api/crops/farmer/${farmerId}`, { credentials: 'include' });
    const data = await res.json();
    if (data.success) setCrops(data.data);
  };

  const toggleComplete = async (index) => {
    const current = timeline[index];
    const res = await fetch(`https://farmmate-production.up.railway.app/api/crops/${selectedCropId}/timeline/${index}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ completed: !current.completed })
    });
    const data = await res.json();
    if (data.success) setTimeline(data.data);
  };

  const deleteItem = async (index) => {
    const res = await fetch(`https://farmmate-production.up.railway.app/api/crops/${selectedCropId}/timeline/${index}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    const data = await res.json();
    if (data.success) setTimeline(data.data);
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setShowTasks(true);
  };

  const closeTasksView = () => {
    setShowTasks(false);
    setSelectedDate(null);
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Planting Calendar</h1>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          {farms.length > 0 && (
            <select className="border rounded px-3 py-2 text-sm sm:text-base" value={selectedFarm?._id || ''} onChange={(e)=>{
              const f = farms.find(x=>x._id===e.target.value); setSelectedFarm(f);
            }}>
              {farms.map(f=> <option key={f._id} value={f._id}>{f.name}</option>)}
            </select>
          )}
          {cropsForSelectedFarm.length > 0 && (
            <select className="border rounded px-3 py-2 text-sm sm:text-base" value={selectedCropId} onChange={(e)=>setSelectedCropId(e.target.value)}>
              {cropsForSelectedFarm.map(c=> (
                <option key={c._id} value={c._id}>{c.name} - {c.variety}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {selectedFarm && cropsForSelectedFarm.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8 text-center">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">No crops found for this farm</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">Add a crop in your Farm Profile to start planning tasks on the calendar.</p>
          <Link href="/dashboard/farmer/farm-profile" className="inline-block bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors">
            Go to Farm Profile
          </Link>
        </div>
      )}

      {/* Calendar */}
      {cropsForSelectedFarm.length > 0 && (
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <button className="p-2 rounded border" onClick={()=>setViewDate(prev=>addMonths(prev, -1))}><ChevronLeft className="w-4 h-4"/></button>
            <button className="p-2 rounded border text-sm" onClick={()=>setViewDate(new Date(new Date().getFullYear(), new Date().getMonth(), 1))}>Today</button>
            <button className="p-2 rounded border" onClick={()=>setViewDate(prev=>addMonths(prev, 1))}><ChevronRight className="w-4 h-4"/></button>
          </div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">{monthName}</h2>
          <div className="text-sm text-gray-500">Tasks: {timeline.length}</div>
        </div>

        <div className="grid grid-cols-7 text-xs font-medium text-gray-500 mb-2">
          {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => (
            <div key={d} className="px-1 sm:px-2 py-1">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-px bg-gray-200 rounded overflow-hidden">
          {calendarCells.map((cell, idx) => {
            const dayTasks = timeline.filter(t => occursOn(t, cell.date));
            const isToday = ymd(cell.date) === ymd(new Date());
            return (
              <div key={idx} className={`min-h-20 sm:min-h-28 bg-white p-1 sm:p-2 ${cell.inCurrentMonth ? '' : 'bg-gray-50'}`}>
                <div className="flex items-center justify-between">
                  <button
                    className={`text-xs px-1 sm:px-2 py-1 rounded ${isToday ? 'bg-teal-600 text-white' : 'text-gray-700'} hover:bg-gray-100 cursor-pointer`}
                    onClick={() => handleDateClick(cell.date)}
                    title="Click to view tasks for this day"
                  >
                    {cell.date.getDate()}
                  </button>
                </div>
                <div className="mt-1 sm:mt-2 space-y-0.5 sm:space-y-1">
                  {dayTasks.slice(0, 2).map((t, i) => (
                    <div key={i} className={`text-[10px] sm:text-[11px] border rounded px-1 py-0.5 ${categoryStyle(t.category)} ${t.completed ? 'opacity-60 line-through' : ''}`}
                      title={`${t.title}\n${t.description || ''}`}
                    >
                      <span className="truncate">{t.title}</span>
                    </div>
                  ))}
                  {dayTasks.length > 2 && (
                    <div className="text-[10px] sm:text-[11px] text-gray-500">+{dayTasks.length - 2} more</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      )}

      {/* Tasks View Modal */}
      {showTasks && selectedDate && (
        <div className="fixed inset-0 z-50 p-4">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowTasks(false)} />
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white rounded-xl w-full max-w-lg p-4 sm:p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                {selectedDate ? `Tasks for ${selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}` : 'Tasks for Selected Date'}
              </h3>
              <button 
                onClick={closeTasksView} 
                className="p-2 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-700"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5"/>
              </button>
            </div>
            
            <div className="space-y-3">
              {selectedDate && timeline.filter(t => occursOn(t, selectedDate)).length > 0 ? (
                timeline.filter(t => occursOn(t, selectedDate)).map((task, index) => (
                  <div key={index} className={`border rounded-lg p-3 ${categoryStyle(task.category)}`}>
                    <h4 className="font-medium mb-2 text-gray-900 text-sm sm:text-base">
                      {task.title}
                    </h4>
                    {task.description ? (
                      <p className="text-xs sm:text-sm text-gray-600">{task.description}</p>
                    ) : (
                      <p className="text-xs sm:text-sm text-gray-500 italic">No description available</p>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-8">
                  {selectedDate ? 'No tasks scheduled for this date' : 'Select a date to view tasks'}
                </div>
              )}
            </div>
          </div>
        </div>
      )}


    </div>
  );
}