import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase";

const educationCollection = collection(db, "education");

export const getEducation = async () => {
  const q = query(
    educationCollection,
    orderBy("startDate", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }));
};

export const addEducation = async (educationData) => {
  return await addDoc(educationCollection, {
    ...educationData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

export const updateEducation = async (id, educationData) => {
  const educationRef = doc(db, "education", id);

  await updateDoc(educationRef, {
    ...educationData,
    updatedAt: serverTimestamp(),
  });
};

export const deleteEducation = async (id) => {
  const educationRef = doc(db, "education", id);

  await deleteDoc(educationRef);
};