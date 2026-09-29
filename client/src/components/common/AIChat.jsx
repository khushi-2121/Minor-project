import { useEffect, useRef, useState } from 'react';
import { Bot, Circle, Minimize2, RotateCcw, Send, Sparkles, Trash2 } from 'lucide-react';
import { aiService } from '../../services/aiService';

const suggestions = [
  'What does low nitrogen mean?',
  'Which crop is suitable for my soil?',
  'How can I improve my soil fertility?',
  'Which fertilizer should I use?',
];

const initialMessage = "Hi! I'm AgriSense AI 🌱\nI can help you understand your soil, nutrients, crops, fertilizers, and soil improvement plans.";

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

function Message({ item }) {
  const isUser = item.role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[86%] ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
        <div className={`whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-5 ${isUser ? 'rounded-br-md bg-emerald-700 text-white' : 'rounded-bl-md bg-slate-100 text-slate-800'}`}>
          {item.text}
        </div>
        <span className="mt-1 px-1 text-[11px] text-slate-400">{formatTime(item.createdAt)}</span>
      </div>
    </div>
  );
}

export default function AIChat({ inline = false, onClose }) {
  const [messages, setMessages] = useState([{ role: 'assistant', text: initialMessage, createdAt: new Date() }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [technicalError, setTechnicalError] = useState('');
  const [lastFailedMessage, setLastFailedMessage] = useState('');
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [messages, loading, error]);

  const sendMessage = async (value = input, { recordUser = true } = {}) => {
    const message = value.trim();
    if (!message || loading) return;

    setInput('');
    setError('');
    setTechnicalError('');
    if (recordUser) {
      setMessages((current) => [...current, { role: 'user', text: message, createdAt: new Date() }]);
    }
    setLoading(true);

    try {
      const response = await aiService.chat(message);
      const reply = response?.reply || response?.message;
      if (!response?.success || !reply) throw new Error(response?.message || 'Unable to connect to the AI service.');
      setMessages((current) => [...current, { role: 'assistant', text: reply, createdAt: new Date() }]);
      setLastFailedMessage('');
    } catch (requestError) {
      setError('Unable to connect to the AI service.');
      setTechnicalError(requestError.message || 'The backend AI endpoint did not return a response.');
      setLastFailedMessage(message);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    sendMessage();
  };

  const clearConversation = () => {
    setMessages([{ role: 'assistant', text: initialMessage, createdAt: new Date() }]);
    setInput('');
    setError('');
    setTechnicalError('');
    setLastFailedMessage('');
    inputRef.current?.focus();
  };

  const panelClasses = inline
    ? 'w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm'
    : 'fixed bottom-24 right-4 z-[60] flex h-[min(620px,calc(100vh-8rem))] w-[min(400px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl sm:right-6';

  return (
    <section className={panelClasses} aria-label="AgriSense AI chat">
      <div className="flex items-center justify-between bg-emerald-700 px-4 py-3 text-white">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/15"><Bot size={20} aria-hidden="true" /></div>
          <div className="min-w-0">
            <h2 className="truncate text-sm font-bold">AgriSense AI</h2>
            <p className="flex items-center gap-1 text-xs text-emerald-100"><Circle size={7} fill="currentColor" aria-hidden="true" />Your intelligent soil assistant</p>
          </div>
        </div>
        <button type="button" onClick={clearConversation} className="rounded-lg p-2 text-white hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white" aria-label="Clear conversation" title="Clear conversation">
          <Trash2 size={17} aria-hidden="true" />
        </button>
        {!inline && (
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-white hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white" aria-label="Minimize AI assistant">
            <Minimize2 size={18} aria-hidden="true" />
          </button>
        )}
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4" aria-live="polite">
          {messages.map((message, index) => <Message key={`${message.createdAt.toISOString()}-${index}`} item={message} />)}
          {loading && <div className="flex items-center gap-2 text-sm text-slate-500"><Sparkles size={15} className="text-emerald-600" />Thinking...</div>}
          {error && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900" role="alert">
              <p>{error}</p>
              <details className="mt-2 text-xs text-amber-800">
                <summary className="cursor-pointer font-semibold">Technical details</summary>
                <p className="mt-1 break-words">{technicalError}</p>
              </details>
              {lastFailedMessage && <button type="button" onClick={() => sendMessage(lastFailedMessage, { recordUser: false })} disabled={loading} className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-amber-900 hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-60"><RotateCcw size={13} aria-hidden="true" />Retry</button>}
            </div>
          )}
          <div ref={messagesEndRef} aria-hidden="true" />
        </div>

        <div className="border-t border-slate-200 bg-slate-50 p-3">
          <div className="mb-3 flex flex-wrap gap-2 pb-1">
            {suggestions.map((suggestion) => (
              <button key={suggestion} type="button" onClick={() => sendMessage(suggestion)} disabled={loading} className="max-w-full rounded-full border border-emerald-200 bg-white px-3 py-1.5 text-left text-xs font-medium leading-4 text-emerald-800 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:text-slate-400" aria-label={`Ask: ${suggestion}`}>
                {suggestion}
              </button>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="flex items-end gap-2">
            <textarea ref={inputRef} value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); handleSubmit(event); } }} rows={1} maxLength={1000} placeholder="Ask something..." className="min-h-11 max-h-28 min-w-0 flex-1 resize-y rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/25" aria-label="Ask AgriSense AI" />
            <button type="submit" disabled={loading || !input.trim()} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-white shadow-sm hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-300" aria-label="Send message">
              <Send size={17} aria-hidden="true" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
