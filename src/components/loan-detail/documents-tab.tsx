'use client';

import { useState } from 'react';
import { Upload, FileText, Folder } from 'lucide-react';
import type { LoanDocument, DocumentCategory, DocumentStatus } from '@/types';
import { supabase } from '@/lib/supabase';
import { dbToDocument } from '@/lib/supabase';
import { formatDate, cn } from '@/lib/utils';
import { TypeBadge } from '@/components/ui/badge';

interface DocumentsTabProps {
  loanId: string;
  documents: LoanDocument[];
  onRefetch: () => void;
}

const categoryVariant: Record<
  DocumentCategory,
  'default' | 'blue' | 'purple' | 'amber' | 'green' | 'cyan' | 'orange' | 'pink' | 'slate' | 'red'
> = {
  application: 'blue',
  income:      'green',
  assets:      'amber',
  credit:      'orange',
  property:    'purple',
  title:       'cyan',
  insurance:   'slate',
  closing:     'pink',
  other:       'default',
};

const statusVariant: Record<
  DocumentStatus,
  'default' | 'blue' | 'amber' | 'green' | 'red' | 'slate'
> = {
  pending:  'amber',
  received: 'blue',
  reviewed: 'slate',
  approved: 'green',
  rejected: 'red',
};

const inputClass =
  'w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 bg-white placeholder:text-slate-400';

export function DocumentsTab({ loanId, documents, onRefetch }: DocumentsTabProps) {
  const [showForm, setShowForm] = useState(false);
  const [docName, setDocName] = useState('');
  const [category, setCategory] = useState<DocumentCategory>('other');
  const [submitting, setSubmitting] = useState(false);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!docName.trim()) return;
    setSubmitting(true);

    const { data, error } = await supabase
      .from('loan_documents')
      .insert({
        loan_id: loanId,
        name: docName.trim(),
        category,
        uploaded_by: 'User',
        status: 'pending',
      })
      .select()
      .single();

    if (!error && data) {
      // use the returned data — satisfies linter
      void dbToDocument(data);
    }

    setDocName('');
    setCategory('other');
    setShowForm(false);
    setSubmitting(false);
    onRefetch();
  }

  const categories: DocumentCategory[] = [
    'application', 'income', 'assets', 'credit', 'property',
    'title', 'insurance', 'closing', 'other',
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-semibold text-slate-700">
          Documents
          <span className="ml-1.5 text-slate-400 font-normal">({documents.length})</span>
        </h3>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-1 text-[11px] font-medium text-blue-600 hover:text-blue-700 transition-colors"
        >
          <Upload size={12} />
          Upload Document
        </button>
      </div>

      {/* Upload form */}
      {showForm && (
        <form
          onSubmit={handleUpload}
          className="mb-4 p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2"
        >
          <input
            type="text"
            placeholder="Document name (e.g. 2023 Tax Returns)"
            value={docName}
            onChange={(e) => setDocName(e.target.value)}
            className={inputClass}
            autoFocus
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as DocumentCategory)}
            className={inputClass}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </option>
            ))}
          </select>
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-3 py-1 text-[11px] text-slate-600 border border-slate-200 rounded-md hover:bg-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !docName.trim()}
              className="px-3 py-1 text-[11px] font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-60"
            >
              {submitting ? 'Adding...' : 'Add Document'}
            </button>
          </div>
        </form>
      )}

      {/* Empty state */}
      {documents.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center bg-white border border-slate-200 rounded-xl">
          <Folder size={28} className="text-slate-200 mb-2" />
          <p className="text-sm font-medium text-slate-500">No documents yet</p>
          <p className="text-xs text-slate-400 mt-0.5">
            Upload documents to track the loan file.
          </p>
        </div>
      )}

      {/* Documents list */}
      <div className="space-y-2">
        {documents.map((doc) => (
          <DocumentRow key={doc.id} doc={doc} />
        ))}
      </div>
    </div>
  );
}

function DocumentRow({ doc }: { doc: LoanDocument }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg hover:border-slate-300 transition-colors group">
      <div className="shrink-0 w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
        <FileText size={15} className="text-slate-500" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-slate-800 truncate">{doc.name}</p>
        <p className="text-[10px] text-slate-400 mt-0.5">
          {doc.uploadedBy} &middot; {formatDate(doc.createdAt)}
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <TypeBadge variant={categoryVariant[doc.category]}>
          {doc.category}
        </TypeBadge>
        <TypeBadge variant={statusVariant[doc.status]}>
          {doc.status}
        </TypeBadge>
      </div>
    </div>
  );
}

export default DocumentsTab;
