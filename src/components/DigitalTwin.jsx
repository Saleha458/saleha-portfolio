import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  motion,
} from "framer-motion";

import {
  FiArrowRight,
  FiArrowUp,
  FiAward,
  FiBookOpen,
  FiBriefcase,
  FiCode,
  FiCpu,
  FiFileText,
  FiLoader,
  FiMail,
  FiMessageCircle,
  FiRotateCcw,
  FiTool,
  FiX,
} from "react-icons/fi";

import {
  askDigitalTwin,
} from "../services/digitalTwinService";

import {
  DEFAULT_AI_SETTINGS,
  subscribeToAISettings,
} from "../services/aiSettingsService";

/* =========================================================
   QUESTIONS
========================================================= */

const SUGGESTED_QUESTIONS = [
  "What technologies does Saleha work with?",
  "Tell me about Saleha's projects.",
  "What experience does Saleha have?",
  "Tell me about CalcAI Pro.",
  "Is Saleha available for work?",
  "What makes Saleha a good developer?",
];

/* =========================================================
   NAVIGATION ACTIONS
========================================================= */

const ACTIONS = {
  projects: {
    label: "View Projects",
    section: "projects",
    icon: FiCode,
  },

  skills: {
    label: "View Skills",
    section: "skills",
    icon: FiTool,
  },

  experience: {
    label: "View Experience",
    section: "experience",
    icon: FiBriefcase,
  },

  education: {
    label: "View Education",
    section: "education",
    icon: FiBookOpen,
  },

  certificates: {
    label: "View Certificates",
    section: "certificates",
    icon: FiAward,
  },

  contact: {
    label: "Contact Saleha",
    section: "contact",
    icon: FiMail,
  },

  resume: {
    label: "View Resume",
    route: "/resume",
    icon: FiFileText,
  },
};

/* =========================================================
   CLEAN AI TEXT
========================================================= */

const formatAssistantText =
  (text = "") =>
    String(text)
      .replace(
        /```[\s\S]*?```/g,
        ""
      )
      .replace(
        /\*\*(.*?)\*\*/g,
        "$1"
      )
      .replace(
        /__(.*?)__/g,
        "$1"
      )
      .replace(
        /^#{1,6}\s*/gm,
        ""
      )
      .replace(
        /^\s*[-*+]\s+/gm,
        "• "
      )
      .replace(
        /^\s*\d+[.)]\s+/gm,
        "• "
      )
      .replace(
        /\n{3,}/g,
        "\n\n"
      )
      .trim();

/* =========================================================
   COMPONENT
========================================================= */

