import React, { useState } from 'react';
import {
  Search, Plus, Play, CheckCircle2, Calendar, Clock, Sparkles, MoreHorizontal, X
} from 'lucide-react';
import { useSprintStore } from '../../store/sprints/sprintStore';
import type { Sprint } from '../../types/sprint';
import { useToast } from '../../hooks/useToast';

interface CustomMeetingItem {
  id: string;
  title: string;
  time: string;
  type: 'Review' | 'Sprint' | '1:1' | 'General';
  typeColor: string;
  day: 'TODAY' | 'TOMORROW';
}

const INITIAL_MEETINGS: CustomMeetingItem[] = [
  {
    id: 'cm-1',
    title: 'School ERP Project',
    time: '6:00 pm',
    type: 'Review',
    typeColor: 'text-red-600',
    day: 'TODAY',
  },
  {
    id: 'cm-2',
    title: 'Meeting with Director',
    time: '8:00 pm',
    type: 'Sprint',
    typeColor: 'text-indigo-600',
    day: 'TODAY',
  },
  {
    id: 'cm-3',
    title: 'Meeting with Design Team',
    time: '3:00 - 3:30 pm',
    type: '1:1',
    typeColor: 'text-orange-600',
    day: 'TOMORROW',
  },
  {
    id: 'cm-4',
    title: 'Meeting with Full Team Management Project',
    time: '5:00 pm',
    type: 'Sprint',
    typeColor: 'text-indigo-600',
    day: 'TOMORROW',
  },
];

