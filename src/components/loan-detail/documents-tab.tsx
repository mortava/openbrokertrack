'use client';

import { useState, useRef } from 'react';
import { Upload, FileText, Folder, Trash2, Download, Paperclip, X, Eye, Image as ImageIcon, FileSpreadsheet } from 'lucide-react';
import type { LoanDocument, DocumentCategory, DocumentStatus } from '@/types';
import { supabase } from '@/lib/supabase';
import { formatDate, cn } from '@/lib/utils';
import { TypeBadge } from '@/components/ui/badge';

interface DocumentsTabProps {
  loanId: string;
  documents: LoanDocument[];
  onRefetch: () => void;
}

const ACCEPTED_TYPES = '.pdf,.png,.jpg,.jpeg,.doc,.docx,.xls,.xlsx';
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

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

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function fileNameWithoutExt(name: string): string {
  const dot = name.lastIndexOf('.');
  return dot > 0 ? name.substring(0, dot) : name;
}

/** Extract storage path from a Supabase public URL */
function storagePathFromUrl(url: string): string | null {
  const marker = '/object/public/loan-documents/';
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  return decodeURIComponent(url.substring(idx + marker.length));
}

/** Determine file type from URL for preview */
function getFileType(url: string): 'pdf' | 'image' | 'other' {
  const lower = url.toLowerCase();
  if (lower.includes('.pdf')) return 'pdf';
  if (lower.includes('.png') || lower.includes('.jpg') || lower.includes('.jpeg')) return 'image';
  return 'other';
}

/** Get file icon based on extension */
function getFileIcon(url?: string) {
  if (!url) return <FileText size={15} className="text-slate-500" />;
  const type = getFileType(url);
  if (type === 'pdf') return <FileText size={15} className="text-red-500" />;
  if (type === 'image') return <ImageIcon size={15} className="text-blue-500" />;
  return <FileSpreadsheet size={15} className="text-green-500" />;
}

