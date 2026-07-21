"use client";
import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'ai';
  content: string;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: 'Namaskara. I am your Crime Intelligence Assistant. How can I help you investigate today? (e.g., "Show network links for Accused X" or "Predict theft hotspots in Bangalore")' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, history: messages })
      });

      const data = await response.json();
      console.log("🔍 Backend Response:", data);

      if (!response.ok) {
        throw new Error(data.detail || "Backend returned an error");
      }

      const aiText = data.response || "Received empty response from backend.";
      setMessages(prev => [...prev, { role: 'ai', content: aiText }]);
      
    } catch (error: any) {
      console.error("❌ Chat Error:", error);
      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: `⚠️ Error: ${error.message || 'Failed to connect to the intelligence backend.'}` 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportPDF = () => {
    alert("PDF Export triggered!");
  };

  const handleVoiceInput = () => {
    alert("Voice input triggered!");
  };

  return (
    <div className="flex flex-col h-[600px] bg-slate-800 rounded-lg border border-slate-700 shadow-xl">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-lg ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-br-none' 
                : 'bg-slate-700 text-slate-100 rounded-bl-none border border-slate-600'
            }`}>
              <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-700 p-3 rounded-lg rounded-bl-none border border-slate-600">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-slate-700 bg-slate-800 rounded-b-lg">
        <div className="flex gap-2">
          <button onClick={handleVoiceInput} className="p-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300 transition" title="Voice Input">🎤</button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about crime patterns, networks, or FIRs..."
            className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button onClick={handleSend} disabled={isLoading} className="px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white rounded-lg font-medium transition">Send</button>
          <button onClick={handleExportPDF} className="p-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300 transition" title="Export to PDF">📄</button>
        </div>
      </div>
    </div>
  );
}