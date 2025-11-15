# HiveManager

A React Native application for beehive management that helps beekeepers track their hives, inspections, and honey production.

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
- **AsyncStorage** for data persistence
- **Expo Linear Gradient** for beautiful UI gradients
- **Expo Vector Icons** for icons

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

The app uses AsyncStorage to persist data locally:
- User authentication data
- Hive information
- Inspection records
- Honey harvest logs

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

- The app currently uses mock authentication (stored locally)
- Google login buttons are placeholders and would need OAuth implementation
- Date pickers use text input format (YYYY-MM-DD) - can be enhanced with native date pickers
- All data is stored locally using AsyncStorage

## License

This project is created for educational purposes.

