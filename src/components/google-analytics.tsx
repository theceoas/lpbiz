'use client'

import Script from 'next/script'

export default function GoogleAnalytics() {
  const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID

  if (!GA_TRACKING_ID) {
    return null
  }

  return (
    <>
      <Script
        strategy="beforeInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_title: document.title,
              page_location: window.location.href,
            });
          `,
        }}
      />
    </>
  )
}