function DigitalTwin() {
  const [
    aiSettings,
    setAISettings,
  ] = useState(
    DEFAULT_AI_SETTINGS
  );

  const [
    settingsReady,
    setSettingsReady,
  ] = useState(false);

  const [
    open,
    setOpen,
  ] = useState(false);

  const [
    messages,
    setMessages,
  ] = useState([]);

  const [
    input,
    setInput,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const messagesEndRef =
    useRef(null);

  const textareaRef =
    useRef(null);

  /* =======================================================
     SETTINGS
  ======================================================= */

  useEffect(() => {
    const unsubscribe =
      subscribeToAISettings(
        (settings) => {
          setAISettings(
            settings
          );

          setSettingsReady(
            true
          );
        },

        () => {
          setSettingsReady(
            true
          );
        }
      );

    return () =>
      unsubscribe();
  }, []);

  /* =======================================================
     WELCOME MESSAGE
  ======================================================= */

  useEffect(() => {
    if (!settingsReady) {
      return;
    }

    setMessages(
      (previous) => {
        if (
          previous.length >
          1
        ) {
          return previous;
        }

        return [
          {
            id: "welcome",

            role: "model",

            text:
              aiSettings.introduction ||
              DEFAULT_AI_SETTINGS.introduction,

            intent: null,
          },
        ];
      }
    );
  }, [
    settingsReady,
    aiSettings.introduction,
  ]);

  /* =======================================================
     AUTO CLOSE IF ADMIN DISABLES AI
  ======================================================= */

  useEffect(() => {
    if (
      aiSettings.enabled ===
      false
    ) {
      setOpen(false);
    }
  }, [
    aiSettings.enabled,
  ]);

  /* =======================================================
     AUTO SCROLL
  ======================================================= */

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView(
      {
        behavior: "smooth",
      }
    );
  }, [
    messages,
    loading,
  ]);

  /* =======================================================
     ESCAPE
  ======================================================= */

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handleEscape =
      (event) => {
        if (
          event.key ===
          "Escape"
        ) {
          setOpen(false);
        }
      };

    window.addEventListener(
      "keydown",
      handleEscape
    );

    return () =>
      window.removeEventListener(
        "keydown",
        handleEscape
      );
  }, [open]);

  /* =======================================================
     RESET CHAT
  ======================================================= */

  const resetChat = () => {
    setMessages([
      {
        id: "welcome",

        role: "model",

        text:
          aiSettings.introduction ||
          DEFAULT_AI_SETTINGS.introduction,

        intent: null,
      },
    ]);

    setInput("");
    setError("");

    window.setTimeout(
      () => {
        textareaRef.current?.focus();
      },
      50
    );
  };

  /* =======================================================
     ACTION
  ======================================================= */

  const handleAction =
    (action) => {
      if (action.route) {
        window.location.href =
          action.route;

        return;
      }

      const section =
        document.getElementById(
          action.section
        );

      if (!section) {
        return;
      }

      setOpen(false);

      window.setTimeout(
        () => {
          section.scrollIntoView(
            {
              behavior: "smooth",
              block: "start",
            }
          );
        },
        100
      );
    };

  /* =======================================================
     SEND MESSAGE
  ======================================================= */

  const sendMessage =
    async (
      forcedQuestion = ""
    ) => {
      const question =
        String(
          forcedQuestion ||
            input
        ).trim();

      if (
        !question ||
        loading
      ) {
        return;
      }

      setError("");

      const userMessage = {
        id:
          `user-${Date.now()}`,

        role: "user",

        text: question,

        intent: null,
      };

      const history =
        messages
          .filter(
            (
              message
            ) =>
              message.id !==
                "welcome" &&
              (
                message.role ===
                  "user" ||
                message.role ===
                  "model"
              )
          )
          .map(
            (
              message
            ) => ({
              role:
                message.role,

              text:
                message.text,
            })
          );

      setMessages(
        (previous) => [
          ...previous,
          userMessage,
        ]
      );

      setInput("");
      setLoading(true);

      try {
        const result =
          await askDigitalTwin({
            question,

            history,

            settings:
              aiSettings,
          });

        setMessages(
          (previous) => [
            ...previous,

            {
              id:
                `model-${Date.now()}`,

              role:
                "model",

              text:
                result.text,

              intent:
                result.intent,
            },
          ]
        );
      } catch (sendError) {
        console.error(
          "Digital Twin error:",
          sendError
        );

        setError(
          sendError?.message ||
            "I couldn't respond right now. Please try again."
        );
      } finally {
        setLoading(false);

        window.setTimeout(
          () => {
            textareaRef.current?.focus();
          },
          50
        );
      }
    };

  /* =======================================================
     KEYBOARD
  ======================================================= */

  const handleKeyDown =
    (event) => {
      if (
        event.key ===
          "Enter" &&
        !event.shiftKey
      ) {
        event.preventDefault();

        sendMessage();
      }
    };

  /* =======================================================
     ADMIN DISABLED
  ======================================================= */

  if (
    !settingsReady ||
    aiSettings.enabled ===
      false
  ) {
    return null;
  }

  /* =======================================================
     UI
  ======================================================= */

  return (
    <>
      {/* ===================================================
          FLOATING LAUNCHER
      =================================================== */}

      {!open && (
        <motion.button
          type="button"
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          whileHover={{
            y: -2,
          }}
          whileTap={{
            scale: 0.98,
          }}
          onClick={() =>
            setOpen(true)
          }
          aria-label="Open Saleha's AI Twin"
          className="
            fixed
            bottom-3
            right-3
            z-40

            flex
            items-center
            justify-center
            gap-2

            rounded-2xl
            border
            border-slate-200

            bg-white/95
            px-2.5
            py-2

            text-xs
            font-semibold
            text-slate-800

            shadow-xl
            shadow-slate-900/10

            backdrop-blur-xl

            transition
            duration-300

            hover:border-indigo-200
            hover:shadow-2xl

            dark:border-slate-700
            dark:bg-slate-800/95
            dark:text-white
            dark:shadow-black/20
            dark:hover:border-indigo-500/30

            min-[360px]:bottom-4
            min-[360px]:right-4
            min-[360px]:gap-2.5
            min-[360px]:px-3
            min-[360px]:py-2.5

            sm:bottom-6
            sm:right-6
            sm:px-4
            sm:py-3
            sm:text-sm
          "
        >
          <span
            className="
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center

              rounded-xl

              bg-indigo-600
              text-white

              shadow-sm
            "
          >
            <FiCpu
              size={17}
            />
          </span>

          <span className="whitespace-nowrap min-[360px]:hidden">
            Ask AI
          </span>

          <span className="hidden whitespace-nowrap min-[360px]:inline">
            Ask Saleha's AI Twin
          </span>
        </motion.button>
      )}

      {/* ===================================================
          MODAL
      =================================================== */}

      {open && (
        <div
          className="
            fixed
            inset-0
            z-50

            bg-slate-950/70
            backdrop-blur-sm

            sm:flex
            sm:items-center
            sm:justify-center
            sm:p-5
          "
        >
          <motion.div
            initial={{
              opacity: 0,
              y: 18,
              scale: 0.98,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            transition={{
              duration: 0.25,
            }}
            className="
              flex
              h-dvh
              w-full
              flex-col
              overflow-hidden

              bg-white
              text-slate-900

              shadow-2xl

              dark:bg-slate-900
              dark:text-white

              sm:h-[92vh]
              sm:max-w-3xl
              sm:rounded-3xl
              sm:border
              sm:border-slate-200

              dark:sm:border-slate-700
            "
            role="dialog"
            aria-modal="true"
            aria-labelledby="ai-twin-title"
          >
            {/* =============================================
                HEADER
            ============================================= */}

            <header
              className="
                flex
                shrink-0
                items-center
                justify-between

                border-b
                border-slate-200

                bg-white/95

                px-4
                py-3.5

                backdrop-blur-xl

                dark:border-slate-700
                dark:bg-slate-900/95

                sm:px-5
                sm:py-4
              "
            >
              <div className="flex min-w-0 items-center gap-3">
                <div
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center

                    rounded-xl

                    bg-indigo-50
                    text-indigo-600

                    dark:bg-indigo-500/10
                    dark:text-indigo-400
                  "
                >
                  <FiCpu
                    size={21}
                  />
                </div>

                <div className="min-w-0">
                  <h2
                    id="ai-twin-title"
                    className="truncate text-sm font-bold sm:text-base"
                  >
                    Saleha's AI Twin
                  </h2>

                  <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
                    Professional portfolio assistant
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={
                    resetChat
                  }
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center

                    rounded-lg

                    text-slate-500

                    transition

                    hover:bg-slate-100
                    hover:text-slate-900

                    dark:text-slate-400
                    dark:hover:bg-slate-800
                    dark:hover:text-white
                  "
                  aria-label="Reset chat"
                >
                  <FiRotateCcw
                    size={16}
                  />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setOpen(false)
                  }
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center

                    rounded-lg

                    text-slate-500

                    transition

                    hover:bg-slate-100
                    hover:text-slate-900

                    dark:text-slate-400
                    dark:hover:bg-slate-800
                    dark:hover:text-white
                  "
                  aria-label="Close AI Twin"
                >
                  <FiX
                    size={19}
                  />
                </button>
              </div>
            </header>

            {/* =============================================
                BODY
            ============================================= */}

            <div
              className="
                min-h-0
                flex-1
                overflow-y-auto
                overscroll-contain

                bg-white

                px-3
                py-4

                dark:bg-slate-900

                sm:px-6
                sm:py-5
              "
            >
              {messages.length <=
                1 && (
                <div className="mb-7">
                  <span
                    className="
                      inline-flex
                      items-center
                      gap-2

                      rounded-full
                      border
                      border-indigo-200

                      bg-indigo-50

                      px-3
                      py-1.5

                      text-xs
                      font-medium
                      text-indigo-700

                      dark:border-indigo-500/20
                      dark:bg-indigo-500/10
                      dark:text-indigo-300
                    "
                  >
                    <FiMessageCircle
                      size={13}
                    />

                    Ask about Saleha
                  </span>

                  <h3
                    className="
                      mt-5
                      max-w-xl

                      text-2xl
                      font-bold
                      leading-tight
                      tracking-tight

                      text-slate-900

                      dark:text-white

                      sm:text-3xl
                    "
                  >
                    Get to know Saleha through her AI Twin.
                  </h3>

                  <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-400">
                    Ask about her skills, projects,
                    experience, education, certifications
                    or professional background.
                  </p>

                  <div className="mt-5 grid gap-2 sm:flex sm:flex-wrap">
                    {SUGGESTED_QUESTIONS.map(
                      (
                        question
                      ) => (
                        <button
                          key={
                            question
                          }
                          type="button"
                          onClick={() =>
                            sendMessage(
                              question
                            )
                          }
                          disabled={
                            loading
                          }
                          className="
                            rounded-xl
                            border
                            border-slate-200

                            bg-white

                            px-3
                            py-2.5

                            text-left
                            text-xs
                            leading-5
                            text-slate-700

                            shadow-sm

                            transition
                            duration-300

                            hover:-translate-y-0.5
                            hover:border-indigo-200
                            hover:text-indigo-600

                            disabled:cursor-not-allowed
                            disabled:opacity-50

                            dark:border-slate-700
                            dark:bg-slate-800
                            dark:text-slate-300
                            dark:hover:border-indigo-500/30
                            dark:hover:text-white
                          "
                        >
                          {
                            question
                          }
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* ===========================================
                  MESSAGES
              =========================================== */}

              <div className="space-y-4">
                {messages.map(
                  (
                    message
                  ) => {
                    const isUser =
                      message.role ===
                      "user";

                    const action =
                      !isUser &&
                      message.intent
                        ? ACTIONS[
                            message.intent
                          ]
                        : null;

                    const ActionIcon =
                      action?.icon;

                    return (
                      <div
                        key={
                          message.id
                        }
                        className={`flex ${
                          isUser
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div className="max-w-[88%] sm:max-w-xl">
                          <div
                            className={`rounded-2xl px-3.5 py-3 text-sm leading-6 sm:px-4 ${
                              isUser
                                ? "rounded-br-md bg-indigo-600 text-white shadow-sm"
                                : "rounded-bl-md border border-slate-200 bg-slate-50 text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                            }`}
                          >
                            {!isUser && (
                              <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                                <FiCpu
                                  size={13}
                                />

                                Saleha's AI Twin
                              </div>
                            )}

                            <p className="whitespace-pre-wrap wrap-break-word">
                              {isUser
                                ? message.text
                                : formatAssistantText(
                                    message.text
                                  )}
                            </p>
                          </div>

                          {action && (
                            <button
                              type="button"
                              onClick={() =>
                                handleAction(
                                  action
                                )
                              }
                              className="
                                mt-2.5
                                inline-flex
                                items-center
                                gap-2

                                rounded-xl
                                border
                                border-indigo-200

                                bg-indigo-50

                                px-3.5
                                py-2.5

                                text-xs
                                font-semibold
                                text-indigo-700

                                transition

                                hover:bg-indigo-100

                                dark:border-indigo-500/20
                                dark:bg-indigo-500/10
                                dark:text-indigo-300
                                dark:hover:bg-indigo-500/20
                              "
                            >
                              <ActionIcon
                                size={14}
                              />

                              {
                                action.label
                              }

                              <FiArrowRight
                                size={14}
                              />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  }
                )}

                {/* =========================================
                    LOADING
                ========================================= */}

                {loading && (
                  <div className="flex justify-start">
                    <div
                      className="
                        rounded-2xl
                        rounded-bl-md
                        border
                        border-slate-200

                        bg-slate-50

                        px-4
                        py-3

                        shadow-sm

                        dark:border-slate-700
                        dark:bg-slate-800
                      "
                    >
                      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                        <FiLoader
                          size={16}
                          className="animate-spin"
                        />

                        Preparing a response...
                      </div>
                    </div>
                  </div>
                )}

                {/* =========================================
                    ERROR
                ========================================= */}

                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
                    {error}
                  </div>
                )}

                <div
                  ref={
                    messagesEndRef
                  }
                />
              </div>
            </div>

            {/* =============================================
                INPUT
            ============================================= */}

            <div
              className="
                shrink-0

                border-t
                border-slate-200

                bg-white

                p-3

                dark:border-slate-700
                dark:bg-slate-900

                sm:p-4
              "
            >
              <div
                className="
                  flex
                  items-end
                  gap-2

                  rounded-2xl
                  border
                  border-slate-200

                  bg-slate-50

                  p-2

                  transition

                  focus-within:border-indigo-400
                  focus-within:ring-2
                  focus-within:ring-indigo-500/10

                  dark:border-slate-700
                  dark:bg-slate-800
                "
              >
                <textarea
                  ref={
                    textareaRef
                  }
                  value={
                    input
                  }
                  onChange={(
                    event
                  ) =>
                    setInput(
                      event.target.value
                    )
                  }
                  onKeyDown={
                    handleKeyDown
                  }
                  disabled={
                    loading
                  }
                  rows={1}
                  maxLength={500}
                  placeholder="Ask about Saleha..."
                  className="
                    max-h-28
                    min-h-10
                    min-w-0
                    flex-1
                    resize-none

                    bg-transparent

                    px-2
                    py-2

                    text-sm
                    leading-6
                    text-slate-900

                    outline-none

                    placeholder:text-slate-400

                    dark:text-white
                    dark:placeholder:text-slate-500
                  "
                />

                <button
                  type="button"
                  onClick={() =>
                    sendMessage()
                  }
                  disabled={
                    loading ||
                    !input.trim()
                  }
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center

                    rounded-xl

                    bg-indigo-600
                    text-white

                    shadow-sm

                    transition

                    hover:bg-indigo-500

                    disabled:cursor-not-allowed
                    disabled:opacity-40
                  "
                  aria-label="Send message"
                >
                  {loading ? (
                    <FiLoader
                      size={17}
                      className="animate-spin"
                    />
                  ) : (
                    <FiArrowUp
                      size={18}
                    />
                  )}
                </button>
              </div>

              <div className="mt-2 flex items-center justify-between gap-3 px-1">
                <p className="text-xs leading-4 text-slate-500 dark:text-slate-400">
                  AI answers are based on Saleha's public portfolio.
                </p>

                <span className="shrink-0 text-xs text-slate-400 dark:text-slate-500">
                  {input.length}/500
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}

export default DigitalTwin;