# MSS Frontend - Marketing & Social Media Agency Website

A modern, responsive React website for MSS (Marketing & Social Media Services) agency with Firebase backend integration.

## 🚀 Features

- **Modern UI/UX** - Beautiful, responsive design that works on all devices
- **Firebase Backend** - Complete backend integration with Firestore, Authentication, and Storage
- **Dynamic Content** - Portfolio, team members, testimonials, and blog posts from database
- **Contact Forms** - Direct submissions to Firebase database
- **Image Uploads** - File storage with progress tracking
- **User Authentication** - Secure login and user management
- **Animations** - Smooth animations with Framer Motion and GSAP
- **Responsive Design** - Optimized for all screen sizes

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Firebase Setup](#firebase-setup)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Technologies Used](#technologies-used)
- [Documentation](#documentation)

## ⚡ Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Firebase (Required)

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Get your Firebase credentials
3. Create a `.env` file in the project root:

```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

4. Enable Firebase services (Authentication, Firestore, Storage)

**📚 See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for detailed instructions**

### 3. Start Development Server

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## 🔥 Firebase Setup

Firebase is integrated as the backend for this project. You need to set it up to use features like:

- Contact form submissions
- Dynamic portfolio/work items
- Blog posts
- Team member management
- Image uploads
- User authentication

### Quick Firebase Setup (5 minutes)

1. **Get Credentials**: [Firebase Console](https://console.firebase.google.com/) → Create Project → Add Web App
2. **Update .env**: Copy credentials to `.env` file
3. **Enable Services**: Enable Authentication, Firestore, and Storage in Firebase Console
4. **Restart Server**: `npm start`

**📚 Complete Guide**: [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)  
**📚 Quick Reference**: [src/firebase/QUICK_START.md](./src/firebase/QUICK_START.md)  
**📚 API Documentation**: [src/firebase/README.md](./src/firebase/README.md)

## 📁 Project Structure

```
Mss-Frontend/
├── public/                      # Static files
├── src/
│   ├── firebase/                # 🔥 Firebase backend services
│   │   ├── config.js            # Firebase initialization
│   │   ├── auth.js              # Authentication
│   │   ├── firestore.js         # Database operations
│   │   ├── storage.js           # File storage
│   │   ├── index.js             # Main exports
│   │   ├── TestFirebase.js      # Test component
│   │   ├── examples/            # Example components
│   │   └── README.md            # Firebase API docs
│   │
│   ├── features/                # Feature modules
│   │   ├── hero/                # Hero section
│   │   ├── about/               # About & Team
│   │   ├── services/            # Services section
│   │   ├── work/                # Portfolio/Work
│   │   ├── clients/             # Client logos
│   │   ├── contact/             # Contact form
│   │   ├── team/                # Team members
│   │   └── home/                # Home page galleries
│   │
│   ├── shared/                  # Shared components
│   │   ├── components/          # Reusable components
│   │   ├── styles/              # Global styles
│   │   └── utils/               # Utility functions
│   │
│   ├── assets/                  # Images & videos
│   ├── App.js                   # Main app component
│   └── index.js                 # Entry point
│
├── .env                         # Firebase credentials (DO NOT COMMIT!)
├── .gitignore                   # Git ignore rules
├── package.json                 # Dependencies
├── README.md                    # This file
├── FIREBASE_SETUP.md            # Firebase setup guide
└── FIREBASE_INTEGRATION_SUMMARY.md  # Integration summary
```

## 📜 Available Scripts

### `npm start`
Runs the app in development mode.  
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm test`
Launches the test runner in interactive watch mode.

### `npm run build`
Builds the app for production to the `build` folder.  
Optimizes the build for best performance.

### `npm run eject`
**Note: this is a one-way operation. Once you eject, you can't go back!**

## 🛠 Technologies Used

### Frontend
- **React** (v19.2.0) - UI library
- **React Router** (v6.30.1) - Routing
- **Framer Motion** (v12.23.24) - Animations
- **GSAP** (v3.13.0) - Advanced animations
- **React Bootstrap** (v2.10.10) - UI components
- **React Icons** (v5.5.0) - Icon library
- **React Player** (v3.3.3) - Video player

### Backend
- **Firebase** (v12.6.0)
  - Authentication - User management
  - Firestore - NoSQL database
  - Storage - File storage
  - Analytics - Usage tracking

### Development
- **React Scripts** (v5.0.1) - Build tooling
- **Testing Library** - Testing utilities

## 📚 Documentation

### Firebase Documentation
- **[FIREBASE_SETUP.md](./FIREBASE_SETUP.md)** - Complete setup guide with step-by-step instructions
- **[FIREBASE_INTEGRATION_SUMMARY.md](./FIREBASE_INTEGRATION_SUMMARY.md)** - Integration overview and checklist
- **[src/firebase/README.md](./src/firebase/README.md)** - API reference and usage examples
- **[src/firebase/QUICK_START.md](./src/firebase/QUICK_START.md)** - 5-minute quick start guide

### Example Components
- **ContactFormExample.js** - Contact form with Firebase
- **PortfolioExample.js** - Dynamic portfolio display
- **ImageUploadExample.js** - Image upload with progress
- **AuthExample.js** - User authentication
- **TestFirebase.js** - Test Firebase connection

## 🔧 Firebase Services

### Authentication
```javascript
import { signIn, signUp, logOut } from './firebase';

// Sign up new user
await signUp(email, password, displayName);

// Sign in existing user
await signIn(email, password);

// Sign out
await logOut();
```

### Database (Firestore)
```javascript
import { submitContactForm, getWorkItems } from './firebase';

// Submit contact form
await submitContactForm({ name, email, message });

// Get portfolio items
const works = await getWorkItems();
```

### Storage
```javascript
import { uploadPortfolioImage } from './firebase';

// Upload image
const url = await uploadPortfolioImage(file);
```

## 🧪 Testing Firebase Integration

1. Import the test component in `src/App.js`:
```javascript
import TestFirebase from './firebase/TestFirebase';
```

2. Add it to your component tree:
```javascript
<TestFirebase />
```

3. Visit your app and click "Test Firebase Connection"

4. Remove the component once Firebase is confirmed working

## 🔒 Security

- **Never commit `.env` file** - Contains sensitive credentials
- **Update security rules** - Before deploying to production
- **Enable billing** - Required for production Firebase apps
- **Monitor usage** - Set up alerts in Firebase Console

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

### Deploy to Firebase Hosting (Optional)

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase Hosting
firebase init hosting

# Deploy
firebase deploy
```

## 📊 Firebase Usage Limits (Free Tier)

- **Firestore**: 50K reads/day, 20K writes/day, 1GB storage
- **Storage**: 1GB storage, 10GB/month download
- **Authentication**: Unlimited users

Monitor usage in Firebase Console → Usage tab

## ⚠️ Before Production Checklist

- [ ] Update Firebase security rules
- [ ] Change from test mode to production mode
- [ ] Enable billing in Firebase Console
- [ ] Set up usage alerts
- [ ] Test all features thoroughly
- [ ] Optimize images and assets
- [ ] Enable Firebase App Check (optional)
- [ ] Set up backup strategy

## 🆘 Troubleshooting

### Firebase Connection Issues
- Verify `.env` file has correct credentials
- Restart development server after updating `.env`
- Check Firebase Console for enabled services

### Build Errors
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear cache: `npm cache clean --force`

### Permission Errors
- Update Firestore security rules in Firebase Console
- Verify authentication is working

## 📞 Support

For questions or issues:
1. Check the documentation files listed above
2. Review example components in `src/firebase/examples/`
3. Consult [Firebase Documentation](https://firebase.google.com/docs)

## 📄 License

This project is private and proprietary.

---

## 🎯 Next Steps

1. ✅ Complete Firebase setup (see [FIREBASE_SETUP.md](./FIREBASE_SETUP.md))
2. 🔧 Integrate Firebase with your components
3. 🧪 Test all functionality
4. 🎨 Customize design and content
5. 🚀 Deploy to production

---

**Built with ❤️ by MSS Team**

