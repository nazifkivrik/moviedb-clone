import { defineStore } from 'pinia'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import { doc, setDoc, query, where, getDocs, collection, getDoc } from 'firebase/firestore'
import { auth, db } from '@/utils/firebaseAuth'
import { reactive, ref } from 'vue'
const userTemplate = { sessionId: '', avatar: '', showAdult: false }
export const useAuthStore = defineStore('authStore', () => {
  const user = ref()
  const isAuthenticated = ref(false)
  const init = () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        getDocument(user.email)
        isAuthenticated.value = true
        // ...
      } else {
        isAuthenticated.value = false
        // User is signed out
        // ...
      }
    })
  }
  const registerUser = (credentials) => {
    createUserWithEmailAndPassword(auth, credentials.email, credentials.password)
      .then((userCredential) => {
        // Signed up
        addDocument(credentials.email, {
          username: credentials.username,
          email: credentials.email,
          ...userTemplate
        })
        // ...
      })
      .catch((error) => {
        console.log(error)
        // ..
      })
  }
  const loginUser = (credentials) => {
    signInWithEmailAndPassword(auth, credentials.email, credentials.password)
      .then(async (userCredential) => {
        // Signed in
        user.value = await getDocument(credentials.email)
        // ...
      })
      .catch((error) => {
        console.log(error)
      })
  }
  const logoutUser = () => {
    signOut(auth)
      .then(() => {
        user.value = null
        // Sign-out successful.
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const addDocument = async (name, object) => {
    console.log(name)
    const userRef = doc(db, 'users', name)
    await setDoc(userRef, object, { merge: true })
  }
  const getDocument = async (email) => {
    const docRef = doc(db, 'users', email)
    const docSnap = await getDoc(docRef)
    return docSnap.data()
  }
  return {
    registerUser,
    loginUser,
    logoutUser,
    init,
    user,
    isAuthenticated,
    addDocument,
    getDocument
  }
})