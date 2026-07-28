import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Folder, CheckSquare, User, CornerDownLeft, Sparkles } from 'lucide-react';
import { useTaskStore, MOCK_TEAM_MEMBERS } from '../../store/tasks';
import { useProjectStore } from '../../store/projects';

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchResult {
  id: string;
  type: 'project' | 'task' | 'team';
  title: string;
  subtitle: string;
  badge?: string;
  badgeColor?: string;
}

export const GlobalSearch = ({ isOpen, onClose }: GlobalSearchProps) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const modalRef = useRef<HTMLDivElement>(null);
  
  const tasks = useTaskStore((state) => state.tasks);
  const projects = useProjectStore((state) => state.projects);

  // Close on Escape, handle Arrow navigation and Enter key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, results.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + results.length) % Math.max(1, results.length));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (results[selectedIndex]) {
          handleSelect(results[selectedIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, query]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Reset query on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Compute search results
  const getResults = (): SearchResult[] => {
    if (!query.trim()) return [];

    const lowerQuery = query.toLowerCase();
    const list: SearchResult[] = [];

    // 1. Projects
    projects.forEach((proj) => {
      if (
        proj.name.toLowerCase().includes(lowerQuery) ||
        (proj.description && proj.description.toLowerCase().includes(lowerQuery))
      ) {
        list.push({
          id: proj.id,
          type: 'project',
          title: proj.name,
          subtitle: `Project · Lead: ${proj.owner}`,
          badge: proj.status.replace('_', ' ').toUpperCase(),
          badgeColor: proj.status === 'on_track' ? 'bg-olive-200 text-forest-900 border-olive-300' :
                      proj.status === 'delayed' ? 'bg-rose-200 text-rose-900 border-rose-300' : 
                      'bg-cream-200 text-forest-700 border-cream-300',
        });
      }
    });

    // 2. Tasks
    tasks.forEach((task) => {
      if (
        task.title.toLowerCase().includes(lowerQuery) ||
        task.description.toLowerCase().includes(lowerQuery) ||
        task.techTag.toLowerCase().includes(lowerQuery)
      ) {
        list.push({
          id: task.id,
          type: 'task',
          title: task.title,
          subtitle: `Task · ${task.techTag}`,
          badge: task.priority.toUpperCase(),
          badgeColor: task.priority === 'high' ? 'bg-rose-100 text-rose-800' :
                      task.priority === 'medium' ? 'bg-olive-100 text-olive-850' :
                      'bg-cream-100 text-forest-650',
        });
      }
    });

    // 3. Team
    MOCK_TEAM_MEMBERS.forEach((member) => {
      if (member.name.toLowerCase().includes(lowerQuery)) {
        list.push({
          id: member.id,
          type: 'team',
          title: member.name,
          subtitle: `Team Member · ${member.initials}`,
          badge: 'Member',
          badgeColor: 'bg-forest-50 text-forest-700',
        });
      }
    });

    return list;
  };

  const results = getResults();

  const handleSelect = (item: SearchResult) => {
    onClose();
    if (item.type === 'project') {
      navigate('/projects');
    } else if (item.type === 'task') {
      navigate('/tasks');
    } else if (item.type === 'team') {
      navigate('/users');
    }
  };

  // Helper to highlight match
  const renderTitle = (title: string) => {
    if (!query) return title;
    const parts = title.split(new RegExp(`(${query})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <mark key={i} className="bg-rose-200 text-forest-900 rounded-sm px-0.5 font-bold">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4 bg-forest-900/40 backdrop-blur-sm transition-all duration-200">
      <div
        ref={modalRef}
        className="w-full max-w-xl bg-cream-50 rounded-2xl border border-cream-200 shadow-2xl overflow-hidden flex flex-col max-h-[70vh] animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Search Input Box */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-cream-200 bg-white">
          <Search className="w-5 h-5 text-forest-500 shrink-0" />
          <input
            autoFocus
            type="text"
            placeholder="Search projects, tasks or members... (Esc to close)"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="flex-1 bg-transparent text-sm text-forest-900 placeholder:text-forest-400 outline-none"
          />
          <div className="flex items-center gap-1 bg-cream-200 text-forest-750 text-[10px] font-bold px-2 py-1 rounded border border-cream-300 shrink-0 select-none">
            ESC
          </div>
        </div>

        {/* Results Box */}
        <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
          {query.trim() === '' ? (
            <div className="py-12 text-center space-y-2">
              <Sparkles className="w-8 h-8 text-rose-300 mx-auto animate-pulse" />
              <p className="text-forest-700 font-semibold text-sm">Quick Find</p>
              <p className="text-forest-400 text-xs max-w-xs mx-auto">
                Type what you are looking for. Results appear instantly.
              </p>
            </div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <p className="text-2xl">🔍</p>
              <p className="text-forest-700 font-semibold text-sm">No results match "{query}"</p>
              <p className="text-forest-400 text-xs">Double check spelling and try again.</p>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="px-3 py-1.5 text-[10px] font-bold text-forest-400 uppercase tracking-wider">
                Matching items ({results.length})
              </div>
              {results.map((item, index) => {
                const isSelected = index === selectedIndex;
                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${
                      isSelected ? 'bg-olive-200 text-forest-900' : 'text-forest-700 hover:bg-cream-100'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`p-2 rounded-lg shrink-0 ${
                        item.type === 'project' ? 'bg-rose-100 text-rose-650' :
                        item.type === 'task' ? 'bg-olive-150 text-olive-750' :
                        'bg-forest-50 text-forest-650'
                      }`}>
                        {item.type === 'project' && <Folder className="w-4 h-4" />}
                        {item.type === 'task' && <CheckSquare className="w-4 h-4" />}
                        {item.type === 'team' && <User className="w-4 h-4" />}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm truncate">{renderTitle(item.title)}</p>
                        <p className={`text-xs truncate ${isSelected ? 'text-forest-750' : 'text-forest-400'}`}>
                          {item.subtitle}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {item.badge && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                      )}
                      {isSelected && (
                        <span className="text-[10px] text-forest-500 flex items-center gap-0.5 font-semibold bg-white/50 px-1.5 py-0.5 rounded border border-forest-200">
                          Select <CornerDownLeft className="w-2.5 h-2.5" />
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
