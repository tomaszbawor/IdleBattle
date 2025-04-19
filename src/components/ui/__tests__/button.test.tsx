import { describe, it, expect } from 'vitest';
import { render, screen } from '../../../test/utils';
import { Button } from '../button';
import * as React from 'react';

describe('Button', () => {
  it('renders with the correct children', () => {
    render(<Button>Test Button</Button>);
    expect(screen.getByRole('button', { name: 'Test Button' })).toBeInTheDocument();
  });

  it('applies the correct classes for default variant', () => {
    render(<Button>Default Button</Button>);
    const button = screen.getByRole('button', { name: 'Default Button' });
    expect(button).toHaveClass('bg-primary');
    expect(button).toHaveClass('text-primary-foreground');
  });

  it('applies the correct classes for destructive variant', () => {
    render(<Button variant="destructive">Destructive Button</Button>);
    const button = screen.getByRole('button', { name: 'Destructive Button' });
    expect(button).toHaveClass('bg-destructive');
    expect(button).toHaveClass('text-destructive-foreground');
  });

  it('applies the correct classes for outline variant', () => {
    render(<Button variant="outline">Outline Button</Button>);
    const button = screen.getByRole('button', { name: 'Outline Button' });
    expect(button).toHaveClass('border');
    expect(button).toHaveClass('border-input');
  });

  it('applies the correct classes for secondary variant', () => {
    render(<Button variant="secondary">Secondary Button</Button>);
    const button = screen.getByRole('button', { name: 'Secondary Button' });
    expect(button).toHaveClass('bg-secondary');
    expect(button).toHaveClass('text-secondary-foreground');
  });

  it('applies the correct classes for ghost variant', () => {
    render(<Button variant="ghost">Ghost Button</Button>);
    const button = screen.getByRole('button', { name: 'Ghost Button' });
    expect(button).toHaveClass('hover:bg-accent');
  });

  it('applies the correct classes for link variant', () => {
    render(<Button variant="link">Link Button</Button>);
    const button = screen.getByRole('button', { name: 'Link Button' });
    expect(button).toHaveClass('text-primary');
    expect(button).toHaveClass('underline-offset-4');
  });

  it('applies the correct classes for flicker variant', () => {
    render(<Button variant="flicker">Flicker Button</Button>);
    const button = screen.getByRole('button', { name: 'Flicker Button' });
    expect(button).toHaveClass('animate-pulse');
  });

  it('applies the correct classes for default size', () => {
    render(<Button>Default Size</Button>);
    const button = screen.getByRole('button', { name: 'Default Size' });
    expect(button).toHaveClass('h-10');
    expect(button).toHaveClass('px-4');
    expect(button).toHaveClass('py-2');
  });

  it('applies the correct classes for sm size', () => {
    render(<Button size="sm">Small Button</Button>);
    const button = screen.getByRole('button', { name: 'Small Button' });
    expect(button).toHaveClass('h-9');
    expect(button).toHaveClass('px-3');
  });

  it('applies the correct classes for lg size', () => {
    render(<Button size="lg">Large Button</Button>);
    const button = screen.getByRole('button', { name: 'Large Button' });
    expect(button).toHaveClass('h-11');
    expect(button).toHaveClass('px-8');
  });

  it('applies the correct classes for icon size', () => {
    render(<Button size="icon">Icon</Button>);
    const button = screen.getByRole('button', { name: 'Icon' });
    expect(button).toHaveClass('h-10');
    expect(button).toHaveClass('w-10');
  });

  it('renders as a different element when asChild is true', () => {
    render(
      <Button asChild>
        <a href="https://example.com">Link Button</a>
      </Button>
    );
    const link = screen.getByRole('link', { name: 'Link Button' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://example.com');
  });

  it('passes through additional props', () => {
    render(<Button data-testid="test-button">Props Button</Button>);
    const button = screen.getByTestId('test-button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Props Button');
  });

  it('combines className with variant classes', () => {
    render(<Button className="custom-class">Custom Class Button</Button>);
    const button = screen.getByRole('button', { name: 'Custom Class Button' });
    expect(button).toHaveClass('custom-class');
    expect(button).toHaveClass('bg-primary'); // Default variant class
  });
});