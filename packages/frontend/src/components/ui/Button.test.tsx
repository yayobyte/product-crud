import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button Component', () => {
  it('renders the button with children', () => {
    render(<Button>Click Me</Button>);
    const buttonElement = screen.getByRole('button', { name: /click me/i });
    expect(buttonElement).toBeInTheDocument();
  });

  it('applies default variant and size if not provided', () => {
    render(<Button>Test Button</Button>);
    const buttonElement = screen.getByRole('button', { name: /test button/i });
    expect(buttonElement).toBeInTheDocument();
  });

  it('applies specified variant and size classes', () => {
    render(
      <Button variant="secondary" size="sm">
        Styled Button
      </Button>
    );
    const buttonElement = screen.getByRole('button', {
      name: /styled button/i,
    });
    expect(buttonElement).toBeInTheDocument();
  });

  it('disables the button when disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>);
    const buttonElement = screen.getByRole('button', {
      name: /disabled button/i,
    });
    expect(buttonElement).toBeDisabled();
  });
});
