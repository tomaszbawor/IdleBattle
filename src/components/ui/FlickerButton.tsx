import React from 'react';
import { Button } from './button';

interface FlickerButtonProps {
  text: string;
  onClick: () => void;
  width?: number;
  height?: number;
  fontSize?: number;
}

const FlickerButton: React.FC<FlickerButtonProps> = ({
  text,
  onClick,
  width = 200,
  height = 80,
  fontSize = 20
}) => {
  return (
    <Button
      variant="flicker"
      onClick={onClick}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        fontSize: `${fontSize}px`
      }}
    >
      {text}
    </Button>
  );
};

export default FlickerButton;
