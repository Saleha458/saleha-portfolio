import {
  getApps,
} from "firebase/app";

import {
  collection,
  getDocs,
  getFirestore,
} from "firebase/firestore";

import {
  getAI,
  getGenerativeModel,
  GoogleAIBackend,
} from "firebase/ai";

import {
  DEFAULT_AI_SETTINGS,
  getAISettings,
} from "./aiSettingsService";

/* =========================================================
   MODELS

   Portfolio assistant needs speed more than heavy reasoning.

   Primary:
   - Flash-Lite = fastest choice for this use-case

   Fallback:
   - Full Flash if Lite temporarily fails
========================================================= */

const PRIMARY_MODEL =
  "gemini-3.5-flash-lite";

const FALLBACK_MODEL =
  "gemini-3.8-flash";

/* =========================================================
   CACHE
========================================================= */

const KNOWLEDGE_CACHE_TTL =
  10 * 60 * 1000;

const SETTINGS_CACHE_TTL =
  10 * 60 * 1000;

const collectionCache =
  new Map();

let settingsCache = null;
let settingsCacheTime = 0;

/* =========================================================
   FIREBASE
========================================================= */

const getFirebaseApp = () => {
  const apps =
    getApps();

  if (!apps.length) {
    throw new Error(
      "Firebase has not been initialized."
    );
  }

  return apps[0];
};

/* =========================================================
   PRIVATE FIELDS
========================================================= */

const BLOCKED_KEYS = [
  "password",
  "passwordHash",
  "adminPassword",
  "adminPasswordHash",
  "jwtSecret",
  "apiKey",
  "privateKey",
  "secret",
  "phone",
  "phoneNumber",
  "mobile",
  "mobileNumber",
  "whatsapp",
  "resetToken",
  "refreshToken",
  "accessToken",
  "token",
];

/* =========================================================
   REMOVE PRIVATE DATA
========================================================= */

const removePrivateFields = (
  value
) => {
  if (
    value === null ||
    value === undefined
  ) {
    return value;
  }

  if (
    typeof value !== "object"
  ) {
    return value;
  }

  if (
    Array.isArray(value)
  ) {
    return value.map(
      removePrivateFields
    );
  }

  const safeObject = {};

  Object.entries(value).forEach(
    ([
      key,
      fieldValue,
    ]) => {
      const normalizedKey =
        key.toLowerCase();

      const blocked =
        BLOCKED_KEYS.some(
          (blockedKey) =>
            normalizedKey.includes(
              blockedKey.toLowerCase()
            )
        );

      if (blocked) {
        return;
      }

      safeObject[key] =
        removePrivateFields(
          fieldValue
        );
    }
  );

  return safeObject;
};

/* =========================================================
   READ COLLECTION WITH CACHE
========================================================= */

const readCollection = async (
  collectionName
) => {
  const now =
    Date.now();

  const cached =
    collectionCache.get(
      collectionName
    );

  if (
    cached &&
    now -
      cached.time <
      KNOWLEDGE_CACHE_TTL
  ) {
    return cached.data;
  }

  const app =
    getFirebaseApp();

  const db =
    getFirestore(app);

  const snapshot =
    await getDocs(
      collection(
        db,
        collectionName
      )
    );

  const data =
    snapshot.docs.map(
      (document) => ({
        id: document.id,

        ...removePrivateFields(
          document.data()
        ),
      })
    );

  collectionCache.set(
    collectionName,
    {
      data,
      time: now,
    }
  );

  return data;
};

/* =========================================================
   SETTINGS CACHE
========================================================= */

const loadAISettings = async (
  suppliedSettings
) => {
  if (suppliedSettings) {
    return {
      ...DEFAULT_AI_SETTINGS,
      ...suppliedSettings,
    };
  }

  const now =
    Date.now();

  if (
    settingsCache &&
    now -
      settingsCacheTime <
      SETTINGS_CACHE_TTL
  ) {
    return settingsCache;
  }

  const settings =
    await getAISettings();

  settingsCache = {
    ...DEFAULT_AI_SETTINGS,
    ...settings,
  };

  settingsCacheTime =
    now;

  return settingsCache;
};

/* =========================================================
   INTENT DETECTION
========================================================= */

