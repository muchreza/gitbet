"use client";

import { useMemo } from "react";

interface SparklineProps {
  seed: string;
  up: boolean;
  width?: number;
  height?: number;
}

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

export function Sparkline({ seed, up, width = 80, height = 28 }: SparklineProps) {
  const points = useMemo(() => {
    const h = hashCode(seed);
    const pts: number[] = [];
    let val = 50;
    for (let i = 0; i < 20; i++) {
      const noise = ((h * (i + 1) * 7919) % 100) / 100;
      val += (noise - 0.45) * 12 + (up ? 0.8 : -0.8);
      val = Math.max(5, Math.min(95, val));
      pts.push(val);
    }
    return pts;
  }, [seed, up]);

  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;

  const pathData = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * width;
      const y = height - ((p - min) / range) * (height - 4) - 2;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  const color = up ? "#00d26a" : "#ff4d4d";

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="opacity-60">
      <path d={pathData} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
