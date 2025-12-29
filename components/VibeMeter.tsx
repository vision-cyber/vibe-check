
import React from 'react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  ResponsiveContainer 
} from 'recharts';
import { VibeStats, EraMode } from '../types';

interface VibeMeterProps {
  stats: VibeStats;
  era: EraMode;
}

const VibeMeter: React.FC<VibeMeterProps> = ({ stats, era }) => {
  const isModern = era === 'modern';
  
  const data = [
    { subject: isModern ? 'Rizz' : 'Swag', A: stats.rizz, fullMark: 100 },
    { subject: isModern ? 'Aura' : 'Clout', A: stats.aura, fullMark: 100 },
    { subject: isModern ? 'Brain Rot' : 'Savage', A: stats.brainRot, fullMark: 100 },
    { subject: isModern ? 'Drip' : 'Fleek', A: stats.drip, fullMark: 100 },
  ];

  const accentColor = isModern ? "#22d3ee" : "#f59e0b";

  return (
    <div className="w-full h-64 bg-slate-900/60 rounded-3xl p-4 border border-slate-800 backdrop-blur-md shadow-2xl">
      <h3 className="text-center text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2">
        {era === 'modern' ? 'AURA DIAGNOSTICS' : 'SQUAD CALIBRATION'}
      </h3>
      <ResponsiveContainer width="100%" height="90%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#334155" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 900 }} />
          <Radar
            name="Vibes"
            dataKey="A"
            stroke={accentColor}
            fill={accentColor}
            fillOpacity={0.4}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VibeMeter;
