"use client";
import { useState } from "react";

const dataPoints = [
  { cx: 150, cy: 110, week: "Week 1", day: "Day 7",  value: 21 },
  { cx: 300, cy: 70,  week: "Week 2", day: "Day 14", value: 32 },
  { cx: 450, cy: 80,  week: "Week 3", day: "Day 21", value: 28 },
  { cx: 600, cy: 50,  week: "Week 3", day: "Day 28", value: 45 },
  { cx: 800, cy: 10,  week: "Week 4", day: "Day 35", value: 63 },
];


export const ChartVisual = () => {
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    value: number;
    day: string;
    week: string;
  } | null>(null);
  return (
    <div className="flex-1 w-full min-h-[250px] relative mt-2">
      {/* SVG Chart Representation */}
      <svg
        className="w-full h-full overflow-visible"
        preserveAspectRatio="none"
        viewBox="0 0 800 200"
      >
        <defs>
          <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#137fec" stopOpacity="0.2"></stop>
            <stop offset="100%" stopColor="#137fec" stopOpacity="0"></stop>
          </linearGradient>
        </defs>
        {/* Grid Lines */}
        <line
          className="dark:stroke-slate-700"
          stroke="#e2e8f0"
          strokeDasharray="4"
          x1="0"
          x2="800"
          y1="150"
          y2="150"
        ></line>
        <line
          className="dark:stroke-slate-700"
          stroke="#e2e8f0"
          strokeDasharray="4"
          x1="0"
          x2="800"
          y1="100"
          y2="100"
        ></line>
        <line
          className="dark:stroke-slate-700"
          stroke="#e2e8f0"
          strokeDasharray="4"
          x1="0"
          x2="800"
          y1="50"
          y2="50"
        ></line>
        {/* Area Path */}
        <path
          d="M0,150 C50,140 100,100 150,110 C200,120 250,80 300,70 C350,60 400,90 450,80 C500,70 550,40 600,50 C650,60 700,30 750,20 L800,10 V200 H0 Z"
          fill="url(#chartGradient)"
        ></path>
        {/* Line Path */}
        <path
          d="M0,150 C50,140 100,100 150,110 C200,120 250,80 300,70 C350,60 400,90 450,80 C500,70 550,40 600,50 C650,60 700,30 750,20 L800,10"
          fill="none"
          stroke="#137fec"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3"
        ></path>
        {/* Data Points */}
        {dataPoints.map((point, i) => (
  <circle
    key={i}
    cx={point.cx}
    cy={point.cy}
    r="6"
    fill="white"
    stroke="#137fec"
    strokeWidth="2"
    className="cursor-pointer"
    onMouseEnter={(e) => {
      const svg = (e.target as SVGCircleElement).closest("svg")!;
      const rect = svg.getBoundingClientRect();
      const scaleX = rect.width / 800;
      const scaleY = rect.height / 200;
      setTooltip({
        x: point.cx * scaleX,
        y: point.cy * scaleY,
        value: point.value,
        day: point.day,
        week: point.week,
      });
    }}
    onMouseLeave={() => setTooltip(null)}
  />
))}
      </svg>
      {tooltip && (
  <div
    className="absolute z-10 pointer-events-none"
    style={{
      left: tooltip.x,
      top: tooltip.y - 60,
      transform: "translateX(-50%)",
    }}
  >
    <div className="bg-slate-800 text-white text-xs rounded-lg px-3 py-2 shadow-lg whitespace-nowrap">
      <div className="font-semibold text-blue-300">{tooltip.week} · {tooltip.day}</div>
      <div className="mt-0.5">Users: <span className="font-bold text-white">{tooltip.value}</span></div>
    </div>
    <div className="flex justify-center">
      <div className="w-2 h-2 bg-slate-800 rotate-45 -mt-1" />
    </div>
  </div>
)}
    </div>
  );
};
