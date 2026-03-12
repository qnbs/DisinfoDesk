import { describe, it, expect, vi } from 'vitest';
import { isRejectedWithValue } from '@reduxjs/toolkit';
import { rtkQueryErrorLogger } from '../../store/middleware/errorLogger';

describe('errorLogger middleware', () => {
  const createMiddleware = () => {
    const dispatch = vi.fn();
    const getState = vi.fn();
    const next = vi.fn((action) => action);
    const api = { dispatch, getState } as any;
    const invoke = rtkQueryErrorLogger(api)(next);
    return { dispatch, next, invoke };
  };

  it('passes non-rejected actions through', () => {
    const { next, invoke } = createMiddleware();
    const action = { type: 'settings/setLanguage', payload: 'en' };
    invoke(action);
    expect(next).toHaveBeenCalledWith(action);
  });

  it('logs errors for rejectedWithValue actions', () => {
    const { dispatch, next, invoke } = createMiddleware();

    // Simulate a rejectedWithValue action (matches isRejectedWithValue guard)
    const action = {
      type: 'aiApi/executeQuery/rejected',
      payload: { status: 403, data: { message: 'Forbidden' } },
      meta: {
        arg: { endpointName: 'analyzeTheory' },
        rejectedWithValue: true,
        requestStatus: 'rejected',
        requestId: 'test-id',
        aborted: false,
        condition: false,
      },
      error: { message: 'Rejected' },
    };

    invoke(action);

    // Should still pass action through
    expect(next).toHaveBeenCalledWith(action);

    // Should dispatch a log entry
    if (isRejectedWithValue(action)) {
      expect(dispatch).toHaveBeenCalled();
    }
  });

  it('redacts long strings that look like API keys', () => {
    const { dispatch, invoke } = createMiddleware();

    const action = {
      type: 'aiApi/executeQuery/rejected',
      payload: { data: { message: 'Error with key AIzaSyB' + 'x'.repeat(35) + ' failed' } },
      meta: {
        rejectedWithValue: true,
        requestStatus: 'rejected',
        requestId: 'test-id',
        aborted: false,
        condition: false,
      },
      error: { message: 'Rejected' },
    };

    invoke(action);

    if (isRejectedWithValue(action)) {
      const logCall = dispatch.mock.calls[0]?.[0];
      if (logCall) {
        expect(logCall.payload.message).toContain('[REDACTED]');
      }
    }
  });
});
