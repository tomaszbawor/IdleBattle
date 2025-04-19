import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../../test/utils';
import SocialButton from '../SocialButton';

// Mock window.open
const originalOpen = window.open;
vi.stubGlobal('open', vi.fn());

describe('SocialButton', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterAll(() => {
    // Restore original window.open
    vi.stubGlobal('open', originalOpen);
  });

  it('renders with the correct platform', () => {
    render(<SocialButton platform="facebook" url="https://facebook.com" />);
    const button = screen.getByLabelText('facebook button');
    expect(button).toBeInTheDocument();
  });

  it('applies the correct styles based on props', () => {
    render(<SocialButton platform="twitter" url="https://twitter.com" size={80} />);
    
    const button = screen.getByLabelText('twitter button');
    expect(button).toHaveStyle({
      backgroundImage: `url('/assets/images/twitter.png')`,
      width: '80px',
      height: '80px'
    });
  });

  it('has the correct aria-label', () => {
    render(<SocialButton platform="instagram" url="https://instagram.com" />);
    expect(screen.getByLabelText('instagram button')).toBeInTheDocument();
  });

  it('opens the URL in a new tab when clicked', () => {
    render(<SocialButton platform="linkedin" url="https://linkedin.com" />);
    
    fireEvent.click(screen.getByLabelText('linkedin button'));
    expect(window.open).toHaveBeenCalledWith('https://linkedin.com', '_blank');
  });

  it('applies default size when not provided', () => {
    render(<SocialButton platform="youtube" url="https://youtube.com" />);
    
    const button = screen.getByLabelText('youtube button');
    expect(button).toHaveStyle({
      width: '50px',
      height: '50px'
    });
  });

  it('has the ghost variant', () => {
    render(<SocialButton platform="facebook" url="https://facebook.com" />);
    
    const button = screen.getByLabelText('facebook button');
    expect(button).toHaveClass('bg-no-repeat');
    expect(button).toHaveClass('bg-center');
    expect(button).toHaveClass('bg-contain');
  });
});