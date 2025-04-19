import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../../test/utils';
import BeginScene from '../BeginScene';

// Mock the FlickerButton and SocialButton components
vi.mock('../../ui/FlickerButton', () => ({
  default: ({ text, onClick }: { text: string; onClick: () => void }) => (
    <button onClick={onClick} data-testid="flicker-button">
      {text}
    </button>
  ),
}));

vi.mock('../../ui/SocialButton', () => ({
  default: ({ platform, url }: { platform: string; url: string }) => (
    <a href={url} data-testid={`social-button-${platform}`}>
      {platform}
    </a>
  ),
}));

describe('BeginScene', () => {
  it('renders the game title', () => {
    render(<BeginScene onPlay={() => {}} />);
    expect(screen.getByText('Battle Without End')).toBeInTheDocument();
  });

  it('renders the play button and calls onPlay when clicked', () => {
    const handlePlay = vi.fn();
    render(<BeginScene onPlay={handlePlay} />);
    
    const playButton = screen.getByTestId('flicker-button');
    expect(playButton).toBeInTheDocument();
    expect(playButton).toHaveTextContent('Play Game');
    
    fireEvent.click(playButton);
    expect(handlePlay).toHaveBeenCalledTimes(1);
  });

  it('displays the version information', () => {
    render(<BeginScene onPlay={() => {}} />);
    expect(screen.getByText('Ver. 1.6')).toBeInTheDocument();
  });

  it('renders the social media buttons', () => {
    render(<BeginScene onPlay={() => {}} />);
    
    expect(screen.getByTestId('social-button-facebook')).toBeInTheDocument();
    expect(screen.getByTestId('social-button-twitter')).toBeInTheDocument();
    expect(screen.getByTestId('social-button-weibo')).toBeInTheDocument();
    expect(screen.getByTestId('social-button-kongregate')).toBeInTheDocument();
  });

  it('social buttons have the correct URLs', () => {
    render(<BeginScene onPlay={() => {}} />);
    
    expect(screen.getByTestId('social-button-facebook')).toHaveAttribute(
      'href',
      'https://www.facebook.com/pages/Crit-Game/492086344181628'
    );
    expect(screen.getByTestId('social-button-twitter')).toHaveAttribute(
      'href',
      'https://twitter.com/jyl111'
    );
    expect(screen.getByTestId('social-button-weibo')).toHaveAttribute(
      'href',
      'http://www.weibo.com/2162569391/'
    );
    expect(screen.getByTestId('social-button-kongregate')).toHaveAttribute(
      'href',
      'http://www.kongregate.com/games/CritGame/battle-without-end'
    );
  });
});