export { default as DemoWrapper } from './DemoWrapper';
export { default as BrowserChrome } from './BrowserChrome';
export { default as DemoOnboarding } from './DemoOnboarding';
export { useDemoContext, isInIframe, isFullscreenMode, getDemoContext } from './utils/iframe-detection.js';
export { getCursorStyle, DEMO_CURSORS, CSS_CURSORS } from '../utils/cursor-utils';
export { WalkthroughSupport, createWalkthroughSteps } from '../utils/walkthrough-support';

// Walkthrough configuration exports
export { 
  createOnboardingConfig,
  HighlightAreas,
  MetricTemplates,
  CalloutTemplates,
  validateOnboardingConfig
} from '../utils/walkthrough-config';