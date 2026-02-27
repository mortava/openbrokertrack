'use client';

import { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Bot,
  User,
  Sparkles,
  Minimize2,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/auth-context';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const QUICK_PROMPTS = [
  'What tasks are overdue?',
  'Summarize my pipeline',
  'Help me with a loan scenario',
  'What documents do I need?',
];

// Simple AI response logic — contextual to mortgage LOS
function generateResponse(input: string, userName: string): string {
  const lower = input.toLowerCase();

  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
    return `Hello ${userName}! I'm your OpenBrokerTrack AI assistant. I can help you with loan scenarios, pipeline questions, document requirements, and general mortgage guidance. What can I help you with?`;
  }

  if (lower.includes('overdue') || lower.includes('late') || lower.includes('behind')) {
    return `To check your overdue tasks, look at the **Today's Goals** widget on your dashboard — it shows all overdue and due-today items at a glance. You can also visit the Pipeline view and filter by status to find loans that may need attention.\n\nWould you like tips on prioritizing your pipeline?`;
  }

  if (lower.includes('pipeline') || lower.includes('summary') || lower.includes('status')) {
    return `Here's how to get a quick pipeline overview:\n\n1. **Dashboard** — The Task Summary cards show your open tasks by timeframe\n2. **Pipeline view** — Switch between Kanban and List views to see all loans by stage\n3. **Reports** — Check the Active Pipeline chart for a visual breakdown\n\nYou can filter by stage, loan type, or assigned MLO. Need help with a specific loan?`;
  }

  if (lower.includes('document') || lower.includes('doc') || lower.includes('checklist')) {
    return `Common documents needed for loan files:\n\n**Income:**\n- 2 years W-2s / 1099s\n- 30 days paystubs\n- 2 years tax returns\n\n**Assets:**\n- 2 months bank statements\n- Retirement/investment statements\n\n**Property:**\n- Purchase contract\n- Appraisal report\n- Title commitment\n- Homeowners insurance\n\n**Credit:**\n- Credit report (pulled by lender)\n- LOE for inquiries if needed\n\nFor DSCR/investor loans, you'll also need the lease agreement and rent schedule. Would you like the full checklist for a specific loan type?`;
  }

  if (lower.includes('scenario') || lower.includes('loan') || lower.includes('qualify')) {
    return `I can help you think through loan scenarios! Tell me about:\n\n- **Loan amount** and **property value** (for LTV)\n- **Credit score**\n- **Occupancy** (primary, secondary, investment)\n- **Income type** (W-2, self-employed, DSCR)\n- **Property type** (SFR, condo, multi-unit)\n\nWith these details, I can suggest which programs might be a good fit and what to watch out for.`;
  }

  if (lower.includes('dscr') || lower.includes('investor') || lower.includes('rental')) {
    return `**DSCR Loan Quick Guide:**\n\n- DSCR = Gross Rental Income / PITIA\n- Most lenders want **DSCR >= 1.00** (some allow 0.75)\n- No personal income verification needed\n- Investment properties only\n- Typically 620+ credit score\n- LTV up to 80% (purchase) or 75% (cash-out)\n- **Prepayment penalties** are common (3-5 year)\n\nBetter DSCR ratios (1.25+) get better pricing. Want me to help structure a DSCR scenario?`;
  }

  if (lower.includes('rate') || lower.includes('pricing') || lower.includes('lock')) {
    return `For rate and pricing questions:\n\n1. **Check current rates** using the pricing engine (if connected)\n2. **Lock timing** — Consider market conditions and closing timeline\n3. **Rate factors** that matter most: credit score, LTV, property type, occupancy\n\n**Tips:**\n- Higher credit scores (740+) get the best pricing\n- Lower LTV = better rate\n- Investment properties have higher rates than primary\n- Rate locks are typically 15-60 days\n\nWould you like help comparing rate scenarios?`;
  }

  if (lower.includes('help') || lower.includes('what can you')) {
    return `I can assist with:\n\n- **Loan scenarios** — Structure deals and check eligibility\n- **Document checklists** — What's needed per loan type\n- **Pipeline management** — Tips on prioritizing tasks\n- **Program guidance** — Conventional, FHA, VA, DSCR, NonQM\n- **General mortgage Q&A** — Guidelines, calculations, best practices\n\nJust ask me anything! I'm here to help you close more loans faster.`;
  }

  if (lower.includes('thank') || lower.includes('thanks')) {
    return `You're welcome, ${userName}! Don't hesitate to ask if you need anything else. Happy closing!`;
  }

  return `Great question! Here's what I'd suggest:\n\nFor specific loan-level help, try opening the loan in the Pipeline and reviewing the details tab. For broader questions about guidelines or scenarios, feel free to describe the situation and I'll walk you through it.\n\nYou can ask me about:\n- Loan scenarios & eligibility\n- Document requirements\n- Program guidelines (Conv, FHA, VA, DSCR)\n- Pipeline & task management tips\n\nWhat would you like to dive into?`;
}

