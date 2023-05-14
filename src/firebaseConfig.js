// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDVTYkG1zW17kUhFk8WjRnHbRpysh6ZC0A',
  authDomain: 'website-a9698.firebaseapp.com',
  projectId: 'website-a9698',
  storageBucket: 'website-a9698.appspot.com',
  messagingSenderId: '935479146025',
  appId: '1:935479146025:web:db99dc072c04821bd00e38',
  measurementId: 'G-55N7Q2WM2H',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
