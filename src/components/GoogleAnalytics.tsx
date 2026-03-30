'use client'

import Script from 'next/script'

const PRIMARY_GA_ID = 'G-RY8JTS6VFZ'
const SECONDARY_GA_ID = 'G-KDYVEN1G3E'

const CROSS_DOMAIN_DOMAINS = [
  'mycvbuddy.com',
  'www.mycvbuddy.com',
  'mycvbuddy.co.uk',
  'www.mycvbuddy.co.uk',
]

export function GoogleAnalytics() {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${PRIMARY_GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${PRIMARY_GA_ID}', {
            linker: {
              domains: ${JSON.stringify(CROSS_DOMAIN_DOMAINS)},
              accept_incoming: true,
              decorate_forms: true
            },
            send_page_view: true
          });

          gtag('config', '${SECONDARY_GA_ID}', {
            linker: {
              domains: ${JSON.stringify(CROSS_DOMAIN_DOMAINS)},
              accept_incoming: true,
              decorate_forms: true
            },
            send_page_view: true
          });
        `}
      </Script>
    </>
  )
}
