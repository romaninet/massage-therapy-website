import type { ServiceKey } from '@/lib/config';

const ICON_PATHS: Record<ServiceKey, React.ReactNode> = {
  therapeutic: (
    <>
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1.2" opacity="0.3" />
      <path d="M24 10 L24 38" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 24 L38 24" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="24" cy="24" r="7" stroke="currentColor" strokeWidth="1.2" fill="none" />
    </>
  ),
  deepTissue: (
    <>
      <path d="M12 36 Q18 28 24 24 Q30 20 36 12" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M12 30 Q18 24 24 20 Q30 16 36 8" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.5" />
      <path d="M16 40 Q22 32 28 28 Q34 24 40 16" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.5" />
      <circle cx="24" cy="24" r="5" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </>
  ),
  relaxation: (
    <>
      <path d="M24 38 Q16 30 14 22 Q12 14 24 10 Q36 14 34 22 Q32 30 24 38Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M24 10 Q24 20 24 38" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.4" />
      <path d="M14 22 Q24 22 34 22" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.4" />
      <circle cx="24" cy="24" r="3" fill="currentColor" opacity="0.3" />
    </>
  ),
  lymphatic: (
    <>
      <path d="M10 20 Q17 12 24 20 Q31 28 38 20" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M10 28 Q17 20 24 28 Q31 36 38 28" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <circle cx="24" cy="24" r="3" fill="currentColor" opacity="0.4" />
      <circle cx="10" cy="24" r="2" fill="currentColor" opacity="0.2" />
      <circle cx="38" cy="24" r="2" fill="currentColor" opacity="0.2" />
    </>
  ),
  children: (
    <>
      <circle cx="24" cy="16" r="6" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M16 28 Q16 40 24 40 Q32 40 32 28 Q32 22 24 22 Q16 22 16 28Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M16 30 Q12 28 11 32 Q10 36 14 37" stroke="currentColor" strokeWidth="1.2" fill="none" opacity="0.6" />
      <path d="M32 30 Q36 28 37 32 Q38 36 34 37" stroke="currentColor" strokeWidth="1.2" fill="none" opacity="0.6" />
    </>
  ),
  couples: (
    <>
      <circle cx="18" cy="24" r="10" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <circle cx="30" cy="24" r="10" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M24 16 Q28 20 28 24 Q28 28 24 32 Q20 28 20 24 Q20 20 24 16Z" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.35" />
    </>
  ),
};

export default function ServiceIcon({
  serviceKey,
  className = 'w-10 h-10',
}: {
  serviceKey: ServiceKey;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      {ICON_PATHS[serviceKey]}
    </svg>
  );
}
