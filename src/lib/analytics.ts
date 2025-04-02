declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event',
      targetId: string,
      config?: Record<string, any>
    ) => void;
    dataLayer: any[];
  }
}

export const initAnalytics = () => {
  if (import.meta.env.VITE_ENABLE_ANALYTICS === 'true') {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${import.meta.env.VITE_GOOGLE_ANALYTICS_ID}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };

    window.gtag('config', import.meta.env.VITE_GOOGLE_ANALYTICS_ID);
  }
};

export const trackEvent = (
  eventName: string,
  params?: Record<string, any>
) => {
  if (import.meta.env.VITE_ENABLE_ANALYTICS === 'true') {
    window.gtag('event', eventName, params);
  }
};

export const trackPageView = (path: string) => {
  if (import.meta.env.VITE_ENABLE_ANALYTICS === 'true') {
    window.gtag('config', import.meta.env.VITE_GOOGLE_ANALYTICS_ID, {
      page_path: path,
    });
  }
}; 