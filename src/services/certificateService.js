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

const certificatesCollection = collection(
  db,
  "certificates"
);

// ================= GET ALL CERTIFICATES =================

export const getCertificates = async () => {
  const q = query(
    certificatesCollection,
    orderBy("issueDate", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }));
};

// ================= ADD CERTIFICATE =================

export const addCertificate = async (
  certificateData
) => {
  const docRef = await addDoc(
    certificatesCollection,
    {
      ...certificateData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }
  );

  return docRef.id;
};

// ================= UPDATE CERTIFICATE =================

export const updateCertificate = async (
  id,
  certificateData
) => {
  const certificateRef = doc(
    db,
    "certificates",
    id
  );

  await updateDoc(certificateRef, {
    ...certificateData,
    updatedAt: serverTimestamp(),
  });
};

// ================= DELETE CERTIFICATE =================

export const deleteCertificate = async (id) => {
  const certificateRef = doc(
    db,
    "certificates",
    id
  );

  await deleteDoc(certificateRef);
};