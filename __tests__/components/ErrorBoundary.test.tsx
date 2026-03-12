import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import settingsReducer from '../../store/slices/settingsSlice';

const createTestStore = () => configureStore({
  reducer: { settings: settingsReducer },
});

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <Provider store={createTestStore()}>{children}</Provider>
);

// A component that throws to test the error boundary
const ThrowingComponent = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) throw new Error('Test error for boundary');
  return <div>Child content</div>;
};

// Suppress console.error from React during error boundary tests
beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

describe('ErrorBoundary', () => {
  it('renders children when no error', () => {
    render(
      <Wrapper>
        <ErrorBoundary>
          <div>Safe content</div>
        </ErrorBoundary>
      </Wrapper>
    );
    expect(screen.getByText('Safe content')).toBeInTheDocument();
  });

  it('renders fallback UI when child throws', () => {
    render(
      <Wrapper>
        <ErrorBoundary>
          <ThrowingComponent shouldThrow={true} />
        </ErrorBoundary>
      </Wrapper>
    );
    expect(screen.getByText('System Error Detected')).toBeInTheDocument();
    expect(screen.getAllByText(/test error for boundary/i).length).toBeGreaterThanOrEqual(1);
  });

  it('renders custom fallback when provided', () => {
    render(
      <Wrapper>
        <ErrorBoundary fallback={<div>Custom fallback</div>}>
          <ThrowingComponent shouldThrow={true} />
        </ErrorBoundary>
      </Wrapper>
    );
    expect(screen.getByText('Custom fallback')).toBeInTheDocument();
  });

  it('calls onError callback when error occurs', () => {
    const onError = vi.fn();
    render(
      <Wrapper>
        <ErrorBoundary onError={onError}>
          <ThrowingComponent shouldThrow={true} />
        </ErrorBoundary>
      </Wrapper>
    );
    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError.mock.calls[0][0]).toBeInstanceOf(Error);
    expect(onError.mock.calls[0][0].message).toBe('Test error for boundary');
  });

  it('shows Try Again button that resets error state', () => {
    render(
      <Wrapper>
        <ErrorBoundary>
          <ThrowingComponent shouldThrow={true} />
        </ErrorBoundary>
      </Wrapper>
    );
    
    expect(screen.getByText('System Error Detected')).toBeInTheDocument();

    const tryAgainBtn = screen.getByText('Try Again');
    fireEvent.click(tryAgainBtn);

    expect(screen.getByText('System Error Detected')).toBeInTheDocument();
  });

  it('shows Reload Page button', () => {
    render(
      <Wrapper>
        <ErrorBoundary>
          <ThrowingComponent shouldThrow={true} />
        </ErrorBoundary>
      </Wrapper>
    );
    expect(screen.getByText('Reload Page')).toBeInTheDocument();
  });

  it('displays error code label', () => {
    render(
      <Wrapper>
        <ErrorBoundary>
          <ThrowingComponent shouldThrow={true} />
        </ErrorBoundary>
      </Wrapper>
    );
    expect(screen.getByText(/ERRCODE: BOUNDARY_TRAP/)).toBeInTheDocument();
  });
});