export function DocumentsTab({ loanId, documents, onRefetch }: DocumentsTabProps) {
  const [showForm, setShowForm] = useState(false);
  const [docName, setDocName] = useState('');
  const [category, setCategory] = useState<DocumentCategory>('other');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<LoanDocument | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFileSelect(file: File | undefined) {
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) {
      setError(`File too large (${formatFileSize(file.size)}). Max is 10 MB.`);
      return;
    }
    setError('');
    setSelectedFile(file);
    if (!docName.trim()) {
      setDocName(fileNameWithoutExt(file.name));
    }
  }

  function clearFile() {
    setSelectedFile(null);
    if (fileRef.current) fileRef.current.value = '';
  }

  function resetForm() {
    setDocName('');
    setCategory('other');
    setSelectedFile(null);
    setError('');
    setShowForm(false);
    if (fileRef.current) fileRef.current.value = '';
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select a file to upload.');
      return;
    }
    if (!docName.trim()) return;
    setSubmitting(true);
    setError('');

    try {
      const storagePath = `${loanId}/${Date.now()}_${selectedFile.name}`;
      const { error: uploadErr } = await supabase.storage
        .from('loan-documents')
        .upload(storagePath, selectedFile);

      if (uploadErr) {
        setError(`Upload failed: ${uploadErr.message}`);
        setSubmitting(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from('loan-documents')
        .getPublicUrl(storagePath);

      await supabase
        .from('loan_documents')
        .insert({
          loan_id: loanId,
          name: docName.trim(),
          category,
          file_url: urlData.publicUrl,
          file_size: selectedFile.size,
          uploaded_by: 'User',
          status: 'received',
        });

      resetForm();
      onRefetch();
    } catch {
      setError('An unexpected error occurred.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(doc: LoanDocument) {
    if (doc.fileUrl) {
      const path = storagePathFromUrl(doc.fileUrl);
      if (path) {
        await supabase.storage.from('loan-documents').remove([path]);
      }
    }
    await supabase.from('loan_documents').delete().eq('id', doc.id);
    if (previewDoc?.id === doc.id) setPreviewDoc(null);
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
          <div
            className={cn(
              'relative border-2 border-dashed rounded-lg p-4 text-center transition-colors cursor-pointer',
              dragOver
                ? 'border-blue-400 bg-blue-50'
                : selectedFile
                  ? 'border-green-300 bg-green-50'
                  : 'border-slate-300 bg-white hover:border-slate-400',
            )}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              handleFileSelect(e.dataTransfer.files[0]);
            }}
            onClick={() => fileRef.current?.click()}
          >
            <input
              ref={fileRef}
              type="file"
              accept={ACCEPTED_TYPES}
              className="hidden"
              onChange={(e) => handleFileSelect(e.target.files?.[0])}
            />
            {selectedFile ? (
              <div className="flex items-center justify-center gap-2">
                <Paperclip size={14} className="text-green-600" />
                <span className="text-xs font-medium text-green-700">{selectedFile.name}</span>
                <span className="text-[10px] text-green-500">({formatFileSize(selectedFile.size)})</span>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); clearFile(); }}
                  className="ml-1 p-0.5 rounded hover:bg-green-200 transition-colors"
                >
                  <X size={12} className="text-green-600" />
                </button>
              </div>
            ) : (
              <div>
                <Upload size={20} className="mx-auto text-slate-400 mb-1" />
                <p className="text-xs text-slate-500">
                  Drag & drop a file here, or <span className="text-blue-600 font-medium">browse</span>
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  PDF, Images, Word, Excel &middot; Max 10 MB
                </p>
              </div>
            )}
          </div>

          <input
            type="text"
            placeholder="Document name (e.g. 2023 Tax Returns)"
            value={docName}
            onChange={(e) => setDocName(e.target.value)}
            className={inputClass}
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

          {error && (
            <p className="text-[11px] text-red-600 bg-red-50 px-2 py-1 rounded">{error}</p>
          )}

          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={resetForm}
              className="px-3 py-1 text-[11px] text-slate-600 border border-slate-200 rounded-md hover:bg-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !docName.trim() || !selectedFile}
              className="px-3 py-1 text-[11px] font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-60"
            >
              {submitting ? 'Uploading...' : 'Upload Document'}
            </button>
          </div>
        </form>
      )}

      {/* Document Preview Modal */}
      {previewDoc && previewDoc.fileUrl && (
        <DocumentPreview doc={previewDoc} onClose={() => setPreviewDoc(null)} />
      )}

      {/* Empty state */}
      {documents.length === 0 && !showForm && (
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
          <DocumentRow
            key={doc.id}
            doc={doc}
            onDelete={() => handleDelete(doc)}
            onPreview={() => setPreviewDoc(doc)}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── Document Preview Modal ──────────────────────────────────────────────── */

function DocumentPreview({ doc, onClose }: { doc: LoanDocument; onClose: () => void }) {
  const url = doc.fileUrl!;
  const type = getFileType(url);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60" onClick={onClose}>
      <div
        className="relative bg-white rounded-xl shadow-2xl w-[90vw] max-w-4xl h-[85vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Preview header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            {getFileIcon(url)}
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">{doc.name}</p>
              <p className="text-[10px] text-slate-400">
                {doc.uploadedBy} &middot; {formatDate(doc.createdAt)}
                {doc.fileSize ? ` \u00B7 ${formatFileSize(doc.fileSize)}` : ''}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <TypeBadge variant={categoryVariant[doc.category]}>{doc.category}</TypeBadge>
            <TypeBadge variant={statusVariant[doc.status]}>{doc.status}</TypeBadge>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-blue-600 transition-colors"
              title="Open in new tab"
            >
              <Download size={14} />
            </a>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Preview body */}
        <div className="flex-1 overflow-hidden bg-slate-100">
          {type === 'pdf' && (
            <iframe
              src={`${url}#toolbar=1&navpanes=0`}
              className="w-full h-full border-0"
              title={doc.name}
            />
          )}
          {type === 'image' && (
            <div className="w-full h-full flex items-center justify-center p-6 overflow-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={doc.name}
                className="max-w-full max-h-full object-contain rounded-lg shadow-md"
              />
            </div>
          )}
          {type === 'other' && (
            <div className="flex flex-col items-center justify-center h-full gap-3">
              <FileSpreadsheet size={40} className="text-slate-300" />
              <p className="text-sm text-slate-500">Preview not available for this file type</p>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download size={13} />
                Download to View
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Document Row ────────────────────────────────────────────────────────── */

function DocumentRow({
  doc,
  onDelete,
  onPreview,
}: {
  doc: LoanDocument;
  onDelete: () => void;
  onPreview: () => void;
}) {
  const [deleting, setDeleting] = useState(false);

  async function confirmDelete() {
    setDeleting(true);
    await onDelete();
  }

  const canPreview = doc.fileUrl && getFileType(doc.fileUrl) !== 'other';

  return (
    <div className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg hover:border-slate-300 transition-colors group">
      <div className="shrink-0 w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
        {getFileIcon(doc.fileUrl)}
      </div>

      <div className="flex-1 min-w-0">
        {doc.fileUrl ? (
          <button
            onClick={onPreview}
            className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline truncate block text-left"
          >
            {doc.name}
          </button>
        ) : (
          <p className="text-xs font-medium text-slate-800 truncate">{doc.name}</p>
        )}
        <p className="text-[10px] text-slate-400 mt-0.5">
          {doc.uploadedBy} &middot; {formatDate(doc.createdAt)}
          {doc.fileSize ? ` \u00B7 ${formatFileSize(doc.fileSize)}` : ''}
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <TypeBadge variant={categoryVariant[doc.category]}>
          {doc.category}
        </TypeBadge>
        <TypeBadge variant={statusVariant[doc.status]}>
          {doc.status}
        </TypeBadge>

        {/* View button */}
        {canPreview && (
          <button
            onClick={onPreview}
            className="p-1 rounded hover:bg-blue-50 text-slate-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-all"
            title="Preview"
          >
            <Eye size={13} />
          </button>
        )}

        {/* Download button */}
        {doc.fileUrl && (
          <a
            href={doc.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-all"
            title="Download"
          >
            <Download size={13} />
          </a>
        )}

        {/* Delete button */}
        <button
          onClick={confirmDelete}
          disabled={deleting}
          className="p-1 rounded hover:bg-red-50 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all disabled:opacity-50"
          title="Delete document"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}

export default DocumentsTab;
