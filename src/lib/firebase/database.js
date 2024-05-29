import {doc, getDoc, getDocs, setDoc} from "firebase/firestore";
import {db} from "./init";
export async function setDocument(data, id, collection) {
  try {
    await setDoc(doc(db, collection, id), data);
    return {data: "Document successfully added", error: null};
  } catch (error) {
    console.log(error);
    return {data: null, error: error.message};
  }
}

export async function getData(id, collection) {
  try {
    const docRef = doc(db, collection, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {data: docSnap.data(), error: null};
    } else {
      return {data: null, error: "Document not found"};
    }
  } catch (error) {
    return {data: null, error: error.message};
  }
}

export async function getDataQueried(
  collectionName,
  field = null,
  operator = null,
  value = null
) {
  try {
    let appointmentsCollection = collection(db, collectionName);
    let q = appointmentsCollection;

    if (field && operator && value) {
      q = query(appointmentsCollection, where(field, operator, value));
    }

    const querySnapshot = await getDocs(q);
    const appointmentsData = [];
    querySnapshot.forEach((doc) => {
      appointmentsData.push({id: doc.id, ...doc.data()});
    });

    return {data: appointmentsData, error: null};
  } catch (error) {
    return {data: null, error: error.message};
  }
}
