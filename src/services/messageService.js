import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  orderBy,
  query,
} from "firebase/firestore";

import { db } from "../firebase";

const messagesCollection = collection(db, "messages");

// GET ALL MESSAGES
export const getMessages = async () => {
  const q = query(
    messagesCollection,
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }));
};

// ADD MESSAGE
export const addMessage = async (messageData) => {
  await addDoc(messagesCollection, {
    ...messageData,
    createdAt: new Date().toISOString(),
    read: false,
  });
};

// DELETE MESSAGE
export const deleteMessage = async (id) => {
  const messageRef = doc(db, "messages", id);

  await deleteDoc(messageRef);
};