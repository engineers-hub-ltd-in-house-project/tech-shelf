import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import Button from './Button.svelte';

describe('Button', () => {
  it('renders with default props', () => {
    const { getByRole } = render(Button, { props: {} });
    const button = getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('btn', 'btn-primary');
  });

  it('applies variant classes', () => {
    const { getByRole } = render(Button, {
      props: {
        variant: 'secondary' as const,
      },
    });
    const button = getByRole('button');
    expect(button).toHaveClass('btn', 'btn-secondary');
  });

  it('applies size classes', () => {
    const { getByRole } = render(Button, {
      props: {
        size: 'lg' as const,
      },
    });
    const button = getByRole('button');
    expect(button).toHaveClass('btn', 'btn-lg');
  });
});
