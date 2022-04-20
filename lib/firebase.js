import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCY_hdjWtTP-lFMRiwG9kn1WxoCWAtaarY",
  authDomain: "juice-bank-2f44e.firebaseapp.com",
  projectId: "juice-bank-2f44e",
  storageBucket: "juice-bank-2f44e.appspot.com",
  messagingSenderId: "1090770320125",
  appId: "1:1090770320125:web:2275153e42956eacee9c94"
};

// Prevent error with multiple initializations
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

export const firestore = firebase.firestore();
export const storage = firebase.storage();

export const STATE_CHANGED = firebase.storage.TaskEvent.STATE_CHANGED;

export const fromMillis = firebase.firestore.Timestamp.fromMillis;
export const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp;

export const increment = firebase.firestore.FieldValue.increment;

// Helper functions.

/**`
  * Gets a user/{uid} document with username
  * @param {string} username
*/

export async function getUserWithUsername(username) {
  const usersRef = firestore.collection('users');
  const query = usersRef.where('username', '==', username).limit(1);

  const userDoc = (await query.get()).docs[0];
  return userDoc;
}
