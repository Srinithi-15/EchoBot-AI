import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  Volume2,
  VolumeX,
  History,
  Settings,
  HelpCircle,
  LogOut,
  Search,
  Bell,
  Trash2,
  Send,
  Play,
  RotateCcw,
  CheckCircle,
  Sparkles,
  MessageSquare,
  Lock,
  User,
  Shield,
  Layers,
  ChevronRight,
  Info,
  Sliders,
  Tv,
  Globe,
  Radio,
  ExternalLink,
  Bot
} from 'lucide-react';
import RobotVisual from './components/RobotVisual';
import { Message, Conversation, EchoBotSettings, UserProfile } from './types';

export default function App() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authSuccessMsg, setAuthSuccessMsg] = useState<string>('');
  const [usernameInput, setUsernameInput] = useState<string>('AlexV');
  const [passwordInput, setPasswordInput] = useState<string>('••••••••');
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [loginError, setLoginError] = useState<string>('');
  const [authTransitioning, setAuthTransitioning] = useState<boolean>(false);

  // General App State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'v2t' | 't2v' | 'history' | 'settings' | 'help'>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [notifications, setNotifications] = useState<Array<{ id: string; text: string; time: string; read: boolean }>>([
    { id: '1', text: '🤖 EchoBot neural core update 2.4 active.', time: 'Just now', read: false },
    { id: '2', text: '🎙️ Voice modulation synthesizer synchronized.', time: '10m ago', read: false },
    { id: '3', text: '🔐 Security handshake verified with Cloud Server.', time: '1h ago', read: true },
  ]);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);

  // Settings State
  const [settings, setSettings] = useState<EchoBotSettings>({
    language: 'en-US',
    voiceGender: 'female',
    volume: 0.85,
    speechSpeed: 1.1,
    accentColor: 'cyan',
    isMuted: false,
  });

  // User Profile
  const [userProfile] = useState<UserProfile>({
    username: 'Alexander V.',
    email: 'alexander.v@echobot.ai',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop',
  });

  // Chat/Conversation state
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 'conv_1',
      title: 'Neural Synthesizer Calibration',
      timestamp: '2026-07-20T11:20:00-07:00',
      summary: 'Calibration session for speech recognition frequencies and response latency testing.',
      messages: [
        { id: 'm1', sender: 'user', text: 'Calibrate vocal interface to 120 hertz frequency, and optimize response throughput.', timestamp: '11:20:10', isVoiceInput: true },
        { id: 'm2', sender: 'bot', text: 'Handshake complete. Vocal modulation is calibrated. All frequency layers are locked at 120 hertz with standard 20ms response pipeline.', timestamp: '11:20:12' },
      ]
    },
    {
      id: 'conv_2',
      title: 'Voice Draft Final',
      timestamp: '2026-07-20T10:15:00-07:00',
      summary: 'Voice drafting test for presentation narration using high quality female model.',
      messages: [
        { id: 'm3', sender: 'user', text: 'Generate an introductory statement for the upcoming product showcase.', timestamp: '10:15:10' },
        { id: 'm4', sender: 'bot', text: 'Welcome honored guests to EchoBot AI, where premium voice synthesis meets artificial cognitive networks. Experience speech and communication re-imagined.', timestamp: '10:15:13' },
      ]
    }
  ]);
  const [activeConversationId, setActiveConversationId] = useState<string>('conv_1');

  // Input States
  const [v2tInputText, setV2tInputText] = useState<string>('');
  const [t2vInputText, setT2vInputText] = useState<string>('Welcome to EchoBot AI. Input text in this chamber, and I shall translate it into spoken speech instantly.');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [speechRecognitionActive, setSpeechRecognitionActive] = useState<boolean>(false);
  const [chatbotIsLoading, setChatbotIsLoading] = useState<boolean>(false);
  
  // Robot Status for Animated SVG Visual
  const [robotStatus, setRobotStatus] = useState<'idle' | 'listening' | 'speaking' | 'processing'>('idle');

  // Audio waveform data simulation for nice visualizer
  const [waveformBars, setWaveformBars] = useState<number[]>(Array(16).fill(12));
  const recognitionRef = useRef<any>(null);
  const recordingTimerRef = useRef<any>(null);
  const visualizerIntervalRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom in conversations
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversations, activeConversationId]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      if (visualizerIntervalRef.current) clearInterval(visualizerIntervalRef.current);
    };
  }, []);

  // Web Speech Synthesis (TTS) Helper
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported in this browser.');
      return;
    }
    
    window.speechSynthesis.cancel(); // cancel existing speech
    setRobotStatus('speaking');

    // Simulate animated waveform bars while speaking
    if (visualizerIntervalRef.current) clearInterval(visualizerIntervalRef.current);
    visualizerIntervalRef.current = setInterval(() => {
      setWaveformBars(Array.from({ length: 16 }, () => Math.floor(Math.random() * 32) + 8));
    }, 100);

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Choose voice based on settings
    const voices = window.speechSynthesis.getVoices();
    let selectedVoice = null;
    
    if (settings.voiceGender === 'female') {
      selectedVoice = voices.find(v => v.name.toLowerCase().includes('google') && v.name.toLowerCase().includes('female')) ||
                      voices.find(v => v.name.toLowerCase().includes('zira')) ||
                      voices.find(v => v.name.toLowerCase().includes('female')) ||
                      voices[1];
    } else {
      selectedVoice = voices.find(v => v.name.toLowerCase().includes('google') && v.name.toLowerCase().includes('male')) ||
                      voices.find(v => v.name.toLowerCase().includes('david')) ||
                      voices.find(v => v.name.toLowerCase().includes('male')) ||
                      voices[0];
    }
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    
    // Assign language, volume and rate
    utterance.lang = settings.language;
    utterance.volume = settings.isMuted ? 0 : settings.volume;
    utterance.rate = settings.speechSpeed;

    utterance.onend = () => {
      setRobotStatus('idle');
      if (visualizerIntervalRef.current) {
        clearInterval(visualizerIntervalRef.current);
        visualizerIntervalRef.current = null;
      }
      setWaveformBars(Array(16).fill(12));
    };

    utterance.onerror = () => {
      setRobotStatus('idle');
      if (visualizerIntervalRef.current) {
        clearInterval(visualizerIntervalRef.current);
        visualizerIntervalRef.current = null;
      }
      setWaveformBars(Array(16).fill(12));
    };

    window.speechSynthesis.speak(utterance);
  };

  // Stop current voice synthesis
  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setRobotStatus('idle');
    if (visualizerIntervalRef.current) {
      clearInterval(visualizerIntervalRef.current);
      visualizerIntervalRef.current = null;
    }
    setWaveformBars(Array(16).fill(12));
  };

  // Toggle speech mute state
  const toggleMute = () => {
    setSettings(prev => ({ ...prev, isMuted: !prev.isMuted }));
    if (settings.isMuted === false) {
      stopSpeaking();
    }
  };

  // Login handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput.trim()) {
      setLoginError('Please designate username credentials.');
      return;
    }
    setLoginError('');
    setAuthTransitioning(true);

    setTimeout(() => {
      setAuthSuccessMsg('🤖 Authentication Successful. Welcome to EchoBot AI.');
      setTimeout(() => {
        setIsAuthenticated(true);
        setAuthTransitioning(false);
      }, 1500);
    }, 1200);
  };

  // Handle Logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setAuthSuccessMsg('');
    stopSpeaking();
  };

  // Speech Recognition (Voice to Text) using standard Web Speech API with fallback simulator
  const startRecording = () => {
    stopSpeaking();
    setIsRecording(true);
    setRecordingSeconds(0);
    setRobotStatus('listening');

    // Start timer display
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    recordingTimerRef.current = setInterval(() => {
      setRecordingSeconds(prev => prev + 1);
    }, 1000);

    // Dynamic wave visualizer while listening
    if (visualizerIntervalRef.current) clearInterval(visualizerIntervalRef.current);
    visualizerIntervalRef.current = setInterval(() => {
      setWaveformBars(Array.from({ length: 16 }, () => Math.floor(Math.random() * 36) + 4));
    }, 80);

    // Try standard webkitSpeechRecognition API
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = settings.language;

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = 0; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setV2tInputText(currentTranscript);
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition interface error:', event.error);
        };

        recognition.onend = () => {
          // Keep recording UI active until manual stop, or auto-stop on final transcription
        };

        recognitionRef.current = recognition;
        recognition.start();
        setSpeechRecognitionActive(true);
      } catch (err) {
        console.warn('Failed to initialize speech recognition engine.', err);
      }
    } else {
      console.warn('Speech recognition API not supported.');
    }
  };

  // Stop recording voice to text
  const stopRecording = () => {
    setIsRecording(false);
    setRobotStatus('idle');
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    if (visualizerIntervalRef.current) {
      clearInterval(visualizerIntervalRef.current);
      visualizerIntervalRef.current = null;
    }
    setWaveformBars(Array(16).fill(12));

    if (recognitionRef.current && speechRecognitionActive) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.error(e);
      }
      setSpeechRecognitionActive(false);
    }
  };

  // Transmit current text to Backend Gemini Core for intelligent reply
  const handleSendToBot = async (customMessageText?: string) => {
    const textToSend = customMessageText || v2tInputText;
    if (!textToSend.trim()) return;

    // Build the user message
    const userMsg: Message = {
      id: `m_user_${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isVoiceInput: !customMessageText, // true if from record panel
    };

    // Find active conversation
    const activeConv = conversations.find(c => c.id === activeConversationId);
    if (!activeConv) return;

    // Append user message immediately
    const updatedMessages = [...activeConv.messages, userMsg];
    setConversations(prev => prev.map(c => {
      if (c.id === activeConversationId) {
        return {
          ...c,
          messages: updatedMessages,
          timestamp: new Date().toISOString()
        };
      }
      return c;
    }));

    if (!customMessageText) {
      setV2tInputText(''); // Reset record input chamber
    }

    // Set robot to processing
    setRobotStatus('processing');
    setChatbotIsLoading(true);

    try {
      // API call to custom Gemini Server route
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: updatedMessages.slice(-6).map(m => ({
            role: m.sender === 'user' ? 'user' : 'model',
            text: m.text
          }))
        })
      });

      if (!response.ok) {
        throw new Error('Neural core returned transmission error.');
      }

      const data = await response.json();
      const botMsgText = data.reply || "Transmission response could not be verified.";

      // Build bot response
      const botMsg: Message = {
        id: `m_bot_${Date.now()}`,
        sender: 'bot',
        text: botMsgText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      // Append bot response and speak aloud!
      setConversations(prev => prev.map(c => {
        if (c.id === activeConversationId) {
          // Update title if it was a generic title or keep it
          const title = c.title.startsWith('Calibration') && updatedMessages.length === 3
            ? textToSend.substring(0, 24) + '...'
            : c.title;

          return {
            ...c,
            title,
            messages: [...updatedMessages, botMsg],
          };
        }
        return c;
      }));

      // Automatically Speak bot's reply aloud
      speakText(botMsgText);

    } catch (err: any) {
      console.error(err);
      const botMsgError: Message = {
        id: `m_bot_err_${Date.now()}`,
        sender: 'bot',
        text: "🚨 Neural network warning. Central server is offline. Speech synthesized from backup local cache: Communication protocols are functioning at peak efficiency.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setConversations(prev => prev.map(c => {
        if (c.id === activeConversationId) {
          return { ...c, messages: [...updatedMessages, botMsgError] };
        }
        return c;
      }));
      speakText("Neural network warning. Central server is offline. Communication protocols are functioning at peak efficiency.");
    } finally {
      setChatbotIsLoading(false);
    }
  };

  // Create new conversation
  const createNewConversation = () => {
    const newId = `conv_${Date.now()}`;
    const newConv: Conversation = {
      id: newId,
      title: `Voice Session ${conversations.length + 1}`,
      timestamp: new Date().toISOString(),
      summary: 'New voice conversation room.',
      messages: [
        {
          id: `m_init_${Date.now()}`,
          sender: 'bot',
          text: 'Hello, I am EchoBot AI. My voice pathways are fully primed. Please speak or write your directive.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]
    };
    setConversations([newConv, ...conversations]);
    setActiveConversationId(newId);
    setActiveTab('v2t'); // Hop to interactive visualizer tab
    speakText('Hello, I am EchoBot AI. Please speak or write your directive.');
  };

  // Delete conversation
  const deleteConversation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const remaining = conversations.filter(c => c.id !== id);
    setConversations(remaining);
    if (activeConversationId === id && remaining.length > 0) {
      setActiveConversationId(remaining[0].id);
    } else if (remaining.length === 0) {
      // Re-create a placeholder if empty
      const placeholderId = `conv_placeholder`;
      setConversations([{
        id: placeholderId,
        title: 'Central Command Stream',
        timestamp: new Date().toISOString(),
        summary: 'Standard system conversation.',
        messages: [{
          id: 'm_p',
          sender: 'bot',
          text: 'EchoBot AI loaded. Command room is active.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]
      }]);
      setActiveConversationId(placeholderId);
    }
  };

  // Filter conversations by query
  const filteredConversations = conversations.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.messages.some(m => m.text.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#050608] text-slate-100 font-sans tech-grid relative overflow-x-hidden flex flex-col justify-between">
      {/* Absolute Ambient Neon Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] glow-radial-blue pointer-events-none z-0" />
      <div className="absolute bottom-12 right-1/4 w-[600px] h-[600px] glow-radial-purple pointer-events-none z-0" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] glow-radial-cyan pointer-events-none z-0" />

      {/* ---------------------------------
          UNAUTHENTICATED LOGIN VIEW 
          --------------------------------- */}
      {!isAuthenticated && (
        <div className="min-h-screen w-full flex flex-col lg:flex-row relative z-10">
          
          {/* Left Hero Split Section */}
          <div className="flex-1 bg-slate-950/40 lg:border-r border-white/5 flex flex-col justify-between p-8 md:p-12 xl:p-16 relative overflow-hidden">
            {/* Top Logo branding */}
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 border border-cyan-400 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)] bg-cyan-950/20">
                <Radio className="w-5 h-5 text-cyan-400 animate-pulse" />
                <div className="absolute -inset-0.5 border border-cyan-400/20 rounded-xl blur-sm" />
              </div>
              <span className="font-display font-bold text-2xl tracking-tight text-white">EchoBot <span className="text-cyan-400">AI</span></span>
            </div>

            {/* Central Friendly Humanoid AI Robot Graphic & Waveform */}
            <div className="my-auto py-12 flex flex-col items-center justify-center">
              <RobotVisual status={authTransitioning ? 'processing' : 'speaking'} accentColor={settings.accentColor} size="lg" />
              
              {/* Soundwaves around robot */}
              <div className="mt-8 flex items-end gap-1.5 h-10 w-48 justify-center">
                <div className="w-1 bg-cyan-400 rounded-full animate-soundwave" style={{ animationDelay: '0.1s' }} />
                <div className="w-1 bg-blue-500 rounded-full animate-soundwave" style={{ animationDelay: '0.3s' }} />
                <div className="w-1 bg-purple-500 rounded-full animate-soundwave" style={{ animationDelay: '0.5s' }} />
                <div className="w-1 bg-cyan-300 rounded-full animate-soundwave" style={{ animationDelay: '0.2s' }} />
                <div className="w-1 bg-indigo-500 rounded-full animate-soundwave" style={{ animationDelay: '0.4s' }} />
                <div className="w-1 bg-cyan-400 rounded-full animate-soundwave" style={{ animationDelay: '0.6s' }} />
                <div className="w-1 bg-purple-600 rounded-full animate-soundwave" style={{ animationDelay: '0.15s' }} />
                <div className="w-1 bg-blue-400 rounded-full animate-soundwave" style={{ animationDelay: '0.35s' }} />
              </div>

              {/* Floating feature micro-badges */}
              <div className="flex flex-wrap gap-3 justify-center mt-8 max-w-md">
                <span className="glass-panel text-xs px-3.5 py-1.5 rounded-full flex items-center gap-1.5 border border-white/5 text-slate-300 animate-float-slow">
                  <Mic className="w-3.5 h-3.5 text-cyan-400" /> Voice Recognition
                </span>
                <span className="glass-panel text-xs px-3.5 py-1.5 rounded-full flex items-center gap-1.5 border border-white/5 text-slate-300 animate-float-medium" style={{ animationDelay: '1s' }}>
                  <Volume2 className="w-3.5 h-3.5 text-purple-400" /> Neural Speech
                </span>
                <span className="glass-panel text-xs px-3.5 py-1.5 rounded-full flex items-center gap-1.5 border border-white/5 text-slate-300 animate-float-slow" style={{ animationDelay: '2s' }}>
                  <Sparkles className="w-3.5 h-3.5 text-cyan-300" /> Gemini Intelligence
                </span>
              </div>
            </div>

            {/* Bottom Slogan & Description */}
            <div className="mt-auto">
              <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 px-3 py-1 rounded-md text-xs font-mono tracking-widest uppercase mb-4">
                <Bot className="w-3.5 h-3.5" /> NEURAL ENGINE v2.4
              </div>
              <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-white mb-2">
                Listen. Understand. Speak.
              </h2>
              <p className="text-slate-400 text-sm md:text-base max-w-lg leading-relaxed">
                An Intelligent Voice & Text Communication Assistant powered by Artificial Intelligence. Speak organically, analyze instantly, and hear replies synthesized live.
              </p>
            </div>
          </div>

          {/* Right Login Split Section */}
          <div className="flex-1 flex items-center justify-center p-6 md:p-12 xl:p-20 relative overflow-hidden bg-gradient-to-br from-slate-950 via-[#050608] to-slate-900/50">
            {/* Visual Glassmorphic Login Card */}
            <div className="w-full max-w-md glass-panel-heavy p-8 md:p-10 rounded-3xl relative z-10 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-500 hover:border-cyan-500/20">
              
              {/* Card Header */}
              <div className="text-center lg:text-left mb-8">
                <h3 className="text-3xl font-display font-bold text-white tracking-tight">Access Terminal</h3>
                <p className="text-slate-400 text-sm mt-1.5">Provide secure credentials to establish connection.</p>
              </div>

              {loginError && (
                <div className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-center gap-2 font-mono">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  {loginError}
                </div>
              )}

              {/* Form elements */}
              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-slate-400 mb-2">Operator Username</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={usernameInput}
                      onChange={(e) => setUsernameInput(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 rounded-xl glass-input text-white text-sm"
                      placeholder="Enter Operator ID..."
                    />
                    <User className="absolute left-4 top-3.5 w-4.5 h-4.5 text-slate-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-slate-400 mb-2">Security Cipher key</label>
                  <div className="relative">
                    <input
                      type="password"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 rounded-xl glass-input text-white text-sm"
                      placeholder="Enter Password..."
                    />
                    <Lock className="absolute left-4 top-3.5 w-4.5 h-4.5 text-slate-400" />
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-300 select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500"
                    />
                    Keep Handshake Active
                  </label>
                  <a href="#forgot" onClick={() => setLoginError("System notification: Please consult your administrator to reset access protocols.")} className="text-cyan-400 hover:text-cyan-300 transition-colors font-mono">
                    Lost Cipher?
                  </a>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={authTransitioning}
                  className="w-full mt-4 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-[#050608] font-bold text-sm tracking-widest uppercase transition-all duration-300 cursor-pointer shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.7)] flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {authTransitioning ? (
                    <>
                      <div className="w-5 h-5 border-2 border-[#050608] border-t-transparent rounded-full animate-spin" />
                      SECURE SHAKE...
                    </>
                  ) : (
                    <>
                      INITIALIZE COMM <ChevronRight className="w-4.5 h-4.5" />
                    </>
                  )}
                </button>
              </form>

              {/* Create Account Link */}
              <div className="mt-8 text-center border-t border-white/5 pt-6 text-xs text-slate-400">
                New to the Voice Network?{' '}
                <a href="#register" onClick={() => setLoginError("System notification: Registration mode is currently offline. Please request temporary operator clearance.")} className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors">
                  Create Operator Credentials
                </a>
              </div>
            </div>

            {/* Glowing success banner animation overlay */}
            {authSuccessMsg && (
              <div className="absolute inset-0 bg-slate-950/90 z-20 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
                <div className="w-20 h-20 border border-cyan-400 rounded-full flex items-center justify-center bg-cyan-950/20 shadow-[0_0_30px_rgba(6,182,212,0.6)] animate-bounce">
                  <CheckCircle className="w-10 h-10 text-cyan-400" />
                </div>
                <h4 className="text-2xl font-display font-bold text-white mt-6 tracking-tight">
                  Authentication Authorized
                </h4>
                <p className="text-cyan-300 font-mono text-sm mt-3 animate-pulse">
                  {authSuccessMsg}
                </p>
                <div className="w-48 bg-white/10 h-1 rounded-full overflow-hidden mt-8">
                  <div className="bg-cyan-400 h-full w-full animate-[progress_1.5s_ease-out]" />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ---------------------------------
          AUTHENTICATED MAIN DASHBOARD VIEW 
          --------------------------------- */}
      {isAuthenticated && (
        <div className="flex-1 flex flex-col relative z-10">
          
          {/* Top Navbar */}
          <header className="h-18 px-6 lg:px-10 border-b border-white/5 bg-[#0a0b10]/95 backdrop-blur-md flex items-center justify-between sticky top-0 z-40">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="relative w-8 h-8 border border-cyan-400 rounded-lg flex items-center justify-center shadow-[0_0_10px_rgba(6,182,212,0.2)] bg-cyan-950/10">
                <Radio className="w-4.5 h-4.5 text-cyan-400" />
              </div>
              <span className="font-display font-bold text-lg tracking-tight text-white hidden sm:inline">
                EchoBot <span className="text-cyan-400">AI</span>
              </span>
            </div>

            {/* Global Search */}
            <div className="relative w-full max-w-xs md:max-w-md mx-4">
              <input
                type="text"
                placeholder="Search channels, transmissions, settings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 rounded-full glass-input text-xs text-white"
              />
              <Search className="absolute left-3 top-2 w-4 h-4 text-slate-400" />
            </div>

            {/* Quick Actions & Profile */}
            <div className="flex items-center gap-4">
              {/* System status pill */}
              <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-mono text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                NEURAL STABLE
              </div>

              {/* Notifications Hub */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-lg border border-white/5 hover:bg-white/5 transition-colors text-slate-300 relative"
                >
                  <Bell className="w-4.5 h-4.5" />
                  {notifications.some(n => !n.read) && (
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-3 w-80 glass-panel-heavy rounded-2xl p-4 border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] z-50">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2.5 mb-3">
                      <span className="text-xs font-mono uppercase tracking-widest text-slate-400">System Logs</span>
                      <button
                        onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
                        className="text-[11px] text-cyan-400 hover:underline"
                      >
                        Acknowledge All
                      </button>
                    </div>
                    <div className="space-y-2.5 max-h-60 overflow-y-auto">
                      {notifications.map(n => (
                        <div key={n.id} className={`p-2.5 rounded-lg text-xs transition-colors ${n.read ? 'bg-white/2 opacity-70' : 'bg-cyan-500/5 border-l-2 border-cyan-400'}`}>
                          <div className="text-slate-200">{n.text}</div>
                          <div className="text-[10px] text-slate-500 mt-1 font-mono">{n.time}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* User profile dropdown & Logout */}
              <div className="flex items-center gap-3 border-l border-white/5 pl-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 to-purple-500 p-0.5">
                  <img
                    src={userProfile.avatarUrl}
                    alt={userProfile.username}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div className="hidden lg:block text-left">
                  <div className="text-xs font-bold text-white leading-none">{userProfile.username}</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">{userProfile.email}</div>
                </div>
                <button
                  onClick={handleLogout}
                  title="Logout Operator Session"
                  className="p-2 rounded-lg border border-white/5 hover:bg-red-500/10 hover:text-red-400 transition-colors text-slate-400 ml-1.5"
                >
                  <LogOut className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>
          </header>

          {/* Main Layout Area */}
          <div className="flex-1 flex flex-col lg:flex-row">
            
            {/* Left Sidebar */}
            <aside className="w-full lg:w-64 bg-[#0a0b10] border-b lg:border-b-0 lg:border-r border-white/5 p-4 flex flex-col justify-between shrink-0">
              
              {/* Conversation rooms or Primary Channels list */}
              <div className="space-y-6">
                <div>
                  <span className="block text-[10px] font-mono uppercase tracking-widest text-slate-500 px-3 mb-2">OPERATIONAL SUITE</span>
                  <nav className="space-y-1">
                    <button
                      onClick={() => setActiveTab('dashboard')}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                        activeTab === 'dashboard'
                          ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-400/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-white/2'
                      }`}
                    >
                      <Layers className="w-4.5 h-4.5" />
                      Dashboard Hub
                    </button>
                    <button
                      onClick={() => setActiveTab('v2t')}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                        activeTab === 'v2t'
                          ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-400/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-white/2'
                      }`}
                    >
                      <Mic className="w-4.5 h-4.5" />
                      Voice to Text (A.I. Chat)
                    </button>
                    <button
                      onClick={() => setActiveTab('t2v')}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                        activeTab === 't2v'
                          ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-400/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-white/2'
                      }`}
                    >
                      <Volume2 className="w-4.5 h-4.5" />
                      Text to Voice (TTS)
                    </button>
                    <button
                      onClick={() => setActiveTab('history')}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                        activeTab === 'history'
                          ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-400/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-white/2'
                      }`}
                    >
                      <History className="w-4.5 h-4.5" />
                      Conversation History
                    </button>
                    <button
                      onClick={() => setActiveTab('settings')}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                        activeTab === 'settings'
                          ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-400/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-white/2'
                      }`}
                    >
                      <Settings className="w-4.5 h-4.5" />
                      Settings Chamber
                    </button>
                    <button
                      onClick={() => setActiveTab('help')}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                        activeTab === 'help'
                          ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-400/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-white/2'
                      }`}
                    >
                      <HelpCircle className="w-4.5 h-4.5" />
                      System Help Center
                    </button>
                  </nav>
                </div>

                {/* Sub section: Active voice streams */}
                <div className="hidden lg:block pt-4 border-t border-white/5">
                  <div className="flex items-center justify-between px-3 mb-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">VOICE STREAMS</span>
                    <button onClick={createNewConversation} className="text-xs text-cyan-400 hover:text-cyan-300 font-bold">
                      + NEW
                    </button>
                  </div>
                  <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                    {conversations.map(c => (
                      <div
                        key={c.id}
                        onClick={() => {
                          setActiveConversationId(c.id);
                          setActiveTab('v2t');
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-mono cursor-pointer flex items-center justify-between group transition-colors ${
                          activeConversationId === c.id
                            ? 'bg-cyan-500/5 text-cyan-300 border-l border-cyan-400'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-white/2'
                        }`}
                      >
                        <span className="truncate max-w-[130px]">{c.title}</span>
                        <button
                          onClick={(e) => deleteConversation(c.id, e)}
                          className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-red-400 transition-opacity"
                          title="Erase Stream"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Mini operational stats */}
              <div className="mt-auto pt-4 border-t border-white/5 hidden lg:block">
                <div className="p-3 bg-white/2 rounded-xl border border-white/5 space-y-2">
                  <div className="flex justify-between text-[10px] font-mono text-slate-400">
                    <span>Synthesizer Core</span>
                    <span className="text-cyan-400">ONLINE</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full w-[85%]" />
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-slate-400">
                    <span>Vocoder Quality</span>
                    <span className="text-purple-400">96.8%</span>
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Interactive viewport viewport */}
            <main className="flex-1 p-4 md:p-8 overflow-y-auto">
              
              {/* ---------------------------------
                  DASHBOARD TAB 
                  --------------------------------- */}
              {activeTab === 'dashboard' && (
                <div className="space-y-8 animate-fade-in">
                  
                  {/* Big Futuristic Hero Welcome Banner */}
                  <div className="relative overflow-hidden rounded-3xl border border-white/10 glass-panel p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-r from-cyan-950/20 via-slate-950/40 to-purple-950/15">
                    
                    {/* Left content text */}
                    <div className="space-y-4 max-w-lg text-center md:text-left">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-cyan-400/10 text-cyan-400 text-xs font-mono font-bold tracking-widest uppercase">
                        <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Neural Core Active
                      </div>
                      <h1 className="text-3xl md:text-4xl font-display font-bold text-white tracking-tight">
                        Hello, Welcome to EchoBot AI
                      </h1>
                      <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                        Your intelligent voice & text communication assistant is ready. Experience seamless real-time soundwave mapping, modern speech conversions, and rich visual neural pathways.
                      </p>
                      <div className="pt-2 flex flex-wrap gap-3 justify-center md:justify-start">
                        <button
                          onClick={() => {
                            setActiveTab('v2t');
                            startRecording();
                          }}
                          className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-[#050608] text-xs font-bold font-mono tracking-wider rounded-xl transition-all duration-200 cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.3)] flex items-center gap-2"
                        >
                          <Mic className="w-4 h-4" /> START RECORDING
                        </button>
                        <button
                          onClick={() => setActiveTab('t2v')}
                          className="px-5 py-2.5 border border-white/10 hover:border-white/20 text-white text-xs font-bold font-mono tracking-wider rounded-xl transition-all duration-200 cursor-pointer bg-white/2 flex items-center gap-2"
                        >
                          <Volume2 className="w-4 h-4" /> SYNTHESIZE SPEECH
                        </button>
                      </div>
                    </div>

                    {/* Central Interactive Robot Head Preview */}
                    <div className="relative w-52 h-52 shrink-0 flex items-center justify-center">
                      <RobotVisual status={robotStatus} accentColor={settings.accentColor} size="md" />
                    </div>
                  </div>

                  {/* Operational Feature Cards */}
                  <div>
                    <h3 className="text-lg font-display font-bold text-white tracking-tight mb-4 flex items-center gap-2">
                      <Sliders className="w-4.5 h-4.5 text-cyan-400" /> Operational Suite Modules
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* 1. Voice to Text Card */}
                      <div className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-cyan-500/20 transition-all duration-300 flex flex-col justify-between space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-xl">
                            <Mic className="w-5 h-5" />
                          </div>
                          <span className="text-[10px] font-mono tracking-widest text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded uppercase">
                            Interactive Voice
                          </span>
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-white">Voice to Text Chamber</h4>
                          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                            Convert dynamic human vocal frequencies into written transcripts in real time, and chat directly with EchoBot AI.
                          </p>
                        </div>
                        <div className="p-3.5 bg-slate-950/60 rounded-xl border border-white/5 text-[11px] font-mono text-cyan-300 min-height-[60px] truncate">
                          &gt; {v2tInputText || "Standing by. Feed mic input..."}
                        </div>
                        <button
                          onClick={() => setActiveTab('v2t')}
                          className="w-full py-2.5 rounded-xl border border-white/5 bg-white/2 hover:bg-white/5 hover:border-white/10 text-xs font-mono font-bold tracking-wider text-slate-200 transition-all cursor-pointer"
                        >
                          OPEN CHAMBER
                        </button>
                      </div>

                      {/* 2. Text to Voice Card */}
                      <div className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-purple-500/20 transition-all duration-300 flex flex-col justify-between space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl">
                            <Volume2 className="w-5 h-5" />
                          </div>
                          <span className="text-[10px] font-mono tracking-widest text-purple-400 bg-purple-400/10 px-2 py-0.5 rounded uppercase">
                            Neural Vocoder
                          </span>
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-white">Text to Voice Synthesizer</h4>
                          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                            Formulate written expressions into smooth, lifelike voice synthesis. Select speeds, genders, and volumes.
                          </p>
                        </div>
                        <div className="p-3.5 bg-slate-950/60 rounded-xl border border-white/5 text-[11px] font-mono text-purple-300 min-height-[60px] truncate">
                          &gt; {t2vInputText || "Write custom words to synthesize..."}
                        </div>
                        <button
                          onClick={() => setActiveTab('t2v')}
                          className="w-full py-2.5 rounded-xl border border-white/5 bg-white/2 hover:bg-white/5 hover:border-white/10 text-xs font-mono font-bold tracking-wider text-slate-200 transition-all cursor-pointer"
                        >
                          OPEN SYNTHESIZER
                        </button>
                      </div>

                      {/* 3. Conversation History Card */}
                      <div className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-all duration-300 flex flex-col justify-between space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="p-3 bg-white/5 text-slate-300 rounded-xl">
                            <History className="w-5 h-5" />
                          </div>
                          <span className="text-[10px] font-mono tracking-widest text-slate-400 bg-white/5 px-2 py-0.5 rounded uppercase">
                            Logs & Storage
                          </span>
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-white">Conversation Logs</h4>
                          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                            Retrieve previous vocal drafts, cognitive chats, and transcripts saved in the operational history buffer.
                          </p>
                        </div>
                        <div className="space-y-1.5">
                          {conversations.slice(0, 2).map(c => (
                            <div key={c.id} className="p-2 bg-white/2 rounded-lg text-[11px] font-mono flex items-center justify-between">
                              <span className="truncate max-w-[150px] text-slate-300">{c.title}</span>
                              <span className="text-slate-500">Active</span>
                            </div>
                          ))}
                        </div>
                        <button
                          onClick={() => setActiveTab('history')}
                          className="w-full py-2.5 rounded-xl border border-white/5 bg-white/2 hover:bg-white/5 hover:border-white/10 text-xs font-mono font-bold tracking-wider text-slate-200 transition-all cursor-pointer"
                        >
                          VIEW TRANSMISSION HISTORY
                        </button>
                      </div>

                      {/* 4. Controls & Settings Card */}
                      <div className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-all duration-300 flex flex-col justify-between space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="p-3 bg-white/5 text-slate-300 rounded-xl">
                            <Settings className="w-5 h-5" />
                          </div>
                          <span className="text-[10px] font-mono tracking-widest text-slate-400 bg-white/5 px-2 py-0.5 rounded uppercase">
                            Configuration
                          </span>
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-white">Neural Modulation Settings</h4>
                          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                            Alter language dialects, gender speech, speech speed multipliers, and visual aesthetic ambient highlights.
                          </p>
                        </div>
                        
                        {/* Interactive summary settings bars */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-[11px] font-mono text-slate-400">
                            <span>Speech speed rate</span>
                            <span className="text-cyan-400">{settings.speechSpeed}x</span>
                          </div>
                          <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden">
                            <div className="bg-cyan-400 h-full" style={{ width: `${(settings.speechSpeed / 2) * 100}%` }} />
                          </div>
                        </div>

                        <button
                          onClick={() => setActiveTab('settings')}
                          className="w-full py-2.5 rounded-xl border border-white/5 bg-white/2 hover:bg-white/5 hover:border-white/10 text-xs font-mono font-bold tracking-wider text-slate-200 transition-all cursor-pointer"
                        >
                          LAUNCH SYSTEM SETTINGS
                        </button>
                      </div>

                    </div>
                  </div>
                </div>
              )}

              {/* ---------------------------------
                  VOICE TO TEXT (A.I. CHAT) CHAMBER 
                  --------------------------------- */}
              {activeTab === 'v2t' && (
                <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
                  
                  {/* Chamber Header */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#0a0b10] p-4 rounded-2xl border border-white/5">
                    <div>
                      <div className="flex items-center gap-2">
                        <Mic className="w-5 h-5 text-cyan-400" />
                        <h2 className="text-xl font-display font-bold text-white">Voice to Text Chamber</h2>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">Chat naturally with EchoBot AI using real speech recognition or our intelligent vocal transceiver simulation.</p>
                    </div>
                    
                    {/* Active conversation title selector */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-500">Active Channel:</span>
                      <select
                        value={activeConversationId}
                        onChange={(e) => setActiveConversationId(e.target.value)}
                        className="bg-slate-950 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-slate-300 font-mono outline-none"
                      >
                        {conversations.map(c => (
                          <option key={c.id} value={c.id}>{c.title}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Primary interactive layout splits: Left (Chat Screen) - Right (Record / Mic Controller) */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* Chat Area (8 Cols) */}
                    <div className="lg:col-span-7 glass-panel rounded-3xl border border-white/10 flex flex-col h-[520px]">
                      
                      {/* Active Chat Room Title */}
                      <div className="px-5 py-3 border-b border-white/5 flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                          {conversations.find(c => c.id === activeConversationId)?.title || "Standard Chat Room"}
                        </span>
                        <button
                          onClick={() => {
                            if (window.confirm("Acknowledge to erase active communication stream history?")) {
                              const activeConv = conversations.find(c => c.id === activeConversationId);
                              if (activeConv) {
                                setConversations(prev => prev.map(c => {
                                  if (c.id === activeConversationId) {
                                    return {
                                      ...c,
                                      messages: [{
                                        id: 'm_res',
                                        sender: 'bot',
                                        text: 'Voice stream cache flushed. Connection re-established.',
                                        timestamp: 'Now'
                                      }]
                                    };
                                  }
                                  return c;
                                }));
                              }
                            }
                          }}
                          className="text-[10px] text-slate-400 hover:text-red-400 transition-colors font-mono uppercase"
                        >
                          Clear Stream
                        </button>
                      </div>

                      {/* Messages Thread Container */}
                      <div className="flex-1 p-5 overflow-y-auto space-y-4">
                        {conversations.find(c => c.id === activeConversationId)?.messages.map((m) => (
                          <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                            <div className="max-w-[85%] space-y-1">
                              {/* Sender metadata banner */}
                              <div className={`flex items-center gap-1.5 text-[10px] font-mono text-slate-500 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <span>{m.sender === 'user' ? 'OPERATOR' : 'ECHOBOT AI'}</span>
                                {m.isVoiceInput && (
                                  <span className="inline-flex items-center gap-0.5 text-cyan-400 font-bold bg-cyan-400/10 px-1 rounded text-[9px] uppercase">
                                    <Mic className="w-2 h-2" /> Voc
                                  </span>
                                )}
                                <span>•</span>
                                <span>{m.timestamp}</span>
                              </div>

                              {/* Speech text bubble */}
                              <div
                                className={`px-4 py-3 rounded-2xl text-xs md:text-sm leading-relaxed ${
                                  m.sender === 'user'
                                    ? 'bg-gradient-to-br from-cyan-600 to-cyan-700 text-[#050608] font-medium rounded-tr-none'
                                    : 'bg-white/5 border border-white/5 text-slate-100 rounded-tl-none hover:border-cyan-500/10 transition-colors'
                                }`}
                              >
                                {m.text}

                                {/* Speak icon helper for assistant replies */}
                                {m.sender === 'bot' && (
                                  <button
                                    onClick={() => speakText(m.text)}
                                    title="Speak Response Aloud"
                                    className="ml-2.5 inline-flex items-center text-slate-400 hover:text-cyan-400 hover:scale-115 transition-all"
                                  >
                                    <Volume2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {chatbotIsLoading && (
                          <div className="flex justify-start animate-pulse">
                            <div className="max-w-[80%] space-y-1.5">
                              <span className="text-[10px] font-mono text-cyan-400">🤖 ECHO CORES PROCESSING...</span>
                              <div className="px-4 py-3 bg-white/2 border border-white/5 rounded-2xl rounded-tl-none text-xs flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                                <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                                <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }} />
                                <span className="text-slate-400 font-mono text-[11px] ml-1">Analyzing voice frequencies...</span>
                              </div>
                            </div>
                          </div>
                        )}

                        <div ref={messagesEndRef} />
                      </div>

                      {/* Direct manual text typing option if preferred */}
                      <div className="p-4 border-t border-white/5 bg-[#0a0b10]/40">
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Type backup message directly or select simulated prompts on right..."
                            value={v2tInputText}
                            onChange={(e) => setV2tInputText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleSendToBot();
                              }
                            }}
                            className="w-full pl-4 pr-12 py-3 rounded-xl glass-input text-xs text-white"
                          />
                          <button
                            onClick={() => handleSendToBot()}
                            disabled={!v2tInputText.trim() || chatbotIsLoading}
                            className="absolute right-2 top-2 p-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-[#050608] transition-colors disabled:opacity-40 cursor-pointer"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                    </div>

                    {/* Microphone & Voice Waveform Controller (5 Cols) */}
                    <div className="lg:col-span-5 space-y-6">
                      
                      {/* Interactive Visualizer Card */}
                      <div className="glass-panel p-6 rounded-3xl border border-white/10 text-center relative overflow-hidden flex flex-col justify-between h-[360px]">
                        
                        {/* Ambient blinking indicator */}
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-[10px] font-mono text-slate-400 tracking-wider">INTERFACE TRANSCRIBER</span>
                          <span className={`inline-flex items-center gap-1 font-mono text-[10px] ${isRecording ? 'text-cyan-400' : 'text-slate-500'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${isRecording ? 'bg-cyan-400 animate-pulse' : 'bg-slate-600'}`} />
                            {isRecording ? 'REC ACTIVE' : 'STANDBY'}
                          </span>
                        </div>

                        {/* Interactive dynamic waveforms representing captured vocal spectrum */}
                        <div className="my-6">
                          <div className="flex items-end justify-center gap-1 h-24 mb-4">
                            {waveformBars.map((h, index) => (
                              <div
                                key={index}
                                className={`w-1.5 rounded-full transition-all duration-100 ${
                                  isRecording 
                                    ? 'bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.4)]' 
                                    : robotStatus === 'speaking'
                                    ? 'bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.4)]'
                                    : 'bg-white/10'
                                }`}
                                style={{ height: `${h * 1.8}%` }}
                              />
                            ))}
                          </div>
                          
                          {/* Timer display */}
                          {isRecording ? (
                            <span className="font-mono text-xl text-cyan-300 font-semibold tracking-widest animate-pulse">
                              00:{recordingSeconds < 10 ? `0${recordingSeconds}` : recordingSeconds}
                            </span>
                          ) : (
                            <span className="font-mono text-xs text-slate-400">
                              Frequencies analyzed: 44.1 kHz • PCM Mono
                            </span>
                          )}
                        </div>

                        {/* Big Recording Button */}
                        <div className="flex justify-center">
                          {!isRecording ? (
                            <button
                              onClick={startRecording}
                              className="w-20 h-20 rounded-full bg-[#050608] hover:bg-slate-950 border border-cyan-400/50 hover:border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.15)] flex items-center justify-center cursor-pointer transition-all duration-300 transform hover:scale-105"
                            >
                              <div className="w-16 h-16 rounded-full bg-cyan-950/20 border border-cyan-400 hover:border-cyan-300 flex items-center justify-center text-cyan-400">
                                <Mic className="w-8 h-8 animate-pulse" />
                              </div>
                            </button>
                          ) : (
                            <button
                              onClick={stopRecording}
                              className="w-20 h-20 rounded-full bg-red-950/20 hover:bg-red-950/40 border border-red-500/50 flex items-center justify-center cursor-pointer transition-all duration-300 transform hover:scale-105 shadow-[0_0_20px_rgba(239,68,68,0.25)]"
                            >
                              <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center text-white">
                                <span className="w-6 h-6 bg-white rounded-md animate-pulse" />
                              </div>
                            </button>
                          )}
                        </div>

                        <div className="text-xs text-slate-300 font-medium">
                          {isRecording ? 'Click Red Block to Transcribe Speech' : 'Click Mic to Initiate Vocal Feed'}
                        </div>
                      </div>

                      {/* Interactive Fallback Transmitter / Preset Prompts */}
                      <div className="glass-panel p-5 rounded-3xl border border-white/10 space-y-4">
                        <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-slate-400">
                          <Sparkles className="w-4 h-4 text-cyan-400" />
                          <span>Pre-modulated Directives</span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          Transmit preset expressions straight into the active voice channel to test live text synthesis replies instantly:
                        </p>
                        
                        <div className="space-y-2">
                          <button
                            onClick={() => {
                              setV2tInputText("Explain how artificial speech pathways organize vocal parameters.");
                              handleSendToBot("Explain how artificial speech pathways organize vocal parameters.");
                            }}
                            className="w-full text-left p-2.5 bg-white/2 hover:bg-white/5 border border-white/5 hover:border-cyan-400/20 rounded-xl text-xs font-mono text-slate-300 transition-colors flex items-center justify-between"
                          >
                            <span>Explain artificial speech pathways</span>
                            <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
                          </button>
                          
                          <button
                            onClick={() => {
                              setV2tInputText("Check central command handshake latency and confirm server stats.");
                              handleSendToBot("Check central command handshake latency and confirm server stats.");
                            }}
                            className="w-full text-left p-2.5 bg-white/2 hover:bg-white/5 border border-white/5 hover:border-cyan-400/20 rounded-xl text-xs font-mono text-slate-300 transition-colors flex items-center justify-between"
                          >
                            <span>Check central command stats</span>
                            <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
                          </button>

                          <button
                            onClick={() => {
                              setV2tInputText("Give me a futuristic voice greeting to showcase this application.");
                              handleSendToBot("Give me a futuristic voice greeting to showcase this application.");
                            }}
                            className="w-full text-left p-2.5 bg-white/2 hover:bg-white/5 border border-white/5 hover:border-cyan-400/20 rounded-xl text-xs font-mono text-slate-300 transition-colors flex items-center justify-between"
                          >
                            <span>Request majestic visual greeting</span>
                            <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              )}

              {/* ---------------------------------
                  TEXT TO VOICE (TTS) SYNTHESIZER 
                  --------------------------------- */}
              {activeTab === 't2v' && (
                <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
                  
                  {/* Chamber Header */}
                  <div className="bg-[#0a0b10] p-4 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-2">
                      <Volume2 className="w-5 h-5 text-purple-400" />
                      <h2 className="text-xl font-display font-bold text-white">Text to Voice Synthesizer</h2>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Input customized dialogue expression parameters and let EchoBot synthesize high-quality vocal speech.</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* Text Input Block (7 Cols) */}
                    <div className="lg:col-span-7 glass-panel p-6 rounded-3xl border border-white/10 flex flex-col space-y-5">
                      <div>
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-2">Vocal Dialogue Input</span>
                        <textarea
                          rows={8}
                          value={t2vInputText}
                          onChange={(e) => setT2vInputText(e.target.value)}
                          placeholder="Type sentences here to compile into vocal soundwaves..."
                          className="w-full p-4 rounded-2xl glass-input text-slate-200 text-sm leading-relaxed font-sans focus:border-purple-500/50 resize-none"
                        />
                      </div>

                      {/* Control parameters */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-2">Vocal Speed: {settings.speechSpeed}x</label>
                          <input
                            type="range"
                            min="0.5"
                            max="2.0"
                            step="0.1"
                            value={settings.speechSpeed}
                            onChange={(e) => setSettings(prev => ({ ...prev, speechSpeed: parseFloat(e.target.value) }))}
                            className="w-full accent-purple-500 bg-slate-900 rounded-lg appearance-none h-1.5 cursor-pointer"
                          />
                          <div className="flex justify-between text-[9px] text-slate-500 font-mono mt-1">
                            <span>0.5x Slow</span>
                            <span>2.0x Fast</span>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-2">Decibel Volume: {Math.round(settings.volume * 100)}%</label>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={settings.volume}
                            onChange={(e) => setSettings(prev => ({ ...prev, volume: parseFloat(e.target.value) }))}
                            className="w-full accent-purple-500 bg-slate-900 rounded-lg appearance-none h-1.5 cursor-pointer"
                          />
                          <div className="flex justify-between text-[9px] text-slate-500 font-mono mt-1">
                            <span>0% Muted</span>
                            <span>100% Boost</span>
                          </div>
                        </div>
                      </div>

                      {/* Synthesis Trigger Button */}
                      <div className="flex gap-3">
                        <button
                          onClick={() => speakText(t2vInputText)}
                          disabled={!t2vInputText.trim() || robotStatus === 'speaking'}
                          className="flex-1 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono font-bold text-xs tracking-widest uppercase transition-all duration-200 cursor-pointer shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_35px_rgba(139,92,246,0.5)] flex items-center justify-center gap-2"
                        >
                          <Play className="w-4 h-4" /> COMPILE & SPEAK SPEECH
                        </button>
                        
                        {robotStatus === 'speaking' && (
                          <button
                            onClick={stopSpeaking}
                            className="px-5 py-3.5 rounded-xl border border-red-500/30 bg-red-950/20 text-red-400 font-mono font-bold text-xs hover:bg-red-950/40 transition-colors flex items-center justify-center"
                          >
                            HALT
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Speech Parameters Controller (5 Cols) */}
                    <div className="lg:col-span-5 space-y-6">
                      
                      {/* Active Waveform visual card during TTS */}
                      <div className="glass-panel p-6 rounded-3xl border border-white/10 text-center relative overflow-hidden flex flex-col justify-between h-[230px]">
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block text-left">Real-Time Wave Calibration</span>
                        
                        <div className="my-3">
                          {robotStatus === 'speaking' ? (
                            <div className="flex items-center justify-center gap-2 h-16 text-purple-400">
                              <Radio className="w-6 h-6 animate-ping text-purple-400" />
                              <span className="font-mono text-xs tracking-wider uppercase animate-pulse">VOCODER ENGAGED</span>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center gap-2 h-16 text-slate-500">
                              <VolumeX className="w-5 h-5" />
                              <span className="font-mono text-xs">Awaiting modulation trigger...</span>
                            </div>
                          )}

                          <div className="flex items-end justify-center gap-1.5 h-10 mt-3">
                            {waveformBars.slice(0, 10).map((h, i) => (
                              <div
                                key={i}
                                className={`w-1 rounded-full ${robotStatus === 'speaking' ? 'bg-purple-500' : 'bg-slate-800'} transition-all`}
                                style={{ height: `${h * 1.5}%` }}
                              />
                            ))}
                          </div>
                        </div>

                        <div className="text-[11px] text-slate-500 font-mono">
                          Output protocol: Web Speech API Synthesis High-Def (PCM)
                        </div>
                      </div>

                      {/* Speech Model parameters settings */}
                      <div className="glass-panel p-5 rounded-3xl border border-white/10 space-y-4">
                        <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-slate-400">
                          <Sliders className="w-4 h-4 text-purple-400" />
                          <span>Vocoder Model settings</span>
                        </div>
                        
                        <div className="space-y-3 text-xs">
                          {/* Dialect */}
                          <div>
                            <span className="block text-slate-400 mb-1.5">Vocal Accent / Dialect</span>
                            <select
                              value={settings.language}
                              onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))}
                              className="w-full bg-slate-950 border border-white/5 rounded-xl px-3 py-2 text-slate-300 font-mono outline-none"
                            >
                              <option value="en-US">English (United States) - US</option>
                              <option value="en-GB">English (United Kingdom) - UK</option>
                              <option value="es-ES">Spanish (Spain) - ES</option>
                              <option value="fr-FR">French (France) - FR</option>
                              <option value="de-DE">German (Germany) - DE</option>
                            </select>
                          </div>

                          {/* Model Voice Gender */}
                          <div>
                            <span className="block text-slate-400 mb-1.5">Model Vocal Gender</span>
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                onClick={() => setSettings(prev => ({ ...prev, voiceGender: 'female' }))}
                                className={`py-2 rounded-xl border text-xs font-mono transition-colors ${
                                  settings.voiceGender === 'female'
                                    ? 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                                    : 'border-white/5 text-slate-400 hover:text-white bg-white/2'
                                }`}
                              >
                                Female HD (Neural Zira)
                              </button>
                              <button
                                onClick={() => setSettings(prev => ({ ...prev, voiceGender: 'male' }))}
                                className={`py-2 rounded-xl border text-xs font-mono transition-colors ${
                                  settings.voiceGender === 'male'
                                    ? 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                                    : 'border-white/5 text-slate-400 hover:text-white bg-white/2'
                                }`}
                              >
                                Male HD (Neural David)
                              </button>
                            </div>
                          </div>

                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              )}

              {/* ---------------------------------
                  CONVERSATION HISTORY 
                  --------------------------------- */}
              {activeTab === 'history' && (
                <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
                  
                  {/* Chamber Header */}
                  <div className="bg-[#0a0b10] p-4 rounded-2xl border border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <History className="w-5 h-5 text-cyan-400" />
                        <h2 className="text-xl font-display font-bold text-white">Operational History Logs</h2>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">Review previously recorded vocal expressions, transcribing metrics, and chatbot messages.</p>
                    </div>

                    <button
                      onClick={() => {
                        if (window.confirm("Acknowledge: This will completely erase all stored communication histories.")) {
                          setConversations([]);
                          createNewConversation();
                        }
                      }}
                      className="px-4 py-2 border border-red-500/20 text-red-400 hover:bg-red-500/10 text-xs font-mono font-bold rounded-xl transition-all"
                    >
                      FLUSH ENTIRE ARCHIVE
                    </button>
                  </div>

                  {/* List of saved conversations */}
                  <div className="space-y-4">
                    {filteredConversations.length === 0 ? (
                      <div className="glass-panel p-8 rounded-2xl text-center border border-white/5 text-slate-400">
                        No conversations found matching query parameters.
                      </div>
                    ) : (
                      filteredConversations.map(c => (
                        <div
                          key={c.id}
                          className={`glass-panel p-5 rounded-2xl border transition-all ${
                            activeConversationId === c.id
                              ? 'border-cyan-400/40 bg-cyan-950/5'
                              : 'border-white/5 hover:border-white/10'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2.5 mb-3">
                            <div>
                              <h4 className="text-sm font-bold text-white font-mono">{c.title}</h4>
                              <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">
                                Captured: {new Date(c.timestamp).toLocaleString()} • {c.messages.length} exchanges
                              </span>
                            </div>
                            
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setActiveConversationId(c.id);
                                  setActiveTab('v2t');
                                }}
                                className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-[#050608] font-mono text-[10px] font-bold rounded-lg transition-colors cursor-pointer"
                              >
                                OPEN CHANNEL
                              </button>
                              
                              <button
                                onClick={(e) => deleteConversation(c.id, e)}
                                className="p-1.5 border border-white/5 hover:bg-red-500/10 hover:text-red-400 rounded-lg text-slate-400 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <p className="text-xs text-slate-400 leading-relaxed max-w-2xl bg-slate-950/40 p-3 rounded-lg border border-white/2">
                            {c.messages[c.messages.length - 1]?.text || "Empty room dialogue logs."}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* ---------------------------------
                  SETTINGS CHAMBER 
                  --------------------------------- */}
              {activeTab === 'settings' && (
                <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
                  
                  {/* Chamber Header */}
                  <div className="bg-[#0a0b10] p-4 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-2">
                      <Settings className="w-5 h-5 text-cyan-400" />
                      <h2 className="text-xl font-display font-bold text-white">System Settings</h2>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Configure neural engine variables, voice speed parameters, and visual dashboard interfaces.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Vocal Engine Settings */}
                    <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-5">
                      <h3 className="text-sm font-bold font-mono uppercase tracking-widest text-slate-300 border-b border-white/5 pb-2">
                        VOICE CORES
                      </h3>

                      {/* Language selection */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-mono text-slate-400 uppercase tracking-widest block">Main Voice Language</label>
                        <select
                          value={settings.language}
                          onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-200 text-xs font-mono outline-none"
                        >
                          <option value="en-US">English (United States)</option>
                          <option value="en-GB">English (United Kingdom)</option>
                          <option value="es-ES">Spanish (Spain)</option>
                          <option value="fr-FR">French (France)</option>
                          <option value="de-DE">German (Germany)</option>
                        </select>
                      </div>

                      {/* Voice model selection */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-mono text-slate-400 uppercase tracking-widest block">Neural Speaker Voice</label>
                        <select
                          value={settings.voiceGender}
                          onChange={(e) => setSettings(prev => ({ ...prev, voiceGender: e.target.value as 'male' | 'female' }))}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-200 text-xs font-mono outline-none"
                        >
                          <option value="female">Neural Voice: Sarah (HD Female)</option>
                          <option value="male">Neural Voice: David (HD Male)</option>
                        </select>
                      </div>

                      {/* Volume and Mute options */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <label className="text-xs font-mono text-slate-400 uppercase tracking-widest">Global Mute Status</label>
                          <button
                            onClick={toggleMute}
                            className={`px-3 py-1 rounded-md text-xs font-mono border transition-colors ${
                              settings.isMuted
                                ? 'bg-red-500/10 text-red-400 border-red-500/20'
                                : 'bg-green-500/10 text-green-400 border-green-500/20'
                            }`}
                          >
                            {settings.isMuted ? 'MUTED' : 'LIVE'}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Interface Styling Settings */}
                    <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-5">
                      <h3 className="text-sm font-bold font-mono uppercase tracking-widest text-slate-300 border-b border-white/5 pb-2">
                        THEME & GLOWS
                      </h3>

                      {/* Active theme color */}
                      <div className="space-y-2.5">
                        <label className="text-xs font-mono text-slate-400 uppercase tracking-widest block">Neon Laser Highlights</label>
                        <div className="grid grid-cols-3 gap-2">
                          <button
                            onClick={() => setSettings(prev => ({ ...prev, accentColor: 'cyan' }))}
                            className={`py-2 rounded-xl text-xs font-mono border transition-all ${
                              settings.accentColor === 'cyan'
                                ? 'bg-cyan-500/10 text-cyan-400 border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                                : 'border-white/5 text-slate-400 hover:text-white bg-white/2'
                            }`}
                          >
                            Cyan Pulse
                          </button>
                          
                          <button
                            onClick={() => setSettings(prev => ({ ...prev, accentColor: 'blue' }))}
                            className={`py-2 rounded-xl text-xs font-mono border transition-all ${
                              settings.accentColor === 'blue'
                                ? 'bg-blue-500/10 text-blue-400 border-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.2)]'
                                : 'border-white/5 text-slate-400 hover:text-white bg-white/2'
                            }`}
                          >
                            Neon Blue
                          </button>

                          <button
                            onClick={() => setSettings(prev => ({ ...prev, accentColor: 'purple' }))}
                            className={`py-2 rounded-xl text-xs font-mono border transition-all ${
                              settings.accentColor === 'purple'
                                ? 'bg-purple-500/10 text-purple-400 border-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.2)]'
                                : 'border-white/5 text-slate-400 hover:text-white bg-white/2'
                            }`}
                          >
                            Cosmic Violet
                          </button>
                        </div>
                      </div>

                      {/* User details summary card */}
                      <div className="space-y-2 bg-[#0a0b10] p-4 rounded-2xl border border-white/5 text-xs text-slate-400 font-mono">
                        <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mb-1.5">Operator details</div>
                        <div>Operator ID: AlexV_Secure_2026</div>
                        <div>Handshake Cipher: Verified (AES-256)</div>
                        <div>Cloud Engine Status: Synced</div>
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* ---------------------------------
                  SYSTEM HELP CENTER 
                  --------------------------------- */}
              {activeTab === 'help' && (
                <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
                  
                  {/* Chamber Header */}
                  <div className="bg-[#0a0b10] p-4 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-2">
                      <HelpCircle className="w-5 h-5 text-cyan-400" />
                      <h2 className="text-xl font-display font-bold text-white">System Guide & Support</h2>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Acquire procedural knowledge for EchoBot Voice to Text and Text to Voice operations.</p>
                  </div>

                  {/* Frequently Asked Questions */}
                  <div className="space-y-4">
                    <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-2">
                      <h4 className="text-sm font-bold text-white font-mono flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                        How does the Voice to Text chamber function?
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        EchoBot utilizes standard Web Speech API voice listeners directly inside your browser. Once you click the Microphone button, speak clearly. If your browser blocks microphone permissions inside the preview frame, EchoBot automatically deploys an interactive pre-calibrated text transmission system to seamlessly model the full AI conversational experience!
                      </p>
                    </div>

                    <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-2">
                      <h4 className="text-sm font-bold text-white font-mono flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                        How do I alter the Voice genders or speed multipliers?
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Navigate to the <strong>Text to Voice Synthesizer</strong> or the <strong>System Settings</strong> tabs. Under Voice parameters, select either Male or Female speakers and use sliders to accelerate speech modulation from 0.5x (slow) up to 2.0x (ultra-fast).
                      </p>
                    </div>

                    <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-2">
                      <h4 className="text-sm font-bold text-white font-mono flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                        Does EchoBot AI run server-side or local?
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        EchoBot AI utilizes a hybrid full-stack system. Conversation logs and advanced model generation are processed by Gemini server-side, while real-time text-to-speech synthesis runs entirely client-side using advanced high-fidelity neural vocoder assets inside your device.
                      </p>
                    </div>
                  </div>
                </div>
              )}

            </main>
          </div>
        </div>
      )}

      {/* ---------------------------------
          FOOTER SYSTEM MARGINS 
          --------------------------------- */}
      <footer className="py-4 px-6 border-t border-white/5 bg-[#050608] flex flex-col sm:flex-row justify-between items-center gap-2.5 text-[10px] font-mono text-slate-500 relative z-20 shrink-0">
        <div>
          © 2026 EchoBot AI. All quantum communications encrypted.
        </div>
        <div className="flex items-center gap-4">
          <span>Neural Bandwidth: 1.2 GB/s</span>
          <span>Holographic core online</span>
        </div>
      </footer>

    </div>
  );
}
