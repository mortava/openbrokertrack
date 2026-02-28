'use client';

import { useState, useMemo } from 'react';
import {
  Megaphone,
  Send,
  Users,
  Mail,
  CheckCircle2,
  AlertCircle,
  Search,
  Check,
  Loader2,
  UserCheck,
  FileText,
  Sparkles,
} from 'lucide-react';
import { useContacts } from '@/hooks/useContacts';
import { useAuth } from '@/contexts/auth-context';
import { cn } from '@/lib/utils';

type EmailMode = 'bulk' | 'single';

const EMAIL_TEMPLATES = [
  {
    id: 'rate-update',
    name: 'Rate Update',
    subject: 'Current Rate Update — Great Opportunities Available',
    body: `Hi {{name}},\n\nI wanted to share some exciting rate updates with you. Current market conditions are favorable, and I'd love to discuss how this might benefit your clients.\n\nLet me know if you'd like to schedule a quick call to review scenarios.\n\nBest regards,\n{{sender}}`,
  },
  {
    id: 'new-program',
    name: 'New Program Announcement',
    subject: 'New Loan Program Now Available',
    body: `Hi {{name}},\n\nWe're excited to announce a new loan program that could open doors for more of your clients. Key highlights include:\n\n• Competitive rates\n• Flexible qualification criteria\n• Fast turnaround times\n\nReach out anytime to learn more.\n\nBest,\n{{sender}}`,
  },
  {
    id: 'follow-up',
    name: 'General Follow-Up',
    subject: 'Checking In — How Can I Help?',
    body: `Hi {{name}},\n\nI hope all is well! I wanted to check in and see if there's anything I can help with. Whether it's a new loan scenario, pricing question, or just catching up — I'm here for you.\n\nLooking forward to hearing from you.\n\nBest,\n{{sender}}`,
  },
  {
    id: 'custom',
    name: 'Custom Email',
    subject: '',
    body: '',
  },
];

