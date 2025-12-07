# 🚀 Firebase Quick Start Guide

Get Firebase running in 5 minutes!

## Step 1: Get Firebase Credentials (2 minutes)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create/select project
3. Click Web icon (`</>`) → Register app
4. Copy the config values

## Step 2: Update Environment Variables (1 minute)

Edit `.env` file in project root:

```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## Step 3: Enable Firebase Services (2 minutes)

In Firebase Console:

1. **Authentication** → Sign-in method → Enable Email/Password
2. **Firestore Database** → Create database → Start in test mode
3. **Storage** → Get started → Start in test mode

## Step 4: Restart Server

```bash
npm start
```

## ✅ You're Ready!

### Quick Test

```javascript
import { submitContactForm } from './firebase';

// Test it
submitContactForm({
  name: 'Test',
  email: 'test@example.com',
  message: 'Hello!'
}).then(id => console.log('Success!', id));
```

---

## 📚 Common Use Cases

### 1. Contact Form
```javascript
import { submitContactForm } from './firebase';

await submitContactForm({ name, email, message });
```

### 2. Get Portfolio Items
```javascript
import { getWorkItems } from './firebase';

const items = await getWorkItems();
```

### 3. Upload Image
```javascript
import { uploadPortfolioImage } from './firebase';

const url = await uploadPortfolioImage(file);
```

### 4. User Sign In
```javascript
import { signIn } from './firebase';

const user = await signIn(email, password);
```

---

## 🔗 Full Documentation

- **Complete Setup**: See `FIREBASE_SETUP.md` in project root
- **API Reference**: See `README.md` in this directory
- **Examples**: Check `examples/` folder

---

## ⚠️ Before Production

1. Update security rules in Firebase Console
2. Change from "test mode" to production rules
3. Enable billing in Firebase
4. Test thoroughly!

---

Need help? Check `FIREBASE_SETUP.md` for detailed instructions!

