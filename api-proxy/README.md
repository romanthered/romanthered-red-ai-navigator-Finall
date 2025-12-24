# RED AI Navigator - API Proxy

Simple Vercel Edge Function to proxy Anthropic API requests and avoid CORS issues.

## Deploy to Vercel

```bash
cd /Users/cardenio/Desktop/api-proxy
vercel --prod
```

This will give you a URL like: `https://your-project.vercel.app`

Then update the HTML file to use:
```javascript
const response = await fetch('https://your-project.vercel.app/api/claude', {
  // ... rest stays the same
});
```

## How it works

- User sends request with their API key in header
- Edge function forwards to Anthropic
- Returns response with CORS headers
- User pays for their own API usage

## Security

- User's API key is sent in headers (not stored on server)
- CORS enabled for all origins (public proxy)
- No rate limiting (user pays, user controls)
