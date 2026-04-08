import leapyImage from 'figma:asset/312ed88cca72c91e77e5ff70735a88a9e9fa111c.png';

interface LeapyIconProps {
  className?: string;
}

export function LeapyIcon({ className = "size-6" }: LeapyIconProps) {
  return (
    <img 
      src={leapyImage} 
      alt="Leapy" 
      className={className}
    />
  );
}