export function BotanicalCornerTL({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M10 110 Q20 70 60 50 Q40 80 10 110Z"
        stroke="currentColor"
        strokeWidth="1.2"
        fill="none"
        opacity="0.6"
      />
      <path
        d="M5 90 Q30 60 70 40"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
        opacity="0.5"
      />
      <path
        d="M15 108 Q35 85 55 55 Q38 90 15 108Z"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
        opacity="0.5"
      />
      <path
        d="M8 75 Q25 55 50 42"
        stroke="currentColor"
        strokeWidth="0.8"
        fill="none"
        opacity="0.4"
      />
      <circle cx="60" cy="50" r="2.5" fill="currentColor" opacity="0.4" />
      <circle cx="70" cy="40" r="1.8" fill="currentColor" opacity="0.35" />
      <path
        d="M25 100 Q30 85 45 75 Q32 88 25 100Z"
        stroke="currentColor"
        strokeWidth="0.9"
        fill="none"
        opacity="0.45"
      />
    </svg>
  );
}

export function BotanicalCornerBR({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M110 10 Q100 50 60 70 Q80 40 110 10Z"
        stroke="currentColor"
        strokeWidth="1.2"
        fill="none"
        opacity="0.6"
      />
      <path
        d="M115 30 Q90 60 50 80"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
        opacity="0.5"
      />
      <path
        d="M105 12 Q85 35 65 65 Q82 30 105 12Z"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
        opacity="0.5"
      />
      <path
        d="M112 45 Q95 65 70 78"
        stroke="currentColor"
        strokeWidth="0.8"
        fill="none"
        opacity="0.4"
      />
      <circle cx="60" cy="70" r="2.5" fill="currentColor" opacity="0.4" />
      <circle cx="50" cy="80" r="1.8" fill="currentColor" opacity="0.35" />
    </svg>
  );
}

export function BotanicalDivider({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 40"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <line x1="0" y1="20" x2="155" y2="20" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
      <path
        d="M175 20 Q185 10 200 20 Q215 30 225 20"
        stroke="currentColor"
        strokeWidth="1.2"
        fill="none"
        opacity="0.7"
      />
      <path
        d="M200 8 Q205 14 200 20 Q195 14 200 8Z"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
        opacity="0.6"
      />
      <circle cx="200" cy="6" r="2" fill="currentColor" opacity="0.5" />
      <line x1="245" y1="20" x2="400" y2="20" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
    </svg>
  );
}

export function LotusIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 80"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Center petal */}
      <path
        d="M50 65 Q50 35 50 10 Q50 35 50 65Z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      {/* Left petals */}
      <path
        d="M50 65 Q30 45 20 20 Q38 42 50 65Z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M50 65 Q15 50 5 30 Q25 48 50 65Z"
        stroke="currentColor"
        strokeWidth="1.2"
        fill="none"
        opacity="0.8"
      />
      {/* Right petals */}
      <path
        d="M50 65 Q70 45 80 20 Q62 42 50 65Z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M50 65 Q85 50 95 30 Q75 48 50 65Z"
        stroke="currentColor"
        strokeWidth="1.2"
        fill="none"
        opacity="0.8"
      />
      {/* Base swirls */}
      <path
        d="M35 70 Q40 65 50 68 Q60 65 65 70"
        stroke="currentColor"
        strokeWidth="1.2"
        fill="none"
        opacity="0.7"
      />
      <path
        d="M28 74 Q35 70 50 72 Q65 70 72 74"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
        opacity="0.5"
      />
    </svg>
  );
}