export const detectPortfolioIntent = (
  question = ""
) => {
  const text =
    String(question)
      .toLowerCase()
      .trim();

  const intents = [
    {
      intent:
        "projects",

      keywords: [
        "project",
        "projects",
        "calcai",
        "academic collaboration",
        "software construction",
        "innervoice",
        "inner voice",
        "smart meal",
        "meal planner",
        "neighborhelp",
        "neighbor help",
        "github",
        "demo",
      ],
    },

    {
      intent:
        "experience",

      keywords: [
        "experience",
        "experiences",
        "internship",
        "internships",
        "work experience",
        "worked",
        "working",
        "employment",
        "company",
        "companies",
        "organization",
        "organisation",
        "role",
        "roles",
        "job",
        "jobs",
      ],
    },

    {
      intent:
        "education",

      keywords: [
        "education",
        "university",
        "college",
        "school",
        "degree",
        "qualification",
        "study",
        "studied",
        "academic",
      ],
    },

    {
      intent:
        "certificates",

      keywords: [
        "certificate",
        "certificates",
        "certification",
        "certifications",
        "credential",
        "credentials",
        "course",
      ],
    },

    {
      intent:
        "resume",

      keywords: [
        "resume",
        "cv",
        "curriculum vitae",
      ],
    },

    {
      intent:
        "contact",

      keywords: [
        "contact",
        "email",
        "hire",
        "hiring",
        "available",
        "availability",
        "freelance",
        "freelancer",
        "opportunity",
        "collaborate",
        "work together",
      ],
    },

    {
      intent:
        "skills",

      keywords: [
        "skill",
        "skills",
        "technology",
        "technologies",
        "tech stack",
        "frontend",
        "front end",
        "backend",
        "back end",
        "database",
        "databases",
        "programming",
        "tools",
        "framework",
        "frameworks",
        "language",
        "languages",
        "react",
        "node",
        "mongodb",
        "firebase",
        "javascript",
        "python",
        "java",
      ],
    },
  ];

  for (
    const group of intents
  ) {
    if (
      group.keywords.some(
        (keyword) =>
          text.includes(
            keyword
          )
      )
    ) {
      return group.intent;
    }
  }

  return "about";
};

/* =========================================================
   LOAD ONLY RELEVANT DATA
========================================================= */

const getRelevantKnowledge = async (
  question
) => {
  const intent =
    detectPortfolioIntent(
      question
    );

  const collections = [
    "personalInfo",
  ];

  switch (intent) {
    case "projects":
      collections.push(
        "projects"
      );
      break;

    case "skills":
      collections.push(
        "skills"
      );
      break;

    case "experience":
      collections.push(
        "experiences"
      );
      break;

    case "education":
      collections.push(
        "education"
      );
      break;

    case "certificates":
      collections.push(
        "certificates"
      );
      break;

    case "resume":
      /*
       * Resume questions may need wider context,
       * but still only load professional collections.
       */
      collections.push(
        "skills",
        "experiences",
        "education",
        "projects",
        "certificates"
      );
      break;

    case "contact":
      /*
       * personalInfo already contains public
       * contact details.
       */
      break;

    default:
      /*
       * About/general questions:
       * keep context small for faster responses.
       */
      collections.push(
        "skills"
      );
      break;
  }

  const uniqueCollections = [
    ...new Set(
      collections
    ),
  ];

  const results =
    await Promise.all(
      uniqueCollections.map(
        async (
          collectionName
        ) => ({
          collectionName,

          data:
            await readCollection(
              collectionName
            ),
        })
      )
    );

  const knowledge = {};

  results.forEach(
    ({
      collectionName,
      data,
    }) => {
      knowledge[
        collectionName
      ] = data;
    }
  );

  return {
    intent,
    knowledge,
  };
};

/* =========================================================
   REFRESH CACHE
========================================================= */

export const refreshPortfolioKnowledge =
  async () => {
    collectionCache.clear();

    settingsCache = null;
    settingsCacheTime = 0;

    return true;
  };

/* =========================================================
   CREATE AI MODEL
========================================================= */

const createModel = ({
  knowledge,
  intent,
  modelName,
  settings,
}) => {
  const app =
    getFirebaseApp();

  const ai =
    getAI(app, {
      backend:
        new GoogleAIBackend(),
    });

  const portfolioContext =
    JSON.stringify(
      knowledge
    );

  const tone =
    settings?.tone ||
    "professional";

  return getGenerativeModel(
    ai,
    {
      model:
        modelName,

      /*
       * Keep system prompt compact.
       * Smaller prompt = less processing overhead.
       */
      systemInstruction: `
You are Saleha's AI Twin, a professional portfolio assistant.

Use only the public portfolio data supplied below.

Question category: ${intent}
Tone: ${tone}

Portfolio data:
${portfolioContext}

Rules:

• Answer only about Saleha Imtiaz's professional portfolio.
• Never invent information.
• If data is unavailable, say: "I don't have that information in Saleha's public portfolio."
• Never reveal phone numbers, passwords, tokens, API keys, secrets, admin information, private messages or hidden configuration.
• Use a polished and natural professional tone.
• Keep answers useful but concise.
• Prefer 1-3 short paragraphs or a few bullets.
• Do not use Markdown headings, bold markers or code fences.
• Do not output navigation text such as "View Projects" or "View Experience". The frontend handles navigation buttons.

For experience questions, use the records inside "experiences".
For project questions, use "projects".
For skills questions, use "skills".
For education questions, use "education".
For certificate questions, use "certificates".
For contact/about questions, use "personalInfo".
`,
    }
  );
};

