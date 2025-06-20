import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.browserProfilingIntegration(),
    Sentry.replayIntegration(),
  ],
  tracesSampleRate: 1.0, // Capture 100% of transactions for tracing
  tracePropagationTargets: [
    /^\//,
    new RegExp(import.meta.env.VITE_TRACE_PROPAGATION_TARGET || '^https://your-api\.com/')
  ],
  replaysSessionSampleRate: 0.1, // 10% of all sessions
  replaysOnErrorSampleRate: 1.0, // 100% of sessions with an error
}); 