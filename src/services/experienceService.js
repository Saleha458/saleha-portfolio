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

const experienceCollection = collection(
  db,
  "experiences"
);

// GET ALL EXPERIENCES
export const getExperiences = async () => {
  const q = query(
    experienceCollection,
    orderBy("startDate", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }));
};

// ADD EXPERIENCE
export const addExperience = async (experienceData) => {
  return await addDoc(experienceCollection, {
    ...experienceData,

    // Featured defaults to false if not provided
    featured: Boolean(experienceData.featured),

    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

// UPDATE EXPERIENCE
export const updateExperience = async (
  id,
  experienceData
) => {
  const experienceRef = doc(
    db,
    "experiences",
    id
  );

  await updateDoc(experienceRef, {
    ...experienceData,

    featured: Boolean(experienceData.featured),

    updatedAt: serverTimestamp(),
  });
};

// DELETE EXPERIENCE
export const deleteExperience = async (id) => {
  const experienceRef = doc(
    db,
    "experiences",
    id
  );

  await deleteDoc(experienceRef);
};