import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase";

const projectsRef = collection(db, "projects");

export const getProjects = async () => {
  const q = query(projectsRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }));
};

export const getProject = async (id) => {
  const projectRef = doc(db, "projects", id);
  const snapshot = await getDoc(projectRef);

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
};

export const addProject = async (projectData) => {
  const docRef = await addDoc(projectsRef, {
    ...projectData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
};

export const updateProject = async (id, projectData) => {
  const projectRef = doc(db, "projects", id);

  await updateDoc(projectRef, {
    ...projectData,
    updatedAt: serverTimestamp(),
  });
};

export const deleteProject = async (id) => {
  const projectRef = doc(db, "projects", id);

  await deleteDoc(projectRef);
};