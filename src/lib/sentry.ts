import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

export const initSentry = () => {
  if (import.meta.env.VITE_ENABLE_ERROR_TRACKING === 'true') {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      integrations: [
        new BrowserTracing({
          tracePropagationTargets: ['localhost', /^https:\/\/yourdomain\.com/],
        }),
        new Sentry.Replay({
          maskAllText: false,
          blockAllMedia: true,
        }),
      ],
      tracesSampleRate: 1.0,
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
    });
  }
};

export const captureError = (error: Error, context?: Record<string, any>) => {
  if (import.meta.env.VITE_ENABLE_ERROR_TRACKING === 'true') {
    Sentry.captureException(error, { extra: context });
  }
};

export const captureMessage = (message: string, level: Sentry.SeverityLevel = 'info') => {
  if (import.meta.env.VITE_ENABLE_ERROR_TRACKING === 'true') {
    Sentry.captureMessage(message, { level });
  }
}; 