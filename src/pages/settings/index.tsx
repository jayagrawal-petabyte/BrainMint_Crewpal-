import { useState } from 'react';
import {
  Bell, Volume2, VolumeX,
  Mail, MessageSquare, Smartphone, Check, ChevronDown, Globe
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
    className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none cursor-pointer ${
      enabled ? 'bg-forest-700' : 'bg-cream-300'
    }`}
    role="switch"
    aria-checked={enabled}
  >
    <span
      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-xs transition-transform duration-200 ${
        enabled ? 'translate-x-5' : 'translate-x-0'
      }`}
    />
  </button>
);

// ─── Section Card ──────────────────────────────────────────────────────────

const SectionCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-white rounded-2xl border border-cream-200 shadow-xs overflow-visible">
    <div className="px-6 py-4 border-b border-cream-100 bg-cream-50/60 rounded-t-2xl">
      <h3 className="text-xs font-bold text-forest-900 tracking-wider uppercase">{title}</h3>
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
  <div className="flex items-center justify-between px-6 py-4 hover:bg-cream-50/40 transition-colors">
    <div className="flex items-center gap-4">
      <div className="w-9 h-9 rounded-xl bg-cream-100/70 flex items-center justify-center text-forest-700 shrink-0">
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
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const currentLang = LANGUAGES.find((l) => l.code === selectedLang)!;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* ─── Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-forest-900 tracking-tight">{t.settings}</h1>
          <p className="text-sm text-forest-500 mt-1">{t.manage}</p>
        </div>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 shadow-sm cursor-pointer ${
            saved
              ? 'bg-emerald-600 text-white'
              : 'bg-forest-800 text-cream-100 hover:bg-forest-900'
          }`}
        >
          {saved ? <><Check className="w-4 h-4" /> {t.saved}</> : t.save}
        </button>
      </div>

      {/* ─── Desktop 2-Column Layout ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Primary Column (2/3 width) - Notification Preferences */}
        <div className="lg:col-span-2 space-y-6">
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
        </div>

        {/* Right Column (1/3 width) - Language & Appearance */}
        <div className="space-y-6">
          {/* Language Selection Card */}
          <SectionCard title={t.langRegion}>
            <div className="px-6 py-5">
              <div className="flex items-center gap-2 mb-3 text-forest-800 font-semibold text-sm">
                <Globe className="w-4 h-4 text-forest-700" />
                <span>{t.dispLang}</span>
              </div>
              <p className="text-xs text-forest-500 mb-4">{t.chooseLang}</p>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setLangOpen(!langOpen)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-cream-50 border border-cream-200 rounded-xl text-sm font-medium text-forest-900 hover:bg-cream-100 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-3">
                    <span className="text-xl">{currentLang.flag}</span>
                    {currentLang.label}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-forest-500 transition-transform ${langOpen ? 'rotate-180' : ''}`} />
                </button>

                {langOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-cream-200 rounded-xl shadow-xl z-30 overflow-hidden max-h-64 overflow-y-auto">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => {
                          changeLanguage(lang.code);
                          setLangOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-4 py-3 text-sm hover:bg-cream-50 transition-colors cursor-pointer ${
                          lang.code === selectedLang ? 'bg-cream-100 font-bold text-forest-900' : 'text-forest-700'
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <span className="text-xl">{lang.flag}</span>
                          {lang.label}
                        </span>
                        {lang.code === selectedLang && <Check className="w-4 h-4 text-forest-700" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Language Badges */}
              <div className="mt-4 pt-4 border-t border-cream-100">
                <p className="text-[11px] font-bold uppercase tracking-wider text-forest-400 mb-2">Quick Switch</p>
                <div className="flex flex-wrap gap-2">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={`badge-${lang.code}`}
                      onClick={() => changeLanguage(lang.code)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                        lang.code === selectedLang
                          ? 'bg-forest-800 text-cream-100 shadow-xs'
                          : 'bg-cream-100 text-forest-800 hover:bg-cream-200'
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.code.toUpperCase()}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </SectionCard>

          {/* System Info Box */}
          <div className="bg-cream-50/80 rounded-2xl border border-cream-200 p-5 text-center space-y-1">
            <p className="text-xs font-bold text-forest-900">CrewPal Platform</p>
            <p className="text-[11px] text-forest-500">v1.0.0 · BrainMint Production Build</p>
            <p className="text-[10px] text-forest-400 pt-1">All preferences auto-saved to browser local storage.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
