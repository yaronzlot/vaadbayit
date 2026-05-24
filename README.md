# ועד הבית — Web App

אפליקציית React לניהול ועד בית, מותאמת לפריסה ב-GitHub Pages.

## 🚀 הפעלה מקומית

```bash
npm install
npm start
```

## 📦 פריסה ל-GitHub Pages

### שלב 1 — העלה ל-GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### שלב 2 — הגדר Secrets ב-GitHub

ב-Repository שלך: **Settings → Secrets and variables → Actions → New repository secret**

הוסף את הסיקרטים הבאים (הערכים מ-Firebase Console שלך):

| Secret Name | Value |
|---|---|
| `REACT_APP_FIREBASE_API_KEY` | `AIzaSy...` |
| `REACT_APP_FIREBASE_AUTH_DOMAIN` | `your-project.firebaseapp.com` |
| `REACT_APP_FIREBASE_PROJECT_ID` | `your-project-id` |
| `REACT_APP_FIREBASE_STORAGE_BUCKET` | `your-project.appspot.com` |
| `REACT_APP_FIREBASE_MESSAGING_SENDER_ID` | `123456789` |
| `REACT_APP_FIREBASE_APP_ID` | `1:123456789:web:abc123` |

### שלב 3 — הפעל GitHub Pages

ב-Repository שלך: **Settings → Pages**
- Source: **GitHub Actions**

### שלב 4 — Trigger הפריסה

כל push ל-`main` יפרוס אוטומטית. ניתן גם לפרוס ידנית:
**Actions → Deploy to GitHub Pages → Run workflow**

### שלב 5 — Firebase Auth Domain

ב-Firebase Console → Authentication → Settings → Authorized domains:
הוסף את הדומיין: `YOUR_USERNAME.github.io`

---

## 🔐 Firebase Rules

הוסף את ה-Rules הבאים ב-Firestore:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
      allow read: if request.auth != null && 
        resource.data.buildingId == get(/databases/$(database)/documents/users/$(request.auth.uid)).data.buildingId;
    }
    match /{collection}/{docId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## 📁 מבנה הפרויקט

```
src/
├── App.js                 # ניתוב ראשי
├── config/firebase.js     # הגדרות Firebase
├── context/AuthContext.js # ניהול משתמש
├── services/              # שירותי Firebase
├── components/UI.js       # קומפוננטים משותפים
├── theme/colors.js        # עיצוב
└── screens/
    ├── auth/              # כניסה / הרשמה
    ├── dashboard/         # דשבורד ראשי
    ├── payments/          # תשלומים
    ├── announcements/     # הודעות
    ├── maintenance/       # תחזוקה
    ├── vendors/           # ספקים
    ├── profile/           # פרופיל
    └── admin/             # ניהול (מנהל בלבד)
```
