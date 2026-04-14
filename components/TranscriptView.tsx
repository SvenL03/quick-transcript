"use client";

import { useState } from "react";

interface Props {
  text: string;
  onReset: () => void;
}

export default function TranscriptView({ text, onReset }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 text-sm text-[#6B7280] hover:text-[#111827] transition-colors"
        >
          <ArrowLeftIcon />
          New file
        </button>
        <button
          onClick={handleCopy}
          aria-label="Copy transcript to clipboard"
          className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg border transition-colors
            ${copied
              ? "border-[#16A34A] text-[#16A34A]"
              : "border-[#E5E7EB] text-[#111827] hover:border-[#2563EB] hover:text-[#2563EB]"
            }`}
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
          <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>

      <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 min-h-[200px]">
        {text.split("\n\n").map((block, i) => (
          <p key={i} className="text-sm leading-relaxed mb-4 last:mb-0">
            {block.split("\n").map((line, j) => (
              <span key={j}>
                {formatLine(line)}
                {j < block.split("\n").length - 1 && <br />}
              </span>
            ))}
          </p>
        ))}
      </div>
    </div>
  );
}

// Render [M:SS] timestamps in muted monospace
function formatLine(line: string) {
  const tsRegex = /^(\[\d+:\d{2}\])\s*/;
  const match = line.match(tsRegex);
  if (match) {
    return (
      <>
        <span className="text-xs font-mono text-[#6B7280] mr-2">{match[1]}</span>
        {line.slice(match[0].length)}
      </>
    );
  }
  return line;
}

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}
