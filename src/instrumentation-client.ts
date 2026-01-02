// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

/**
 * Detect Safari 15 or older to avoid replay integration bugs
 * iOS Safari 15 has a known issue with HTMLMediaElement.canPlayType instrumentation
 * that causes infinite recursion and "Maximum call stack size exceeded" errors
 * See: fixes/sentry-replay-ios-safari-15-infinite-recursion.md
 */
function isSafari15OrOlder(): boolean {
  if (typeof window === 'undefined') return false;
  
  const ua = window.navigator.userAgent;
  const isSafari = /^((?!chrome|android).)*safari/i.test(ua);
  
  if (!isSafari) return false;
  
  // Extract Safari version
  const match = ua.match(/Version\/(\d+)/);
  if (!match) return false;
  
  const version = parseInt(match[1], 10);
  return version <= 15;
}

// Conditionally include replay integration to avoid Safari 15 bugs
const integrations = [];
if (!isSafari15OrOlder()) {
  integrations.push(Sentry.replayIntegration({
    blockAllMedia: true, // Avoid media element instrumentation issues
    maskAllText: false,
    maskAllInputs: true,
  }));
}

Sentry.init({
  dsn: "https://398f046b26f6a782129279913a2e8edf@o4510211244294144.ingest.de.sentry.io/4510211246325840",

  // Add optional integrations for additional features
  integrations,

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1, // 10% in prod, 100% in dev
  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Define how likely Replay events are sampled.
  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: process.env.NODE_ENV === 'production' ? 0.05 : 0.1, // 5% in prod, 10% in dev

  // Define how likely Replay events are sampled when an error occurs.
  replaysOnErrorSampleRate: 1.0, // Always capture replay when error occurs

  // Enable sending user PII (Personally Identifiable Information)
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: true,

  // Filter out known Safari 15 errors if they still occur
  beforeSend(event) {
    if (event.exception?.values?.[0]?.value?.includes('Maximum call stack size exceeded')) {
      const userAgent = event.request?.headers?.['User-Agent'] || '';
      if (userAgent.includes('Safari/15') || userAgent.includes('Version/15')) {
        // Don't send Safari 15 stack overflow errors to Sentry
        console.warn('[Sentry] Filtered Safari 15 stack overflow error');
        return null;
      }
    }
    return event;
  },
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;