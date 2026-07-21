import React, { useState, useEffect } from 'react';
import { Mic, MicOff, X, Send, Sparkles, CheckCircle, Keyboard, Play, ShieldAlert } from 'lucide-react';
import { AlertItem, createAlert } from '../utils/alertStorage';
import { getActiveProfile } from '../utils/profileHelper';

interface MaestroVoiceProps {
  onClose: () => void;
}

interface SpeechRecognitionResultEvent {
  results: { [index: number]: { [index: number]: { transcript: string } } };
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

interface SpeechRecognitionLike {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: (() => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  onresult: ((event: SpeechRecognitionResultEvent) => void) | null;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognitionLike;
}

const VOICE_SUGGESTIONS = [
  "Remind me to renew my passport",
  "Alert: check athletic scout reports",
  "Remind me to call the supplier at 10 AM",
  "Create high priority task to review presentation slides",
  "Remind me to schedule vehicle service next week",
];

const MaestroVoice: React.FC<MaestroVoiceProps> = ({ onClose }) => {
  const [profile] = useState(getActiveProfile());
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [assistantResponse, setAssistantResponse] = useState<string>('Listening for command...');
  const [lastCreatedAlert, setLastCreatedAlert] = useState<AlertItem | null>(null);
  const [recognition, setRecognition] = useState<SpeechRecognitionLike | null>(null);
  const [showKeyboardInput, setShowKeyboardInput] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [visualizerHeights, setVisualizerHeights] = useState<number[]>([15, 40, 20, 50, 10, 30, 25, 45, 12, 35]);

  // Handle Speech Recognition Setup
  useEffect(() => {
    const browserWindow = window as Window & {
      SpeechRecognition?: SpeechRecognitionConstructor;
      webkitSpeechRecognition?: SpeechRecognitionConstructor;
    };
    const SpeechRecognition = browserWindow.SpeechRecognition || browserWindow.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onstart = () => {
        setIsListening(true);
        setAssistantResponse(`Microphone is active. Go ahead, ${profile.name}…`);
      };

      rec.onerror = (event: SpeechRecognitionErrorEvent) => {
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setAssistantResponse("Microphone permission denied. Feel free to type or tap a command suggestion below.");
        } else {
          setAssistantResponse("Voice signal interrupted. Please type or select a command.");
        }
      };

      rec.onend = () => {
        setIsListening(false);
      };

      rec.onresult = (event: SpeechRecognitionResultEvent) => {
        const speechToText = event.results[0][0].transcript;
        setInputText(speechToText);
        handleProcessCommand(speechToText);
      };

      setRecognition(rec);
      return () => rec.abort();
    }
  }, []);