export const MeetingsView: React.FC = () => {
  const { sprints, createSprint, startSprint, completeSprint } = useSprintStore();
  const { addToast } = useToast();

  const [searchTitle, setSearchTitle] = useState('');
  const [meetingsList, setMeetingsList] = useState<CustomMeetingItem[]>(INITIAL_MEETINGS);

  // Modals state
  const [showCreateSprintModal, setShowCreateSprintModal] = useState(false);
  const [showStartSprintModal, setShowStartSprintModal] = useState(false);
  const [showCompleteSprintModal, setShowCompleteSprintModal] = useState(false);
  const [showNewMeetingModal, setShowNewMeetingModal] = useState(false);

  // Form states for Create Sprint
  const [sprintName, setSprintName] = useState('');
  const [sprintGoal, setSprintGoal] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Form states for New Meeting
  const [newMeetingTitle, setNewMeetingTitle] = useState('');
  const [newMeetingTime, setNewMeetingTime] = useState('');
  const [newMeetingDay, setNewMeetingDay] = useState<'TODAY' | 'TOMORROW'>('TODAY');
  const [newMeetingType, setNewMeetingType] = useState<'Review' | 'Sprint' | '1:1' | 'General'>('Sprint');

  // Active & Planned Sprints
  const activeSprint = sprints.find((s) => s.status === 'active');
  const plannedSprints = sprints.filter((s) => s.status === 'planned');

  const handleCreateSprint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sprintName.trim()) return;

    createSprint({
      name: sprintName,
      goal: sprintGoal || 'Achieve planned milestone tasks',
      startDate: startDate || new Date().toISOString().split('T')[0],
      endDate: endDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    });

    addToast(`Sprint "${sprintName}" created!`, 'success');
    setSprintName('');
    setSprintGoal('');
    setStartDate('');
    setEndDate('');
    setShowCreateSprintModal(false);
  };

  const handleStartSprintSubmit = (sprintId: string) => {
    startSprint(sprintId);
    addToast('Sprint started successfully!', 'success');
    setShowStartSprintModal(false);
  };

  const handleCompleteSprintSubmit = (sprintId: string) => {
    completeSprint(sprintId);
    addToast('Sprint completed successfully!', 'success');
    setShowCompleteSprintModal(false);
  };

  const handleCreateMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMeetingTitle.trim()) return;

    const colorMap: Record<string, string> = {
      Review: 'text-red-600',
      Sprint: 'text-indigo-600',
      '1:1': 'text-orange-600',
      General: 'text-emerald-600',
    };

    const newItem: CustomMeetingItem = {
      id: `cm-${Date.now()}`,
      title: newMeetingTitle,
      time: newMeetingTime || '4:00 pm',
      type: newMeetingType,
      typeColor: colorMap[newMeetingType] || 'text-indigo-600',
      day: newMeetingDay,
    };

    setMeetingsList((prev) => [...prev, newItem]);
    addToast('New meeting scheduled!', 'success');
    setNewMeetingTitle('');
    setNewMeetingTime('');
    setShowNewMeetingModal(false);
  };

  const filteredMeetings = meetingsList.filter((m) =>
    m.title.toLowerCase().includes(searchTitle.toLowerCase())
  );

  const todayMeetings = filteredMeetings.filter((m) => m.day === 'TODAY');
  const tomorrowMeetings = filteredMeetings.filter((m) => m.day === 'TOMORROW');

  return (
    <div className="space-y-6 font-['Roboto',sans-serif] animate-in fade-in duration-200">
      {/* ─── ACTION BAR (FIGMA SPECIFIC LAYOUT: SEARCH + NEW MEETING + ADD TO CALENDAR / SPRINT ACTIONS) ─── */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search Field (Figma Pink-Beige input) */}
        <div className="w-full md:w-96 h-12 px-4 py-3 bg-[#f2cece]/60 rounded-3xl border-b border-[#e7a8a8] flex items-center gap-2 shadow-sm">
          <Search className="w-5 h-5 text-zinc-500 shrink-0" />
          <input
            type="text"
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
            placeholder="Enter meeting title"
            className="flex-1 bg-transparent text-[#0b170e] text-base font-normal outline-none placeholder:text-zinc-500"
          />
        </div>

        {/* Action Buttons Group */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          {/* New Meeting Button (Figma Dark-Green button) */}
          <button
            onClick={() => setShowNewMeetingModal(true)}
            className="h-10 px-4 bg-[#1e3624] hover:bg-[#142619] text-[#f5f0e1] rounded-2xl outline outline-2 outline-offset-[-2px] outline-[#1e3624] flex items-center justify-center gap-2 text-sm font-medium transition-all shadow"
          >
            <Plus className="w-4 h-4 text-[#f5f0e1]" />
            New Meeting
          </button>

          {/* Create Sprint Button */}
          <button
            onClick={() => setShowCreateSprintModal(true)}
            className="h-10 px-4 bg-[#1e3624] hover:bg-[#142619] text-[#f5f0e1] rounded-2xl outline outline-2 outline-offset-[-2px] outline-[#1e3624] flex items-center justify-center gap-2 text-sm font-medium transition-all shadow"
          >
            <Sparkles className="w-4 h-4 text-[#f5f0e1]" />
            Create Sprint
          </button>

          {/* Start Sprint Button */}
          <button
            onClick={() => setShowStartSprintModal(true)}
            className="h-10 px-4 bg-emerald-800 hover:bg-emerald-900 text-white rounded-2xl outline outline-2 outline-offset-[-2px] outline-emerald-800 flex items-center justify-center gap-2 text-sm font-medium transition-all shadow"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            Start Sprint
          </button>

          {/* Complete Sprint Button */}
          <button
            onClick={() => setShowCompleteSprintModal(true)}
            className="h-10 px-4 bg-rose-700 hover:bg-rose-800 text-white rounded-2xl outline outline-2 outline-offset-[-2px] outline-rose-700 flex items-center justify-center gap-2 text-sm font-medium transition-all shadow"
          >
            <CheckCircle2 className="w-4 h-4" />
            Complete Sprint
          </button>
        </div>
      </div>

      {/* Active Sprint Summary Banner */}
      {activeSprint && (
        <div className="bg-[#d4d9b8] border border-[#b8c094] rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-emerald-600 animate-pulse" />
            <div>
              <h4 className="text-sm font-bold text-[#0b170e]">Active Sprint: {activeSprint.name}</h4>
              <p className="text-xs text-forest-800">{activeSprint.goal}</p>
            </div>
          </div>
          <span className="text-xs font-bold text-[#1e3624] bg-white/70 px-3 py-1 rounded-full border border-[#1e3624]/20">
            {activeSprint.startDate} — {activeSprint.endDate}
          </span>
        </div>
      )}

      {/* ─── SECTION 1: TODAY MEETINGS (FIGMA EXACT STYLES) ─── */}
      <div className="bg-[#d4d9b8] rounded-2xl p-3 border border-[#b8c094]/60 space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between px-2">
          <span className="text-base font-medium text-zinc-800 tracking-wide">TODAY</span>
          <MoreHorizontal className="w-5 h-5 text-zinc-500 cursor-pointer" />
        </div>

        {/* Items Container */}
        <div className="space-y-3">
          {todayMeetings.length === 0 ? (
            <p className="text-xs italic text-zinc-600 p-2">No meetings scheduled for today.</p>
          ) : (
            todayMeetings.map((item) => (
              <div
                key={item.id}
                className="w-full h-16 pl-4 bg-amber-400/10 border-l-[3px] border-[#1e3624] rounded-xl flex items-center justify-between shadow-xs hover:bg-amber-400/20 transition-all cursor-pointer"
              >
                <div className="flex-1 flex flex-col justify-center">
                  <h4 className="text-sm font-medium text-zinc-800 leading-4">{item.title}</h4>
                  <p className="text-sm font-normal text-zinc-800 leading-5 mt-1">{item.time}</p>
                </div>

                <div className="h-12 flex items-center gap-2 pr-2">
                  <button
                    onClick={() => {
                      if (item.type === 'Sprint') {
                        setShowStartSprintModal(true);
                      } else {
                        addToast(`Opening ${item.title}`, 'info');
                      }
                    }}
                    className={`px-4 py-2 text-sm font-normal ${item.typeColor} hover:underline transition-all`}
                  >
                    {item.type}
                  </button>
                  <MoreHorizontal className="w-5 h-5 text-zinc-800 opacity-70" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ─── SECTION 2: TOMORROW MEETINGS (FIGMA EXACT STYLES) ─── */}
      <div className="bg-black/10 rounded-2xl p-3 border border-black/10 space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between px-2">
          <span className="text-base font-medium text-zinc-800 tracking-wide">TOMORROW</span>
          <MoreHorizontal className="w-5 h-5 text-zinc-500 cursor-pointer" />
        </div>

        {/* Items Container */}
        <div className="space-y-3">
          {tomorrowMeetings.length === 0 ? (
            <p className="text-xs italic text-zinc-600 p-2">No meetings scheduled for tomorrow.</p>
          ) : (
            tomorrowMeetings.map((item) => (
              <div
                key={item.id}
                className="w-full h-16 pl-4 bg-amber-400/10 border-l-[3px] border-[#1e3624] rounded-xl flex items-center justify-between shadow-xs hover:bg-amber-400/20 transition-all cursor-pointer"
              >
                <div className="flex-1 flex flex-col justify-center">
                  <h4 className="text-sm font-medium text-zinc-800 leading-4">{item.title}</h4>
                  <p className="text-sm font-normal text-zinc-800 leading-5 mt-1">{item.time}</p>
                </div>

                <div className="h-12 flex items-center gap-2 pr-2">
                  <button
                    onClick={() => {
                      if (item.type === 'Sprint') {
                        setShowStartSprintModal(true);
                      } else {
                        addToast(`Opening ${item.title}`, 'info');
                      }
                    }}
                    className={`px-4 py-2 text-sm font-normal ${item.typeColor} hover:underline transition-all`}
                  >
                    {item.type}
                  </button>
                  <MoreHorizontal className="w-5 h-5 text-zinc-800 opacity-70" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ─── CREATE SPRINT MODAL ─── */}
      {showCreateSprintModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-[#fdf8e8] border border-[#0b170e] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-[#0b170e]">Create Sprint</h2>
              <button onClick={() => setShowCreateSprintModal(false)} className="text-zinc-600 hover:text-zinc-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSprint} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#0b170e] uppercase mb-1">Sprint Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sprint 4 - BrainMint Core"
                  value={sprintName}
                  onChange={(e) => setSprintName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-[#0b170e]/30 rounded-xl text-xs text-[#0b170e] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0b170e] uppercase mb-1">Sprint Goal</label>
                <textarea
                  rows={3}
                  placeholder="Enter objective for this sprint..."
                  value={sprintGoal}
                  onChange={(e) => setSprintGoal(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-[#0b170e]/30 rounded-xl text-xs text-[#0b170e] outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#0b170e] uppercase mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#0b170e]/30 rounded-xl text-xs text-[#0b170e] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0b170e] uppercase mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#0b170e]/30 rounded-xl text-xs text-[#0b170e] outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateSprintModal(false)}
                  className="px-4 py-2 rounded-full text-xs font-bold text-[#0b170e] hover:bg-cream-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1e3624] text-[#f5f0e1] rounded-full text-xs font-bold hover:bg-[#142619] shadow"
                >
                  Create Sprint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── START SPRINT MODAL ─── */}
      {showStartSprintModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-[#fdf8e8] border border-[#0b170e] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h2 className="text-xl font-extrabold text-[#0b170e]">Start Sprint</h2>
            <p className="text-xs text-forest-800">Select a planned sprint to set as ACTIVE:</p>

            <div className="space-y-2 max-h-56 overflow-y-auto">
              {plannedSprints.length === 0 ? (
                <p className="text-xs italic text-zinc-600">No planned sprints available. Create one first!</p>
              ) : (
                plannedSprints.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => handleStartSprintSubmit(s.id)}
                    className="p-3 bg-white border border-[#0b170e]/20 rounded-xl hover:bg-emerald-50 cursor-pointer flex items-center justify-between group"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-[#0b170e] group-hover:text-emerald-900">{s.name}</h4>
                      <p className="text-[11px] text-zinc-500">{s.startDate} ~ {s.endDate}</p>
                    </div>
                    <Play className="w-4 h-4 text-emerald-700" />
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowStartSprintModal(false)}
                className="px-4 py-2 rounded-full text-xs font-bold text-[#0b170e] hover:bg-cream-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── COMPLETE SPRINT MODAL ─── */}
      {showCompleteSprintModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-[#fdf8e8] border border-[#0b170e] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h2 className="text-xl font-extrabold text-[#0b170e]">Complete Sprint</h2>

            {activeSprint ? (
              <div className="space-y-3">
                <p className="text-xs text-forest-900 leading-relaxed">
                  Are you sure you want to complete <strong>{activeSprint.name}</strong>?
                </p>
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900">
                  Sprint duration: {activeSprint.startDate} to {activeSprint.endDate}
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setShowCompleteSprintModal(false)}
                    className="px-4 py-2 rounded-full text-xs font-bold text-[#0b170e] hover:bg-cream-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleCompleteSprintSubmit(activeSprint.id)}
                    className="px-5 py-2 bg-rose-700 text-white rounded-full text-xs font-bold hover:bg-rose-800 shadow"
                  >
                    Confirm Complete
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs italic text-zinc-600">No active sprint is currently running.</p>
                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => setShowCompleteSprintModal(false)}
                    className="px-4 py-2 rounded-full text-xs font-bold text-[#0b170e] hover:bg-cream-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── NEW MEETING MODAL ─── */}
      {showNewMeetingModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-[#fdf8e8] border border-[#0b170e] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h2 className="text-xl font-extrabold text-[#0b170e]">Schedule New Meeting</h2>

            <form onSubmit={handleCreateMeeting} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#0b170e] uppercase mb-1">Meeting Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sync with Director"
                  value={newMeetingTitle}
                  onChange={(e) => setNewMeetingTitle(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-[#0b170e]/30 rounded-xl text-xs text-[#0b170e] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#0b170e] uppercase mb-1">Time</label>
                  <input
                    type="text"
                    placeholder="e.g. 6:00 pm"
                    value={newMeetingTime}
                    onChange={(e) => setNewMeetingTime(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#0b170e]/30 rounded-xl text-xs text-[#0b170e] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0b170e] uppercase mb-1">Schedule Day</label>
                  <select
                    value={newMeetingDay}
                    onChange={(e) => setNewMeetingDay(e.target.value as 'TODAY' | 'TOMORROW')}
                    className="w-full px-3 py-2 bg-white border border-[#0b170e]/30 rounded-xl text-xs text-[#0b170e] outline-none"
                  >
                    <option value="TODAY">TODAY</option>
                    <option value="TOMORROW">TOMORROW</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0b170e] uppercase mb-1">Category / Tag</label>
                <select
                  value={newMeetingType}
                  onChange={(e) => setNewMeetingType(e.target.value as any)}
                  className="w-full px-3.5 py-2 bg-white border border-[#0b170e]/30 rounded-xl text-xs text-[#0b170e] outline-none"
                >
                  <option value="Sprint">Sprint</option>
                  <option value="Review">Review</option>
                  <option value="1:1">1:1</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewMeetingModal(false)}
                  className="px-4 py-2 rounded-full text-xs font-bold text-[#0b170e] hover:bg-cream-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1e3624] text-[#f5f0e1] rounded-full text-xs font-bold hover:bg-[#142619] shadow"
                >
                  Add Meeting
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
