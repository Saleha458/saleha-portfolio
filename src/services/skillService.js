import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";

import { db } from "../firebase";

const skillsCollection = collection(db, "skills");

// ADD
export const addSkill = async (skillData) => {
  const docRef = await addDoc(skillsCollection, {
    ...skillData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
};

// GET
export const getSkills = async () => {
  const q = query(skillsCollection, orderBy("createdAt", "desc"));

  const snapshot = await getDocs(q);

  return snapshot.docs.map((document) => ({
    id: document.id,
    ...document.data(),
  }));
};

// UPDATE
export const updateSkill = async (id, skillData) => {
  const skillRef = doc(db, "skills", id);

  await updateDoc(skillRef, {
    ...skillData,
    updatedAt: serverTimestamp(),
  });
};

// DELETE
export const deleteSkill = async (id) => {
  const skillRef = doc(db, "skills", id);

  await deleteDoc(skillRef);
};