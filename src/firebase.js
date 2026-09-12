import { initializeApp } from "firebase/app";

import {
  initializeAppCheck,
  ReCaptchaEnterpriseProvider,
} from "firebase/app-check";

import {
  getAuth,
} from "firebase/auth";

import {
  getFirestore,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAhTCOFjNIy10DtIdsepsO9ab2esNt5XQ4",
  authDomain:
    "saleha-portfolio-71a0a.firebaseapp.com",
  projectId:
    "saleha-portfolio-71a0a",
  storageBucket:
    "saleha-portfolio-71a0a.firebasestorage.app",
  messagingSenderId:
    "281724988925",
  appId:
    "1:281724988925:web:7b9cae4d2752571ebe3d94",
};

const app =
  initializeApp(firebaseConfig);

/*
 * Local development App Check debug mode.
 */
if (import.meta.env.DEV) {
  self.FIREBASE_APPCHECK_DEBUG_TOKEN =
    true;
}

const recaptchaSiteKey =
  import.meta.env
    .VITE_RECAPTCHA_ENTERPRISE_SITE_KEY;

if (!recaptchaSiteKey) {
  console.error(
    "Missing VITE_RECAPTCHA_ENTERPRISE_SITE_KEY in .env"
  );
}

export const appCheck =
  initializeAppCheck(app, {
    provider:
      new ReCaptchaEnterpriseProvider(
        recaptchaSiteKey
      ),
    isTokenAutoRefreshEnabled:
      true,
  });

export const auth =
  getAuth(app);

export const db =
  getFirestore(app);

export default app;