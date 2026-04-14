"use client";

import { useEffect, useState } from "react";

interface Props {
  isLoading: boolean;
  isComplete: boolean;
}

const SIZE = 80;
const STROKE = 6;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function ProgressRing({ isLoading, isComplete }: Props) {
  const [progress, setProgress] = useState(0);

  // Fake progress: rushes to ~20%, then crawls asymptotically toward 80%
  useEffect(() => {
    if (!isLoading) {
      setProgress(0);
      return;
    }

    let current = 0;
    let frame: ReturnType<typeof setTimeout>;

    function tick() {
      current += (80 - current) * 0.045;
      setProgress(Math.min(current, 79.5));
      frame = setTimeout(tick, 120);
    }

    frame = setTimeout(tick, 120);
    return () => clearTimeout(frame);
  }, [isLoading]);

  // Snap to 100% when done
  useEffect(() => {
    if (isComplete) setProgress(100);
  }, [isComplete]);

  const offset = CIRCUMFERENCE * (1 - progress / 100);
  const pct = Math.round(progress);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: SIZE, height: SIZE }}>
        <svg width={SIZE} height={SIZE} className="-rotate-90">
          {/* Track */}
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="#E5E7EB"
            strokeWidth={STROKE}
          />
          {/* Progress arc */}
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="#2563EB"
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            style={{ transition: isComplete ? "stroke-dashoffset 0.4s ease" : "stroke-dashoffset 0.12s linear" }}
          />
        </svg>
        {/* Percentage label */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-medium text-[#111827]">{pct}%</span>
        </div>
      </div>
      <p className="text-sm text-[#6B7280]">Transcribing…</p>
    </div>
  );
}
