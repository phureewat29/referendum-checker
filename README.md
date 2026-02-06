# Thai Election Region Checker

A minimal, clean Next.js app that checks Thai election regions from two government APIs and compares the results.

## ✅ What's Working Now

- **Clean UI**: Black background, white text, mobile-first, centered on desktop
- **Thai ID Validation**: 13-digit with checksum verification
- **Parallel API Calls**: Calls both APIs simultaneously
- **Smart Comparison**: Shows ✓ ตรงกัน (match) or ✗ ไม่ตรงกัน (different)
- **Auto-retry**: Tries multiple endpoint patterns automatically
- **Bilingual**: Thai and English labels

## ⏳ What Needs to Be Done

The API endpoints need to be discovered. The app tries 4 common patterns but gets 404 errors.

**Time needed**: 10 minutes using the discovery script below.

## Quick Start

```bash
npm run dev
# Open http://localhost:3000
```

## Discover Real API Endpoints (Required)

### Option 1: Browser Console Script (Fastest)

1. **Open**: https://boraservices.bora.dopa.go.th/election/enqelection/
2. **Press F12** → Console tab
3. **Paste script**:

```javascript
(function() {
  const originalFetch = window.fetch;
  window.fetch = function(...args) {
    const [url, options = {}] = args;
    console.log('🔍 URL:', url);
    console.log('Method:', options.method || 'GET');
    console.log('Body:', options.body);
    return originalFetch.apply(this, args).then(r => {
      r.clone().json().then(d => console.log('Response:', d));
      return r;
    });
  };
  console.log('✅ Submit form now');
})();
```

4. **Submit form** with Thai ID
5. **Copy output** (URL, method, parameters)
6. **Update** `app/api/election/route.ts`
7. **Repeat** for https://boraservices.bora.dopa.go.th/election/enqelectionpm/ → Update `app/api/election-pm/route.ts`

### Option 2: Network Tab

1. Open website → F12 → Network tab
2. Filter: XHR
3. Submit form
4. Click API request → Copy URL, method, payload
5. Update route files

## Update API Routes

Edit `app/api/election/route.ts`:

```typescript
const API_PATTERNS = [
  {
    url: 'PASTE_DISCOVERED_URL', // ← Your discovered URL here
    method: 'POST',              // ← Your discovered method
    bodyParam: 'pid'              // ← Your discovered param name
  },
  // ...keep other patterns as fallback
];
```

## UI Preview

```
Black screen with:
- Center card
- "ตรวจสอบเขตเลือกตั้ง" heading (white)
- Input field for 13 digits
- "ตรวจสอบ" button
- Results: สส. (MP) and ประชามติ cards
- Color-coded match indicator
```

## Project Structure

```
app/
├── page.tsx                # UI ✅
├── api/
│   ├── election/route.ts   # MP API ⏳
│   └── election-pm/route.ts # Referendum API ⏳

Files to update: Just those 2 route files!
```

## Testing

```bash
# Test API (will show 404 until discovered)
curl -X POST http://localhost:3000/api/election \
  -H "Content-Type: application/json" \
  -d '{"thaiId":"1234567890129"}'
```

## More Help

- `DISCOVER_API.md` - Detailed instructions
- `FINAL_SUMMARY.md` - Complete overview
- `public/discover-api.js` - Full script

## Tech Stack

- Next.js 15 + TypeScript
- Tailwind CSS
- Thai ID checksum validation

---

**Status**: UI complete, just need API endpoints! 🚀
