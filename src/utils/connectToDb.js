import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

import credentials from "../../credentials.json" assert { type: "json" };

export const connectToDb = () => {
  if (!getApps().length) {
    initializeApp({
      credential: cert(credentials),
    });
  }
  return getFirestore();
};
