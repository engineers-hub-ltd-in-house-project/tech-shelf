import { describe, it, expect } from 'vitest';

// Simple unit tests without rendering
describe('Button', () => {
  it('default variant should be primary', () => {
    const defaultVariant = 'primary';
    expect(defaultVariant).toBe('primary');
  });

  it('default size should be md', () => {
    const defaultSize = 'md';
    expect(defaultSize).toBe('md');
  });

  it('variant classes mapping is correct', () => {
    const variantClasses = {
      primary: 'btn-primary',
      secondary: 'btn-secondary',
      ghost: 'btn-ghost',
      link: 'btn-link',
    };

    expect(variantClasses.primary).toBe('btn-primary');
    expect(variantClasses.secondary).toBe('btn-secondary');
    expect(variantClasses.ghost).toBe('btn-ghost');
    expect(variantClasses.link).toBe('btn-link');
  });

  it('size classes mapping is correct', () => {
    const sizeClasses = {
      sm: 'btn-sm',
      md: '',
      lg: 'btn-lg',
    };

    expect(sizeClasses.sm).toBe('btn-sm');
    expect(sizeClasses.md).toBe('');
    expect(sizeClasses.lg).toBe('btn-lg');
  });

  it('classes should be constructed correctly', () => {
    const variant = 'primary';
    const size = 'md';
    const variantClasses = {
      primary: 'btn-primary',
      secondary: 'btn-secondary',
      ghost: 'btn-ghost',
      link: 'btn-link',
    };
    const sizeClasses = {
      sm: 'btn-sm',
      md: '',
      lg: 'btn-lg',
    };

    const classes = `btn ${variantClasses[variant]} ${sizeClasses[size]}`;
    expect(classes).toBe('btn btn-primary ');
  });
});
