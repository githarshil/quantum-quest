import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Sparkles, Send, Lightbulb, Mic, MicOff, Volume2, VolumeX, BookOpen, User, RotateCcw } from 'lucide-react';
import Pushpin from './Pushpin';
import Tape from './Tape';
import NovaMascot from './NovaMascot';
import { API_BASE_URL } from '../apiConfig';

export default function NovaGuide({ 
  initialMessage = "Cadet! I'm Nova, your laboratory AI. I'll help you decode quantum behaviors and troubleshoot your circuit.",
  mood = 'happy',
  onAskNova,
  suggestedActions = ["How do I create a Bell State?", "What does superposition mean?"],
  lessonId = null,
  missionId = null,
  circuitData = null,
  simulationResult = null,
}) {
  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'nova', text: initialMessage, mood: mood, sources: [] }
  ]);
  const [loading, setLoading] = useState(false);
  const [sources, setSources] = useState(null);

  // Voice state
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [ttsSupported, setTtsSupported] = useState(false);

  const recognitionRef = useRef(null);
  const synthRef = useRef(null);
  const chatContainerRef = useRef(null);
  const isInitialMount = useRef(true);

  const scrollToBottom = (smooth = true) => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto'
      });
    }
  };

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    scrollToBottom(true);
  }, [messages, loading]);

  const prevMessageRef = useRef(initialMessage);
  // Update if initialMessage changes (e.g. after simulation)
  useEffect(() => {
    if (prevMessageRef.current !== initialMessage) {
      prevMessageRef.current = initialMessage;
      queueMicrotask(() => {
        setMessages(prev => [...prev, { sender: 'nova', text: initialMessage, mood, sources: [] }]);
        setSources(null);
      });
    }
  }, [initialMessage, mood]);

  // Check for speech API support on mount
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    setSpeechSupported(!!SpeechRecognition);
    setTtsSupported('speechSynthesis' in window);
    synthRef.current = window.speechSynthesis || null;
  }, []);

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch {}
      }
      if (synthRef.current) {
        try { synthRef.current.cancel(); } catch {}
      }
    };
  }, []);

  // ---- RAG-first send logic ----
  const handleSend = async (textToSend) => {
    const q = textToSend || inputQuery;
    if (!q.trim()) return;

    const userMsg = { sender: 'user', text: q };
    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);
    setSources(null);

    try {
      // Try the new RAG endpoint first
      const ragRes = await fetch(`${API_BASE_URL}/api/ai/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          lesson_id: lessonId,
          mission_id: missionId,
          circuit: circuitData,
          simulation_result: simulationResult,
        })
      });

      if (ragRes.ok) {
        const ragData = await ragRes.json();
        setMessages(prev => [...prev, {
          sender: 'nova',
          text: ragData.answer || "Quantum calculation parsed!",
          mood: ragData.mood || 'happy',
          grounded: ragData.grounded || false,
          sources: ragData.sources || [],
        }]);
        if (ragData.sources && ragData.sources.length > 0) {
          setSources(ragData.sources);
        }
        // Auto-speak the response if TTS is available
        if (ttsSupported && ragData.answer) {
          speakText(ragData.answer);
        }
        setLoading(false);
        return;
      }
    } catch {
      // RAG endpoint unreachable — fall through to existing Nova
    }

    // Fallback: try onAskNova prop or direct /api/nova/chat
    try {
      if (onAskNova) {
        const replyObj = await onAskNova(q);
        setMessages(prev => [...prev, { 
          sender: 'nova', 
          text: replyObj.reply || replyObj.answer || "Quantum calculation parsed!", 
          mood: replyObj.mood || 'happy',
          sources: replyObj.sources || [],
        }]);
        if (replyObj.sources && replyObj.sources.length > 0) {
          setSources(replyObj.sources);
        }
      } else {
        // Fallback directly to backend
        const res = await fetch(`${API_BASE_URL}/api/nova/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: q, context: 'general' })
        });
        const data = await res.json();
        setMessages(prev => [...prev, { sender: 'nova', text: data.reply, mood: data.mood, sources: [] }]);
      }
    } catch {
      setMessages(prev => [...prev, {
        sender: 'nova',
        text: "My quantum subroutines encountered interference, but here's a hint: Apply an H gate on q[0] and CNOT from q[0] to q[1]!",
        mood: 'thinking',
        sources: []
      }]);
    } finally {
      setLoading(false);
    }
  };

  // ---- Speech Recognition ----
  const startListening = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    // Stop any current speech output
    if (synthRef.current) synthRef.current.cancel();
    setIsSpeaking(false);

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(r => r[0].transcript)
        .join('');
      setInputQuery(transcript);

      // Auto-send on final result
      if (event.results[0].isFinal) {
        setTimeout(() => {
          setIsListening(false);
          if (transcript.trim()) {
            handleSend(transcript.trim());
          }
        }, 300);
      }
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
  }, [lessonId, missionId, circuitData, simulationResult]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
    }
    setIsListening(false);
  }, []);

  // ---- Text-to-Speech ----
  const speakText = useCallback((text) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();

    // Clean text for speech (remove markdown-style formatting)
    const cleanText = text
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/\|/g, '')
      .replace(/[#_`]/g, '')
      .replace(/\[General Knowledge\]/gi, 'General Knowledge:')
      .replace(/\n/g, '. ');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    utterance.lang = 'en-US';

    // Try to pick a pleasant voice
    const voices = synthRef.current.getVoices();
    const preferred = voices.find(v =>
      v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Zira')
    );
    if (preferred) utterance.voice = preferred;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthRef.current.speak(utterance);
  }, []);

  const stopSpeaking = useCallback(() => {
    if (synthRef.current) synthRef.current.cancel();
    setIsSpeaking(false);
  }, []);

  const getMoodEmoji = (m) => {
    switch (m) {
      case 'celebrating': return '🎉';
      case 'thinking': return '🤔';
      case 'curious': return '🧐';
      case 'excited': return '⚡';
      default: return '✨';
    }
  };

  const lastNovaMsg = messages.filter(m => m.sender === 'nova').slice(-1)[0] || { text: initialMessage, mood };

  const handleClearChat = () => {
    setMessages([{ sender: 'nova', text: initialMessage, mood, sources: [] }]);
    setSources(null);
    if (synthRef.current) synthRef.current.cancel();
    setIsSpeaking(false);
  };

  return (
    <div className="relative bg-cream rounded-2xl p-4 shadow-paper border-2 border-amber-300 text-slate-800 flex flex-col h-full min-h-[580px] lg:min-h-[720px]">
      <Pushpin color="gold" className="absolute -top-2.5 left-6" />
      <Tape position="top" angle="rotate-1" color="#f5ea92" className="-top-2.5 right-12 w-24" />

      {/* Nova Header */}
      <div className="flex items-center justify-between border-b border-amber-200/80 pb-2.5 mb-2.5 flex-shrink-0">
        <div className="flex items-center gap-3">
          <NovaMascot 
            size="md"
            state={isSpeaking ? 'speaking' : isListening ? 'listening' : loading ? 'thinking' : (lastNovaMsg.mood === 'celebrating' ? 'celebrating' : 'idle')}
            mood={lastNovaMsg.mood}
            showBadge={true}
            className="hover:scale-105 transition-transform"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-sm tracking-wide text-slate-900 font-hand text-lg">NOVA AI ASSISTANT</h3>
              <span className="text-[9px] font-mono bg-amber-200/70 text-amber-900 px-1.5 py-0.5 rounded font-bold">RAG v2.4</span>
            </div>
            <p className="text-[10px] text-slate-500 font-mono">LABORATORY COMPANION &amp; TUTOR</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Speaking indicator */}
          {isSpeaking && (
            <button
              onClick={stopSpeaking}
              className="text-[10px] bg-purple-100 text-purple-800 font-mono px-2 py-0.5 rounded-full font-semibold flex items-center gap-1 hover:bg-purple-200 transition-all"
              title="Stop speaking"
            >
              <Volume2 className="w-3 h-3 text-purple-600 animate-pulse" /> SPEAKING
              <VolumeX className="w-3 h-3 text-purple-500 ml-0.5" />
            </button>
          )}

          {/* Listening indicator */}
          {isListening && (
            <span className="text-[10px] bg-rose-100 text-rose-800 font-mono px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping inline-block" />
              LISTENING
            </span>
          )}

          <span className="text-[10px] bg-cyan-100 text-cyan-800 font-mono px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-600" /> ONLINE
          </span>

          {/* Reset / Clear Chat Button */}
          {messages.length > 1 && (
            <button
              onClick={handleClearChat}
              className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Reset conversation history"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Chat History Stream (Scrollable) */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto pr-1.5 my-1 space-y-3 min-h-[300px] max-h-[500px] lg:max-h-none"
      >
        {messages.map((m, idx) => {
          if (m.sender === 'user') {
            return (
              <div key={idx} className="flex justify-end items-end gap-2 my-1.5">
                <div className="bg-slate-900 text-slate-100 rounded-2xl rounded-br-sm px-3.5 py-2 text-xs font-sans shadow-sm max-w-[85%] border border-slate-800">
                  <div className="text-[9px] font-mono text-cyan-300 font-semibold mb-0.5 uppercase tracking-wider">
                    You (Cadet)
                  </div>
                  <div className="whitespace-pre-line leading-relaxed">{m.text}</div>
                </div>
                <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-300 flex-shrink-0 mb-0.5" title="Cadet">
                  <User className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          }

          // NOVA Message Bubble
          const isLatestNova = idx === messages.length - 1;
          return (
            <div key={idx} className="flex items-start gap-2.5 my-2">
              <NovaMascot 
                size="sm" 
                state={isSpeaking && isLatestNova ? 'speaking' : (m.mood === 'celebrating' ? 'celebrating' : 'idle')} 
                className="mt-1 flex-shrink-0" 
              />
              <div className="flex-1 bg-white rounded-2xl rounded-tl-sm p-3.5 border border-amber-200/80 shadow-sm text-xs sm:text-sm leading-relaxed font-sans text-slate-800 whitespace-pre-line max-w-[92%]">
                <div className="flex items-center justify-between border-b border-amber-100 pb-1 mb-1.5 font-mono text-[10px]">
                  <span className="font-bold text-amber-950 flex items-center gap-1">
                    <span>NOVA</span>
                    <span className="text-slate-400 font-normal">AI</span>
                  </span>
                  {ttsSupported && (
                    <button
                      onClick={() => isSpeaking ? stopSpeaking() : speakText(m.text)}
                      className="text-slate-400 hover:text-indigo-600 flex items-center gap-1 transition-colors"
                      title="Listen to this message"
                    >
                      <Volume2 className="w-3 h-3 text-slate-400 hover:text-indigo-600" />
                    </button>
                  )}
                </div>

                <div>{m.text}</div>

                {/* Per-message Sources Badge */}
                {m.sources && m.sources.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-start gap-1.5 text-[10px] font-mono text-slate-500 bg-slate-50 rounded-lg p-2">
                    <BookOpen className="w-3 h-3 text-indigo-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-indigo-600 font-semibold">Sources:</span>
                      {m.sources.map((s, si) => (
                        <span key={si} className="ml-1 text-slate-600">
                          {s.document} ({s.section}){si < m.sources.length - 1 ? ',' : ''}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Thinking / Analyzing Indicator */}
        {loading && (
          <div className="flex items-start gap-2.5 my-2">
            <NovaMascot size="sm" state="thinking" className="mt-1 flex-shrink-0" />
            <div className="bg-white/95 rounded-2xl rounded-tl-sm p-3 border border-amber-200 shadow-sm flex items-center gap-2 text-xs font-mono text-slate-600">
              <Sparkles className="w-3.5 h-3.5 animate-spin text-cyan-600" />
              <span>Nova is analyzing quantum statevectors...</span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Area: Suggested Quick Prompts + Input + Voice */}
      <div className="flex-shrink-0 pt-2 border-t border-amber-200/80 mt-auto">
        {/* Suggested Quick Prompt Pills */}
        {suggestedActions && suggestedActions.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-1.5">
            {suggestedActions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(action)}
                className="text-[10px] sm:text-[11px] bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-full px-2.5 py-1 font-hand tracking-wide transition-all hover:scale-105 active:scale-95 text-left flex items-center gap-1"
              >
                <Lightbulb className="w-3 h-3 text-amber-500" />
                {action}
              </button>
            ))}
          </div>
        )}

        {/* Ask Nova Input + Mic + Send */}
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder={isListening ? "Listening..." : "Ask Nova about this circuit..."}
            className="flex-1 text-xs px-3 py-2 rounded-lg border border-amber-300 bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 font-sans text-slate-800 placeholder:text-slate-400 shadow-sm"
          />

          {/* Microphone Button */}
          {speechSupported && (
            <button
              type="button"
              onClick={isListening ? stopListening : startListening}
              disabled={loading}
              className={`px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-1 transition-all border shadow-sm ${
                isListening
                  ? 'bg-rose-100 hover:bg-rose-200 text-rose-700 border-rose-300 animate-pulse'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
              } disabled:opacity-50`}
              title={isListening ? "Stop listening" : "Ask NOVA by voice"}
            >
              {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
            </button>
          )}

          {/* Send Button */}
          <button
            type="submit"
            disabled={loading || !inputQuery.trim()}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-lg text-xs font-medium flex items-center gap-1 transition-all shadow-sm"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
