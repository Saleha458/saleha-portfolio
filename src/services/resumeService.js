import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  limit,
} from "firebase/firestore";

import { db } from "../firebase";

const RESUME_COLLECTION = "resume";

const resumeCollection = collection(
  db,
  RESUME_COLLECTION
);

const CLOUDINARY_CLOUD_NAME =
  import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

const CLOUDINARY_UPLOAD_PRESET =
  import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

/* =========================================================
   GET CURRENT RESUME
========================================================= */

export const getResume = async () => {
  const q = query(
    resumeCollection,
    orderBy("updatedAt", "desc"),
    limit(1)
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return null;
  }

  const document = snapshot.docs[0];

  return {
    id: document.id,
    ...document.data(),
  };
};

/* =========================================================
   UPLOAD RESUME TO CLOUDINARY
========================================================= */

export const uploadResumeFile = async (
  file,
  onProgress
) => {
  if (!file) {
    throw new Error(
      "Please select a resume file."
    );
  }

  if (!CLOUDINARY_CLOUD_NAME) {
    throw new Error(
      "Cloudinary cloud name is missing."
    );
  }

  if (!CLOUDINARY_UPLOAD_PRESET) {
    throw new Error(
      "Cloudinary upload preset is missing."
    );
  }

  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (!allowedTypes.includes(file.type)) {
    throw new Error(
      "Only PDF, DOC and DOCX files are allowed."
    );
  }

  const maxSize =
    10 * 1024 * 1024;

  if (file.size > maxSize) {
    throw new Error(
      "Resume file must be smaller than 10 MB."
    );
  }

  const formData = new FormData();

  formData.append(
    "file",
    file
  );

  formData.append(
    "upload_preset",
    CLOUDINARY_UPLOAD_PRESET
  );

  /*
    Resume files are uploaded as raw files.
  */

  const uploadUrl =
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/raw/upload`;

  return new Promise(
    (resolve, reject) => {
      const xhr =
        new XMLHttpRequest();

      xhr.open(
        "POST",
        uploadUrl
      );

      /* ================= PROGRESS ================= */

      xhr.upload.addEventListener(
        "progress",
        (event) => {
          if (
            event.lengthComputable &&
            onProgress
          ) {
            const progress =
              Math.round(
                (event.loaded /
                  event.total) *
                  100
              );

            onProgress(progress);
          }
        }
      );

      /* ================= SUCCESS ================= */

      xhr.addEventListener(
        "load",
        () => {
          if (
            xhr.status >= 200 &&
            xhr.status < 300
          ) {
            try {
              const response =
                JSON.parse(
                  xhr.responseText
                );

              if (
                !response.secure_url
              ) {
                reject(
                  new Error(
                    "Cloudinary did not return a valid file URL."
                  )
                );

                return;
              }

              resolve({
                url:
                  response.secure_url,

                publicId:
                  response.public_id,

                originalFilename:
                  response.original_filename ||
                  file.name,

                format:
                  response.format ||
                  "",

                bytes:
                  response.bytes ||
                  file.size,

                resourceType:
                  response.resource_type ||
                  "raw",
              });
            } catch {
              reject(
                new Error(
                  "Invalid response received from Cloudinary."
                )
              );
            }
          } else {
            let message =
              "Cloudinary upload failed.";

            try {
              const response =
                JSON.parse(
                  xhr.responseText
                );

              message =
                response?.error?.message ||
                message;
            } catch {
              // Keep default message.
            }

            reject(
              new Error(message)
            );
          }
        }
      );

      /* ================= NETWORK ERROR ================= */

      xhr.addEventListener(
        "error",
        () => {
          reject(
            new Error(
              "Network error while uploading the resume."
            )
          );
        }
      );

      /* ================= ABORT ================= */

      xhr.addEventListener(
        "abort",
        () => {
          reject(
            new Error(
              "Resume upload was cancelled."
            )
          );
        }
      );

      xhr.send(formData);
    }
  );
};

/* =========================================================
   ADD RESUME
========================================================= */

export const addResume = async (
  resumeData
) => {
  const docRef =
    await addDoc(
      resumeCollection,
      {
        ...resumeData,
        updatedAt:
          new Date(),
      }
    );

  return docRef.id;
};

/* =========================================================
   UPDATE RESUME
========================================================= */

export const updateResume = async (
  id,
  resumeData
) => {
  if (!id) {
    throw new Error(
      "Resume ID is missing."
    );
  }

  const resumeRef =
    doc(
      db,
      RESUME_COLLECTION,
      id
    );

  await updateDoc(
    resumeRef,
    {
      ...resumeData,
      updatedAt:
        new Date(),
    }
  );
};

/* =========================================================
   DELETE RESUME
========================================================= */

export const deleteResume = async (
  id
) => {
  if (!id) {
    throw new Error(
      "Resume ID is missing."
    );
  }

  await deleteDoc(
    doc(
      db,
      RESUME_COLLECTION,
      id
    )
  );
};