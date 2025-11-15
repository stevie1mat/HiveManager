# Quick Start Guide

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (will be installed globally or via npx)
- Expo Go app on your mobile device (for testing)

## Setup Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the Development Server**
   ```bash
   npm start
   ```

3. **Run on Your Device**
   - Scan the QR code with Expo Go (iOS) or the Expo app (Android)
   - Or press `i` for iOS simulator, `a` for Android emulator

## First Time Setup

1. The app will start with the Splash screen
2. Navigate to "Sign Up" to create a new account
3. Fill in your details (First Name, Last Name, Email, Password)
4. After registration, you'll be automatically logged in

## Testing the App

### Create Your First Hive
1. From the Dashboard, tap the "+" button or "Add New Hive"
2. Enter a Hive ID (e.g., "Hive-001")
3. Select Queen Status and Strength
4. Tap "Save Hive"

### Record an Inspection
1. Tap on a hive from the Dashboard
2. Tap "Start Inspection"
3. Fill in the inspection details
4. Tap "Done Inspection"

### Log Honey Harvest
1. Navigate to the "Honey Production" tab
2. Select a hive
3. Enter date and quantity
4. Tap "Save Harvest"

## Default Test Account

You can create a test account with:
- Email: `test@example.com`
- Password: `password123`

## Troubleshooting

### If the app doesn't start:
- Make sure all dependencies are installed: `npm install`
- Clear cache: `npm start -- --clear`
- Check Node.js version: `node --version` (should be 14+)

### If navigation doesn't work:
- Make sure you're using the latest version of React Navigation
- Check that all screen components are properly imported

### If data doesn't persist:
- AsyncStorage should work automatically
- On web, data is stored in localStorage
- On mobile, data persists between app restarts

## Next Steps

- Customize the UI colors and styling
- Add backend API integration
- Implement Google authentication
- Add push notifications
- Enhance with additional features

