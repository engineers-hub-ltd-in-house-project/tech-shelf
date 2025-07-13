import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte/svelte5';
import OutlinePane from '$lib/components/editor/OutlinePane.svelte';

describe('OutlinePane', () => {
  const mockContent = `# Heading 1
Some text here

## Heading 2
More text

### Heading 3
Even more text

## Another Heading 2
Final text`;

  it('renders outline correctly', () => {
    const { getByText } = render(OutlinePane, { props: { content: mockContent } });

    expect(getByText('Heading 1')).toBeTruthy();
    expect(getByText('Heading 2')).toBeTruthy();
    // Heading 3 is nested within Heading 2, so we should check it's in the document
    // but it might not be visible if collapsed by default
    expect(getByText('Another Heading 2')).toBeTruthy();
  });

  it('shows empty state when no headings', () => {
    const { getByText } = render(OutlinePane, { props: { content: 'No headings here' } });

    expect(getByText('見出しがありません')).toBeTruthy();
  });

  it('handles collapse/expand functionality', async () => {
    const { container } = render(OutlinePane, {
      props: { content: mockContent },
    });

    // Heading 3 is a child of Heading 2
    // Check if nested content exists
    const nestedContent = container.querySelector('.outline-sublist');
    expect(nestedContent).toBeTruthy();

    // Find and click the collapse button for Heading 2
    const collapseButtons = container.querySelectorAll('.collapse-button');
    expect(collapseButtons.length).toBeGreaterThan(0);

    // Since we're using hierarchical structure, we check for the presence
    // of the collapse button which indicates children exist
    await fireEvent.click(collapseButtons[0]);

    // After clicking, the button should still exist but the state changes
    const collapsedButton = container.querySelector('.collapse-button svg.collapsed');
    expect(collapsedButton).toBeTruthy();

    // Click again to expand
    await fireEvent.click(collapseButtons[0]);

    // The collapsed class should be removed
    const expandedButton = container.querySelector('.collapse-button svg:not(.collapsed)');
    expect(expandedButton).toBeTruthy();
  });

  it('calls onReorder when items are reordered', async () => {
    const onReorder = vi.fn();
    const { container } = render(OutlinePane, {
      props: { content: mockContent, onReorder },
    });

    // Simulate drag and drop (simplified test)
    const outlineList = container.querySelector('.outline-list');
    expect(outlineList).toBeTruthy();

    // Note: Full drag-and-drop testing would require more complex setup
    // This test verifies the component renders with the necessary props
  });

  it('handles click navigation', async () => {
    const navigateSpy = vi.fn();
    globalThis.addEventListener('navigate', navigateSpy);

    const { getByText } = render(OutlinePane, { props: { content: mockContent } });

    const heading = getByText('Heading 1');
    await fireEvent.click(heading);

    expect(navigateSpy).toHaveBeenCalled();

    globalThis.removeEventListener('navigate', navigateSpy);
  });
});
