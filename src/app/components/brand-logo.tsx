import { useId } from 'react';

interface BrandMarkProps {
  size?: number;
  className?: string;
  title?: string;
}

export function BrandMark({ size = 32, className, title = 'Cyber Warriors - PonyCot' }: BrandMarkProps) {
  const uid = useId().replace(/:/g, '');
  const bgId = `cw-bg-${uid}`;
  const goldId = `cw-gold-${uid}`;
  const softId = `cw-soft-${uid}`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 128 128"
      width={size}
      height={size}
      role="img"
      aria-label={title}
      className={className}
    >
      <defs>
        <linearGradient id={bgId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0B1220" />
          <stop offset="55%" stopColor="#101a2e" />
          <stop offset="100%" stopColor="#070b15" />
        </linearGradient>
        <linearGradient id={goldId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F5E7A1" />
          <stop offset="45%" stopColor="#E8C766" />
          <stop offset="100%" stopColor="#B8892B" />
        </linearGradient>
        <linearGradient id={softId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F5E7A1" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#B8892B" stopOpacity="0" />
        </linearGradient>
      </defs>

      <rect width="128" height="128" rx="26" fill={`url(#${bgId})`} />
      <rect
        x="10"
        y="10"
        width="108"
        height="108"
        rx="20"
        fill="none"
        stroke={`url(#${goldId})`}
        strokeOpacity="0.22"
        strokeWidth="1"
      />

      <path
        d="M64 18 L102 38 V78 L64 110 L26 78 V38 Z"
        fill={`url(#${softId})`}
        stroke={`url(#${goldId})`}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />

      <g
        fill="none"
        stroke={`url(#${goldId})`}
        strokeWidth="5.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M76 46 A20 20 0 1 0 76 84" />
        <path d="M50 50 L58 82 L64 64 L70 82 L78 50" />
      </g>

      <circle cx="64" cy="22" r="1.6" fill={`url(#${goldId})`} />
      <circle cx="64" cy="106" r="1.6" fill={`url(#${goldId})`} />
    </svg>
  );
}

interface BrandLockupProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  className?: string;
}

const sizeMap = {
  sm: { mark: 28, primary: 'text-sm', secondary: 'text-[10px]' },
  md: { mark: 40, primary: 'text-base', secondary: 'text-[11px]' },
  lg: { mark: 56, primary: 'text-2xl', secondary: 'text-xs' },
};

export function BrandLockup({ size = 'md', showTagline = true, className }: BrandLockupProps) {
  const s = sizeMap[size];
  return (
    <div className={`flex items-center gap-3 ${className ?? ''}`}>
      <BrandMark size={s.mark} className="shrink-0 rounded-xl shadow-sm ring-1 ring-slate-900/5" />
      <div className="min-w-0 leading-tight">
        <p className={`truncate font-semibold tracking-tight text-slate-950 ${s.primary}`}>
          <span>Cyber Warriors</span>
          <span className="mx-1 text-amber-600/80">—</span>
          <span>PonyCot</span>
        </p>
        {showTagline && (
          <p className={`mt-0.5 truncate font-medium uppercase tracking-[0.18em] text-slate-500 ${s.secondary}`}>
            Premium CV Studio
          </p>
        )}
      </div>
    </div>
  );
}
