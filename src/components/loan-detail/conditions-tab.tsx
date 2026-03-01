'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Plus,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Circle,
  Clock,
  ChevronUp,
  FileCheck,
  Ban,
  Send,
} from 'lucide-react';
import type { LoanCondition, ConditionType, ConditionStatus } from '@/types';
import { supabase, dbToCondition } from '@/lib/supabase';
import { useAuth } from '@/contexts/auth-context';
import { formatDate, cn } from '@/lib/utils';
import { TypeBadge } from '@/components/ui/badge';

interface ConditionsTabProps {
  loanId: string;
  onNotify?: (subject: string, body: string) => void;
}

const CONDITION_TYPES: { value: ConditionType; label: string; description: string }[] = [
  { value: 'ptd', label: 'Prior to Docs (PTD)', description: 'Must be cleared before loan documents are drawn' },
  { value: 'ptf', label: 'Prior to Funding (PTF)', description: 'Must be cleared before loan can fund' },
  { value: 'ptc', label: 'Prior to Closing (PTC)', description: 'Must be cleared before closing' },
];

const typeVariant: Record<ConditionType, 'amber' | 'purple' | 'cyan'> = {
  ptd: 'amber',
  ptf: 'purple',
  ptc: 'cyan',
};

const typeLabel: Record<ConditionType, string> = {
  ptd: 'PTD',
  ptf: 'PTF',
  ptc: 'PTC',
};

const statusConfig: Record<ConditionStatus, {
  label: string;
  variant: 'default' | 'amber' | 'blue' | 'green' | 'slate' | 'red';
  icon: React.ElementType;
}> = {
  open:      { label: 'Open',      variant: 'amber', icon: Circle },
  requested: { label: 'Requested', variant: 'blue',  icon: Send },
  received:  { label: 'Received',  variant: 'slate', icon: Clock },
  cleared:   { label: 'Cleared',   variant: 'green', icon: CheckCircle2 },
  waived:    { label: 'Waived',    variant: 'default', icon: Ban },
};

const inputClass =
  'w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#171717]/10 focus:border-[#171717]/30 bg-white placeholder:text-gray-400';

