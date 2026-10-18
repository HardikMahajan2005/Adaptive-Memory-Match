import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '@/App';
import { MemoryCard } from '@/components/game/MemoryCard';
import { Card } from '@/game/types';

describe('UI & Interaction Component Tests (AC-13, AC-14, AC-19)', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('renders application title, subtitle, and primary dashboard sections', () => {
    render(<App />);

    // Brand and board headings
    expect(screen.getAllByText('Adaptive Memory Match').length).toBeGreaterThanOrEqual(1);
    expect(
      screen.getByText('Find all matching pairs. The game adapts to your performance.')
    ).toBeInTheDocument();

    // Panels
    expect(screen.getByText('Game Status')).toBeInTheDocument();
    expect(screen.getByText('Next Round')).toBeInTheDocument();
    expect(screen.getByText('Game Controls')).toBeInTheDocument();
    expect(screen.getByText('Recent Results')).toBeInTheDocument();
    expect(screen.getByText('Adaptive Difficulty')).toBeInTheDocument();
    expect(screen.getByText('Pro Tip')).toBeInTheDocument();

    // 16 cards in 4x4 grid
    const cards = screen.getAllByRole('button', { name: /Row \d, Column \d/ });
    expect(cards).toHaveLength(16);
  });

  it('opens and closes How to Play modal on user interaction', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Click How to Play button
    const howToPlayButtons = screen.getAllByRole('button', { name: /how to play/i });
    await user.click(howToPlayButtons[0]);

    expect(screen.getByRole('dialog', { name: /how to play adaptive memory match/i })).toBeInTheDocument();

    // Close via modal close button
    const closeBtn = screen.getByRole('button', { name: /close dialog/i });
    await user.click(closeBtn);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens Stats modal and displays analytics information', async () => {
    const user = userEvent.setup();
    render(<App />);

    const statsBtn = screen.getByRole('button', { name: /open statistics/i });
    await user.click(statsBtn);

    expect(screen.getByRole('dialog', { name: /session analytics & records/i })).toBeInTheDocument();
    expect(screen.getByText('Total Games')).toBeInTheDocument();
    expect(screen.getByText('Best Moves')).toBeInTheDocument();
    expect(screen.getByText('Best Time')).toBeInTheDocument();
  });

  it('supports accessible keyboard card selection with Enter and Space keys (AC-14, AC-19)', () => {
    const mockCard: Card = {
      id: 'test-card-1',
      pairId: 'star',
      symbol: 'star',
      isFlipped: false,
      isMatched: false,
      position: 0,
    };

    const handleClick = vi.fn();
    render(<MemoryCard card={mockCard} onClick={handleClick} />);

    const button = screen.getByRole('button', { name: /Row 1, Column 1: Hidden card/i });
    expect(button).toBeInTheDocument();

    // Space key
    fireEvent.keyDown(button, { key: ' ' });
    expect(handleClick).toHaveBeenCalledTimes(1);

    // Enter key
    fireEvent.keyDown(button, { key: 'Enter' });
    expect(handleClick).toHaveBeenCalledTimes(2);
  });

  it('hides symbol identity in accessible label when card is face down (AC-14)', () => {
    const mockCard: Card = {
      id: 'secret-card',
      pairId: 'heart',
      symbol: 'heart',
      isFlipped: false,
      isMatched: false,
      position: 5,
    };

    render(<MemoryCard card={mockCard} onClick={() => {}} />);

    const button = screen.getByRole('button');
    // Does NOT leak 'heart' or 'Heart'
    expect(button.getAttribute('aria-label')).toBe('Row 2, Column 2: Hidden card');
    expect(button.getAttribute('aria-label')).not.toContain('Heart');
  });

  it('reveals symbol in accessible label when card is matched (AC-14)', () => {
    const mockCard: Card = {
      id: 'revealed-card',
      pairId: 'heart',
      symbol: 'heart',
      isFlipped: true,
      isMatched: true,
      position: 5,
    };

    render(<MemoryCard card={mockCard} onClick={() => {}} />);

    const button = screen.getByRole('button');
    expect(button.getAttribute('aria-label')).toContain('Matched Heart');
  });

  it('operates in the premium Liquid Glass dark theme by default (AC-13)', () => {
    render(<App />);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('allows manual switching of difficulty levels via segmented switcher and adaptive stepper', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Switch to Medium via segmented switcher
    const mediumRadio = screen.getByRole('radio', { name: /^medium$/i });
    await user.click(mediumRadio);
    expect(mediumRadio).toHaveAttribute('aria-checked', 'true');

    // Switch to Hard via stepper button in AdaptiveDifficultyPanel
    const hardStepper = screen.getByRole('radio', { name: /select hard difficulty/i });
    await user.click(hardStepper);
    expect(hardStepper).toHaveAttribute('aria-checked', 'true');

    // Switch back to Easy via segmented switcher
    const easyRadio = screen.getByRole('radio', { name: /^easy$/i });
    await user.click(easyRadio);
    expect(easyRadio).toHaveAttribute('aria-checked', 'true');
  });
});