export default function AIAssistant() {
  const { currentUser } = useAuth();
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hi ${currentUser.fullName.split(' ')[0]}! I'm your AI assistant for OpenBrokerTrack. I can help with loan scenarios, document checklists, pipeline questions, and more. How can I help you today?`,
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (open && !minimized) {
      inputRef.current?.focus();
    }
  }, [open, minimized]);

  function handleSend(text?: string) {
    const msg = (text || input).trim();
    if (!msg) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: msg,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking delay
    setTimeout(() => {
      const response = generateResponse(msg, currentUser.fullName.split(' ')[0]);
      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 800 + Math.random() * 700);
  }

  // Floating button when closed
  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-[9999] w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center group"
        title="AI Assistant"
      >
        <MessageSquare size={20} />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
      </button>
    );
  }

  // Minimized bar
  if (minimized) {
    return (
      <div
        className="fixed bottom-5 right-5 z-[9999] bg-white border border-slate-200 rounded-xl shadow-lg flex items-center gap-2 px-3 py-2 cursor-pointer hover:shadow-xl transition-shadow"
        onClick={() => setMinimized(false)}
      >
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
          <Bot size={12} className="text-white" />
        </div>
        <span className="text-xs font-medium text-slate-700">AI Assistant</span>
        <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
        <button
          onClick={(e) => { e.stopPropagation(); setOpen(false); setMinimized(false); }}
          className="ml-1 p-0.5 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600"
        >
          <X size={12} />
        </button>
      </div>
    );
  }

  // Full chat panel
  return (
    <div className="fixed bottom-5 right-5 z-[9999] w-[380px] h-[520px] bg-white border border-slate-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <Sparkles size={16} className="text-white" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">AI Assistant</h4>
            <p className="text-[10px] text-blue-200">OpenBrokerTrack</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setMinimized(true)}
            className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors"
            title="Minimize"
          >
            <Minimize2 size={14} />
          </button>
          <button
            onClick={() => setOpen(false)}
            className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors"
            title="Close"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-slate-50/50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              'flex gap-2',
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            {msg.role === 'assistant' && (
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shrink-0 mt-0.5">
                <Bot size={12} className="text-white" />
              </div>
            )}
            <div
              className={cn(
                'max-w-[80%] px-3 py-2 rounded-xl text-xs leading-relaxed',
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-sm'
                  : 'bg-white border border-slate-200 text-slate-700 rounded-bl-sm shadow-sm'
              )}
            >
              {msg.content.split('\n').map((line, i) => (
                <span key={i}>
                  {line.split(/(\*\*[^*]+\*\*)/).map((part, j) =>
                    part.startsWith('**') && part.endsWith('**') ? (
                      <strong key={j} className={msg.role === 'user' ? 'text-white' : 'text-slate-900'}>
                        {part.slice(2, -2)}
                      </strong>
                    ) : (
                      <span key={j}>{part}</span>
                    )
                  )}
                  {i < msg.content.split('\n').length - 1 && <br />}
                </span>
              ))}
            </div>
            {msg.role === 'user' && (
              <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                <User size={12} className="text-slate-600" />
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex gap-2 items-start">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shrink-0">
              <Bot size={12} className="text-white" />
            </div>
            <div className="bg-white border border-slate-200 rounded-xl rounded-bl-sm px-3 py-2 shadow-sm">
              <div className="flex items-center gap-1.5">
                <Loader2 size={12} className="text-blue-500 animate-spin" />
                <span className="text-[11px] text-slate-400">Thinking...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick prompts (show when few messages) */}
      {messages.length <= 2 && (
        <div className="px-4 py-2 border-t border-slate-100 bg-white">
          <p className="text-[10px] text-slate-400 mb-1.5">Quick questions:</p>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSend(prompt)}
                className="px-2.5 py-1 text-[10px] font-medium text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="px-3 py-2.5 border-t border-slate-200 bg-white shrink-0">
        <form
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex items-center gap-2"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything..."
            className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 bg-slate-50 placeholder:text-slate-400"
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={14} />
          </button>
        </form>
      </div>
    </div>
  );
}
