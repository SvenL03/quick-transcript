"use client";

interface Settings {
  paragraphs: boolean;
  timestamps: boolean;
}

interface Props {
  settings: Settings;
  onChange: (s: Settings) => void;
}

export default function TranscriptSettings({ settings, onChange }: Props) {
  function toggle(key: keyof Settings) {
    onChange({ ...settings, [key]: !settings[key] });
  }

  return (
    <div className="space-y-3">
      <p className="text-xs font-medium text-[#6B7280] uppercase tracking-wide">Settings</p>
      <div className="space-y-2">
        <Toggle
          label="Paragraph breaks"
          checked={settings.paragraphs}
          onChange={() => toggle("paragraphs")}
        />
        <Toggle
          label="Timestamps"
          checked={settings.timestamps}
          onChange={() => toggle("timestamps")}
        />
      </div>
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex items-center justify-between cursor-pointer select-none">
      <span className="text-sm text-[#111827]">{label}</span>
      <button
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={`relative w-10 h-6 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-2
          ${checked ? "bg-[#2563EB]" : "bg-[#E5E7EB]"}`}
      >
        <span
          className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform
            ${checked ? "translate-x-5" : "translate-x-1"}`}
        />
      </button>
    </label>
  );
}
