import { useChatStore } from '../store/useChatStore';
import { useAudioPipeline } from '../hooks/useAudioPipeline';
import { Mic, Square } from 'lucide-react';
import { motion } from 'framer-motion';

export function ChatOverlay() {
  const {
    status,
    userText,
    translationText,
    isRecording,
    sourceLang,
    targetLang,
    setSourceLang,
    setTargetLang
  } = useChatStore();

  const { toggleRecording } = useAudioPipeline();

  return (
    <div className="absolute inset-0 flex flex-col justify-end pointer-events-none p-4">
      <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-700 shadow-xl overflow-hidden flex flex-col pointer-events-auto">
        
        {/* Language Controls */}
        <div className="px-3 py-2 bg-slate-800/80 flex flex-wrap gap-2 justify-between items-center text-xs border-b border-slate-700">
          <select 
            className="bg-slate-900 text-white border border-slate-600 rounded px-2 py-1 outline-none flex-1 min-w-[100px]"
            value={sourceLang}
            onChange={e => setSourceLang(e.target.value)}
          >
            <option value="auto">Auto-Detect</option>
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="es">Spanish</option>
          </select>
          <span className="text-slate-400 hidden sm:inline">→</span>
          <select 
            className="bg-slate-900 text-white border border-slate-600 rounded px-2 py-1 outline-none flex-1 min-w-[100px]"
            value={targetLang}
            onChange={e => setTargetLang(e.target.value)}
          >
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="es">Spanish</option>
          </select>
        </div>

        {/* Chat Display */}
        <div className="p-4 flex flex-col gap-2 min-h-[80px] max-h-[150px] overflow-y-auto">
          {userText && (
            <div className="text-slate-300 text-xs font-medium">
              {userText}
            </div>
          )}
          {translationText && (
            <motion.div 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-indigo-500/20 text-indigo-200 p-2 rounded text-xs border border-indigo-500/30"
            >
              {translationText}
            </motion.div>
          )}
        </div>

        {/* Controls */}
        <div className="p-3 border-t border-slate-700 flex justify-between items-center bg-slate-800/50">
          <span className="text-blue-300 text-xs font-semibold px-2 animate-pulse">{status}</span>
          <button 
            onClick={toggleRecording}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              isRecording 
                ? 'bg-red-500 hover:bg-red-600 shadow-[0_0_15px_rgba(239,68,68,0.5)] animate-pulse' 
                : 'bg-indigo-600 hover:bg-indigo-700 shadow-md'
            }`}
          >
            {isRecording ? <Square fill="white" className="text-white w-5 h-5" /> : <Mic className="text-white w-6 h-6" />}
          </button>
        </div>
      </div>
    </div>
  );
}
