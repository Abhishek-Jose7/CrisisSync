# CrisisSync PWA Setup Guide

## Overview
CrisisSync is a Progressive Web App (PWA) that can be installed on your mobile device for quick access, just like a native app. Follow these instructions to install CrisisSync on your Android or iOS device.

## Android Setup

### Method 1: Chrome Browser (Recommended)
1. **Open CrisisSync** in Chrome browser on your Android device
2. **Look for the install prompt** - Chrome will show a banner at the bottom saying "Add CrisisSync to Home screen"
3. **Tap "Add"** on the prompt to install the app
4. **Alternative manual method:**
   - Tap the **three dots menu** (⋮) in the top-right corner
   - Select **"Add to Home screen"** or **"Install app"**
   - Tap **"Add"** or **"Install"**
5. The CrisisSync icon will appear on your home screen

### Method 2: Firefox Browser
1. Open CrisisSync in Firefox
2. Tap the **three dots menu** (⋮) 
3. Select **"Install"** or **"Add to Home screen"**
4. Confirm the installation

### Android Benefits
- Works offline (limited functionality)
- Fast startup from home screen
- No app store required
- Full screen experience
- Push notifications (when enabled)

## iOS Setup (iPhone/iPad)

### Method 1: Safari Browser (Recommended)
1. **Open CrisisSync** in Safari on your iOS device
2. **Tap the Share button** (square with arrow pointing up) at the bottom
3. **Scroll down** and find **"Add to Home Screen"**
4. **Tap "Add to Home Screen"**
5. **Customize the name** if desired (default is "CrisisSync")
6. **Tap "Add"** in the top-right corner
7. The CrisisSync icon will appear on your home screen

### Method 2: Alternative Safari Method
1. Open CrisisSync in Safari
2. Tap the **AA icon** in the address bar
3. Select **"Add to Home Screen"**
4. Follow steps 4-7 from Method 1

### iOS Limitations & Notes
- Full screen experience (no Safari bars when launched from home screen)
- Works offline with limited functionality
- No push notifications on iOS (Safari limitation)
- Must use Safari (Chrome/Firefox don't support PWA installation on iOS)

## Installation URLs

Use these URLs for each CrisisSync component:

### Main Website
```
https://crisis-sync-jovf.vercel.app
```

### Admin Portal
```
https://crisis-sync-jovf.vercel.app/admin
```

### Staff Portal  
```
https://crisis-sync-usof.vercel.app
```

### Guest Access
```
https://crisis-sync-vvh5.vercel.app
```

## After Installation

### First Launch
1. **Tap the CrisisSync icon** on your home screen
2. The app will launch in full screen mode
3. **Allow permissions** if prompted (camera for QR scanning, notifications, etc.)

### Updating the PWA
- PWAs update automatically when connected to internet
- To force update: Close the app completely and reopen it
- Or clear browser cache and revisit the website

### Uninstalling
- **Android:** Long-press the icon and select "Uninstall" or "Remove"
- **iOS:** Long-press the icon, tap "Remove App", then "Remove from Home Screen"

## Troubleshooting

### "Add to Home Screen" Not Working
- **iOS:** Ensure you're using Safari (not Chrome/Firefox)
- **Android:** Try clearing browser cache and restarting
- Check internet connection
- Make sure the website loads properly first

### App Not Working Offline
- Some features require internet connection
- Basic emergency information should be available offline
- Try refreshing when connected to internet

### Icon Not Appearing
- **iOS:** Check all home screen pages and app library
- **Android:** Check app drawer and all home screens
- Try installation again

## Role-Specific Setup

### For Admin Users
1. Install the main website PWA first
2. Access admin portal through the app
3. Bookmark admin login for quick access

### For Staff Members  
1. Install the staff portal PWA directly
2. Login credentials work the same as web
3. Demo mode available without login for testing

### For Guest Users
1. Install the guest access PWA
2. Use QR code scanner feature for zone access
3. No login required - scan and go

## Security Notes

- PWAs are as secure as the website they're installed from
- Use HTTPS connections (all CrisisSync URLs use HTTPS)
- Login credentials are encrypted and stored securely
- Regular browser security updates also protect PWAs

## Performance Tips

- **Storage:** PWAs typically use 10-50MB of device storage
- **Battery:** More efficient than keeping browser tabs open
- **Network:** Caches content for faster loading and offline use
- **Updates:** Happen automatically in background when connected

## Need Help?

If you encounter issues with PWA installation:
1. Check you're using a supported browser (Chrome/Android, Safari/iOS)
2. Ensure stable internet connection during installation
3. Try restarting your device and attempting installation again
4. Contact your system administrator for organization-specific setup help

---

**Last Updated:** April 2026  
**Version:** CrisisSync v1.0  
**Compatible:** Android 7+, iOS 11.3+
