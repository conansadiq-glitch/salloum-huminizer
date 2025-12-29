
import React from 'react';

interface ScoreGaugeProps {
  score: number;
  label: string;
  colorClass: string;
}

const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score, label, colorClass }) => {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center p-4 rounded-2xl glass transition-all hover:scale-105">
      <div className="relative inline-flex items-center justify-center">
        <svg className="w-32 h-32 transform -rotate-90">
          <circle
            className="text-slate-800"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="64"
            cy="64"
          />
          <circle
            className={colorClass}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="64"
            cy="64"
          />
        </svg>
        <span className="absolute text-2xl font-bold">{score}%</span>
      </div>
      <p className="mt-2 text-sm font-medium text-slate-400 uppercase tracking-wider">{label}</p>
    </div>
  );
};

export default ScoreGauge;
