# Demo Feature Flag

Interactive demos are feature-flagged to control their visibility.

## Quick Reference

**Production:** Demos disabled (shows cover images)  
**Local Dev:** Use `npm run server:demos` to enable

## Enabling in Production

Update `_config.yml`:
```yaml
feature_flags:
  demos_enabled: true
```