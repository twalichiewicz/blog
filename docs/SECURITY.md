# Security Policy

## Overview

This document outlines the security measures, best practices, and policies for the thomas.design blog.

## Security Features

### 1. Transport Security
- **HTTPS Enforced**: All traffic is served over HTTPS via GitHub Pages
- **HSTS Header**: Strict-Transport-Security with preload enabled
- **Custom Domain**: SSL certificate automatically provisioned by GitHub

### 2. Content Security
- **Static Site**: No server-side code execution
- **No User Input**: No forms, comments, or user-generated content
- **Content Security Policy**: Restrictive CSP headers implemented

### 3. Security Headers
Implemented in `source/_headers`:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- `Content-Security-Policy` with restricted sources

### 4. Client-Side Security
- **External Links**: Automatic `rel="noopener noreferrer"`
- **SRI Hashes**: Subresource Integrity on CDN resources
- **No Inline Event Handlers**: Event listeners added via JavaScript

## Environment Variables

### Secure Configuration
Never commit sensitive data to version control:
- API keys
- Admin credentials
- Secret tokens
- Private configuration

### Using .env Files
1. Copy `.env.example` to `.env`
2. Add your actual values
3. Never commit `.env` to Git
4. Use environment variables in CI/CD

Example:
```bash
# .env.example
FIGMA_API_KEY=your_figma_api_key_here
ADMIN_SECRET=your_secure_random_secret
```

## Dependencies

### Managing Vulnerabilities
1. **Regular Updates**: Run `npm audit` monthly
2. **Automated Scanning**: Dependabot enabled on GitHub
3. **Manual Review**: Check for security advisories

### Current Status
Run `npm audit` to check for vulnerabilities:
```bash
npm audit
npm audit fix  # For automatic fixes
```

## Build Pipeline Security

### GitHub Actions
Permissions are restricted to minimum required:
```yaml
permissions:
  contents: write      # For deployment only
  pages: write        # For GitHub Pages
  id-token: write     # For OIDC
  deployments: write  # For deployment status
  pull-requests: write # For PR comments
```

### Secrets Management
- Use GitHub Secrets for sensitive values
- Never log secrets in workflows
- Rotate secrets regularly

## Content Security Policy

Current CSP configuration:
```
default-src 'self';
script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://unpkg.com;
style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net;
img-src 'self' data: https:;
font-src 'self' https://cdn.jsdelivr.net;
connect-src 'self' https:;
media-src 'self';
object-src 'none';
frame-ancestors 'none';
```

### Improvements Needed
- Remove `'unsafe-inline'` for scripts
- Remove `'unsafe-eval'`
- Implement nonce-based inline scripts

## Best Practices

### For Contributors
1. **Never commit secrets**: Check files before committing
2. **Use .gitignore**: Ensure sensitive files are excluded
3. **Review dependencies**: Check licenses and security
4. **Test locally**: Ensure no sensitive data in output

### For Maintainers
1. **Rotate secrets**: Change API keys periodically
2. **Monitor security alerts**: GitHub security tab
3. **Update dependencies**: Keep packages current
4. **Review PRs carefully**: Check for security issues

## Incident Response

### If a Secret is Exposed
1. **Immediate Actions**:
   - Revoke the exposed credential
   - Generate new credential
   - Update all systems using it

2. **Git History Cleanup**:
   ```bash
   # Remove file from history
   git filter-branch --tree-filter 'rm -f path/to/file' HEAD
   git push --force
   ```

3. **Notification**:
   - Notify affected users if applicable
   - Document incident
   - Review prevention measures

### Security Vulnerabilities
If you discover a security vulnerability:
1. **Do not** create a public issue
2. Email security concerns to [contact email]
3. Include:
   - Description of vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

## Regular Security Tasks

### Monthly
- [ ] Run `npm audit`
- [ ] Review dependency updates
- [ ] Check for exposed secrets
- [ ] Review security headers

### Quarterly
- [ ] Rotate API keys
- [ ] Review GitHub Actions permissions
- [ ] Update security documentation
- [ ] Test CSP configuration

### Annually
- [ ] Full security audit
- [ ] Penetration testing (if applicable)
- [ ] Review all access permissions
- [ ] Update incident response plan

## Tools & Resources

### Security Testing
- **Observatory**: https://observatory.mozilla.org
- **Security Headers**: https://securityheaders.com
- **SSL Labs**: https://www.ssllabs.com/ssltest/

### Dependency Scanning
- **npm audit**: Built-in vulnerability scanner
- **Snyk**: https://snyk.io
- **GitHub Security**: Dependabot alerts

### CSP Testing
- **CSP Evaluator**: https://csp-evaluator.withgoogle.com
- **Report URI**: https://report-uri.com

## Compliance

### GDPR Considerations
- No personal data collection
- No cookies (except functional)
- No analytics tracking personal data
- Clear privacy policy (if needed)

### Accessibility
- WCAG 2.1 AA compliance target
- Keyboard navigation support
- Screen reader compatibility
- Color contrast requirements

## Contact

For security concerns, please contact:
- GitHub Issues (for non-sensitive issues)
- Email: [security contact email]

---

*Last updated: June 2025*