export function ConditionsTab({ loanId, onNotify }: ConditionsTabProps) {
  const { currentUser } = useAuth();
  const [conditions, setConditions] = useState<LoanCondition[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [condType, setCondType] = useState<ConditionType>('ptd');
  const [submitting, setSubmitting] = useState(false);

  const fetchConditions = useCallback(async () => {
    const { data } = await supabase
      .from('loan_conditions')
      .select('*')
      .eq('loan_id', loanId)
      .order('created_at', { ascending: true });
    setConditions((data ?? []).map(dbToCondition));
    setLoading(false);
  }, [loanId]);

  useEffect(() => {
    fetchConditions();
  }, [fetchConditions]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);

    await supabase.from('loan_conditions').insert({
      loan_id: loanId,
      condition_type: condType,
      title: title.trim(),
      description: description.trim() || null,
      status: 'open',
      added_by: currentUser.fullName,
    });

    // Send notification
    if (onNotify) {
      onNotify(
        `New ${typeLabel[condType]} Condition Added`,
        `${currentUser.fullName} added a new ${typeLabel[condType]} condition: "${title.trim()}"`
      );
    }

    setTitle('');
    setDescription('');
    setCondType('ptd');
    setShowForm(false);
    setSubmitting(false);
    fetchConditions();
  }

  async function handleStatusChange(condition: LoanCondition, newStatus: ConditionStatus) {
    const patch: Record<string, unknown> = {
      status: newStatus,
      updated_at: new Date().toISOString(),
    };

    if (newStatus === 'cleared' || newStatus === 'waived') {
      patch.cleared_by = currentUser.fullName;
      patch.cleared_at = new Date().toISOString();
    } else {
      patch.cleared_by = null;
      patch.cleared_at = null;
    }

    await supabase
      .from('loan_conditions')
      .update(patch)
      .eq('id', condition.id);

    // Send notification for cleared/waived
    if ((newStatus === 'cleared' || newStatus === 'waived') && onNotify) {
      onNotify(
        `Condition ${newStatus === 'cleared' ? 'Cleared' : 'Waived'}: ${typeLabel[condition.conditionType]}`,
        `${currentUser.fullName} ${newStatus} the condition: "${condition.title}"`
      );
    }

    fetchConditions();
  }

  async function handleDelete(id: string) {
    await supabase.from('loan_conditions').delete().eq('id', id);
    fetchConditions();
  }

  const openConditions = conditions.filter((c) => c.status !== 'cleared' && c.status !== 'waived');
  const clearedConditions = conditions.filter((c) => c.status === 'cleared' || c.status === 'waived');

  // Group open by type
  const byType = (type: ConditionType) => openConditions.filter((c) => c.conditionType === type);

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
            <div className="h-4 bg-gray-100 rounded w-48 mb-2" />
            <div className="h-3 bg-gray-100 rounded w-32" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-semibold text-gray-700">
            Underwriting Conditions
          </h3>
          {openConditions.length > 0 && (
            <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-amber-50 text-amber-700 rounded-full">
              {openConditions.length} open
            </span>
          )}
          {openConditions.length === 0 && conditions.length > 0 && (
            <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-green-50 text-green-700 rounded-full flex items-center gap-1">
              <ShieldCheck size={10} /> All Clear
            </span>
          )}
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-1 text-[11px] font-medium text-[#171717] hover:text-[#171717]/70 transition-colors"
        >
          <Plus size={12} />
          Add Condition
        </button>
      </div>

      {/* Add condition form */}
      {showForm && (
        <form
          onSubmit={handleAdd}
          className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg space-y-2"
        >
          <div className="flex gap-2">
            <select
              value={condType}
              onChange={(e) => setCondType(e.target.value as ConditionType)}
              className={cn(inputClass, 'w-40')}
            >
              {CONDITION_TYPES.map((ct) => (
                <option key={ct.value} value={ct.value}>{ct.label}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Condition title (e.g. Verification of Employment)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={cn(inputClass, 'flex-1')}
              autoFocus
            />
          </div>
          <textarea
            placeholder="Description or notes (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={cn(inputClass, 'h-16 resize-none')}
          />
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-3 py-1 text-[11px] text-gray-600 border border-gray-200 rounded-md hover:bg-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !title.trim()}
              className="px-3 py-1 text-[11px] font-medium text-white bg-[#171717] rounded-md hover:bg-[#171717]/90 disabled:opacity-60"
            >
              {submitting ? 'Adding...' : 'Add Condition'}
            </button>
          </div>
        </form>
      )}

      {/* Empty state */}
      {conditions.length === 0 && !showForm && (
        <div className="flex flex-col items-center justify-center py-12 text-center bg-white border border-gray-200 rounded-xl">
          <FileCheck size={28} className="text-gray-200 mb-2" />
          <p className="text-sm font-medium text-gray-500">No conditions yet</p>
          <p className="text-xs text-gray-400 mt-0.5">
            Add underwriting conditions to track items that need to be cleared.
          </p>
        </div>
      )}

      {/* Open conditions by type */}
      {(['ptd', 'ptf', 'ptc'] as ConditionType[]).map((type) => {
        const items = byType(type);
        if (items.length === 0) return null;
        const typeInfo = CONDITION_TYPES.find((t) => t.value === type)!;
        return (
          <div key={type} className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <TypeBadge variant={typeVariant[type]}>{typeLabel[type]}</TypeBadge>
              <span className="text-[10px] text-gray-500">{typeInfo.label}</span>
              <span className="text-[10px] text-gray-400">({items.length})</span>
            </div>
            <div className="space-y-2">
              {items.map((cond) => (
                <ConditionRow
                  key={cond.id}
                  condition={cond}
                  onStatusChange={(status) => handleStatusChange(cond, status)}
                  onDelete={() => handleDelete(cond.id)}
                />
              ))}
            </div>
          </div>
        );
      })}

      {/* Cleared / Waived section */}
      {clearedConditions.length > 0 && (
        <ClearedSection conditions={clearedConditions} />
      )}

      {/* Sign-off summary */}
      {conditions.length > 0 && (
        <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-center">
                <p className="text-lg font-bold text-gray-800">{conditions.length}</p>
                <p className="text-[9px] text-gray-400 uppercase">Total</p>
              </div>
              <div className="w-px h-8 bg-gray-200" />
              <div className="text-center">
                <p className="text-lg font-bold text-green-600">{clearedConditions.length}</p>
                <p className="text-[9px] text-gray-400 uppercase">Cleared</p>
              </div>
              <div className="w-px h-8 bg-gray-200" />
              <div className="text-center">
                <p className={cn('text-lg font-bold', openConditions.length > 0 ? 'text-amber-600' : 'text-green-600')}>
                  {openConditions.length}
                </p>
                <p className="text-[9px] text-gray-400 uppercase">Open</p>
              </div>
            </div>
            {openConditions.length === 0 && conditions.length > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg">
                <ShieldCheck size={14} className="text-green-600" />
                <span className="text-xs font-semibold text-green-700">Clear to Close</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Condition Row ───────────────────────────────────────────────────────── */

function ConditionRow({
  condition,
  onStatusChange,
  onDelete,
}: {
  condition: LoanCondition;
  onStatusChange: (status: ConditionStatus) => void;
  onDelete: () => void;
}) {
  const [showActions, setShowActions] = useState(false);
  const cfg = statusConfig[condition.status];
  const StatusIcon = cfg.icon;

  return (
    <div className="p-3 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors group">
      <div className="flex items-start gap-3">
        {/* Status icon / click to clear */}
        <button
          onClick={() => onStatusChange(condition.status === 'cleared' ? 'open' : 'cleared')}
          className="shrink-0 mt-0.5 transition-colors"
          title={condition.status === 'cleared' ? 'Reopen' : 'Clear condition'}
        >
          {condition.status === 'cleared' ? (
            <CheckCircle2 size={16} className="text-green-500" />
          ) : (
            <Circle size={16} className="text-gray-300 hover:text-green-500" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <p className={cn(
            'text-xs font-medium',
            condition.status === 'cleared' ? 'text-gray-400 line-through' : 'text-gray-800'
          )}>
            {condition.title}
          </p>
          {condition.description && (
            <p className="text-[10px] text-gray-400 mt-0.5">{condition.description}</p>
          )}
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span className="text-[10px] text-gray-400">
              Added by {condition.addedBy} &middot; {formatDate(condition.createdAt)}
            </span>
            {condition.clearedBy && (
              <span className="text-[10px] text-green-500">
                Cleared by {condition.clearedBy}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <TypeBadge variant={cfg.variant}>
            <span className="flex items-center gap-1">
              <StatusIcon size={10} />
              {cfg.label}
            </span>
          </TypeBadge>

          {/* Status change dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowActions((v) => !v)}
              className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-all text-[10px]"
              title="Change status"
            >
              <AlertCircle size={13} />
            </button>
            {showActions && (
              <div className="absolute right-0 top-full mt-1 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
                {(Object.keys(statusConfig) as ConditionStatus[]).map((status) => {
                  const sc = statusConfig[status];
                  const Icon = sc.icon;
                  return (
                    <button
                      key={status}
                      onClick={() => { onStatusChange(status); setShowActions(false); }}
                      className={cn(
                        'w-full flex items-center gap-2 px-3 py-1.5 text-xs hover:bg-gray-50 transition-colors text-left',
                        condition.status === status ? 'bg-gray-100 text-gray-900 font-medium' : 'text-gray-600'
                      )}
                    >
                      <Icon size={12} />
                      {sc.label}
                    </button>
                  );
                })}
                <div className="border-t border-gray-100">
                  <button
                    onClick={() => { onDelete(); setShowActions(false); }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-red-500 hover:bg-red-50 transition-colors text-left"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Cleared Section ─────────────────────────────────────────────────────── */

function ClearedSection({ conditions }: { conditions: LoanCondition[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-4">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 text-[11px] text-gray-500 hover:text-gray-700 mb-2"
      >
        <ChevronUp
          size={12}
          className={cn('transition-transform', open ? '' : 'rotate-180')}
        />
        <CheckCircle2 size={12} className="text-green-500" />
        {conditions.length} cleared/waived condition{conditions.length !== 1 ? 's' : ''}
      </button>
      {open && (
        <div className="space-y-1.5 opacity-60">
          {conditions.map((cond) => (
            <div key={cond.id} className="flex items-center gap-3 p-2.5 bg-white border border-gray-100 rounded-lg">
              <CheckCircle2 size={14} className="text-green-500 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 line-through truncate">{cond.title}</p>
                <p className="text-[10px] text-gray-400">
                  {cond.status === 'waived' ? 'Waived' : 'Cleared'} by {cond.clearedBy} &middot; {cond.clearedAt ? formatDate(cond.clearedAt) : ''}
                </p>
              </div>
              <TypeBadge variant={typeVariant[cond.conditionType]}>{typeLabel[cond.conditionType]}</TypeBadge>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ConditionsTab;
