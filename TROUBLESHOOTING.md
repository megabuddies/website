# Mega Buddies - 404 Error Troubleshooting Guide

## Problem
The URLs `/ai-companions` and `/telegram-bots` are returning 404 errors, even though the corresponding HTML files exist.

## Root Cause Analysis
The issue is likely related to URL rewriting configuration on the server. The website uses clean URLs (without .html extensions) but the server may not be properly configured to handle them.

## Solutions Applied

### 1. Improved .htaccess Configuration
- Enhanced URL rewriting rules for better compatibility
- Added specific fallback rules for main pages
- Added support for servers without mod_rewrite

### 2. PHP Router Fallback
- Created `router.php` as a backup solution
- Can be used if .htaccess rewriting doesn't work

### 3. Server Testing
- Created `test-server.html` to diagnose server configuration

## Possible Server Issues

### A. mod_rewrite Not Enabled
**Symptoms:** Clean URLs return 404 errors
**Solution:** Contact hosting provider to enable mod_rewrite

### B. .htaccess Not Allowed
**Symptoms:** All .htaccess rules ignored
**Solution:** Server admin needs to set `AllowOverride All` in Apache config

### C. File Permissions
**Symptoms:** Intermittent 404 errors
**Solution:** Ensure files have correct permissions (644 for files, 755 for directories)

## Quick Fixes to Try

### Option 1: Test Current Configuration
1. Upload all files to server
2. Visit `/test-server.html` to diagnose issues
3. Check if direct `.html` URLs work

### Option 2: Use PHP Router (if .htaccess fails)
1. Rename `index.html` to `index.php`
2. Add this to the top of `index.php`:
   ```php
   <?php include 'router.php'; ?>
   ```

### Option 3: Manual Redirects
If all else fails, create these files:

**ai-companions/index.html:**
```html
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="refresh" content="0; url=../ai-companions.html">
    <title>Redirecting...</title>
</head>
<body>
    <p>Redirecting to <a href="../ai-companions.html">AI Companions</a>...</p>
</body>
</html>
```

**telegram-bots/index.html:**
```html
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="refresh" content="0; url=../telegram-bots.html">
    <title>Redirecting...</title>
</head>
<body>
    <p>Redirecting to <a href="../telegram-bots.html">Telegram Bots</a>...</p>
</body>
</html>
```

## Verification Steps
1. Test direct HTML URLs: `/ai-companions.html`, `/telegram-bots.html`
2. Test clean URLs: `/ai-companions`, `/telegram-bots`
3. Check server error logs for specific error messages
4. Verify file permissions and server configuration

## Files Modified/Created
- `.htaccess` - Improved URL rewriting rules
- `router.php` - PHP fallback router
- `test-server.html` - Server configuration tester
- `.htaccess.backup` - Backup configuration
- `TROUBLESHOOTING.md` - This guide

## Contact Information
If issues persist, contact your hosting provider with these details:
- mod_rewrite needs to be enabled
- AllowOverride All needs to be set for the domain
- File permissions should be 644 for files, 755 for directories