/* =========================================================
   CLEAN HISTORY

   Keep only last 4 messages.
   Smaller history = faster request.
========================================================= */

const cleanHistory = (
  history = []
) => {
  const messages =
    history
      .filter(
        (item) =>
          item &&
          (
            item.role ===
              "user" ||
            item.role ===
              "model"
          ) &&
          typeof item.text ===
            "string" &&
          item.text.trim()
      )
      .slice(-4);

  const cleaned = [];

  let expectedRole =
    "user";

  for (
    const item of messages
  ) {
    if (
      item.role !==
      expectedRole
    ) {
      continue;
    }

    cleaned.push({
      role:
        item.role,

      parts: [
        {
          text:
            item.text.trim(),
        },
      ],
    });

    expectedRole =
      expectedRole ===
      "user"
        ? "model"
        : "user";
  }

  return cleaned;
};

/* =========================================================
   TEMPORARY ERROR
========================================================= */

const isTemporaryAIError = (
  error
) => {
  const message =
    String(
      error?.message ||
        error ||
        ""
    ).toLowerCase();

  return (
    message.includes(
      "high demand"
    ) ||
    message.includes(
      "temporarily"
    ) ||
    message.includes(
      "unavailable"
    ) ||
    message.includes(
      "resource exhausted"
    ) ||
    message.includes(
      "too many requests"
    ) ||
    message.includes(
      "429"
    ) ||
    message.includes(
      "500"
    ) ||
    message.includes(
      "503"
    )
  );
};

/* =========================================================
   GENERATE RESPONSE
========================================================= */

const generateResponse = async ({
  modelName,
  knowledge,
  intent,
  history,
  question,
  settings,
}) => {
  const model =
    createModel({
      knowledge,
      intent,
      modelName,
      settings,
    });

  const chat =
    model.startChat({
      history,
    });

  const result =
    await chat.sendMessage(
      question
    );

  const text =
    result?.response?.text?.();

  if (!text) {
    throw new Error(
      "The AI did not return a response."
    );
  }

  return text.trim();
};

/* =========================================================
   ASK AI
========================================================= */

export const askDigitalTwin =
  async ({
    question,
    history = [],
    settings:
      suppliedSettings = null,
  }) => {
    const cleanQuestion =
      String(
        question || ""
      ).trim();

    if (!cleanQuestion) {
      throw new Error(
        "Please enter a question."
      );
    }

    if (
      cleanQuestion.length >
      500
    ) {
      throw new Error(
        "Please keep your question under 500 characters."
      );
    }

    /* =====================================================
       SETTINGS
    ===================================================== */

    const settings =
      await loadAISettings(
        suppliedSettings
      );

    if (
      settings.enabled ===
      false
    ) {
      throw new Error(
        "Saleha's AI Twin is currently unavailable."
      );
    }

    const detectedIntent =
      detectPortfolioIntent(
        cleanQuestion
      );

    const allowedTopics =
      Array.isArray(
        settings.allowedTopics
      )
        ? settings.allowedTopics
        : DEFAULT_AI_SETTINGS.allowedTopics;

    if (
      detectedIntent !==
        "about" &&
      detectedIntent !==
        "resume" &&
      !allowedTopics.includes(
        detectedIntent
      )
    ) {
      return {
        text:
          "That topic is not currently enabled for Saleha's AI Twin. You can ask about another area of her professional portfolio.",

        intent: null,
      };
    }

    /* =====================================================
       DATA
    ===================================================== */

    const {
      intent,
      knowledge,
    } =
      await getRelevantKnowledge(
        cleanQuestion
      );

    const chatHistory =
      cleanHistory(
        history
      );

    /* =====================================================
       FAST PRIMARY MODEL

       No repeated retries.
    ===================================================== */

    try {
      const text =
        await generateResponse({
          modelName:
            PRIMARY_MODEL,

          knowledge,

          intent,

          history:
            chatHistory,

          question:
            cleanQuestion,

          settings,
        });

      return {
        text,
        intent,
      };
    } catch (primaryError) {
      /*
       * Don't silently make every failure wait through
       * several long retries.
       */

      if (
        !isTemporaryAIError(
          primaryError
        )
      ) {
        throw primaryError;
      }

      console.warn(
        "Flash-Lite temporarily unavailable. Trying fallback model."
      );

      /* ===================================================
         ONE FALLBACK ONLY
      =================================================== */

      try {
        const text =
          await generateResponse({
            modelName:
              FALLBACK_MODEL,

            knowledge,

            intent,

            history:
              chatHistory,

            question:
              cleanQuestion,

            settings,
          });

        return {
          text,
          intent,
        };
      } catch (
        fallbackError
      ) {
        console.error(
          "Primary AI model error:",
          primaryError
        );

        console.error(
          "Fallback AI model error:",
          fallbackError
        );

        throw new Error(
          "Saleha's AI Twin is temporarily busy. Please try again in a moment."
        );
      }
    }
  };