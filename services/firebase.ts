import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import rawConfig from '../firebase-applet-config.json';

// Dynamic configuration resolver prioritizing environment variables over local files
export interface ResolvedFirebaseConfig {
  apiKey: string;
  projectId: string;
  appId: string;
  authDomain: string;
  storageBucket: string;
  messagingSenderId: string;
  firestoreDatabaseId: string;
}

export function getResolvedFirebaseConfig(): ResolvedFirebaseConfig {
  const conf = (rawConfig as any) || {};
  return {
    apiKey: conf.apiKey || '',
    projectId: conf.projectId || 'gen-lang-client-0829268660',
    appId: conf.appId || '',
    authDomain: conf.authDomain || `${conf.projectId || 'gen-lang-client-0829268660'}.firebaseapp.com`,
    storageBucket: conf.storageBucket || `${conf.projectId || 'gen-lang-client-0829268660'}.firebasestorage.app`,
    messagingSenderId: conf.messagingSenderId || '',
    firestoreDatabaseId: conf.firestoreDatabaseId || 'ai-studio-aifestivelens-2964fb0d-44f1-4820-96f9-19cdce4025e0'
  };
}

export const firebaseConfig = getResolvedFirebaseConfig();

// Initialize Firebase App singleton with sanitized public client parameters
const app = getApps().length > 0 
  ? getApp() 
  : initializeApp({
      apiKey: firebaseConfig.apiKey,
      projectId: firebaseConfig.projectId,
      appId: firebaseConfig.appId,
      authDomain: firebaseConfig.authDomain,
      storageBucket: firebaseConfig.storageBucket,
      messagingSenderId: firebaseConfig.messagingSenderId,
    });

// Initialize Firestore with explicit database ID
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Connection check as required by Firebase skill
export async function validateFirestoreConnection(): Promise<boolean> {
  if (!firebaseConfig.apiKey) {
    console.warn('Firebase API key not provided. Set VITE_FIREBASE_API_KEY or configure local file.');
    return false;
  }
  try {
    await getDocFromServer(doc(db, 'cards', '__connection_ping__'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore client is offline or network unavailable.');
      return false;
    }
    // Document missing or other non-fatal errors indicate live server connection
    return true;
  }
}
