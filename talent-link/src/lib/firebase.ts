// Firebase configuration and initialization
import { initializeApp, getApps, FirebaseApp } from 'firebase/app'
import { getAnalytics, Analytics, isSupported } from 'firebase/analytics'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBsm9xl3T0N5T6dGZw3aYQP_RTIhZEFH1M',
  authDomain: 'talentlink-22clc.firebaseapp.com',
  projectId: 'talentlink-22clc',
  storageBucket: 'talentlink-22clc.firebasestorage.app',
  messagingSenderId: '195779068090',
  appId: '1:195779068090:web:8c5c0ca72238674daf4283',
  measurementId: 'G-JWR07Z2QZ5',
}

// Initialize Firebase (only if not already initialized)
let app: FirebaseApp
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig)
} else {
  app = getApps()[0]
}

// Initialize Analytics (client-side only)
export const getFirebaseAnalytics = async (): Promise<Analytics | null> => {
  // Only initialize on client-side
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const supported = await isSupported()
    if (supported) {
      return getAnalytics(app)
    }
    return null
  } catch (error) {
    console.error('Firebase Analytics initialization error:', error)
    return null
  }
}

export default app
