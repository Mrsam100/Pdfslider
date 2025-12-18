# Setup Instructions

## API Key Configuration

**IMPORTANT:** You need to set up your API key before running the application.

### Steps:

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Get your API key from one of these providers:
   - **OpenRouter**: https://openrouter.ai/keys
   - **Google Gemini**: https://ai.google.dev/

3. Edit the `.env` file and replace `your_api_key_here` with your actual API key:
   ```env
   VITE_API_KEY=your_actual_api_key_here
   ```

4. Install dependencies and run:
   ```bash
   npm install
   npm run dev
   ```

### Security Notes

- Never commit the `.env` file to git (it's already in `.gitignore`)
- Never share your API key publicly
- For production deployment, use a backend server to proxy API requests
- Revoke and regenerate your API key if it's ever exposed

### Troubleshooting

If you see "API_KEY environment variable is not set":
1. Make sure `.env` file exists in the `Pdfslider/` directory
2. Make sure `VITE_API_KEY` is set in `.env`
3. Restart the dev server: `npm run dev`
4. Clear browser cache and reload
