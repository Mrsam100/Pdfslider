# Deploying PDFSlider to Vercel

This guide will help you deploy your PDFSlider application to Vercel.

## Prerequisites

1. A [Vercel account](https://vercel.com/signup) (free tier works great)
2. A [Google Gemini API Key](https://makersuite.google.com/app/apikey)
3. Your code pushed to a Git repository (GitHub, GitLab, or Bitbucket)

## Step-by-Step Deployment

### 1. Prepare Your Repository

Make sure your code is pushed to a Git repository:

```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### 2. Import Project to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"**
3. Select **"Import Git Repository"**
4. Choose your PDFSlider repository
5. Click **"Import"**

### 3. Configure Build Settings

Vercel should auto-detect the Vite framework. Verify these settings:

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

These are already configured in `vercel.json`, so you don't need to change anything.

### 4. Add Environment Variables

**CRITICAL**: You must add your Gemini API key as an environment variable.

In the Vercel project settings:

1. Go to **Settings** → **Environment Variables**
2. Add the following variable:

   | Name | Value |
   |------|-------|
   | `VITE_GEMINI_API_KEY` | Your actual Gemini API key |

3. Click **"Save"**

**Optional environment variables** (you can use defaults):
- `VITE_API_ENDPOINT`
- `VITE_APP_NAME`
- `VITE_ENABLE_ANALYTICS`
- `VITE_MAX_FILE_SIZE`

See `.env.example` for all available options.

### 5. Deploy

1. Click **"Deploy"**
2. Wait for the build to complete (usually 1-2 minutes)
3. Your app will be live at `https://your-project-name.vercel.app`

## After Deployment

### Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Follow Vercel's DNS configuration instructions

### Monitor Your App

- **Deployments**: View deployment history and logs
- **Analytics**: Track visitor metrics (upgrade required)
- **Logs**: Debug issues in real-time

## Environment Variables Reference

### Required

- **VITE_GEMINI_API_KEY**: Your Google Gemini API key

### Optional

See `.env.example` for a complete list of optional environment variables.

## Troubleshooting

### Build Fails

1. Check the build logs in Vercel
2. Verify all dependencies are in `package.json`
3. Make sure your code builds locally: `npm run build`

### API Key Not Working

1. Verify the environment variable name is exactly `VITE_GEMINI_API_KEY`
2. Check the key is valid at [Google AI Studio](https://makersuite.google.com/app/apikey)
3. Redeploy after adding environment variables

### 404 Errors on Routes

- The `vercel.json` rewrites configuration should handle this
- Make sure `vercel.json` is in your repository

## Automatic Deployments

Vercel automatically deploys:
- **Production**: Every push to `main` branch
- **Preview**: Every pull request

## Local Development

To run locally with production environment variables:

```bash
# Copy environment template
cp .env.example .env

# Edit .env and add your API key
# Then run dev server
npm run dev
```

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html#vercel)
- [Google Gemini API Docs](https://ai.google.dev/docs)

---

**Your app is now live! 🎉**

Visit your deployment URL and start converting PDFs to PowerPoint presentations!
