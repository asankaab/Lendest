import { initializeApp } from "firebase/app";
import { getAuth, sendEmailVerification, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { addDoc, collection, deleteDoc, doc, getDocs, getFirestore, Timestamp } from "firebase/firestore";
import { redirect } from "react-router";
import { firebaseConfig } from "./config/firebaseConfig";
import 'dayjs/locale/en-gb';

const app = initializeApp(firebaseConfig);
console.log(app)
const auth = getAuth(app);

const db = getFirestore(app);

// **** ********

export async function addUser({request}) {

    const getForm = await request.formData();
    const formData = Object.fromEntries(getForm);
  
    // firestore
    const peopleRef = collection(db, auth?.currentUser?.uid);
  
    const docRef = await addDoc(peopleRef, {
        name: formData.name.charAt(0).toUpperCase() + formData.name.slice(1)
    });
    
    if (formData.amount) {
        addDoc(collection(peopleRef, docRef.id, 'datacollection'), {
            amount: Number(formData.amount),
            date: Timestamp.fromDate(new Date(formData.date))
        })
    }

    return docRef.id;
  }

// **** ********

export async function editData({request, params}) {

const getForm = await request.formData();
const formData = Object.fromEntries(getForm);

const peopleRef = collection(db, auth?.currentUser?.uid);

if (formData.deleteuser === "confirmed") {

// delete user operation

    const querySnapshot = await getDocs(collection(db, auth?.currentUser?.uid, params.id, "datacollection"));
    await querySnapshot.forEach((item) => {
        deleteDoc(doc(db, auth?.currentUser?.uid, params.id, "datacollection", item.id));
    });
    await deleteDoc(doc(db, auth?.currentUser?.uid, params.id));

    return redirect('/')

} else if (formData.action === "add" && formData.amount) {

// add data operation

    addDoc(collection(peopleRef, params.id, 'datacollection'), {
        amount: Number(formData.amount),
        date: Timestamp.fromDate(new Date(formData.date))
    })

} else if (formData.action === "deleteItems" && formData.removeList) {

// delete data operation

    const listArray = formData.removeList.split(',')
    listArray.forEach(async(id) => {
        await deleteDoc(doc(db, auth?.currentUser?.uid, params.id, "datacollection", id))
    })
}

return null

}

// ***** ********

export async function editContent({request}) {
    const getForm = await request.formData();
    const formData = Object.fromEntries(getForm);

    console.log(formData)

    return null;
}

// **** ********

export async function signIn({request}) {

const formData = await request.formData();
const credentials = Object.fromEntries(formData);
const email = credentials.email;
const password = credentials.password;

const signOutReq = credentials.signout;
const verifyReq = credentials.verify;

    if(verifyReq) {
        sendEmailVerification(auth.currentUser)
        .then(() => {
            alert('email sent')
        });
        return redirect('/profile');
    } else if (signOutReq == 'signout') {
        await signOut(auth)
        return redirect('/')
    } else {
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        })
        .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(error)
        });
        return null
    }

}
  
// **** ********
  
export async function editProfile({request}) {
    const formData = await request.formData();
    const inputs = Object.fromEntries(formData);
    const name = inputs.name.charAt(0).toUpperCase() + inputs.name.slice(1);
  
    updateProfile(auth.currentUser, {
      displayName: name, photoURL: "https://firebasestorage.googleapis.com/v0/b/lendingdata.appspot.com/o/IMG_7988-pro-disco.png?alt=media&token=aa8d402a-4165-4c7d-9808-335ed761a231"
    }).then(() => {
      
    }).catch((error) => {
      // An error occurred
      // ...
    });
    return redirect('/profile')
  }