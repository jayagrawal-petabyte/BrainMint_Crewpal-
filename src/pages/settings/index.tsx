import { useState } from 'react';
import {
  Bell, Moon, Sun, Volume2, VolumeX,
  Mail, MessageSquare, Smartphone, Check, ChevronDown
} from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

// ─── Types ────────────────────────────────────────────────────────────────────

type Language = { code: string; label: string; flag: string };

const LANGUAGES: Language[] = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'hi', label: 'हिन्दी (Hindi)', flag: '🇮🇳' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
];

// ─── Toggle Switch ─────────────────────────────────────────────────────────

const Toggle = ({ enabled, onChange }: { enabled: boolean; onChange: () => void }) => (
  <button
    onClick={onChange}
    className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
      enabled ? 'bg-forest-700' : 'bg-cream-300'
    }`}
    role="switch"
    aria-checked={enabled}
  >
    <span
      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
        enabled ? 'translate-x-5' : 'translate-x-0'
      }`}
    />
  </button>
);

// ─── Section Card ──────────────────────────────────────────────────────────

const SectionCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-white rounded-2xl border border-cream-200 shadow-sm overflow-visible">
    <div className="px-5 py-3.5 border-b border-cream-100 bg-cream-50 rounded-t-2xl">
      <h3 className="text-sm font-bold text-forest-900 tracking-wide uppercase">{title}</h3>
    </div>
    <div className="divide-y divide-cream-100">{children}</div>
  </div>
);

// ─── Preference Row ────────────────────────────────────────────────────────

const PrefRow = ({
  icon: Icon,
  label,
  description,
  enabled,
  onToggle,
}: {
  icon: React.ElementType;
  label: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}) => (
  <div className="flex items-center justify-between px-5 py-4 hover:bg-cream-50 transition-colors">
    <div className="flex items-center gap-3.5">
      <div className="w-9 h-9 rounded-xl bg-cream-100 flex items-center justify-center text-forest-700 shrink-0">
        <Icon className="w-4.5 h-4.5" />
      </div>
      <div>
        <p className="text-sm font-semibold text-forest-900">{label}</p>
        <p className="text-xs text-forest-500 mt-0.5">{description}</p>
      </div>
    </div>
    <Toggle enabled={enabled} onChange={onToggle} />
  </div>
);



export const Settings = () => {
  // Notification Preferences
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs]   = useState(true);
  const [inAppNotifs, setInAppNotifs] = useState(true);
  const [taskReminders, setTaskReminders] = useState(true);
  const [sprintAlerts, setSprintAlerts]   = useState(true);
  const [commentNotifs, setCommentNotifs] = useState(false);
  const [muteAll, setMuteAll]             = useState(false);

  // Global Language Hook
  const { t, lang: selectedLang, changeLanguage } = useTranslation();
  const [langOpen, setLangOpen]         = useState(false);

  // Appearance
  const [darkMode, setDarkMode]         = useState(false);

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const currentLang = LANGUAGES.find((l) => l.code === selectedLang)!;

  return (
    <div className="min-h-screen bg-[#f5f0e1] px-4 pt-6 pb-24 max-w-lg mx-auto">
      {/* ─── Header ─── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-forest-900 tracking-tight">{t.settings}</h1>
          <p className="text-xs text-forest-500 mt-0.5">{t.manage}</p>
        </div>
        <button
          onClick={handleSave}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 shadow-sm ${
            saved
              ? 'bg-olive-500 text-white'
              : 'bg-forest-900 text-cream-50 hover:bg-forest-700'
          }`}
        >
          {saved ? <><Check className="w-3.5 h-3.5" /> {t.saved}</> : t.save}
        </button>
      </div>

      <div className="space-y-5">
        {/* ─── Notification Preferences ─── */}
        <SectionCard title={t.notifPref}>
          <PrefRow
            icon={VolumeX}
            label={t.muteAll}
            description={t.muteAllDesc}
            enabled={muteAll}
            onToggle={() => setMuteAll(!muteAll)}
          />
          <PrefRow
            icon={Mail}
            label={t.email}
            description={t.emailDesc}
            enabled={!muteAll && emailNotifs}
            onToggle={() => setEmailNotifs(!emailNotifs)}
          />
          <PrefRow
            icon={Smartphone}
            label={t.push}
            description={t.pushDesc}
            enabled={!muteAll && pushNotifs}
            onToggle={() => setPushNotifs(!pushNotifs)}
          />
          <PrefRow
            icon={Bell}
            label={t.inApp}
            description={t.inAppDesc}
            enabled={!muteAll && inAppNotifs}
            onToggle={() => setInAppNotifs(!inAppNotifs)}
          />
          <PrefRow
            icon={Volume2}
            label={t.reminders}
            description={t.remindersDesc}
            enabled={!muteAll && taskReminders}
            onToggle={() => setTaskReminders(!taskReminders)}
          />
          <PrefRow
            icon={Bell}
            label={t.sprints}
            description={t.sprintsDesc}
            enabled={!muteAll && sprintAlerts}
            onToggle={() => setSprintAlerts(!sprintAlerts)}
          />
          <PrefRow
            icon={MessageSquare}
            label={t.comments}
            description={t.commentsDesc}
            enabled={!muteAll && commentNotifs}
            onToggle={() => setCommentNotifs(!commentNotifs)}
          />
        </SectionCard>

        {/* ─── Language Selection ─── */}
        <SectionCard title={t.langRegion}>
          <div className="px-5 py-4">
            <p className="text-sm font-semibold text-forest-900 mb-1">{t.dispLang}</p>
            <p className="text-xs text-forest-500 mb-3">{t.chooseLang}</p>

            <div className="relative">
              <button
                type="button"
                onClick={() => setLangOpen(!langOpen)}
                className="w-full flex items-center justify-between px-4 py-3 bg-cream-50 border border-cream-200 rounded-xl text-sm font-medium text-forest-900 hover:bg-cream-100 transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <span className="text-lg">{currentLang.flag}</span>
                  {currentLang.label}
                </span>
                <ChevronDown className={`w-4 h-4 text-forest-500 transition-transform ${langOpen ? 'rotate-180' : ''}`} />
              </button>

              {langOpen && (
                <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-cream-200 rounded-xl shadow-xl z-20 overflow-hidden max-h-60 overflow-y-auto">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => {
                        changeLanguage(lang.code);
                        setLangOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3 text-sm hover:bg-cream-50 transition-colors ${
                        lang.code === selectedLang ? 'bg-cream-100 font-bold text-forest-900' : 'text-forest-700'
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <span className="text-lg">{lang.flag}</span>
                        {lang.label}
                      </span>
                      {lang.code === selectedLang && <Check className="w-4 h-4 text-forest-700" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </SectionCard>

        {/* ─── Appearance ─── */}
        <SectionCard title={t.appearance}>
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-cream-100 flex items-center justify-center text-forest-700">
                {darkMode ? <Moon className="w-4.5 h-4.5" /> : <Sun className="w-4.5 h-4.5" />}
              </div>
              <div>
                <p className="text-sm font-semibold text-forest-900">{t.darkMode}</p>
                <p className="text-xs text-forest-500 mt-0.5">{t.darkModeDesc}</p>
              </div>
            </div>
            <Toggle enabled={darkMode} onChange={() => setDarkMode(!darkMode)} />
          </div>
        </SectionCard>

        {/* ─── App Version ─── */}
        <div className="text-center pt-2">
          <p className="text-[11px] text-forest-400">CREWPAL v1.0.0 · BrainMint Internship · 2026</p>
        </div>
      </div>
    </div>
  );
};
