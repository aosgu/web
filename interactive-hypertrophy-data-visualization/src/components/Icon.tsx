import type { CSSProperties } from 'react';

type IconName = 'arrow-up-right' | 'arrow-down' | 'arrow-right' | 'sound' | 'muted' | 'replay' | 'plus' | 'close' | 'menu' | 'info' | 'chevron-down' | 'chart' | 'table' | 'download' | 'check';

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
  style?: CSSProperties;
}

export default function Icon({ name, size = 20, className, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className} style={style}>
      {name === 'arrow-up-right' && <path d="M5 19 19 5M5 5h14v14" />}
      {name === 'arrow-down' && <path d="M12 4v16m-6-6 6 6 6-6" />}
      {name === 'arrow-right' && <path d="M4 12h16m-6-6 6 6-6 6" />}
      {name === 'sound' && <><path d="m11 5-5 4H3v6h3l5 4V5Z" /><path d="M15 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14" /></>}
      {name === 'muted' && <><path d="m11 5-5 4H3v6h3l5 4V5Z" /><path d="m16 9 6 6m0-6-6 6" /></>}
      {name === 'replay' && <><path d="M3 10a9 9 0 1 1 1.8 8.4M3 4v6h6" /></>}
      {name === 'plus' && <path d="M12 5v14M5 12h14" />}
      {name === 'close' && <path d="m6 6 12 12M18 6 6 18" />}
      {name === 'menu' && <path d="M4 7h16M4 12h16M4 17h16" />}
      {name === 'info' && <><circle cx="12" cy="12" r="9" /><path d="M12 11v6m0-10h.01" /></>}
      {name === 'chevron-down' && <path d="m6 9 6 6 6-6" />}
      {name === 'chart' && <><path d="M4 4v16h16M8 15V9m5 6V5m5 10v-4" /></>}
      {name === 'table' && <><rect x="4" y="4" width="16" height="16" rx="1" /><path d="M4 9h16M4 14h16M10 4v16" /></>}
      {name === 'download' && <><path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5" /></>}
      {name === 'check' && <path d="m5 12 4 4L19 6" />}
    </svg>
  );
}