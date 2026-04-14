"use client";

import { useRef, useState } from "react";

interface Props {
  onFile: (file: File) => void;
  file: File | null;
  onClear: () => void;
}

const ACCEPTED = ["audio/mpeg", "audio/mp4", "audio/x-m4a", "audio/wav", "audio/wave", "audio/webm"];
const ACCEPTED_EXT = ".mp3,.m4a,.wav,.webm";
const MAX_BYTES = 500 * 1024 * 1024; // 500 MB

export default function AudioDropzone({ onFile, file, onClear }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");

  function validate(f: File): string {
    if (f.size > MAX_BYTES) return "File is too large. Try under 500 MB.";
    if (!ACCEPTED.includes(f.type) && !f.name.match(/\.(mp3|m4a|wav|webm)$/i)) {
      return "Unsupported format. Use mp3, m4a, or wav.";
    }
    return "";
  }

  function handleFile(f: File) {
    const err = validate(f);
    if (err) { setError(err); return; }
    setError("");
    onFile(f);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
    e.target.value = "";
  }

  function formatSize(bytes: number) {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  if (file) {
    return (
      <div className="border border-[#E5E7EB] rounded-xl px-5 py-4 flex items-center justify-between bg-white">
        <div className="flex items-center gap-3 min-w-0">
          <AudioFileIcon />
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{file.name}</p>
            <p className="text-xs text-[#6B7280]">{formatSize(file.size)}</p>
          </div>
        </div>
        <button
          onClick={onClear}
          aria-label="Remove file"
          className="ml-4 text-[#6B7280] hover:text-[#111827] transition-colors flex-shrink-0"
        >
          <XIcon />
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`w-full border-2 border-dashed rounded-xl px-6 py-10 flex flex-col items-center gap-3 transition-colors cursor-pointer
          ${dragging
            ? "border-[#2563EB] bg-[#EFF6FF]"
            : "border-[#E5E7EB] bg-white hover:border-[#2563EB] hover:bg-[#EFF6FF]"
          }`}
      >
        <UploadIcon />
        <div className="text-center">
          <p className="text-sm font-medium">Drop audio here, or click to browse</p>
          <p className="text-xs text-[#6B7280] mt-1">mp3 · m4a · wav</p>
        </div>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_EXT}
        onChange={onInputChange}
        className="hidden"
      />
      {error && (
        <p className="text-sm text-[#DC2626] mt-2">{error}</p>
      )}
    </div>
  );
}

function UploadIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

function AudioFileIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
