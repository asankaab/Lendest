import 'firebaseui/dist/firebaseui.css'
import { initializeApp } from 'firebase/app';

import { collection, doc, getAggregateFromServer, getDoc, getDocs, getFirestore, initializeFirestore, memoryLocalCache, query, sum } from "firebase/firestore";
import { firebaseConfig } from './config/firebaseConfig';



// export const db = initializeFirestore(app, {localCache: memoryLocalCache()});
