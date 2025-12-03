
import { isRejectedWithValue, Middleware, MiddlewareAPI } from '@reduxjs/toolkit';
import { addLog } from '../slices/settingsSlice';

/**
 * Global Error Logger Middleware
 * 
 * Intercepts any action ending in /rejected (AsyncThunks) or containing an error.
 * Automatically dispatches a system log entry, centralized error handling.
 */
export const rtkQueryErrorLogger: Middleware = (api: MiddlewareAPI) => (next) => (action: any) => {
  if (isRejectedWithValue(action)) {
    const errorCode = action.payload?.status || action.error?.code || 'UNKNOWN_ERR';
    const errorMessage = action.payload?.data?.message || action.error?.message || 'An unexpected error occurred';
    const endpointName = action.meta?.arg?.endpointName ? `[API: ${action.meta.arg.endpointName}]` : '[Redux]';

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
