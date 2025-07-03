# Netlify Setup Guide

This guide will help you set up Netlify for automatic PR preview deployments.

## Step 1: Create Netlify Account

1. Go to [netlify.com](https://netlify.com)
2. Sign up with your GitHub account (recommended)

## Step 2: Import Your Repository

1. Click "Add new site" → "Import an existing project"
2. Choose "Deploy with GitHub"
3. Authorize Netlify to access your GitHub account
4. Select the `twalichiewicz/blog` repository

## Step 3: Configure Build Settings

Netlify should auto-detect settings from `netlify.toml`, but verify:

- **Branch to deploy**: `main`
- **Build command**: `npm run build:prod`
- **Publish directory**: `public`
- **Node version**: Will use 18 from netlify.toml

Click "Deploy site"

## Step 4: Enable Deploy Previews

1. Go to Site settings → Build & deploy → Continuous Deployment
2. Under "Deploy contexts", ensure these are checked:
   - ✅ Production branch (main)
   - ✅ Deploy Previews (Pull requests)
   - ✅ Branch deploys (All)

## Step 5: Configure Deploy Notifications

1. Go to Site settings → Build & deploy → Deploy notifications
2. Add "GitHub pull request comment" 
3. Select "Deploy Preview succeeded"
4. This will auto-comment on PRs with preview URLs

## Step 6: Custom Domain (Optional)

If you want preview URLs like `pr-123.preview.thomas.design`:

1. Go to Domain settings
2. Add a custom domain
3. Configure DNS subdomain

## How It Works

### Creating a PR
1. Create a new branch: `git checkout -b feature/my-feature`
2. Make changes and push
3. Open PR on GitHub
4. Netlify automatically builds and comments with preview URL
5. URL will be like: `https://deploy-preview-123--thomas-design.netlify.app`

### Preview Features
- Exact production build (runs `npm run build:prod`)
- Isolated environment (no cache interference)
- Shareable URL for testing
- Automatic HTTPS
- Updates on every push to PR

### Debugging Deploys
- Check Netlify dashboard for build logs
- Common issues:
  - Node version mismatch (fixed by netlify.toml)
  - Missing dependencies (use `npm ci` not `npm install`)
  - Build memory issues (fixed by NODE_OPTIONS in netlify.toml)

## Environment Variables

If you need environment variables:

1. Go to Site settings → Environment variables
2. Add any needed variables
3. They'll be available during build

## Build Hooks (Optional)

To trigger rebuilds programmatically:

1. Go to Site settings → Build & deploy → Build hooks
2. Create a hook
3. Use the webhook URL to trigger builds

## Netlify CLI (Optional)

For local testing:

```bash
npm install -g netlify-cli
netlify login
netlify link
netlify dev  # Test locally with Netlify environment
```

## What's Included

The `netlify.toml` file configures:
- ✅ Node 18 LTS
- ✅ Increased memory for builds
- ✅ Security headers
- ✅ Cache control headers
- ✅ Lighthouse CI plugin for performance monitoring
- ✅ Asset optimization

## Testing Your Setup

1. Create a test PR with a small change
2. Wait for Netlify to comment with preview URL
3. Visit the URL and verify:
   - Site loads correctly
   - No cache issues
   - All features work
   - Console has no errors

## Troubleshooting

### Build Fails
- Check build log in Netlify dashboard
- Run `npm run build:prod` locally
- Ensure all dependencies are in package.json

### Preview URL Not Working
- Check deploy status in Netlify
- Verify build command in settings
- Check for console errors

### Slow Builds
- Normal for first build (caches dependencies)
- Subsequent builds are faster
- Consider build plugins for optimization

## Success! 🎉

Once set up, every PR will automatically get a preview URL that shows exactly what will deploy to production. No more surprises!