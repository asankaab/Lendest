import 'firebaseui/dist/firebaseui.css'
import { initializeApp } from 'firebase/app';

import { collection, doc, getAggregateFromServer, getDoc, getDocs, initializeFirestore, memoryLocalCache, query, sum } from "firebase/firestore";
import { firebaseConfig } from './config/firebaseConfig';
import { getAuth } from 'firebase/auth';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export const db = initializeFirestore(app, {localCache: memoryLocalCache()});


export async function getNames() {

  const q = query(collection(db, auth?.currentUser?.uid));

  const querySnapshot = await getDocs(q);

  const docs = await querySnapshot.docs;

  const names = docs.map((doc)=> {  return {id: doc.id, name: doc.get("name")}   })

  return { names };

}

export async function getDetails({params}) {
  // fetch name
  const docRef = doc(db, auth?.currentUser?.uid, params.id);
  const docSnap = await getDoc(docRef);
  
  const name = docSnap.data().name;
  const docId = docSnap.data().id;

  // fetch datacollection

  const querySnapshot = await getDocs(collection(db, auth?.currentUser?.uid, params.id, "datacollection"));
  const docs = querySnapshot.docs
  
  const details = docs.map((doc)=> {
    return { id: doc.id, date: doc.data().date, amount: doc.data().amount }
  })

  const totalSnap = await getAggregateFromServer(collection(db, auth?.currentUser?.uid, params.id, "datacollection"), {
    sum: sum('amount')
  });
  let total = totalSnap.data().sum;

  docSnap.metadata.fromCache ? console.log("data loaded from localcache") : null;

  return {name, docId, details, total};
  
}
