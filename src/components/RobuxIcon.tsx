export default function RobuxIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="18" height="18" rx="3" fill="url(#robux-grad)" />
      <path
        d="M8 8h3.5l2.5 4 2.5-4H20v2h-2.5L14 14h-2l-3.5-4H8v4H6V8h2z"
        fill="white"
        fillOpacity="0.95"
      />
      <defs>
        <linearGradient id="robux-grad" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2ecc71" />
          <stop offset="1" stopColor="#1a8a4a" />
        </linearGradient>
      </defs>
    </svg>
  );
}
