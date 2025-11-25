import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";

let db: Firestore | null = null;

export function initializeFirestore(): Firestore {
  if (db) {
    return db;
  }

  if (getApps().length === 0) {
    // For Firestore in development, use simple initialization
    // In production, ensure proper Firebase credentials are set
    const projectId = process.env.FIREBASE_PROJECT_ID;
    
    if (!projectId) {
      throw new Error("FIREBASE_PROJECT_ID is not configured");
    }

    // Try to initialize with admin SDK if full credentials available
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

    if (privateKey && clientEmail) {
      // Convert escaped newlines in private key if needed
      const formattedPrivateKey = privateKey.includes('\\n') 
        ? privateKey.replace(/\\n/g, '\n') 
        : privateKey;
      
      const serviceAccount = {
        projectId,
        privateKey: formattedPrivateKey,
        clientEmail,
      };

      initializeApp({
        credential: cert(serviceAccount as any),
      });
    } else {
      // Fallback initialization for development
      initializeApp({
        projectId,
      });
    }
  }

  db = getFirestore();
  return db;
}

export function getFirestoreDb(): Firestore {
  return initializeFirestore();
}