export default function MarketingPage() {
  const { contacts, loading: contactsLoading } = useContacts();
  const { currentUser } = useAuth();

  const [mode, setMode] = useState<EmailMode>('bulk');
  const [selectedContacts, setSelectedContacts] = useState<Set<string>>(new Set());
  const [selectedTemplate, setSelectedTemplate] = useState(EMAIL_TEMPLATES[0]);
  const [subject, setSubject] = useState(EMAIL_TEMPLATES[0].subject);
  const [body, setBody] = useState(EMAIL_TEMPLATES[0].body);
  const [singleEmail, setSingleEmail] = useState('');
  const [singleName, setSingleName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  // Filter contacts by search
  const filteredContacts = useMemo(() => {
    if (!searchQuery.trim()) return contacts;
    const q = searchQuery.toLowerCase();
    return contacts.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.company?.toLowerCase().includes(q)
    );
  }, [contacts, searchQuery]);

  // Contact type groups
  const contactsByType = useMemo(() => {
    const groups: Record<string, typeof contacts> = {};
    filteredContacts.forEach((c) => {
      const type = c.type || 'other';
      if (!groups[type]) groups[type] = [];
      groups[type].push(c);
    });
    return groups;
  }, [filteredContacts]);

  function toggleContact(id: string) {
    setSelectedContacts((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function selectAllVisible() {
    const ids = filteredContacts.map((c) => c.id);
    setSelectedContacts(new Set(ids));
  }

  function clearSelection() {
    setSelectedContacts(new Set());
  }

  function handleTemplateChange(templateId: string) {
    const tmpl = EMAIL_TEMPLATES.find((t) => t.id === templateId) ?? EMAIL_TEMPLATES[0];
    setSelectedTemplate(tmpl);
    setSubject(tmpl.subject);
    setBody(tmpl.body);
  }

  function personalizeBody(rawBody: string, name: string): string {
    return rawBody
      .replace(/\{\{name\}\}/g, name)
      .replace(/\{\{sender\}\}/g, currentUser.fullName);
  }

  async function handleSend() {
    setSending(true);
    setResult(null);

    try {
      let recipients: { email: string; name: string }[] = [];

      if (mode === 'single') {
        if (!singleEmail.trim()) {
          setResult({ success: false, message: 'Please enter an email address.' });
          setSending(false);
          return;
        }
        recipients = [{ email: singleEmail.trim(), name: singleName.trim() || 'there' }];
      } else {
        const selected = contacts.filter((c) => selectedContacts.has(c.id));
        if (selected.length === 0) {
          setResult({ success: false, message: 'Please select at least one contact.' });
          setSending(false);
          return;
        }
        recipients = selected.map((c) => ({ email: c.email, name: c.name }));
      }

      if (!subject.trim()) {
        setResult({ success: false, message: 'Please enter a subject line.' });
        setSending(false);
        return;
      }

      let successCount = 0;
      let failCount = 0;

      // Send emails one at a time for personalization
      for (const recipient of recipients) {
        const personalizedBody = personalizeBody(body, recipient.name);
        const htmlBody = personalizedBody.replace(/\n/g, '<br/>');

        try {
          const res = await fetch('/api/send-notification', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              subject,
              html: `
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                  ${htmlBody}
                </div>
              `,
              to: [recipient.email],
            }),
          });

          if (res.ok) successCount++;
          else failCount++;
        } catch {
          failCount++;
        }
      }

      if (failCount === 0) {
        setResult({ success: true, message: `Successfully sent ${successCount} email${successCount !== 1 ? 's' : ''}!` });
      } else {
        setResult({
          success: false,
          message: `Sent ${successCount}, failed ${failCount} of ${recipients.length} emails.`,
        });
      }
    } catch {
      setResult({ success: false, message: 'An unexpected error occurred.' });
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-slate-50">
      <div className="p-5 space-y-5 max-w-6xl mx-auto w-full">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Megaphone size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">Marketing Center</h1>
              <p className="text-xs text-slate-500">Send emails to your contacts directly from the portal</p>
            </div>
          </div>
        </div>

        {/* Mode toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setMode('bulk')}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all',
              mode === 'bulk'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            )}
          >
            <Users size={14} />
            Bulk Email
          </button>
          <button
            onClick={() => setMode('single')}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all',
              mode === 'single'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            )}
          >
            <Mail size={14} />
            Single Email
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
          {/* Left: Recipients */}
          <div className="xl:col-span-2">
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100">
                <h3 className="text-xs font-semibold text-slate-700 flex items-center gap-2">
                  <UserCheck size={13} />
                  {mode === 'bulk' ? 'Select Recipients' : 'Recipient'}
                </h3>
              </div>

              {mode === 'single' ? (
                <div className="p-4 space-y-3">
                  <div>
                    <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={singleName}
                      onChange={(e) => setSingleName(e.target.value)}
                      placeholder="Recipient name"
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 bg-white placeholder:text-slate-400"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={singleEmail}
                      onChange={(e) => setSingleEmail(e.target.value)}
                      placeholder="email@example.com"
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 bg-white placeholder:text-slate-400"
                    />
                  </div>
                </div>
              ) : (
                <>
                  {/* Search + actions */}
                  <div className="px-4 py-2 border-b border-slate-50">
                    <div className="relative mb-2">
                      <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search contacts..."
                        className="w-full pl-7 pr-3 py-1.5 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-slate-50 placeholder:text-slate-400"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">
                        {selectedContacts.size} of {contacts.length} selected
                      </span>
                      <div className="flex gap-2">
                        <button onClick={selectAllVisible} className="text-[10px] text-blue-600 hover:text-blue-700 font-medium">
                          Select All
                        </button>
                        <button onClick={clearSelection} className="text-[10px] text-slate-400 hover:text-slate-600 font-medium">
                          Clear
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Contact list */}
                  <div className="max-h-[400px] overflow-y-auto">
                    {contactsLoading ? (
                      <div className="p-4 space-y-2">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="h-8 bg-slate-100 rounded animate-pulse" />
                        ))}
                      </div>
                    ) : filteredContacts.length === 0 ? (
                      <div className="p-8 text-center text-slate-400">
                        <Users size={20} className="mx-auto mb-2 opacity-30" />
                        <p className="text-xs">No contacts found</p>
                      </div>
                    ) : (
                      Object.entries(contactsByType).map(([type, typeContacts]) => (
                        <div key={type}>
                          <div className="px-4 py-1.5 bg-slate-50 border-y border-slate-100">
                            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                              {type} ({typeContacts.length})
                            </span>
                          </div>
                          {typeContacts.map((contact) => {
                            const isSelected = selectedContacts.has(contact.id);
                            return (
                              <button
                                key={contact.id}
                                onClick={() => toggleContact(contact.id)}
                                className={cn(
                                  'w-full flex items-center gap-2.5 px-4 py-2 text-left transition-colors',
                                  isSelected ? 'bg-blue-50' : 'hover:bg-slate-50'
                                )}
                              >
                                <div className={cn(
                                  'w-4 h-4 rounded border flex items-center justify-center shrink-0',
                                  isSelected ? 'bg-blue-600 border-blue-600' : 'border-slate-300'
                                )}>
                                  {isSelected && <Check size={10} className="text-white" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-medium text-slate-800 truncate">{contact.name}</p>
                                  <p className="text-[10px] text-slate-400 truncate">{contact.email}</p>
                                </div>
                                {contact.company && (
                                  <span className="text-[10px] text-slate-400 shrink-0">{contact.company}</span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      ))
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right: Compose */}
          <div className="xl:col-span-3 space-y-4">
            {/* Template selector */}
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={13} className="text-purple-500" />
                <h3 className="text-xs font-semibold text-slate-700">Email Template</h3>
              </div>
              <div className="flex gap-2 flex-wrap">
                {EMAIL_TEMPLATES.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    onClick={() => handleTemplateChange(tmpl.id)}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all',
                      selectedTemplate.id === tmpl.id
                        ? 'bg-purple-100 text-purple-700 border border-purple-200'
                        : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                    )}
                  >
                    {tmpl.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Compose area */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <FileText size={13} className="text-slate-500" />
                <h3 className="text-xs font-semibold text-slate-700">Compose Email</h3>
              </div>

              <div>
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Email subject..."
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 bg-white placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                  Body
                  <span className="text-slate-400 font-normal ml-1">
                    (use {'{{name}}'} for recipient, {'{{sender}}'} for your name)
                  </span>
                </label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={12}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 bg-white placeholder:text-slate-400 resize-none font-mono leading-relaxed"
                  placeholder="Write your email here..."
                />
              </div>

              {/* Result message */}
              {result && (
                <div className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg text-xs',
                  result.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                )}>
                  {result.success ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                  {result.message}
                </div>
              )}

              {/* Send button */}
              <div className="flex items-center justify-between pt-2">
                <p className="text-[10px] text-slate-400">
                  {mode === 'bulk'
                    ? `Sending to ${selectedContacts.size} contact${selectedContacts.size !== 1 ? 's' : ''}`
                    : singleEmail ? `Sending to ${singleEmail}` : 'Enter a recipient email'
                  }
                </p>
                <button
                  onClick={handleSend}
                  disabled={sending}
                  className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60 shadow-sm transition-all"
                >
                  {sending ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={14} />
                      Send Email{mode === 'bulk' && selectedContacts.size > 1 ? 's' : ''}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
