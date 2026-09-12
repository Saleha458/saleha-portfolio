import {
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

import { db } from "../firebase";

const PERSONAL_DOC_ID =
  "personal";

const CACHE_KEY =
  "saleha-portfolio-personal-info";

const CACHE_TTL =
  5 * 60 * 1000;

let memoryCache = null;
let memoryCacheTime = 0;

/* =========================================================
   SESSION CACHE
========================================================= */

const readSessionCache = () => {
  try {
    const raw =
      sessionStorage.getItem(
        CACHE_KEY
      );

    if (!raw) {
      return null;
    }

    const parsed =
      JSON.parse(raw);

    if (
      !parsed?.data ||
      !parsed?.cachedAt
    ) {
      return null;
    }

    if (
      Date.now() -
        parsed.cachedAt >
      CACHE_TTL
    ) {
      sessionStorage.removeItem(
        CACHE_KEY
      );

      return null;
    }

    return parsed.data;
  } catch {
    return null;
  }
};

const writeCache = (
  data
) => {
  if (!data) {
    return;
  }

  memoryCache = data;
  memoryCacheTime =
    Date.now();

  try {
    sessionStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        data,
        cachedAt:
          memoryCacheTime,
      })
    );
  } catch {
    // Session storage may be unavailable.
  }
};

/* =========================================================
   GET CACHED DATA IMMEDIATELY
========================================================= */

export const getCachedPersonalInfo =
  () => {
    if (
      memoryCache &&
      Date.now() -
        memoryCacheTime <
        CACHE_TTL
    ) {
      return memoryCache;
    }

    const cached =
      readSessionCache();

    if (cached) {
      memoryCache =
        cached;

      memoryCacheTime =
        Date.now();

      return cached;
    }

    return null;
  };

/* =========================================================
   GET PERSONAL INFO
========================================================= */

export const getPersonalInfo =
  async ({
    forceRefresh = false,
  } = {}) => {
    if (!forceRefresh) {
      const cached =
        getCachedPersonalInfo();

      if (cached) {
        return cached;
      }
    }

    const docRef = doc(
      db,
      "personalInfo",
      PERSONAL_DOC_ID
    );

    const snapshot =
      await getDoc(docRef);

    if (
      !snapshot.exists()
    ) {
      return null;
    }

    const data = {
      id: snapshot.id,
      ...snapshot.data(),
    };

    writeCache(data);

    return data;
  };

/* =========================================================
   SAVE PERSONAL INFO
========================================================= */

export const savePersonalInfo =
  async (data) => {
    const docRef = doc(
      db,
      "personalInfo",
      PERSONAL_DOC_ID
    );

    const savedData = {
      ...data,
      updatedAt:
        new Date().toISOString(),
    };

    await setDoc(
      docRef,
      savedData
    );

    const result = {
      id: PERSONAL_DOC_ID,
      ...savedData,
    };

    writeCache(result);

    return result;
  };