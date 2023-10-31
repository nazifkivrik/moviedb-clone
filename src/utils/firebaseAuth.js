import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
  apiKey: 'AIzaSyBssOz1GjcQY-bFwFIv6gd7S377WMjk_lY',
  authDomain: 'tmdb-c-f2c12.firebaseapp.com',
  projectId: 'tmdb-c-f2c12',
  storageBucket: 'tmdb-c-f2c12.appspot.com',
  messagingSenderId: '818734992354',
  appId: '1:818734992354:web:571a4451cecb2ed72287bb'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app)
const db = getFirestore(app)
export { db, auth }
