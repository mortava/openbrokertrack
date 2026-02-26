'use client';

import { useState } from 'react';
import { Pin, PinOff, Trash2, MessageSquare } from 'lucide-react';
import type { LoanNote } from '@/types';
import { addNote, deleteNote } from '@/lib/mutations';
import { formatDate, cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

interface NotesTabProps {
  loanId: string;
  notes: LoanNote[];
  onRefetch: () => void;
}

export function NotesTab({ loanId, notes, onRefetch }: NotesTabProps) {
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    await addNote(loanId, content.trim(), 'User');
    setContent('');
    setSubmitting(false);
    onRefetch();
  }

  async function handleDelete(id: string) {
    setDeleting(id);
    await deleteNote(id);
    setDeleting(null);
    onRefetch();
  }

  async function handlePin(note: LoanNote) {
    setToggling(note.id);
    await supabase
      .from('loan_notes')
      .update({ pinned: !note.pinned, updated_at: new Date().toISOString() })
      .eq('id', note.id);
    setToggling(null);
    onRefetch();
  }

  return (
    <div>
      {/* Add Note area */}
      <form
        onSubmit={handleSubmit}
        className="mb-5 bg-white border border-slate-200 rounded-xl overflow-hidden"
      >
        <textarea
          placeholder="Add a note..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          className="w-full px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 resize-none focus:outline-none border-b border-slate-100"
        />
        <div className="flex items-center justify-end px-3 py-2 bg-slate-50">
          <button
            type="submit"
            disabled={submitting || !content.trim()}
            className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-60 flex items-center gap-1.5"
          >
            {submitting && (
              <span className="w-3 h-3 border border-white/40 border-t-white rounded-full animate-spin" />
            )}
            {submitting ? 'Saving...' : 'Add Note'}
          </button>
        </div>
      </form>

      {/* Empty state */}
      {notes.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center bg-white border border-slate-200 rounded-xl">
          <MessageSquare size={28} className="text-slate-200 mb-2" />
          <p className="text-sm font-medium text-slate-500">No notes yet</p>
          <p className="text-xs text-slate-400 mt-0.5">
            Notes will appear here once added.
          </p>
        </div>
      )}

      {/* Notes list */}
      <div className="space-y-3">
        {notes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            onDelete={() => handleDelete(note.id)}
            onTogglePin={() => handlePin(note)}
            deleting={deleting === note.id}
            toggling={toggling === note.id}
          />
        ))}
      </div>
    </div>
  );
}

function NoteCard({
  note,
  onDelete,
  onTogglePin,
  deleting,
  toggling,
}: {
  note: LoanNote;
  onDelete: () => void;
  onTogglePin: () => void;
  deleting: boolean;
  toggling: boolean;
}) {
  return (
    <div
      className={cn(
        'group bg-white border rounded-xl px-4 py-3 transition-colors',
        note.pinned ? 'border-blue-200 bg-blue-50/30' : 'border-slate-200'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-700">{note.author}</span>
          {note.pinned && (
            <span className="text-[10px] font-medium text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded-full">
              Pinned
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onTogglePin}
            disabled={toggling}
            className="p-1 text-slate-400 hover:text-blue-500 transition-colors rounded disabled:opacity-50"
            title={note.pinned ? 'Unpin' : 'Pin'}
          >
            {note.pinned ? <PinOff size={12} /> : <Pin size={12} />}
          </button>
          <button
            onClick={onDelete}
            disabled={deleting}
            className="p-1 text-slate-400 hover:text-red-500 transition-colors rounded disabled:opacity-50"
            title="Delete note"
          >
            {deleting ? (
              <span className="w-3 h-3 border border-slate-300 border-t-red-400 rounded-full animate-spin block" />
            ) : (
              <Trash2 size={12} />
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{note.content}</p>

      {/* Timestamp */}
      <p className="text-[10px] text-slate-400 mt-2">{formatDate(note.createdAt)}</p>
    </div>
  );
}

export default NotesTab;
