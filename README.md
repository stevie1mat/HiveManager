# HiveManager

A React Native application for beehive management that helps beekeepers track their hives, inspections, and honey production.

![HiveManager Screenshot](assets/screenshot.png)

## ☕ Support

If you find this project helpful, consider supporting the development:

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/steviemathew)

## Features

### Authentication
- **Splash Screen**: Beautiful introductory screen with app logo and tagline
- **Login**: Email/password authentication with "Forgot Password" and Google login options
- **Registration**: New user registration with first name, last name, email, and password

### Main Application
- **Dashboard (My Hives)**: 
  - View all beehives with ID, queen status, strength, and last inspection date
  - Add new hives
  - Quick access to hive details
  
- **Hive Details Screen**:
  - Detailed hive information
  - Health status and queen status
  - Past inspections list
  - Start new inspection button

- **New Inspection Screen**:
  - Record inspection date
  - Track general health, queen status, temperament
  - Note swarm cells and diseases
  - Add inspection notes

- **Honey Production**:
  - Log honey harvests for specific hives
  - Track quantity and unit (lbs/kg)
  - View recent harvest history

- **Settings**:
  - User profile display
  - Account settings
  - Notifications
  - Support and Privacy Policy
  - Log out functionality

## Tech Stack

- **React Native** with Expo
- **React Navigation** for navigation
- **Context API** for state management
- **Supabase** for backend (authentication, database, real-time)
- **Expo Linear Gradient** for beautiful UI gradients
- **Expo Vector Icons** for icons
- **Urbanist** font for headings
- **IBM Plex Sans** font for body text

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the Expo development server:
```bash
npm start
```

3. Run on iOS:
```bash
npm run ios
```

4. Run on Android:
```bash
npm run android
```

## Project Structure

```
├── App.js                 # Main app entry point
├── src/
│   ├── config/           # Configuration files
│   │   └── supabase.js  # Supabase client configuration
│   ├── constants/        # Constants and utilities
│   │   └── fonts.js     # Font family constants
│   ├── context/          # Context providers for state management
│   │   ├── AuthContext.js
│   │   └── HiveContext.js
│   ├── navigation/       # Navigation configuration
│   │   ├── AppNavigator.js
│   │   ├── AuthNavigator.js
│   │   └── MainNavigator.js
│   └── screens/          # Screen components
│       ├── auth/
│       │   ├── SplashScreen.js
│       │   ├── LoginScreen.js
│       │   └── RegisterScreen.js
│       └── main/
│           ├── DashboardScreen.js
│           ├── HiveDetailsScreen.js
│           ├── NewInspectionScreen.js
│           ├── HoneyProductionScreen.js
│           ├── SettingsScreen.js
│           └── AddHiveScreen.js
└── package.json
```

## Data Persistence

The app uses Supabase for data persistence:
- User authentication (managed by Supabase Auth)
- Hive information (stored in Supabase database)
- Inspection records (stored in Supabase database)
- Honey harvest logs (stored in Supabase database)

All data is synced with Supabase backend and accessible across devices.

## Form Validation

All forms include basic validation:
- Required field checks
- Email format validation
- Password length requirements
- Password confirmation matching
- Numeric validation for quantities

## Future Enhancements

- Backend API integration
- Google authentication implementation
- Push notifications
- Data export functionality
- Advanced analytics and reporting
- Photo attachments for inspections
- Weather integration
- Reminder notifications for inspections

## Notes

- The app uses Supabase for authentication and data storage
- Google login buttons are placeholders and would need OAuth implementation
- Date pickers use text input format (YYYY-MM-DD) - can be enhanced with native date pickers
- All data is stored in Supabase PostgreSQL database with Row Level Security
- See `SUPABASE_SETUP.md` for database setup instructions

## License

This project is created for educational purposes.

