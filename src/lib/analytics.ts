// Google Analytics utility functions

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

// Track page views
export const trackPageView = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_TRACKING_ID, {
      page_location: url,
    });
  }
};

// Track custom events
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Specific event tracking functions
export const trackFormSubmission = (formName: string) => {
  trackEvent('form_submit', 'engagement', formName);
};

export const trackButtonClick = (buttonName: string) => {
  trackEvent('click', 'engagement', buttonName);
};

export const trackBookingAttempt = () => {
  trackEvent('booking_attempt', 'conversion', 'calendar_booking');
};

export const trackBookingComplete = () => {
  trackEvent('booking_complete', 'conversion', 'calendar_booking');
};

export const trackWaitlistSignup = () => {
  trackEvent('waitlist_signup', 'conversion', 'email_signup');
};

export const trackCTAClick = (ctaLocation: string) => {
  trackEvent('cta_click', 'engagement', ctaLocation);
};

export const trackScrollDepth = (percentage: number) => {
  trackEvent('scroll', 'engagement', 'scroll_depth', percentage);
};

// Track user engagement time
export const trackEngagementTime = (timeInSeconds: number) => {
  trackEvent('engagement_time', 'engagement', 'time_on_page', timeInSeconds);
};