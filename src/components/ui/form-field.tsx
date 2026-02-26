import { cn } from '@/lib/utils';

interface FormFieldProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  error?: string;
  hint?: string;
  className?: string;
}

export function FormField({
  label,
  required,
  children,
  error,
  hint,
  className,
}: FormFieldProps) {
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <label className="text-xs font-medium text-slate-700 flex items-center gap-0.5">
        {label}
        {required && (
          <span className="text-red-500 ml-0.5" aria-hidden="true">
            *
          </span>
        )}
      </label>

      {children}

      {hint && !error && (
        <p className="text-[11px] text-slate-400 leading-tight">{hint}</p>
      )}

      {error && (
        <p className="text-[11px] text-red-500 leading-tight" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export default FormField;
