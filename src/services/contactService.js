import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { db } from "../firebase";

const CONTACT_COLLECTION = "contactMessages";
const LEGACY_COLLECTION = "messages";

/**
 * Convert Firestore timestamps and regular dates
 * into a comparable numeric value.
 */
const getTimestampValue = (value) => {
  if (!value) return 0;

  if (typeof value?.toMillis === "function") {
    return value.toMillis();
  }

  if (typeof value?.seconds === "number") {
    return value.seconds * 1000;
  }

  if (value instanceof Date) {
    return value.getTime();
  }

  const parsed = new Date(value).getTime();

  return Number.isNaN(parsed) ? 0 : parsed;
};

/**
 * Normalize a message so old and new records
 * have the same structure.
 */
const normalizeMessage = (data, id, collectionName) => {
  const isRead =
    typeof data.isRead === "boolean"
      ? data.isRead
      : typeof data.read === "boolean"
      ? data.read
      : false;

  return {
    id,
    collectionName,

    name: data.name || data.fullName || "Unknown",
    email: data.email || data.senderEmail || "",
    subject:
      data.subject ||
      data.title ||
      "Portfolio Contact Message",

    message:
      data.message ||
      data.content ||
      data.body ||
      "",

    isRead,

    // Keep legacy property available if older records use it.
    read: isRead,

    createdAt: data.createdAt || data.timestamp || null,

    createdAtValue: getTimestampValue(
      data.createdAt || data.timestamp
    ),
  };
};

/**
 * Add a new public contact message.
 *
 * New messages always go to contactMessages.
 */
export const addContactMessage = async ({
  name,
  email,
  subject,
  message,
}) => {
  const cleanData = {
    name: String(name || "").trim(),
    email: String(email || "").trim(),
    subject: String(subject || "").trim(),
    message: String(message || "").trim(),

    isRead: false,

    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(
    collection(db, CONTACT_COLLECTION),
    cleanData
  );

  return {
    id: docRef.id,
    collectionName: CONTACT_COLLECTION,
    ...cleanData,
  };
};

/**
 * Get all contact messages.
 *
 * Reads both the current contactMessages collection
 * and the older messages collection so existing
 * messages are not lost.
 */
export const getContactMessages = async () => {
  const collectionsToRead = [
    CONTACT_COLLECTION,
    LEGACY_COLLECTION,
  ];

  const allMessages = [];

  for (const collectionName of collectionsToRead) {
    try {
      const snapshot = await getDocs(
        collection(db, collectionName)
      );

      snapshot.forEach((messageDoc) => {
        allMessages.push(
          normalizeMessage(
            messageDoc.data(),
            messageDoc.id,
            collectionName
          )
        );
      });
    } catch (error) {
      console.warn(
        `Could not read ${collectionName}:`,
        error
      );
    }
  }

  // Newest first.
  allMessages.sort(
    (a, b) => b.createdAtValue - a.createdAtValue
  );

  return allMessages;
};

/**
 * Mark message as read/unread.
 */
export const updateContactMessage = async (
  id,
  updates,
  collectionName = CONTACT_COLLECTION
) => {
  if (!id) {
    throw new Error("Message ID is required.");
  }

  const safeUpdates = {
    ...updates,
  };

  // Keep both fields synchronized for compatibility
  // with older records.
  if (typeof updates.isRead === "boolean") {
    safeUpdates.isRead = updates.isRead;
    safeUpdates.read = updates.isRead;
  }

  await updateDoc(
    doc(db, collectionName, id),
    safeUpdates
  );
};

/**
 * Delete a contact message.
 */
export const deleteContactMessage = async (
  id,
  collectionName = CONTACT_COLLECTION
) => {
  if (!id) {
    throw new Error("Message ID is required.");
  }

  await deleteDoc(
    doc(db, collectionName, id)
  );
};