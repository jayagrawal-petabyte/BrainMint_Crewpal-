import React, { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  Play,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Users,
  ChevronDown,
  ChevronUp,
  Video,
  CalendarDays,
  Sparkles,
} from 'lucide-react';
import { useSprintStore } from '../../store/sprints/sprintStore';
import type { Sprint, SprintStatus } from '../../types/sprint';
import { useToast } from '../../hooks/useToast';

export const Meetings: React.FC = () => {
  const { sprints, fetchSprints, isLoading, error, createSprint, startSprint, completeSprint, addMeetingToSprint } = useSprintStore();
  const toast = useToast();

  useEffect(() => {
    fetchSprints();
  }, [fetchSprints]);

  const [search, setSearch] = useState('');
  const [filterStatus] = useState<SprintStatus | 'all'>('all');
  const [expandedSprintIds, setExpandedSprintIds] = useState<string[]>(['sprint-2']);

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddMeetingModal, setShowAddMeetingModal] = useState(false);
  const [selectedSprintIdForMeeting, setSelectedSprintIdForMeeting] = useState<string | null>(null);

  // Form states for Create Sprint
  const [sprintName, setSprintName] = useState('');
  const [sprintGoal, setSprintGoal] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Form states for Add Meeting
  const [meetingTitle, setMeetingTitle] = useState('');
  const [meetingTime, setMeetingTime] = useState('');
  const [meetingDuration, setMeetingDuration] = useState('45m');
  const [meetingLink, setMeetingLink] = useState('Google Meet');
  const [meetingAgenda, setMeetingAgenda] = useState('');
  const [attendeesCount] = useState(5);

  const toggleExpand = (id: string) => {
    setExpandedSprintIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCreateSprint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sprintName.trim()) return;

    createSprint({
      name: sprintName,
      goal: sprintGoal || 'No goal set for this sprint.',
      startDate: startDate || new Date().toISOString().split('T')[0],
      endDate: endDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    });

    toast.success('Sprint created successfully!');
    setSprintName('');
    setSprintGoal('');
    setStartDate('');
    setEndDate('');
    setShowCreateModal(false);
  };

  const handleStartSprint = (sprint: Sprint) => {
    if (sprint.status === 'active') {
      toast.info('Sprint is already active');
      return;
    }
    startSprint(sprint.id);
    toast.success(`"${sprint.name}" is now STARTED and ACTIVE!`);
  };

  const handleCompleteSprint = (sprint: Sprint) => {
    if (sprint.status === 'completed') {
      toast.info('Sprint is already completed');
      return;
    }
    completeSprint(sprint.id);
    toast.success(`"${sprint.name}" has been COMPLETED!`);
  };

  const handleAddMeetingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSprintIdForMeeting || !meetingTitle.trim()) return;

    addMeetingToSprint(selectedSprintIdForMeeting, {
      title: meetingTitle,
      time: meetingTime || '10:00 AM - 11:00 AM',
      duration: meetingDuration,
      locationOrLink: meetingLink,
      attendeesCount: attendeesCount,
      status: 'upcoming',
      organizer: 'Jay Agrawal',
      agenda: meetingAgenda,
    });

    toast.success('Meeting added to sprint!');
    setMeetingTitle('');
    setMeetingTime('');
    setMeetingAgenda('');
    setShowAddMeetingModal(false);
  };

  const filteredSprints = sprints.filter((sprint) => {
    const matchesSearch =
      sprint.name.toLowerCase().includes(search.toLowerCase()) ||
      sprint.goal.toLowerCase().includes(search.toLowerCase()) ||
      sprint.meetings.some((m) => m.title.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = filterStatus === 'all' || sprint.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const activeSprint = sprints.find((s) => s.status === 'active');
  const plannedSprints = sprints.filter((s) => s.status === 'planned');

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {error && (
        <div role="alert" className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-semibold">
          {error}
        </div>
      )}
      {isLoading && (
        <div className="py-8 text-center text-xs text-forest-600 font-medium animate-pulse">
          Loading meeting and sprint data from backend...
        </div>
      )}

      {/* ─── HEADER & TAB BAR (Matching Figma Design Node 38:2737) ─── */}
      <div className="space-y-4">
        {/* Title */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-[#0b170e] tracking-tight">Project Meetings & Sprints</h1>
            <p className="text-xs text-forest-700 font-medium mt-1">
              Manage sprint cadence, start/complete iterations, and organize team syncs.
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-4 overflow-x-auto pb-2 border-b border-[#0b170e]/10 no-scrollbar">
          <span className="text-sm font-semibold text-[#0b170e]/60 whitespace-nowrap cursor-pointer">Overview</span>
          <span className="text-sm font-semibold text-[#0b170e]/60 whitespace-nowrap cursor-pointer">Tasks</span>
          <span className="text-sm font-semibold text-[#0b170e]/60 whitespace-nowrap cursor-pointer">Updates</span>

          <div className="flex items-center gap-1.5 pb-2 border-b-2 border-[#1e3624] cursor-pointer whitespace-nowrap">
            <span className="text-sm font-extrabold text-[#1e3624]">Meetings</span>
            <span className="bg-[#e7a8a8] text-[#0b170e] text-[11px] font-bold rounded-full px-2 py-0.5 min-w-[20px] text-center">
              {sprints.reduce((acc, s) => acc + s.meetings.length, 0)}
            </span>
          </div>

          <span className="text-sm font-semibold text-[#0b170e]/60 whitespace-nowrap cursor-pointer">Documents</span>
        </div>
      </div>

      {/* ─── CONTROLS & ACTIONS ROW (Figma Frame 38:2758) ─── */}
      <div className="bg-[#d4d9b8]/50 p-4 rounded-2xl border border-[#b8c094]/60 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="flex-1 w-full md:w-auto flex items-center gap-2 bg-[#f2cece]/60 border border-[#e7a8a8] rounded-full px-4 py-2.5 shadow-sm">
          <Search className="w-4 h-4 text-[#426348] shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search meeting or sprint goal..."
            className="w-full bg-transparent text-xs text-[#0b170e] placeholder:text-[#426348]/70 outline-none font-medium"
          />
        </div>

        {/* Primary Action Buttons: Create Sprint, Start Sprint, Complete Sprint */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
          {/* Create Sprint Button */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 bg-[#1e3624] hover:bg-[#142619] text-[#f5f0e1] px-4 py-2.5 rounded-full text-xs font-bold shadow-md transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Create Sprint
          </button>

          {/* Start Sprint (Triggers active/planned toggle) */}
          {plannedSprints.length > 0 && (
            <button
              onClick={() => handleStartSprint(plannedSprints[0])}
              className="flex items-center gap-1.5 bg-[#2d5a37] hover:bg-[#23472b] text-white px-4 py-2.5 rounded-full text-xs font-bold shadow-md transition-all active:scale-95"
              title={`Start ${plannedSprints[0].name}`}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Start Sprint
            </button>
          )}

          {/* Complete Sprint Button */}
          {activeSprint && (
            <button
              onClick={() => handleCompleteSprint(activeSprint)}
              className="flex items-center gap-1.5 bg-rose-700 hover:bg-rose-800 text-white px-4 py-2.5 rounded-full text-xs font-bold shadow-md transition-all active:scale-95"
              title={`Complete ${activeSprint.name}`}
            >
              <CheckCircle2 className="w-4 h-4" />
              Complete Sprint
            </button>
          )}
        </div>
      </div>

      {/* ─── SPRINTS LIST (Figma Kanban / Notification Column layout) ─── */}
      <div className="space-y-6">
        {filteredSprints.length === 0 ? (
          <div className="p-12 text-center bg-[#fdf8e8] rounded-2xl border border-[#0b170e]/20 space-y-3">
            <CalendarDays className="w-12 h-12 text-[#426348] mx-auto" />
            <h3 className="text-base font-bold text-[#0b170e]">No Sprints Found</h3>
            <p className="text-xs text-forest-700">Try adjusting your search query or create a new sprint.</p>
          </div>
        ) : (
          filteredSprints.map((sprint) => {
            const isExpanded = expandedSprintIds.includes(sprint.id);

            return (
              <div
                key={sprint.id}
                className={`bg-[#fdf8e8] border border-[#0b170e] rounded-2xl p-5 shadow-sm transition-all ${
                  sprint.status === 'active' ? 'ring-2 ring-[#1e3624]' : ''
                }`}
              >
                {/* Sprint Card Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#0b170e]/15 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h2 className="text-lg font-extrabold text-[#0b170e]">{sprint.name}</h2>
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full tracking-wider ${
                          sprint.status === 'active'
                            ? 'bg-[#1e3624] text-[#f5f0e1]'
                            : sprint.status === 'completed'
                            ? 'bg-emerald-200 text-emerald-900 border border-emerald-400'
                            : 'bg-amber-100 text-amber-900 border border-amber-300'
                        }`}
                      >
                        {sprint.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-[#426348] font-medium pt-0.5">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {sprint.startDate} ~ {sprint.endDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <Video className="w-3.5 h-3.5" />
                        {sprint.meetings.length} Meetings Scheduled
                      </span>
                    </div>
                  </div>

                  {/* Actions Header Toolbar */}
                  <div className="flex items-center gap-2">
                    {sprint.status === 'planned' && (
                      <button
                        onClick={() => handleStartSprint(sprint)}
                        className="px-3 py-1.5 bg-[#1e3624] text-white rounded-full text-xs font-bold flex items-center gap-1 hover:bg-[#142619]"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        Start
                      </button>
                    )}

                    {sprint.status === 'active' && (
                      <button
                        onClick={() => handleCompleteSprint(sprint)}
                        className="px-3 py-1.5 bg-rose-700 text-white rounded-full text-xs font-bold flex items-center gap-1 hover:bg-rose-800"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Complete
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setSelectedSprintIdForMeeting(sprint.id);
                        setShowAddMeetingModal(true);
                      }}
                      className="px-3 py-1.5 bg-[#d4d9b8] text-[#0b170e] rounded-full text-xs font-bold flex items-center gap-1 hover:bg-[#b8c094]"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Meeting
                    </button>

                    <button
                      onClick={() => toggleExpand(sprint.id)}
                      className="p-1.5 hover:bg-[#d4d9b8]/60 rounded-full text-[#0b170e] transition-colors"
                      aria-label="Toggle Expand"
                    >
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Sprint Goal Banner */}
                {sprint.goal && (
                  <div className="mt-3 bg-[#d4d9b8]/40 border border-[#b8c094]/50 rounded-xl px-4 py-2.5 flex items-start gap-2 text-xs text-[#0b170e]">
                    <Sparkles className="w-4 h-4 text-[#1e3624] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold uppercase tracking-wider text-[10px] text-forest-800 block">Sprint Goal</span>
                      <p className="font-medium text-forest-900">{sprint.goal}</p>
                    </div>
                  </div>
                )}

                {/* Expanded Content: Meetings Cards (Figma Notification Style Cards) */}
                {isExpanded && (
                  <div className="mt-5 space-y-3">
                    <h3 className="text-xs font-bold text-[#0b170e] uppercase tracking-wider">Scheduled Meetings</h3>

                    {sprint.meetings.length === 0 ? (
                      <p className="text-xs italic text-[#426348] py-2">No meetings added to this sprint yet.</p>
                    ) : (
                      sprint.meetings.map((meeting) => (
                        <div
                          key={meeting.id}
                          className="bg-[#f2cece]/40 border border-[#e7a8a8] rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-shadow"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-[#0b170e]">{meeting.title}</h4>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-[#1e3624] border border-[#1e3624]/30">
                                {meeting.duration}
                              </span>
                            </div>

                            {meeting.agenda && (
                              <p className="text-xs text-forest-800 line-clamp-1">{meeting.agenda}</p>
                            )}

                            <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#426348] pt-1">
                              <span className="flex items-center gap-1 font-semibold">
                                <Clock className="w-3 h-3" />
                                {meeting.time}
                              </span>
                              <span className="flex items-center gap-1 font-semibold">
                                <MapPin className="w-3 h-3" />
                                {meeting.locationOrLink}
                              </span>
                              <span className="flex items-center gap-1 font-semibold">
                                <Users className="w-3 h-3" />
                                {meeting.attendeesCount} Attendees
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                            <button
                              onClick={() => toast.info(`Joining ${meeting.title}...`)}
                              className="px-3 py-1.5 bg-[#1e3624] text-white rounded-full text-xs font-bold hover:bg-[#142619] shadow-sm transition-all"
                            >
                              Join Call
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* ─── CREATE SPRINT MODAL ─── */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-[#fdf8e8] border border-[#0b170e] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h2 className="text-xl font-extrabold text-[#0b170e]">Create New Sprint</h2>

            <form onSubmit={handleCreateSprint} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#0b170e] uppercase mb-1">Sprint Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sprint 4 - Checkout Flow"
                  value={sprintName}
                  onChange={(e) => setSprintName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-[#0b170e]/30 rounded-xl text-xs text-[#0b170e] outline-none focus:border-[#1e3624]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0b170e] uppercase mb-1">Sprint Goal</label>
                <textarea
                  rows={3}
                  placeholder="Describe the main objective of this sprint..."
                  value={sprintGoal}
                  onChange={(e) => setSprintGoal(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-[#0b170e]/30 rounded-xl text-xs text-[#0b170e] outline-none focus:border-[#1e3624] resize-none"
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
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-full text-xs font-bold text-[#0b170e] hover:bg-cream-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1e3624] text-white rounded-full text-xs font-bold hover:bg-[#142619] shadow-md"
                >
                  Create Sprint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── ADD MEETING MODAL ─── */}
      {showAddMeetingModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-[#fdf8e8] border border-[#0b170e] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h2 className="text-xl font-extrabold text-[#0b170e]">Schedule Meeting for Sprint</h2>

            <form onSubmit={handleAddMeetingSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#0b170e] uppercase mb-1">Meeting Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Design & Architecture Sync"
                  value={meetingTitle}
                  onChange={(e) => setMeetingTitle(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-[#0b170e]/30 rounded-xl text-xs text-[#0b170e] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#0b170e] uppercase mb-1">Time Slot</label>
                  <input
                    type="text"
                    placeholder="10:00 AM - 11:00 AM"
                    value={meetingTime}
                    onChange={(e) => setMeetingTime(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#0b170e]/30 rounded-xl text-xs text-[#0b170e] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0b170e] uppercase mb-1">Duration</label>
                  <input
                    type="text"
                    placeholder="45m"
                    value={meetingDuration}
                    onChange={(e) => setMeetingDuration(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#0b170e]/30 rounded-xl text-xs text-[#0b170e] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0b170e] uppercase mb-1">Location / Link</label>
                <input
                  type="text"
                  placeholder="Google Meet / Room 4"
                  value={meetingLink}
                  onChange={(e) => setMeetingLink(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-[#0b170e]/30 rounded-xl text-xs text-[#0b170e] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0b170e] uppercase mb-1">Agenda</label>
                <textarea
                  rows={2}
                  placeholder="Brief meeting agenda..."
                  value={meetingAgenda}
                  onChange={(e) => setMeetingAgenda(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-[#0b170e]/30 rounded-xl text-xs text-[#0b170e] outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddMeetingModal(false)}
                  className="px-4 py-2 rounded-full text-xs font-bold text-[#0b170e] hover:bg-cream-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1e3624] text-white rounded-full text-xs font-bold hover:bg-[#142619] shadow-md"
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
