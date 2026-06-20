import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyDN6G1npjUbP4Ysbplp5StI51of5mga1nY',
  authDomain: 'molkky-app-cb242.firebaseapp.com',
  projectId: 'molkky-app-cb242',
  storageBucket: 'molkky-app-cb242.firebasestorage.app',
  messagingSenderId: '1043004236205',
  appId: '1:1043004236205:web:87dc4e7a22593959ff4124',
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
