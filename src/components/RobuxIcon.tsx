import robuxLogo from '../images/robux.png';

export default function RobuxIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <img 
      src={robuxLogo} 
      alt="Robux" 
      className={className}
      style={{ objectFit: 'contain' }}
    />
  );
}

