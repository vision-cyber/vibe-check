
import React from 'react';
import { Translation } from '../types';

interface HistoryListProps {
  history: Translation[];
  onSelect: (t: Translation) => void;
}

const HistoryList: React.FC<HistoryListProps> = ({ history, onSelect }) => {
  if (history.length === 0) return null;

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="flex items-center gap-6 mb-12">
        <h2 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-400 to-slate-600 uppercase tracking-widest">
          TIMELINE LOGS 💾
        </h2>
        <div className="flex-1 h-px bg-slate-800/50"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {history.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item)}
            className="w-full text-left p-8 md:p-10 bg-slate-900/20 hover:bg-slate-900/50 border border-slate-800/40 rounded-[2.5rem] transition-all group relative overflow-hidden active:scale-[0.98] backdrop-blur-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">
                  ID: {item.id} • {new Date(item.timestamp).toLocaleTimeString()}
                </span>
                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full w-fit ${
                  item.era === 'modern' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-orange-500/20 text-orange-400'
                }`}>
                  Era: {item.era}
                </span>
              </div>
              <div className="flex gap-2">
                <span className="px-3 py-1 rounded-full bg-slate-500/10 text-slate-400 text-[9px] font-black uppercase border border-slate-500/10">
                  {item.era === 'modern' ? 'DRIP' : 'FLEEK'}: {item.vibeStats.drip}
                </span>
              </div>
            </div>
            <p className="text-slate-500 line-clamp-1 italic mb-3 text-sm">
              "{item.original}"
            </p>
            <p className="text-white font-bold group-hover:text-cyan-400 transition-colors text-xl md:text-2xl leading-tight">
              {item.translated}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default HistoryList;
