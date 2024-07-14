"use client";
import { ReactNode } from "react";
import { initializeApp, FirebaseOptions, getApp } from "firebase/app";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";

type Props = {
  children: ReactNode;
};
// Firestoreはログインやユーザー登録の実装には使わないが、今後のことを考えて入れておく
import {
  browserLocalPersistence,
  connectAuthEmulator,
  getAuth,
} from "firebase/auth";

// .envファイルで設定した環境変数をfirebaseConfigに入れる
const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

export default function FirebaseInitialize(props: Props) {
  try {
    initializeApp(firebaseConfig);
  } catch (error) {
    console.log(error);
  }

  const auth = getAuth();
  // auth.setPersistence(browserLocalPersistence);
  const functions = getFunctions();
  const firestore = getFirestore();

  functions.region = "asia-northeast1";

  if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR) {
    setupEmulators({ auth, functions, firestore });
  }

  return props.children;
}

async function setupEmulators({
  auth,
  functions,
  firestore,
}: {
  auth: ReturnType<typeof getAuth>;
  functions: ReturnType<typeof getFunctions>;
  firestore: ReturnType<typeof getFirestore>;
}) {
  // Firebase: Error (auth/emulator-config-failed). を避けるため、事前にauthUrlをfetchしておく
  // https://dev.to/ilumin/fix-firebase-error-authemulator-config-failed-mng
  const authUrl = "http://127.0.0.1:9099";
  await fetch(authUrl);
  connectAuthEmulator(auth, authUrl, {
    disableWarnings: true,
  });
  connectFunctionsEmulator(functions, "localhost", 5001);
  connectFirestoreEmulator(firestore, "localhost", 8080);
}
