# How to Discover the Real API Endpoints

The app is now running with a clean, minimal UI (white text on black background, mobile-first, centered on large screens).

However, the API routes are currently trying multiple common endpoint patterns. To get the EXACT working endpoints, follow these steps:

## Option 1: Browser Console Script (Easiest)

1. **Start the app** (if not running):
   ```bash
   npm run dev
   ```

2. **Open the target website**:
   - For MP election: https://boraservices.bora.dopa.go.th/election/enqelection/
   - For Referendum: https://boraservices.bora.dopa.go.th/election/enqelectionpm/

3. **Open DevTools Console** (F12 → Console tab)

4. **Copy and paste this script** into the console:
   ```javascript
   // API Discovery Script
   (function() {
     console.log('%c🔍 API Discovery Started', 'color: green; font-size: 16px; font-weight: bold;');

     const originalFetch = window.fetch;
     window.fetch = function(...args) {
       const [url, options = {}] = args;
       console.log('%c📡 FETCH CALL', 'color: purple; font-size: 14px; font-weight: bold;');
       console.log('URL:', url);
       console.log('Method:', options.method || 'GET');
       console.log('Body:', options.body);

       return originalFetch.apply(this, args).then(response => {
         return response.clone().json().then(data => {
           console.log('%c✅ Response:', 'color: green;');
           console.log(JSON.stringify({
             url,
             method: options.method || 'GET',
             body: options.body,
             response: data
           }, null, 2));
           return data;
         }).catch(() => response);
       });
     };

     const originalOpen = XMLHttpRequest.prototype.open;
     const originalSend = XMLHttpRequest.prototype.send;

     XMLHttpRequest.prototype.open = function(method, url) {
       this._method = method;
       this._url = url;
       return originalOpen.apply(this, arguments);
     };

     XMLHttpRequest.prototype.send = function(body) {
       console.log('%c📡 XHR CALL', 'color: purple; font-size: 14px; font-weight: bold;');
       console.log('URL:', this._url);
       console.log('Method:', this._method);
       console.log('Body:', body);

       this.addEventListener('load', function() {
         try {
           const data = JSON.parse(this.responseText);
           console.log('%c✅ Response:', 'color: green;');
           console.log(JSON.stringify({
             url: this._url,
             method: this._method,
             body: body,
             response: data
           }, null, 2));
         } catch(e) {}
       });

       return originalSend.apply(this, arguments);
     };

     console.log('%c✅ Script installed! Now submit the form.', 'color: green;');
   })();
   ```

5. **Submit the form** with a Thai ID

6. **Copy the output** - it will show the exact URL, method, body parameters, and response structure

7. **Update the API files**:
   - `app/api/election/route.ts` for MP election
   - `app/api/election-pm/route.ts` for referendum

## Option 2: Network Tab (Manual)

1. Open the website
2. Press F12 → Network tab
3. Filter by: XHR or Fetch
4. Submit the form with a Thai ID
5. Click on the API request
6. Copy:
   - Request URL
   - Request Method
   - Request Payload (body)
   - Response structure

## Example: Updating the API Route

If you discover:
- URL: `https://boraservices.bora.dopa.go.th/boraapi/enqelection`
- Method: `POST`
- Body: `{"pid": "1234567890123"}`

Update `app/api/election/route.ts`:

```typescript
const API_PATTERNS = [
  {
    url: 'https://boraservices.bora.dopa.go.th/boraapi/enqelection', // ← Discovered URL
    method: 'POST',
    bodyParam: 'pid' // ← Discovered parameter name
  },
  // Keep other patterns as fallback
];
```

## Current Status

- ✅ UI is complete (minimal, white text, mobile-first, centered)
- ✅ Thai ID validation working
- ✅ Comparison logic working
- ⏳ API endpoints trying multiple patterns (update when discovered)

## Quick Test

1. Open http://localhost:3000
2. You should see a minimal black page with white text
3. Enter a 13-digit Thai ID
4. Click ตรวจสอบ
5. Check terminal logs for which endpoints were attempted
6. If all fail, use the scripts above to discover the real endpoints

## App Features

- **Clean minimal UI**: Black background, white text, centered
- **Thai language**: Labels in Thai with English subtitles
- **Validation**: Thai ID checksum verification
- **Comparison**: Shows if regions match between MP and Referendum
- **Fallback system**: Tries multiple API patterns automatically
