# Deployment Guide

This guide covers the deployment process for the thomas.design blog, including CI/CD pipeline, manual deployment, and troubleshooting.

## Table of Contents

1. [Overview](#overview)
2. [Automated Deployment (CI/CD)](#automated-deployment-cicd)
3. [Manual Deployment](#manual-deployment)
4. [Environment Configuration](#environment-configuration)
5. [GitHub Pages Setup](#github-pages-setup)
6. [Custom Domain Configuration](#custom-domain-configuration)
7. [Deployment Checklist](#deployment-checklist)
8. [Monitoring & Maintenance](#monitoring--maintenance)
9. [Rollback Procedures](#rollback-procedures)
10. [Troubleshooting](#troubleshooting)

## Overview

The blog uses a GitHub Actions-based CI/CD pipeline for automated deployment to GitHub Pages. Every push to the `main` branch triggers a build and deployment process.

### Deployment Architecture

```
Developer Push → GitHub → GitHub Actions → Build → Optimize → Deploy → GitHub Pages
                                ↓
                        Pull Request Preview
```

### Key Features

- **Automated builds** on push to main
- **Image optimization** before deployment
- **Build size analysis**
- **Zero-downtime deployments**
- **Custom domain support**

## Automated Deployment (CI/CD)

### GitHub Actions Workflow

The deployment pipeline is defined in `.github/workflows/optimize-and-deploy.yml`:

```yaml
name: Optimize and Deploy

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  optimize-and-deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: write
      pages: write
      id-token: write
```

### Pipeline Stages

1. **Checkout Code**
   ```yaml
   - uses: actions/checkout@v4
   ```

2. **Setup Environment**
   ```yaml
   - uses: actions/setup-node@v4
     with:
       node-version: '18'
       cache: 'npm'
   ```

3. **Install Dependencies**
   ```yaml
   - run: npm ci
   ```

4. **Optimize Images**
   ```yaml
   - run: npm run optimize:images
   ```

5. **Build Production**
   ```yaml
   - run: npm run build:prod
   ```

6. **Analyze Build**
   ```yaml
   - run: |
       echo "Build size analysis:"
       npm run analyze
   ```

7. **Deploy to GitHub Pages**
   ```yaml
   - uses: peaceiris/actions-gh-pages@v3
     with:
       github_token: ${{ secrets.GITHUB_TOKEN }}
       publish_dir: ./public
       cname: thomas.design
   ```

### Pull Request Previews

PRs create deployment status checks but don't deploy:

```yaml
- name: Create deployment status for PR
  if: github.event_name == 'pull_request'
  uses: actions/github-script@v7
```

## Manual Deployment

### Local Build & Deploy

```bash
# 1. Clean previous build
npm run clean

# 2. Build with optimizations
npm run build:prod

# 3. Deploy to GitHub Pages
npm run deploy
```

### Direct GitHub Pages Deploy

```bash
# Using hexo-deployer-git
hexo deploy

# Or manually
cd public
git init
git add -A
git commit -m 'Deploy'
git push -f git@github.com:twalichiewicz/twalichiewicz.github.io.git main
```

### Emergency Deploy

```bash
# Quick deploy without optimization
hexo clean && hexo generate && hexo deploy
```

## Environment Configuration

### Production Settings

`_config.yml`:
```yaml
# URL configuration
url: https://thomas.design
root: /

# Deployment
deploy:
  type: git
  repo: git@github.com:twalichiewicz/twalichiewicz.github.io.git
  branch: main
```

### Environment Variables

GitHub Actions automatically provides:
- `GITHUB_TOKEN`: Authentication
- `GITHUB_REPOSITORY`: Repo name
- `GITHUB_SHA`: Commit SHA
- `GITHUB_REF`: Branch/tag ref

### Build Configuration

```yaml
# Production optimizations
minify:
  enable: true
  preview: false
  
lazyload:
  enable: true
  
post_asset_folder: true
```

## GitHub Pages Setup

### Repository Settings

1. Go to **Settings → Pages**
2. **Source**: Deploy from a branch
3. **Branch**: `gh-pages` (created by Actions)
4. **Folder**: `/ (root)`

### Enable GitHub Pages

```bash
# Via GitHub CLI
gh repo edit --enable-pages
```

### Pages Configuration

- **Custom domain**: thomas.design
- **Enforce HTTPS**: ✓ Enabled
- **Visibility**: Public

## Custom Domain Configuration

### DNS Setup

1. **Add CNAME file** to `source/`:
   ```
   thomas.design
   ```

2. **Configure DNS records**:
   ```
   Type    Name    Value
   CNAME   @       twalichiewicz.github.io
   CNAME   www     twalichiewicz.github.io
   ```

3. **Alternative A records**:
   ```
   A       @       185.199.108.153
   A       @       185.199.109.153
   A       @       185.199.110.153
   A       @       185.199.111.153
   ```

### SSL/TLS

GitHub Pages automatically provisions Let's Encrypt certificates:
- Wait 24-48 hours after DNS setup
- Check status in repository settings
- Force HTTPS when available

## Deployment Checklist

### Pre-Deployment

- [ ] All changes committed
- [ ] Tests passing (if applicable)
- [ ] Images optimized
- [ ] SCSS compiled without errors
- [ ] No console errors locally
- [ ] Version bumped (if needed)

### Deployment Steps

1. **Merge to main**:
   ```bash
   git checkout main
   git merge feature/branch
   git push origin main
   ```

2. **Monitor Actions**:
   - Go to Actions tab
   - Watch "Optimize and Deploy"
   - Check for errors

3. **Verify Deployment**:
   - Visit [thomas.design](https://thomas.design)
   - Check latest changes
   - Test critical paths

### Post-Deployment

- [ ] Verify site loads
- [ ] Check latest content
- [ ] Test navigation
- [ ] Verify assets load
- [ ] Check console for errors
- [ ] Monitor analytics

## Monitoring & Maintenance

### Health Checks

```bash
# Check site status
curl -I https://thomas.design

# Verify deployment
curl https://thomas.design | grep "latest-post-title"
```

### GitHub Actions Monitoring

1. **Actions Tab**: View run history
2. **Email Notifications**: Configure in settings
3. **Status Badge**:
   ```markdown
   ![Deploy Status](https://github.com/twalichiewicz/blog/workflows/Optimize%20and%20Deploy/badge.svg)
   ```

### Performance Monitoring

- **PageSpeed Insights**: Regular checks
- **Lighthouse CI**: Automated in PR
- **Build Size**: Track over time

## Rollback Procedures

### Quick Rollback

```bash
# Revert last commit
git revert HEAD
git push origin main

# Or reset to specific commit
git reset --hard <commit-sha>
git push --force origin main
```

### Manual Rollback

1. **Download previous build**:
   ```bash
   # From GitHub Pages branch
   git clone -b gh-pages https://github.com/twalichiewicz/twalichiewicz.github.io.git old-build
   ```

2. **Deploy old version**:
   ```bash
   cd old-build
   git push origin gh-pages:gh-pages
   ```

### Deployment History

View deployment history:
```bash
# GitHub CLI
gh run list --workflow=optimize-and-deploy.yml
```

## Troubleshooting

### Build Failures

**Problem**: Action fails during build
```bash
# Check logs
gh run view

# Common fixes:
npm ci                    # Clean install
hexo clean               # Clear cache
rm -rf node_modules      # Reset deps
```

**Problem**: Out of memory
```yaml
# Increase Node memory
env:
  NODE_OPTIONS: --max_old_space_size=4096
```

### Deployment Failures

**Problem**: Permission denied
```bash
# Check token permissions
# Settings → Actions → General → Workflow permissions
# Enable "Read and write permissions"
```

**Problem**: GitHub Pages not updating
```bash
# Force refresh
git commit --allow-empty -m "Trigger rebuild"
git push
```

### Domain Issues

**Problem**: Custom domain not working
1. Check DNS propagation: `dig thomas.design`
2. Verify CNAME file exists
3. Check GitHub Pages settings
4. Wait for SSL certificate

**Problem**: SSL certificate error
- Wait 24-48 hours
- Check domain configuration
- Contact GitHub Support

### Performance Issues

**Problem**: Slow deployment
```bash
# Optimize images locally first
npm run optimize:images
git add .
git commit -m "Pre-optimize images"
```

**Problem**: Large build size
```bash
# Analyze and fix
npm run analyze
# Check for large files
find public -size +1M -type f
```

## Advanced Configuration

### Staging Environment

Create a staging branch:
```yaml
# .github/workflows/staging.yml
on:
  push:
    branches: [ staging ]

# Deploy to different domain
```

### Deployment Secrets

```bash
# Add secrets via GitHub CLI
gh secret set DEPLOY_KEY < ~/.ssh/deploy_key
```

### Custom Deployment Script

```javascript
// scripts/deploy.js
const { execSync } = require('child_process');

function deploy() {
  console.log('🚀 Starting deployment...');
  
  try {
    execSync('npm run build:prod', { stdio: 'inherit' });
    execSync('hexo deploy', { stdio: 'inherit' });
    console.log('✅ Deployment successful!');
  } catch (error) {
    console.error('❌ Deployment failed:', error);
    process.exit(1);
  }
}

deploy();
```

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Hexo Deployment](https://hexo.io/docs/deployment)
- [peaceiris/actions-gh-pages](https://github.com/peaceiris/actions-gh-pages)

---

*For development setup, see [DEVELOPMENT.md](./DEVELOPMENT.md)*  
*For performance optimization, see [PERFORMANCE.md](./PERFORMANCE.md)*