  // Voice waves pulsing simulation
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isListening || isAnalyzing) {
      interval = setInterval(() => {
        setVisualizerHeights(
          Array.from({ length: 10 }, () => Math.floor(Math.random() * (isAnalyzing ? 30 : 65)) + 10)
        );
      }, 100);
    } else {
      setVisualizerHeights([10, 15, 12, 10, 8, 12, 10, 14, 10, 12]);
    }
    return () => clearInterval(interval);
  }, [isListening, isAnalyzing]);

  const toggleListening = () => {
    if (!recognition) {
      // Fallback for browsers with no speech API or inside restricted iframe
      setAssistantResponse("Web Speech API restricted in this environment. Please type or tap a tactical command.");
      setShowKeyboardInput(true);
      return;
    }

    if (isListening) {
      recognition.stop();
    } else {
      setLastCreatedAlert(null);
      setInputText('');
      try {
        recognition.start();
      } catch (e) {
        recognition.stop();
      }
    }
  };

  // Browser-only rules convert a transcript into a local demo alert.
  const handleProcessCommand = async (command: string) => {
    if (!command.trim()) return;
    
    setIsAnalyzing(true);
    setAssistantResponse("Applying local keyword rules…");
    
    setTimeout(() => {
      let title = command;
      let description = `Created via MaestroVoice assistant transcription: "${command}"`;
      let urgency: 'high' | 'medium' | 'low' = 'medium';
      let category = 'Maestro Voice';

      const lower = command.toLowerCase();

      // Deliberately simple, inspectable parsing heuristics.
      if (lower.startsWith('remind me to ')) {
        title = command.substring(13);
        // capitalize first letter
        title = title.charAt(0).toUpperCase() + title.slice(1);
      } else if (lower.startsWith('alert: ')) {
        title = command.substring(7);
        title = title.charAt(0).toUpperCase() + title.slice(1);
        urgency = 'high';
      } else if (lower.startsWith('create high priority task to ')) {
        title = command.substring(29);
        title = title.charAt(0).toUpperCase() + title.slice(1);
        urgency = 'high';
        category = 'Consulting';
      } else if (lower.startsWith('create task to ')) {
        title = command.substring(15);
        title = title.charAt(0).toUpperCase() + title.slice(1);
      }

      // Extract high urgency keywords
      if (lower.includes('urgent') || lower.includes('priority') || lower.includes('emergency') || lower.includes('asap') || lower.includes('critical')) {
        urgency = 'high';
      }

      // Extract category keywords
      if (lower.includes('family') || lower.includes('home') || lower.includes('passport')) {
        category = 'Family Care';
      } else if (lower.includes('summit') || lower.includes('slides') || lower.includes('keynote') || lower.includes('consulting') || lower.includes('work')) {
        category = 'Consulting';
      }

      // Save the alert to unencrypted browser localStorage.
      const newAlert = createAlert(title, description, urgency, category);
      
      setLastCreatedAlert(newAlert);
      setAssistantResponse(`Local alert created, ${profile.name}.`);
      setIsAnalyzing(false);
      setInputText('');
    }, 1500);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputText(suggestion);
    handleProcessCommand(suggestion);
  };

  return (
    <div className="fixed inset-0 z-[300] bg-[#0D0D0D]/95 backdrop-blur-2xl flex flex-col justify-between p-6 md:p-8 animate-in fade-in duration-300">
      
      {/* Top Header */}
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-primary animate-pulse"></span>
          <span className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] font-mono">Browser Assistant Demo</span>
        </div>
        <button
          onClick={onClose}
          className="size-10 flex items-center justify-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all active:scale-95"
        >
          <X className="size-5" />
        </button>
      </div>

      {/* Assistant Voice response & Visualizer */}
      <div className="flex flex-col items-center justify-center flex-1 w-full gap-8 text-center max-w-md mx-auto">
        
        {/* Dynamic Wave Ring */}
        <div className="relative size-48 rounded-2xl bg-slate-950/45 border border-slate-900 flex items-center justify-center shadow-2xl">
          <div className="absolute inset-4 rounded-2xl bg-primary/5 blur-xl animate-pulse"></div>
          
          {/* Wave Lines Visualizer */}
          <div className="flex items-center gap-1.5 h-20 z-10">
            {visualizerHeights.map((h, i) => (
              <div 
                key={i} 
                className="w-1.5 rounded-full bg-primary shadow-lg shadow-primary/40 transition-all duration-100"
                style={{ 
                  height: `${h}px`,
                  opacity: isListening ? 1 : isAnalyzing ? 0.8 : 0.4
                }}
              ></div>
            ))}
          </div>
        </div>

        <div className="space-y-3 px-2">
          <p className="text-sm font-black uppercase tracking-widest text-primary flex items-center justify-center gap-1.5">
            <Sparkles className="size-3.5" /> Maestro Core
          </p>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight leading-snug">
            {assistantResponse}
          </h2>
        </div>

        {/* Action Success Card */}
        {lastCreatedAlert && (
          <div className="w-full bg-primary/5 border border-primary/20 rounded-3xl p-5 text-left animate-in slide-in-from-bottom-5 duration-300 shadow-xl">
            <div className="flex items-center gap-2 mb-2 text-primary">
              <CheckCircle className="size-4 shrink-0" />
              <span className="text-[10px] font-black uppercase tracking-widest">Alert Saved Locally</span>
            </div>
            <h4 className="text-white font-black text-sm uppercase tracking-tight">{lastCreatedAlert.title}</h4>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{lastCreatedAlert.description}</p>
            <div className="flex gap-2.5 mt-3 pt-3 border-t border-slate-850/30 text-[9px] text-slate-500 font-bold uppercase">
              <span>Urgency: <strong className={lastCreatedAlert.urgency === 'high' ? 'text-red-400' : 'text-slate-400'}>{lastCreatedAlert.urgency}</strong></span>
              <span>•</span>
              <span>Category: <strong>{lastCreatedAlert.category}</strong></span>
            </div>
          </div>
        )}

        {/* Input Textbox fallback */}
        {showKeyboardInput && !lastCreatedAlert && (
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleProcessCommand(inputText);
            }}
            className="w-full flex bg-slate-900 border border-slate-850 rounded-2xl p-1.5 items-center gap-2"
          >
            <input 
              type="text" 
              placeholder="Type your spoken command..." 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="bg-transparent border-none focus:ring-0 text-white font-medium text-xs flex-1 px-3 py-2"
            />
            <button 
              type="submit" 
              disabled={!inputText.trim() || isAnalyzing}
              className="size-10 rounded-xl bg-primary hover:bg-orange-500 transition-colors flex items-center justify-center text-black disabled:opacity-50"
            >
              <Send className="size-4" />
            </button>
          </form>
        )}
      </div>

      {/* Suggestions and Microphone Controller */}
      <div className="w-full flex flex-col items-center gap-6 pb-6 max-w-md mx-auto">
        
        {/* Suggested spoken commands */}
        {!lastCreatedAlert && !isListening && !isAnalyzing && (
          <div className="w-full space-y-2">
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 text-left px-2">Suggested Commands</p>
            <div className="flex gap-2 overflow-x-auto hide-scrollbar w-full py-1">
              {VOICE_SUGGESTIONS.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-4 py-2.5 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-slate-850 hover:border-slate-700 text-slate-300 font-medium text-[11px] whitespace-nowrap transition-all active:scale-95 text-left flex items-center gap-2"
                >
                  <Play className="size-2.5 text-primary" />
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="w-full border border-primary/30 bg-primary/5 p-3 text-left">
          <div className="flex gap-2"><ShieldAlert className="mt-0.5 size-4 shrink-0 text-primary" /><p className="text-[9px] leading-relaxed text-slate-400">Voice recognition is provided by your browser and may use its vendor's speech service. Typed commands stay in this browser. Alerts are stored locally without encryption.</p></div>
        </div>

        {/* Mic Control Row */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowKeyboardInput(!showKeyboardInput)}
            className={`size-12 rounded-full border flex items-center justify-center transition-all ${
              showKeyboardInput 
                ? 'bg-primary/20 border-primary text-primary' 
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
            }`}
            title="Toggle keyboard input"
          >
            <Keyboard className="size-5" />
          </button>

          <button 
            onClick={toggleListening}
            disabled={isAnalyzing}
            className={`relative size-20 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 active:scale-95 ${
              isListening 
                ? 'bg-red-500 text-white shadow-red-500/20' 
                : 'bg-primary text-black shadow-primary/30 hover:bg-orange-500'
            }`}
          >
            {isListening ? (
              <MicOff className="size-8" />
            ) : (
              <Mic className="size-8" />
            )}
            {isListening && (
              <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-25"></div>
            )}
          </button>

          {lastCreatedAlert ? (
            <button
              onClick={onClose}
              className="size-12 rounded-full bg-primary text-black flex items-center justify-center shadow-xl shadow-primary/20 animate-bounce"
            >
              <CheckCircle className="size-5" />
            </button>
          ) : (
            <div className="size-12"></div>
          )}
        </div>

        <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em]">
          {isListening ? 'MICROPHONE ACTIVE — TAP TO STOP' : 'TAP MIC FOR BROWSER SPEECH RECOGNITION'}
        </p>
      </div>

    </div>
  );
};

export default MaestroVoice;
