import React from 'react';
import { Button } from './button';
import { cn } from '../../lib/utils';

interface SocialButtonProps {
  platform: string;
  url: string;
  size?: number;
}

const SocialButton: React.FC<SocialButtonProps> = ({ platform, url, size = 50 }) => {
  const handleClick = (): void => {
    window.open(url, '_blank');
  };

  return (
    <Button 
      variant="ghost"
      className={cn(
        'bg-no-repeat bg-center bg-contain p-0 hover:bg-opacity-80'
      )}
      onClick={handleClick}
      style={{ 
        backgroundImage: `url('/assets/images/${platform}.png')`,
        width: `${size}px`,
        height: `${size}px`
      }}
      aria-label={`${platform} button`}
    />
  );
};

export default SocialButton;
