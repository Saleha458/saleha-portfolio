import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  FiCpu,
  FiRefreshCw,
  FiSave,
} from "react-icons/fi";

import {
  DEFAULT_AI_SETTINGS,
  getAISettings,
  saveAISettings,
} from "../services/aiSettingsService";

import {
  refreshPortfolioKnowledge,
} from "../services/digitalTwinService";

const TOPICS = [
  {
    id: "about",
    label: "About",
  },
  {
    id: "skills",
    label: "Skills",
  },
  {
    id: "projects",
    label: "Projects",
  },
  {
    id: "experience",
    label: "Experience",
  },
  {
    id: "education",
    label: "Education",
  },
  {
    id: "certificates",
    label: "Certificates",
  },
  {
    id: "contact",
    label: "Contact & Availability",
  },
];

function AITwinSettings() {
  const [
    settings,
    setSettings,
  ] = useState(
    DEFAULT_AI_SETTINGS
  );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    refreshing,
    setRefreshing,
  ] = useState(false);

  const [
    success,
    setSuccess,
  ] = useState("");

  const [
    error,
    setError,
  ] = useState("");

  /* =======================================================
     LOAD SETTINGS
  ======================================================= */

  const loadSettings =
    useCallback(async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          await getAISettings();

        setSettings(data);
      } catch (
        loadError
      ) {
        console.error(
          "Failed to load AI settings:",
          loadError
        );

        setError(
          "AI Twin settings could not be loaded."
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  /* =======================================================
     INPUT CHANGE
  ======================================================= */

  const handleChange =
    (event) => {
      const {
        name,
        value,
      } = event.target;

      setSettings(
        (previous) => ({
          ...previous,
          [name]: value,
        })
      );

      setSuccess("");
      setError("");
    };

  /* =======================================================
     ENABLE / DISABLE
  ======================================================= */

  const toggleEnabled = () => {
    setSettings(
      (previous) => ({
        ...previous,
        enabled:
          !previous.enabled,
      })
    );

    setSuccess("");
    setError("");
  };

  /* =======================================================
     TOPICS
  ======================================================= */

  const toggleTopic = (
    topic
  ) => {
    setSettings(
      (previous) => {
        const current =
          Array.isArray(
            previous.allowedTopics
          )
            ? previous.allowedTopics
            : [];

        const exists =
          current.includes(
            topic
          );

        return {
          ...previous,

          allowedTopics:
            exists
              ? current.filter(
                  (item) =>
                    item !== topic
                )
              : [
                  ...current,
                  topic,
                ],
        };
      }
    );

    setSuccess("");
    setError("");
  };

  /* =======================================================
     SAVE
  ======================================================= */

  const handleSave =
    async (event) => {
      event.preventDefault();

      setSaving(true);
      setSuccess("");
      setError("");

      try {
        await saveAISettings(
          settings
        );

        setSuccess(
          "AI Twin settings saved successfully."
        );
      } catch (
        saveError
      ) {
        console.error(
          "Failed to save AI settings:",
          saveError
        );

        setError(
          "Unable to save AI Twin settings."
        );
      } finally {
        setSaving(false);
      }
    };

  /* =======================================================
     REFRESH KNOWLEDGE
  ======================================================= */

  const handleRefresh =
    async () => {
      try {
        setRefreshing(true);
        setSuccess("");
        setError("");

        await refreshPortfolioKnowledge();

        setSuccess(
          "AI portfolio knowledge cache refreshed successfully."
        );
      } catch (
        refreshError
      ) {
        console.error(
          "AI knowledge refresh failed:",
          refreshError
        );

        setError(
          "Unable to refresh AI knowledge."
        );
      } finally {
        setRefreshing(false);
      }
    };

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
        <div className="flex items-center gap-3 text-slate-400">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/10 border-t-indigo-500" />

          Loading AI Twin settings...
        </div>
      </div>
    );
  }

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="mx-auto max-w-4xl">
      {/* HEADER */}

      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400">
            <FiCpu
              size={23}
            />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">
              AI Twin Settings
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Control how your AI portfolio assistant behaves.
            </p>
          </div>
        </div>
      </div>

      {/* STATUS */}

      {success && (
        <div
          className="mb-6 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300"
          role="status"
        >
          {success}
        </div>
      )}

      {error && (
        <div
          className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300"
          role="alert"
        >
          {error}
        </div>
      )}

      <form
        onSubmit={
          handleSave
        }
        className="space-y-6"
      >
        {/* ENABLE */}

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-semibold text-white">
                Enable AI Twin
              </h3>

              <p className="mt-1 max-w-xl text-sm leading-6 text-slate-400">
                When disabled, visitors will not see the AI Twin button on the public portfolio.
              </p>
            </div>

            <button
              type="button"
              onClick={
                toggleEnabled
              }
              className={`relative h-7 w-14 shrink-0 rounded-full transition ${
                settings.enabled
                  ? "bg-indigo-600"
                  : "bg-slate-700"
              }`}
              aria-pressed={
                settings.enabled
              }
              aria-label="Enable or disable AI Twin"
            >
              <span
                className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
                  settings.enabled
                    ? "left-8"
                    : "left-1"
                }`}
              />
            </button>
          </div>
        </div>

        {/* INTRODUCTION */}

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
          <label
            htmlFor="ai-introduction"
            className="block font-semibold text-white"
          >
            AI Introduction
          </label>

          <p className="mt-1 text-sm text-slate-400">
            This message appears when visitors first open the AI Twin.
          </p>

          <textarea
            id="ai-introduction"
            name="introduction"
            value={
              settings.introduction
            }
            onChange={
              handleChange
            }
            rows={4}
            maxLength={400}
            className="mt-4 w-full resize-y rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          />

          <p className="mt-2 text-right text-xs text-slate-500">
            {
              settings
                .introduction
                .length
            }
            /400
          </p>
        </div>

        {/* TONE */}

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
          <label
            htmlFor="ai-tone"
            className="block font-semibold text-white"
          >
            Response Tone
          </label>

          <p className="mt-1 text-sm text-slate-400">
            Choose the communication style used by the assistant.
          </p>

          <select
            id="ai-tone"
            name="tone"
            value={
              settings.tone
            }
            onChange={
              handleChange
            }
            className="mt-4 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
          >
            <option value="professional">
              Professional
            </option>

            <option value="friendly">
              Friendly
            </option>

            <option value="concise">
              Professional & Concise
            </option>
          </select>
        </div>

        {/* TOPICS */}

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
          <h3 className="font-semibold text-white">
            Allowed Topics
          </h3>

          <p className="mt-1 text-sm text-slate-400">
            Select which portfolio areas the AI Twin is allowed to discuss.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {TOPICS.map(
              (topic) => {
                const checked =
                  settings.allowedTopics?.includes(
                    topic.id
                  );

                return (
                  <label
                    key={
                      topic.id
                    }
                    className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-slate-950/50 p-4 transition hover:border-indigo-500/30 hover:bg-white/5"
                  >
                    <input
                      type="checkbox"
                      checked={
                        checked
                      }
                      onChange={() =>
                        toggleTopic(
                          topic.id
                        )
                      }
                      className="h-4 w-4 accent-indigo-600"
                    />

                    <span className="text-sm text-slate-300">
                      {
                        topic.label
                      }
                    </span>
                  </label>
                );
              }
            )}
          </div>
        </div>

        {/* KNOWLEDGE */}

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
          <h3 className="font-semibold text-white">
            AI Knowledge
          </h3>

          <p className="mt-1 text-sm leading-6 text-slate-400">
            Clear the temporary portfolio cache after major content updates.
          </p>

          <button
            type="button"
            onClick={
              handleRefresh
            }
            disabled={
              refreshing
            }
            className="mt-4 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FiRefreshCw
              size={16}
              className={
                refreshing
                  ? "animate-spin"
                  : ""
              }
            />

            {refreshing
              ? "Refreshing..."
              : "Refresh AI Knowledge"}
          </button>
        </div>

        {/* SAVE */}

        <button
          type="submit"
          disabled={
            saving
          }
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          <FiSave
            size={17}
          />

          {saving
            ? "Saving..."
            : "Save AI Settings"}
        </button>
      </form>
    </div>
  );
}

export default AITwinSettings;