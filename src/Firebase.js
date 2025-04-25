import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBT8t6U4_MsgYgYQPO7afth8-MOrtVtYTc",
  authDomain: "todo-crud-dbffe.firebaseapp.com",
  projectId: "todo-crud-dbffe",
  storageBucket: "todo-crud-dbffe.appspot.com",
  messagingSenderId: "78953314748",
  appId: "1:78953314748:web:e6aca25bfab8de613053b9",
  measurementId: "G-LV93KT3JXZ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app); 

export { db, auth };
