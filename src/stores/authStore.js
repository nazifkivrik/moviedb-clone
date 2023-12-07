import { defineStore } from 'pinia'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import { doc, setDoc, getDoc, arrayUnion, arrayRemove, updateDoc } from 'firebase/firestore'
import { auth, db } from '@/utils/firebaseAuth'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const userTemplate = {
  sessionId: '',
  avatar: '',
  showAdult: false,
  lists: [],
  favorites: [],
  watchlist: []
}
export const useAuthStore = defineStore('authStore', () => {
  const user = ref()
  const isAuthenticated = ref(false)
  const router = useRouter()
  const init = async () => {
    onAuthStateChanged(auth, async (userInAuth) => {
      if (userInAuth) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        user.value = await getDocument(userInAuth.email)
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
    let err = createUserWithEmailAndPassword(auth, credentials.email, credentials.password)
      .then(() => {
        // Signed up
        addDocument('users', credentials.email, {
          username: credentials.username,
          email: credentials.email,
          ...userTemplate
        })
        router.replace({ path: '/' })

        // ...
      })
      .catch((error) => {
        return error
        // ..
      })
    return err
  }
  const loginUser = (credentials) => {
    let err = signInWithEmailAndPassword(auth, credentials.email, credentials.password)
      .then(async () => {
        // Signed in
        user.value = await getDocument(credentials.email)
        router.replace({ path: '/' })
        // ...
      })
      .catch((error) => {
        return error
      })
    return err
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
  const addToArray = async (document, col, key, arr) => {
    const userRef = doc(db, document, col)
    await updateDoc(userRef, {
      [key]: arrayUnion(arr)
    })
  }
  const removeFromArray = async (document, col, key, arr) => {
    const userRef = doc(db, document, col)
    await updateDoc(userRef, {
      [key]: arrayRemove(arr)
    })
  }
  const addDocument = async (document, name, object) => {
    const userRef = doc(db, document, name)
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
    getDocument,
    addToArray,
    removeFromArray
  }
})
