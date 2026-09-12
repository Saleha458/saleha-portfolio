import {
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import { db } from "../firebase";

const SETTINGS_COLLECTION =
  "aiSettings";

const SETTINGS_DOCUMENT =
  "main";

export const DEFAULT_AI_SETTINGS = {
  enabled: true,

  introduction:
    "Hi! I'm Saleha's AI Twin. I can answer questions about her skills, projects, experience, education, certifications and professional background.",

  tone:
    "professional",

  allowedTopics: [
    "about",
    "skills",
    "projects",
    "experience",
    "education",
    "certificates",
    "contact",
    "resume",
  ],
};

/* =========================================================
   NORMALIZE
========================================================= */

const normalizeSettings = (
  data = {}
) => ({
  ...DEFAULT_AI_SETTINGS,
  ...data,

  enabled:
    data.enabled !== false,

  allowedTopics:
    Array.isArray(
      data.allowedTopics
    )
      ? data.allowedTopics
      : DEFAULT_AI_SETTINGS.allowedTopics,
});

/* =========================================================
   GET
========================================================= */

export const getAISettings =
  async () => {
    const reference = doc(
      db,
      SETTINGS_COLLECTION,
      SETTINGS_DOCUMENT
    );

    const snapshot =
      await getDoc(reference);

    if (
      !snapshot.exists()
    ) {
      return {
        ...DEFAULT_AI_SETTINGS,
      };
    }

    return normalizeSettings(
      snapshot.data()
    );
  };

/* =========================================================
   REAL-TIME SUBSCRIPTION
========================================================= */

export const subscribeToAISettings =
  (
    onChange,
    onError
  ) => {
    const reference = doc(
      db,
      SETTINGS_COLLECTION,
      SETTINGS_DOCUMENT
    );

    return onSnapshot(
      reference,

      (snapshot) => {
        if (
          !snapshot.exists()
        ) {
          onChange({
            ...DEFAULT_AI_SETTINGS,
          });

          return;
        }

        onChange(
          normalizeSettings(
            snapshot.data()
          )
        );
      },

      (error) => {
        console.error(
          "AI settings listener failed:",
          error
        );

        if (onError) {
          onError(error);
        }
      }
    );
  };

/* =========================================================
   SAVE
========================================================= */

export const saveAISettings =
  async (settings) => {
    const reference = doc(
      db,
      SETTINGS_COLLECTION,
      SETTINGS_DOCUMENT
    );

    const cleanSettings = {
      enabled:
        settings.enabled !==
        false,

      introduction:
        String(
          settings.introduction ||
            ""
        ).trim() ||
        DEFAULT_AI_SETTINGS.introduction,

      tone:
        String(
          settings.tone ||
            "professional"
        ).trim(),

      allowedTopics:
        Array.isArray(
          settings.allowedTopics
        )
          ? settings.allowedTopics
          : DEFAULT_AI_SETTINGS.allowedTopics,

      updatedAt:
        serverTimestamp(),
    };

    await setDoc(
      reference,
      cleanSettings,
      {
        merge: true,
      }
    );

    return cleanSettings;
  };