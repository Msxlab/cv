import { CheckCircle2, Clock, Download, ShieldCheck, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from './ui/badge';
import { cn } from './ui/utils';

interface SessionStatusProps {
  saveStatus: 'idle' | 'unsaved' | 'saved' | 'error';
  lastSavedAt?: string;
  lastExportedAt?: string;
  compact?: boolean;
  backupStale?: boolean;
  className?: string;
}

function safeTime(value?: string) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return format(date, 'h:mm a');
}

export function SessionStatus({
  saveStatus,
  lastSavedAt,
  lastExportedAt,
  compact = false,
  backupStale,
  className,
}: SessionStatusProps) {
  const savedTime = safeTime(lastSavedAt);
  const exportedTime = safeTime(lastExportedAt);

  const label =
    saveStatus === 'unsaved'
      ? 'Unsaved changes'
      : saveStatus === 'error'
        ? 'This tab is out of space'
        : savedTime
          ? `Saved ${savedTime}`
          : 'Browser-only';

  return (
    <div className={cn('flex flex-wrap items-center gap-1.5 text-xs text-slate-600', className)}>
      <Badge
        variant="outline"
        className={cn(
          'gap-1.5',
          saveStatus === 'error'
            ? 'border-red-200 bg-red-50 text-red-700'
            : 'border-emerald-200 bg-emerald-50 text-emerald-700'
        )}
      >
        {saveStatus === 'unsaved' ? (
          <Clock className="h-3 w-3" aria-hidden />
        ) : saveStatus === 'error' ? (
          <AlertTriangle className="h-3 w-3" aria-hidden />
        ) : (
          <CheckCircle2 className="h-3 w-3" aria-hidden />
        )}
        {label}
      </Badge>

      {!compact && (
        <Badge variant="outline" className="gap-1.5 border-blue-200 bg-blue-50 text-blue-700">
          <ShieldCheck className="h-3 w-3" aria-hidden />
          Browser-only · never uploaded
        </Badge>
      )}

      {backupStale ? (
        <Badge variant="outline" className="gap-1.5 border-amber-200 bg-amber-50 text-amber-800">
          <AlertTriangle className="h-3 w-3" aria-hidden />
          Backup needed
        </Badge>
      ) : exportedTime ? (
        <Badge variant="outline" className="gap-1.5 border-slate-200 bg-white text-slate-600">
          <Download className="h-3 w-3" aria-hidden />
          Backup {exportedTime}
        </Badge>
      ) : null}
    </div>
  );
}
