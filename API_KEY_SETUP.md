# API Key Setup Guide

## ✅ API Key Configuration Complete

Your NVIDIA AI LLM API key has been successfully configured!

### What Was Done

1. ✅ Created `.env` file with your API key
2. ✅ Added `.env` to `.gitignore` (prevents accidental commits)
3. ✅ Updated `vite.config.ts` to support both `API_KEY` and `GEMINI_API_KEY`
4. ✅ Created `.env.example` template for other developers
5. ✅ Build tested successfully

### Current Configuration

**Location:** `Pdfslider/.env`

```env
API_KEY=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
```

### How It Works

The API key is loaded by Vite at build/dev time and made available as `process.env.API_KEY` in your code.

**In your code:** [services/geminiService.ts](services/geminiService.ts#L9-L12)
```typescript
const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("FATAL: API_KEY environment variable is not set.");
}
const ai = new GoogleGenAI({ apiKey: API_KEY });
```

### Running the Application

```bash
# Development mode
cd Pdfslider
npm run dev

# Production build
npm run build
npm run preview
```

The app will automatically load your API key from the `.env` file.

### Important Security Notes

⚠️ **CRITICAL SECURITY WARNINGS:**

1. **Never Commit `.env` File**
   - Your `.env` file is already in `.gitignore`
   - Never manually add it to git
   - If accidentally committed, revoke the key immediately

2. **API Key Exposure Risk**
   - Your API key is currently embedded in the frontend JavaScript bundle
   - Anyone can extract it from the browser DevTools or network inspector
   - This is a **MAJOR SECURITY RISK** for production use

3. **Production Deployment**
   - **DO NOT deploy with API key in frontend**
   - Move API calls to a backend server
   - Use environment variables on the server only
   - Implement rate limiting to prevent abuse

### Recommended Production Architecture

```
Frontend (React)
    ↓ HTTPS request
Backend API Server (Node.js/Python)
    ↓ API key stored securely
NVIDIA AI / Gemini API
```

**Example Backend (Node.js/Express):**
```javascript
// backend/server.js
const express = require('express');
const app = express();

// API key stored in server environment variables (not in frontend)
const API_KEY = process.env.API_KEY;

app.post('/api/analyze', async (req, res) => {
  const { text } = req.body;

  // Rate limiting
  // Authentication check
  // Input validation

  // Call AI API with server-side key
  const result = await callAIAPI(text, API_KEY);
  res.json(result);
});

app.listen(3001);
```

**Frontend calls backend instead:**
```typescript
// Frontend - no API key needed
const response = await fetch('https://your-domain.com/api/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ text: extractedText })
});
const aiResponse = await response.json();
```

### Switching API Providers

If you want to switch from NVIDIA to Google Gemini (or vice versa):

1. Get your new API key
2. Update `.env` file:
   ```env
   API_KEY=your_new_key_here
   ```
3. Restart the dev server: `npm run dev`

The code will automatically use the new key.

### Troubleshooting

**Problem:** "FATAL: API_KEY environment variable is not set"

**Solution:**
1. Check that `.env` file exists in `Pdfslider/` directory
2. Check that API_KEY is set in `.env`
3. Restart the dev server (`npm run dev`)
4. Clear browser cache and reload

**Problem:** API calls fail with 401 Unauthorized

**Solution:**
1. Verify your API key is valid at https://build.nvidia.com/
2. Check if the key has been revoked
3. Generate a new key if needed
4. Update `.env` and restart

**Problem:** API key visible in browser DevTools

**Solution:**
- This is expected behavior in development
- For production, implement backend API proxy
- Never deploy with API key in frontend code

### API Key Rotation

To rotate your API key:

1. Generate new key at https://build.nvidia.com/
2. Update `.env` with new key
3. Restart application
4. Revoke old key after confirming new one works

### Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `API_KEY` | NVIDIA AI or Gemini API key | Yes |

### Files Reference

- `.env` - Contains your actual API key (gitignored)
- `.env.example` - Template for other developers (committed to git)
- `vite.config.ts` - Loads environment variables at build time
- `services/geminiService.ts` - Uses the API key

### Next Steps

1. ✅ API key configured
2. Test the application: `npm run dev`
3. Upload a PDF and verify conversion works
4. For production: Implement backend API proxy

---

**Status:** ✅ Ready for Development
**Security:** ⚠️ Not Ready for Production (API key exposed in frontend)

---

*Last Updated: 2025-12-16*
