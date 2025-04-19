import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../../test/utils';
import FlickerButton from '../FlickerButton';

describe('FlickerButton', () => {
  it('renders with the correct text', () => {
    render(<FlickerButton text="Test Button" onClick={() => {}} />);
    expect(screen.getByText('Test Button')).toBeInTheDocument();
  });

  it('applies the correct styles based on props', () => {
    render(
      <FlickerButton 
        text="Styled Button" 
        onClick={() => {}} 
        width={300} 
        height={100} 
        fontSize={24} 
      />
    );
    
    const button = screen.getByText('Styled Button');
    expect(button).toHaveStyle({
      width: '300px',
      height: '100px',
      fontSize: '24px'
    });
  });

  it('calls the onClick handler when clicked', () => {
    const handleClick = vi.fn();
    render(<FlickerButton text="Click Me" onClick={handleClick} />);
    
    fireEvent.click(screen.getByText('Click Me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies default styles when props are not provided', () => {
    render(<FlickerButton text="Default Button" onClick={() => {}} />);
    
    const button = screen.getByText('Default Button');
    expect(button).toHaveStyle({
      width: '200px',
      height: '80px',
      fontSize: '20px'
    });
  });

  it('has the flicker variant', () => {
    render(<FlickerButton text="Flicker Button" onClick={() => {}} />);
    
    const button = screen.getByText('Flicker Button');
    expect(button).toHaveClass('animate-pulse');
  });
});