import { createSecureHeaders } from "next-secure-headers";

const securityHeaders = createSecureHeaders({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      imgSrc: ["'self'", "data:", "https://images.unsplash.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      connectSrc: ["'self'", "https://*.supabase.co"],
      frameSrc: ["'self'", "https://js.stripe.com"],
    },
  },
  referrerPolicy: "strict-origin-when-cross-origin",
  forceHTTPSRedirect: [true, { maxAge: 3600, includeSubDomains: true }],
  xFrameOptions: "DENY",
  strictTransportSecurity: "max-age=63072000; includeSubDomains; preload",
});

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: true,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
