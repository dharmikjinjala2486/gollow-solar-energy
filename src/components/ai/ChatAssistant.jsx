import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Sun, ArrowRight, CheckCircle2 } from 'lucide-react';

const SUGGESTIONS = [
  "How does solar rental work?",
  "Is there an upfront investment?",
  "What is the average savings?",
  "Do you support construction sites?",
  "I want to request a callback"
];

const BOT_RESPONSES = {
  "how does solar rental work?": "GOL LOW rents out complete solar power systems (panels, inverters, and optional battery storage) to UAE businesses and homeowners. We handle everything from site surveys to engineering design, DEWA/authority approvals, installation, commissioning, and continuous monitoring. You simply pay a flat monthly rental fee that is offset by your utility bill savings.",
  "is there an upfront investment?": "No, there is absolutely zero upfront capital expenditure (CAPEX). GOL LOW covers 100% of the equipment, logistics, installation, and engineering costs. Your rental contract starts only after the system is fully commissioned and starts generating power.",
  "what is the average savings?": "Most clients see immediate net savings of 15% to 35% on their utility bills. Because your solar generation offset is larger than the monthly rental payment, you achieve positive cash flow from day one.",
  "do you support construction sites?": "Yes, we specialize in high-capacity solar container units paired with industrial batteries. These solar rentals replace loud, polluting diesel generators on construction and infrastructure sites across the UAE, reducing fuel costs by up to 60%.",
  "i want to request a callback": "Excellent. I can arrange an energy specialist to contact you. Please share your name, phone number, and location, and we will get in touch within 24 hours."
};

const DEFAULT_FALLBACK = "I can help you with solar rental inquiries, pricing plans, construction setups, and ROI calculations. Ask me anything, or type 'request callback' to have our engineers call you.";

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showNotifications, setShowNotifications] = useState(true);
  const messagesEndRef = useRef(null);

  // Load welcome message
  useEffect(() => {
    setMessages([
      {
        id: 1,
        sender: 'bot',
        text: "Marhaban! I am your GOL LOW Solar Assistant. Let me help you estimate your solar rental benefits and structure your clean energy plan. How can I help you today?",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    
    // Auto open/hint notification timer
    const timer = setTimeout(() => {
      setShowNotifications(false);
    }, 6000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSend = (textToSend) => {
    if (!textToSend.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newMessagesHistory = [...messages, userMsg];
    setMessages(newMessagesHistory);
    setInputText('');
    setIsTyping(true);

    fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: newMessagesHistory.map(m => ({
          role: m.sender === 'user' ? 'user' : 'assistant',
          content: m.text
        }))
      })
    })
      .then((res) => res.json())
      .then((data) => {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          sender: 'bot',
          text: data.content,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        setIsTyping(false);
      })
      .catch((err) => {
        console.error('Chat API Error:', err);
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          sender: 'bot',
          text: 'I apologize, but I am experiencing connection issues. Please call us at +971 4 337 7881.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        setIsTyping(false);
      });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend(inputText);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div id="chat-assistant-container" className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        <AnimatePresence>
          {showNotifications && !isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              className="bg-brand-yellow text-brand-navy text-xs font-semibold py-2 px-4 rounded-xl shadow-lg border border-brand-yellow/20 flex items-center gap-2"
            >
              <Sun className="w-4 h-4 animate-spin-slow" />
              <span>Ask me about Solar Rentals!</span>
              <button onClick={() => setShowNotifications(false)}>
                <X className="w-3.5 h-3.5 hover:text-white" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          id="chat-trigger-btn"
          onClick={() => {
            setIsOpen(!isOpen);
            setShowNotifications(false);
          }}
          className="relative w-14 h-14 rounded-full bg-brand-yellow hover:bg-brand-yellow/95 text-brand-navy flex items-center justify-center shadow-glow-yellow transition-transform duration-300 hover:scale-105 active:scale-95 group"
        >
          {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
          <span className="absolute inset-0 rounded-full border-4 border-brand-yellow/25 animate-ping pointer-events-none" />
        </button>
      </div>

      {/* Chat Window Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-24 left-4 right-4 sm:left-auto sm:right-6 sm:w-[400px] h-[500px] sm:h-[550px] max-h-[70vh] sm:max-h-[80vh] bg-brand-navy/95 border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 backdrop-blur-md"
          >
            {/* Header */}
            <div className="bg-[#04111f] p-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full bg-brand-yellow/10 flex items-center justify-center border border-brand-yellow/20">
                  <Sun className="w-5 h-5 text-brand-yellow animate-spin-slow" />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-brand-green rounded-full border-2 border-brand-navy" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-sm text-white flex items-center gap-1.5">
                    GOL LOW Solar AI
                  </h4>
                  <span className="text-[10px] text-brand-green font-medium">Online • Instant Support</span>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/60 hover:text-white p-1 hover:bg-white/5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col max-w-[80%] ${
                    msg.sender === 'user' ? 'self-end items-end' : 'self-start items-start'
                  }`}
                >
                  <div
                    className={`px-4 py-3 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-brand-yellow text-brand-navy font-medium rounded-tr-none'
                        : 'bg-white/5 text-white/90 border border-white/10 rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-white/30 mt-1 px-1">{msg.time}</span>
                </div>
              ))}

              {isTyping && (
                <div className="self-start flex flex-col items-start max-w-[80%]">
                  <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-none px-4 py-3.5 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestion Chips */}
            <div className="p-3 bg-white/5 border-t border-white/5 flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-none" style={{ scrollbarWidth: 'none' }}>
              {SUGGESTIONS.map((sug, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(sug)}
                  className="bg-white/5 border border-white/10 hover:border-brand-yellow/40 hover:bg-white/10 text-white/80 rounded-full px-3 py-1.5 text-[10px] transition-all duration-300 active:scale-95"
                >
                  {sug}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <div className="p-3 bg-[#04111f] border-t border-white/10 flex gap-2 items-center">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about rental rates, solar arrays..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-yellow/50 placeholder:text-white/30"
              />
              <button
                onClick={() => handleSend(inputText)}
                disabled={!inputText.trim()}
                className="p-2.5 rounded-xl bg-brand-yellow text-brand-navy hover:bg-brand-yellow/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
