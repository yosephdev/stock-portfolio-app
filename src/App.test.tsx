import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

describe('App', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
    // Mock localStorage to return empty initially
    localStorageMock.getItem.mockReturnValue(null);
  });

  it('renders the stock portfolio tracker title', () => {
    render(<App />);
    const titleElement = screen.getByText(/Stock Portfolio Tracker/i);
    expect(titleElement).toBeInTheDocument();
  });

  it('renders the subtitle', () => {
    render(<App />);
    const subtitleElement = screen.getByText(/Track your investments in real-time/i);
    expect(subtitleElement).toBeInTheDocument();
  });
});