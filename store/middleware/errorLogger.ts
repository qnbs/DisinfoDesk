import { isRejectedWithValue, Middleware, MiddlewareAPI, UnknownAction } from '@reduxjs/toolkit';
import { addLog } from '../slices/settingsSlice';

/**
 * Interface definition for a rejected action structure
 * to avoid using 'any' when accessing properties.
 */
interface RejectedAction extends UnknownAction {
  payload?: { status?: number | string; data?: { message?: string } };
  error?: { code?: string; message?: string };
  meta?: { arg?: { endpointName?: string } };
}

/**
 * Global Error Logger Middleware
 * 
 * Intercepts any action ending in /rejected (AsyncThunks) or containing an error.
 * Automatically dispatches a system log entry, centralized error handling.
 */
export const rtkQueryErrorLogger: Middleware = (api: MiddlewareAPI) => (next) => (action: unknown) => {
  if (isRejectedWithValue(action)) {
    // Cast to specific rejected structure after the type guard
    const rejectedAction = action as RejectedAction;
    
    const errorCode = rejectedAction.payload?.status || rejectedAction.error?.code || 'UNKNOWN_ERR';
    const errorMessage = rejectedAction.payload?.data?.message || rejectedAction.error?.message || 'An unexpected error occurred';
    const endpointName = rejectedAction.meta?.arg?.endpointName ? `[API: ${rejectedAction.meta.arg.endpointName}]` : '[Redux]';

    // Dispatch to System Terminal (Settings Slice)
    api.dispatch(addLog({
      message: `${endpointName} ${errorCode}: ${errorMessage}`,
      type: 'error'
    }));

    console.groupCollapsed(`%c 🚨 Redux Error: ${errorCode}`, 'color: #ef4444; font-weight: bold;');
    console.log('Action:', action);
    console.log('Message:', errorMessage);
    console.groupEnd();
  }

  return next(action);
};