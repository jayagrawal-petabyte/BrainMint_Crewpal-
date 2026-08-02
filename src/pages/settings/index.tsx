import { useState } from 'react';
import {
  Bell, Globe, Moon, Sun, Volume2, VolumeX,
  Mail, MessageSquare, Smartphone, Check, ChevronDown
} from 'lucide-react';

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

// ─── Translations ──────────────────────────────────────────────────────────

const TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    settings: "Settings",
    manage: "Manage your preferences",
    save: "Save Changes",
    saved: "Saved!",
    notifPref: "Notification Preferences",
    muteAll: "Mute All Notifications",
    muteAllDesc: "Silence all alerts across all channels",
    email: "Email Notifications",
    emailDesc: "Receive updates via your registered email",
    push: "Push Notifications",
    pushDesc: "Browser & mobile push alerts",
    inApp: "In-App Notifications",
    inAppDesc: "Notification bell inside the app",
    reminders: "Task Reminders",
    remindersDesc: "Reminders before task due dates",
    sprints: "Sprint Alerts",
    sprintsDesc: "Alerts when sprints start, end or change",
    comments: "Comment Notifications",
    commentsDesc: "Get notified when someone comments on your task",
    langRegion: "Language & Region",
    dispLang: "Display Language",
    chooseLang: "Choose the language for the app interface",
    appearance: "Appearance",
    darkMode: "Dark Mode",
    darkModeDesc: "Switch between light and dark theme",
  },
  hi: {
    settings: "सेटिंग्स",
    manage: "अपनी प्राथमिकताओं को प्रबंधित करें",
    save: "बदलाव सहेजें",
    saved: "सहेजा गया!",
    notifPref: "अधिसूचना प्राथमिकताएं",
    muteAll: "सभी सूचनाएं म्यूट करें",
    muteAllDesc: "सभी चैनलों पर सभी अलर्ट मौन करें",
    email: "ईमेल सूचनाएं",
    emailDesc: "अपने पंजीकृत ईमेल के माध्यम से अपडेट प्राप्त करें",
    push: "पुश सूचनाएं",
    pushDesc: "ब्राउज़र और मोबाइल पुश अलर्ट",
    inApp: "इन-ऐप सूचनाएं",
    inAppDesc: "ऐप के अंदर अधिसूचना घंटी",
    reminders: "कार्य अनुस्मारक",
    remindersDesc: "कार्य की देय तिथियों से पहले अनुस्मारक",
    sprints: "स्प्रिंट अलर्ट",
    sprintsDesc: "स्प्रिंट शुरू, समाप्त या बदलने पर अलर्ट",
    comments: "टिप्पणी सूचनाएं",
    commentsDesc: "जब कोई आपके कार्य पर टिप्पणी करे तो सूचित किया जाए",
    langRegion: "भाषा और क्षेत्र",
    dispLang: "भाषा प्रदर्शित करें",
    chooseLang: "ऐप इंटरफ़ेस के लिए भाषा चुनें",
    appearance: "दिखावट",
    darkMode: "डार्क मोड",
    darkModeDesc: "लाइट और डार्क थीम के बीच स्विच करें",
  },
  es: {
    settings: "Ajustes",
    manage: "Gestiona tus preferencias",
    save: "Guardar Cambios",
    saved: "¡Guardado!",
    notifPref: "Preferencias de Notificación",
    muteAll: "Silenciar Todas las Notificaciones",
    muteAllDesc: "Silenciar alertas en todos los canales",
    email: "Notificaciones por Correo",
    emailDesc: "Recibe actualizaciones por correo",
    push: "Notificaciones Push",
    pushDesc: "Alertas push de navegador y móvil",
    inApp: "Notificaciones en la App",
    inAppDesc: "Campana de notificaciones en la app",
    reminders: "Recordatorios de Tareas",
    remindersDesc: "Recordatorios antes de la fecha límite",
    sprints: "Alertas de Sprints",
    sprintsDesc: "Alertas de inicio, fin o cambios en sprints",
    comments: "Notificaciones de Comentarios",
    commentsDesc: "Notificaciones de comentarios en tus tareas",
    langRegion: "Idioma y Región",
    dispLang: "Idioma de Pantalla",
    chooseLang: "Elige el idioma de la aplicación",
    appearance: "Apariencia",
    darkMode: "Modo Oscuro",
    darkModeDesc: "Cambiar entre tema claro y oscuro",
  },
  fr: {
    settings: "Paramètres",
    manage: "Gérer vos préférences",
    save: "Enregistrer",
    saved: "Enregistré !",
    notifPref: "Préférences de Notification",
    muteAll: "Couper toutes les notifications",
    muteAllDesc: "Désactiver toutes les alertes",
    email: "Notifications par E-mail",
    emailDesc: "Recevoir les mises à jour par e-mail",
    push: "Notifications Push",
    pushDesc: "Alertes push sur navigateur et mobile",
    inApp: "Notifications Intégrées",
    inAppDesc: "Cloche de notification dans l'application",
    reminders: "Rappels de Tâches",
    remindersDesc: "Rappels avant les dates d'échéance",
    sprints: "Alertes de Sprint",
    sprintsDesc: "Alertes de début, fin ou modification",
    comments: "Notifications de Commentaires",
    commentsDesc: "Notification lors de commentaires sur vos tâches",
    langRegion: "Langue & Région",
    dispLang: "Langue d'affichage",
    chooseLang: "Choisissez la langue de l'interface",
    appearance: "Apparence",
    darkMode: "Mode Sombre",
    darkModeDesc: "Basculez entre le thème clair et sombre",
  },
  de: {
    settings: "Einstellungen",
    manage: "Einstellungen verwalten",
    save: "Änderungen speichern",
    saved: "Gespeichert!",
    notifPref: "Benachrichtigungseinstellungen",
    muteAll: "Alle Benachrichtigungen stumm schalten",
    muteAllDesc: "Alle Alarme auf allen Kanälen deaktivieren",
    email: "E-Mail-Benachrichtigungen",
    emailDesc: "Updates per E-Mail erhalten",
    push: "Push-Benachrichtigungen",
    pushDesc: "Browser- und mobile Push-Alarme",
    inApp: "In-App-Benachrichtigungen",
    inAppDesc: "Benachrichtigungsglocke in der App",
    reminders: "Aufgaben-Erinnerungen",
    remindersDesc: "Erinnerungen vor Fälligkeitsterminen",
    sprints: "Sprint-Benachrichtigungen",
    sprintsDesc: "Alarme bei Sprintstart, -ende oder -änderung",
    comments: "Kommentar-Benachrichtigungen",
    commentsDesc: "Benachrichtigung bei Kommentaren zu Ihren Aufgaben",
    langRegion: "Sprache & Region",
    dispLang: "Anzeigesprache",
    chooseLang: "Sprache für die App-Oberfläche wählen",
    appearance: "Erscheinungsbild",
    darkMode: "Dunkelmodus",
    darkModeDesc: "Zwischen hellem und dunklem Design wechseln",
  },
  ja: {
    settings: "設定",
    manage: "環境設定の管理",
    save: "変更を保存",
    saved: "保存されました！",
    notifPref: "通知設定",
    muteAll: "すべての通知をミュート",
    muteAllDesc: "すべてのチャンネルのすべてのアラートを消音",
    email: "メール通知",
    emailDesc: "登録メールでアップデートを受信",
    push: "プッシュ通知",
    pushDesc: "ブラウザとモバイルのプッシュアラート",
    inApp: "アプリ内通知",
    inAppDesc: "アプリ内の通知ベル",
    reminders: "タスクリマインダー",
    remindersDesc: "タスク期日前のリマインダー",
    sprints: "スプリントアラート",
    sprintsDesc: "スプリント開始、終了、変更時のアラート",
    comments: "コメント通知",
    commentsDesc: "あなたのタスクにコメントがついた時の通知",
    langRegion: "言語と地域",
    dispLang: "表示言語",
    chooseLang: "アプリ画面の言語を選択",
    appearance: "外観",
    darkMode: "ダークモード",
    darkModeDesc: "ライトテーマとダークテーマの切り替え",
  },
  zh: {
    settings: "设置",
    manage: "管理您的偏好",
    save: "保存更改",
    saved: "已保存！",
    notifPref: "通知偏好",
    muteAll: "静音所有通知",
    muteAllDesc: "关闭所有渠道的所有提醒",
    email: "邮件通知",
    emailDesc: "通过注册邮箱接收更新",
    push: "推送通知",
    pushDesc: "浏览器与手机推送提醒",
    inApp: "应用内通知",
    inAppDesc: "应用内的通知铃铛",
    reminders: "任务提醒",
    remindersDesc: "任务截止日期前的提醒",
    sprints: "Sprint 提醒",
    sprintsDesc: "Sprint 开始、结束或变更时的提醒",
    comments: "评论通知",
    commentsDesc: "当有人评论您的任务时通知我",
    langRegion: "语言与地区",
    dispLang: "显示语言",
    chooseLang: "选择应用界面语言",
    appearance: "外观",
    darkMode: "暗黑模式",
    darkModeDesc: "切换亮色与暗色主题",
  },
};

// ─── Main Settings Page ────────────────────────────────────────────────────

export const Settings = () => {
  // Notification Preferences
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs]   = useState(true);
  const [inAppNotifs, setInAppNotifs] = useState(true);
  const [taskReminders, setTaskReminders] = useState(true);
  const [sprintAlerts, setSprintAlerts]   = useState(true);
  const [commentNotifs, setCommentNotifs] = useState(false);
  const [muteAll, setMuteAll]             = useState(false);

  // Language
  const [selectedLang, setSelectedLang] = useState<string>('en');
  const [langOpen, setLangOpen]         = useState(false);

  // Appearance
  const [darkMode, setDarkMode]         = useState(false);

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const currentLang = LANGUAGES.find((l) => l.code === selectedLang)!;
  const t = TRANSLATIONS[selectedLang] || TRANSLATIONS.en;

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
                      onClick={() => { setSelectedLang(lang.code); setLangOpen(false); }}
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
