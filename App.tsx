
import React, { useState, useEffect, useCallback } from 'react';
import { Translation, EraMode, TranslationDirection } from './types';
import { translateToEra } from './services/geminiService';
import VibeMeter from './components/VibeMeter';
import HistoryList from './components/HistoryList';

const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Translation | null>(null);
  const [history, setHistory] = useState<Translation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [era, setEra] = useState<EraMode>('modern');
  const [direction, setDirection] = useState<TranslationDirection>('to-slang');

  // Load history from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('vibe_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Save history to local storage
  useEffect(() => {
    localStorage.setItem('vibe_history', JSON.stringify(history.slice(0, 15)));
  }, [history]);

  const handleTranslate = async () => {
    if (!inputText.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await translateToEra(inputText, era, direction);
      
      const newTranslation: Translation = {
        id: Math.random().toString(36).substr(2, 6).toUpperCase(),
        original: inputText,
        translated: response.translatedText,
        timestamp: Date.now(),
        vibeStats: response.stats,
        era: era,
        direction: direction,
      };

      setResult(newTranslation);
      setHistory(prev => [newTranslation, ...prev].slice(0, 15));
      setInputText('');
    } catch (err: any) {
      setError(err.message || "Big L. Server crashed.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.translated);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSelectHistory = useCallback((t: Translation) => {
    setResult(t);
    setEra(t.era);
    setDirection(t.direction || 'to-slang');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const toggleEra = (newEra: EraMode) => {
    setEra(newEra);
    setResult(null); // Reset result for clarity when era changes
  };

  return (
    <div className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 xl:px-16 py-12 md:py-24 xl:py-32 no-scrollbar">
      {/* Header */}
      <header className="text-center mb-12 md:mb-20 xl:mb-24 space-y-4 xl:space-y-6 animate-in fade-in slide-in-from-top duration-1000">
        <div className="flex flex-col items-center gap-6">
          <div className="inline-block px-5 py-2 rounded-full bg-slate-500/10 border border-slate-500/20 text-slate-400 text-[10px] md:text-xs font-black uppercase tracking-[0.25em]">
            Timeline Translator v2.3 ⚡
          </div>

          {/* Era Toggle Switch */}
          <div className="bg-slate-900/50 p-1.5 rounded-full border border-slate-800 flex items-center gap-1">
            <button 
              onClick={() => toggleEra('modern')}
              className={`px-6 py-2 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest transition-all ${
                era === 'modern' ? 'bg-cyan-500 text-black' : 'text-slate-500 hover:text-white'
              }`}
            >
              Modern (Brain Rot)
            </button>
            <button 
              onClick={() => toggleEra('2016')}
              className={`px-6 py-2 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest transition-all ${
                era === '2016' ? 'bg-orange-500 text-black' : 'text-slate-500 hover:text-white'
              }`}
            >
              2016 (Lit Era)
            </button>
          </div>
        </div>

        <h1 className="text-6xl sm:text-8xl md:text-9xl xl:text-7xl 2xl:text-8xl font-black tracking-tighter text-white uppercase italic leading-[0.85] select-none">
          VIBE<span className={`text-transparent bg-clip-text bg-gradient-to-r transition-all duration-500 pr-3 md:pr-6 xl:pr-4 ${
            era === 'modern' 
            ? 'from-cyan-400 via-blue-500 to-emerald-400' 
            : 'from-orange-400 via-red-500 to-yellow-400'
          }`}>CHECK</span>
        </h1>
        
        <p className="text-slate-400 text-base sm:text-lg md:text-xl xl:text-lg font-medium max-w-2xl mx-auto leading-relaxed px-4">
          Upgrade your boomer syntax to {era === 'modern' ? (
            <span className="text-white font-bold">Absolute Brain Rot</span>
          ) : (
            <span className="text-white font-bold">Pure Savage 2016 Lit-ness</span>
          )}. No cap, deadass.
        </p>
      </header>

      {/* Main UI */}
      <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-start">
        <div className="space-y-6 md:space-y-8">
          <div className="relative group">
            <div className="flex justify-between items-center mb-4 px-2">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">Input Feed</label>
              <button 
                onClick={() => setDirection(direction === 'to-slang' ? 'to-normal' : 'to-slang')} 
                className={`text-[11px] font-black uppercase tracking-[0.2em] transition-colors px-4 py-1.5 rounded-full border ${
                  era === 'modern' ? 'text-cyan-500 bg-cyan-500/5 border-cyan-500/10 hover:text-cyan-300' : 'text-orange-500 bg-orange-500/5 border-orange-500/10 hover:text-orange-300'
                }`}
              >
                {direction === 'to-slang' ? '→ Slang' : '→ Normal'}
              </button>
            </div>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={direction === 'to-slang' ? `Enter boring text to make it ${era === 'modern' ? 'Skibidi' : 'Lit'}...` : `Enter ${era === 'modern' ? 'Brain Rot' : 'Lit'} text to make it normal...`}
              className={`w-full h-48 md:h-64 xl:h-56 bg-slate-900/40 border-2 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 xl:p-6 text-lg md:text-xl xl:text-lg focus:outline-none focus:bg-slate-900/60 transition-all placeholder:text-slate-800 resize-none shadow-[0_30px_100px_rgba(0,0,0,0.3)] backdrop-blur-3xl text-white font-medium no-scrollbar ${
                era === 'modern' ? 'border-slate-800/50 focus:border-cyan-500/50' : 'border-slate-800/50 focus:border-orange-500/50'
              }`}
            />
          </div>

          <button
            onClick={handleTranslate}
            disabled={loading || !inputText.trim()}
            className={`w-full py-4 md:py-6 xl:py-5 rounded-[2rem] md:rounded-[2.5rem] font-black text-lg md:text-2xl xl:text-xl uppercase italic tracking-tighter transition-all transform active:scale-[0.97] flex items-center justify-center gap-3 ${
              loading 
              ? 'bg-slate-800 text-slate-600 cursor-not-allowed' 
              : era === 'modern' 
                ? 'bg-white text-black hover:bg-cyan-400 hover:shadow-[0_0_80px_rgba(34,211,238,0.4)] shadow-[0_0_60px_rgba(34,211,238,0.15)]' 
                : 'bg-white text-black hover:bg-orange-400 hover:shadow-[0_0_80px_rgba(251,146,60,0.4)] shadow-[0_0_60px_rgba(251,146,60,0.15)]'
            } transition-all duration-300`}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-b-4 border-black"></div>
                COOKING... 🔥
              </>
            ) : (
              <>
                {era === 'modern' ? 'LET HIM COOK 🔥' : 'GET LIT FAM 🔥'}
              </>
            )}
          </button>

          {error && (
            <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-3xl text-red-500 text-center font-black uppercase text-sm tracking-widest animate-in fade-in zoom-in">
              Big L: {error}
            </div>
          )}
        </div>

        {/* Results */}
        <div className="space-y-8 min-h-[350px] md:min-h-[450px]">
          {!result && !loading && (
            <div className="h-full min-h-[300px] md:min-h-[400px] xl:min-h-[350px] flex flex-col items-center justify-center p-8 md:p-12 xl:p-10 bg-slate-900/10 rounded-[2.5rem] border-2 border-dashed border-slate-800/30 text-slate-700 text-center space-y-4">
              <div className="text-4xl md:text-6xl xl:text-5xl opacity-10 grayscale select-none">
                {era === 'modern' ? '💀' : '💯'}
              </div>
              <p className="font-black uppercase tracking-[0.4em] italic text-sm md:text-lg">Awaiting the Cook... 👨‍🍳</p>
            </div>
          )}

          {loading && (
            <div className="space-y-8 animate-pulse">
              <div className="h-40 bg-slate-900/30 rounded-[2.5rem] border border-slate-800/50"></div>
              <div className="h-60 bg-slate-900/30 rounded-[2.5rem] border border-slate-800/50"></div>
            </div>
          )}

          {result && !loading && (
            <div className="animate-in zoom-in fade-in slide-in-from-bottom-12 duration-700 space-y-8 no-scrollbar">
              <div className="relative p-6 md:p-10 xl:p-8 bg-gradient-to-br from-white to-slate-200 text-slate-950 rounded-[2.5rem] md:rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.5)] group/card">
                <button 
                  onClick={copyToClipboard}
                  className={`absolute -top-4 -right-4 w-12 h-12 md:w-16 md:h-16 xl:w-14 xl:h-14 bg-black text-white rounded-full shadow-2xl hover:scale-110 transition-transform active:scale-90 flex items-center justify-center text-lg md:text-2xl xl:text-xl border-4 md:border-6 xl:border-4 border-[#020617] z-20`}
                  title="Copy Translation"
                >
                  {copied ? '✅' : era === 'modern' ? '🧊' : '💯'}
                </button>
                <div className="flex items-center gap-3 mb-6">
                   <span className="px-4 py-1.5 bg-black text-white font-black rounded-xl text-[10px] md:text-xs uppercase tracking-widest">
                    {era === 'modern' ? 'SIGMA-VERIFIED' : 'FLEEK-APPROVED'}
                   </span>
                   <span className="text-slate-400 text-[10px] md:text-xs font-black uppercase tracking-widest">Era: {era.toUpperCase()}</span>
                </div>
                <p className="text-xl md:text-3xl xl:text-2xl font-black leading-[1.1] mb-6 xl:mb-8 tracking-tight">
                  {result.translated}
                </p>
                <div className="pt-6 border-t border-slate-300/60">
                  <span className="text-[10px] md:text-xs text-slate-400 font-black uppercase tracking-widest block mb-2">Source Material:</span>
                  <p className="text-slate-600 text-sm md:text-base xl:text-sm italic font-medium line-clamp-4 leading-relaxed">"{result.original}"</p>
                </div>
              </div>

              <VibeMeter stats={result.vibeStats} era={result.era} />
            </div>
          )}
        </div>
      </main>

      {/* History Section */}
        <div className="no-scrollbar mt-16 md:mt-24 xl:mt-20">
        <HistoryList history={history} onSelect={handleSelectHistory} />
      </div>

      {/* Credits */}
      <footer className="mt-16 md:mt-24 xl:mt-20 pb-20 text-center space-y-6 opacity-40">
        <div className="h-px w-32 md:w-48 bg-gradient-to-r from-transparent via-slate-700 to-transparent mx-auto mb-10"></div>
        <p className="text-slate-500 text-[11px] md:text-xs font-black uppercase tracking-[0.6em]">
          Powered by Gemini • Time Traveler Edition • Stay Cold 🧊
        </p>
      </footer>
    </div>
  );
};

export default App;
