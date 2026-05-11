import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Info, ShieldCheck, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';
import { cn } from './utils';

const noticeVariants = cva(
  'flex items-start gap-3 rounded-xl border px-4 py-3 text-sm',
  {
    variants: {
      tone: {
        privacy: 'border-emerald-200 bg-emerald-50 text-emerald-950',
        info: 'border-blue-200 bg-blue-50 text-blue-950',
        success: 'border-emerald-200 bg-emerald-50 text-emerald-950',
        warning: 'border-amber-200 bg-amber-50 text-amber-950',
        danger: 'border-red-200 bg-red-50 text-red-900',
      },
    },
    defaultVariants: { tone: 'info' },
  }
);

const toneIcon = {
  privacy: ShieldCheck,
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  danger: AlertCircle,
} as const;

export interface NoticeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof noticeVariants> {
  icon?: React.ComponentType<{ className?: string }> | false;
}

export function Notice({ className, tone, icon, children, ...rest }: NoticeProps) {
  const Icon = icon === false ? null : icon || toneIcon[tone || 'info'];
  return (
    <div className={cn(noticeVariants({ tone }), className)} {...rest}>
      {Icon ? <Icon className="mt-0.5 h-4 w-4 flex-shrink-0" /> : null}
      <div className="min-w-0 flex-1 leading-relaxed">{children}</div>
    </div>
  );
}
