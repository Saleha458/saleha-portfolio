import {
  useEffect,
  useState,
} from "react";

import {
  FiArrowLeft,
  FiDownload,
  FiExternalLink,
  FiFileText,
  FiRefreshCw,
} from "react-icons/fi";

import {
  Link,
} from "react-router-dom";

import {
  getResume,
} from "../services/resumeService";

const RESUME_CACHE_KEY =
  "saleha-portfolio-resume";

const CACHE_TIME =
  10 * 60 * 1000;

/* =========================================================
   READ CACHE
========================================================= */

const readResumeCache = () => {
  try {
    const raw =
      sessionStorage.getItem(
        RESUME_CACHE_KEY
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
      CACHE_TIME
    ) {
      sessionStorage.removeItem(
        RESUME_CACHE_KEY
      );

      return null;
    }

    return parsed.data;
  } catch {
    return null;
  }
};

/* =========================================================
   SAVE CACHE
========================================================= */

const saveResumeCache = (
  data
) => {
  if (!data) {
    return;
  }

  try {
    sessionStorage.setItem(
      RESUME_CACHE_KEY,
      JSON.stringify({
        data,

        cachedAt:
          Date.now(),
      })
    );
  } catch {
    // Ignore storage failure.
  }
};

/* =========================================================
   DOWNLOAD FILE NAME
========================================================= */

const getDownloadFileName = (
  resume
) => {
  const original =
    String(
      resume?.fileName || ""
    ).trim();

  if (original) {
    return original;
  }

  return "Saleha-Imtiaz-Resume.pdf";
};

/* =========================================================
   COMPONENT
========================================================= */

function Resume() {
  const cachedResume =
    readResumeCache();

  const [
    resume,
    setResume,
  ] = useState(
    cachedResume
  );

  const [
    loading,
    setLoading,
  ] = useState(
    !cachedResume
  );

  const [
    error,
    setError,
  ] = useState("");

  const [
    previewLoaded,
    setPreviewLoaded,
  ] = useState(false);

  const [
    downloading,
    setDownloading,
  ] = useState(false);

  /* =======================================================
     LOAD / REFRESH RESUME
  ======================================================= */

  const loadResume =
    async () => {
      try {
        if (!resume) {
          setLoading(true);
        }

        setError("");

        const data =
          await getResume();

        if (
          !data ||
          !data.resumeUrl
        ) {
          if (!resume) {
            setError(
              "Resume is currently unavailable."
            );
          }

          return;
        }

        setResume(data);

        saveResumeCache(
          data
        );
      } catch (loadError) {
        console.error(
          "Failed to load resume:",
          loadError
        );

        if (!resume) {
          setError(
            "Unable to load the resume right now."
          );
        }
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    loadResume();
  }, []);

  /* =======================================================
     RESUME DATA
  ======================================================= */

  const resumeUrl =
    resume?.resumeUrl || "";

  const fileType =
    String(
      resume?.fileType || ""
    ).toLowerCase();

  const fileName =
    String(
      resume?.fileName || ""
    ).toLowerCase();

  const isPdf =
    fileType.includes(
      "pdf"
    ) ||
    fileName.endsWith(
      ".pdf"
    ) ||
    resumeUrl
      .toLowerCase()
      .includes(".pdf");

  const previewUrl =
    isPdf && resumeUrl
      ? `${resumeUrl}#toolbar=0&navpanes=0&view=FitH`
      : resumeUrl;

  /* =======================================================
     DOWNLOAD
  ======================================================= */

  const handleDownload =
    async () => {
      if (
        !resumeUrl ||
        downloading
      ) {
        return;
      }

      try {
        setDownloading(true);

        const response =
          await fetch(
            resumeUrl
          );

        if (!response.ok) {
          throw new Error(
            "Resume download failed."
          );
        }

        const blob =
          await response.blob();

        const localUrl =
          URL.createObjectURL(
            blob
          );

        const anchor =
          document.createElement(
            "a"
          );

        anchor.href =
          localUrl;

        anchor.download =
          getDownloadFileName(
            resume
          );

        document.body.appendChild(
          anchor
        );

        anchor.click();

        anchor.remove();

        window.setTimeout(
          () => {
            URL.revokeObjectURL(
              localUrl
            );
          },
          1000
        );
      } catch (downloadError) {
        console.error(
          "Resume download failed:",
          downloadError
        );

        window.open(
          resumeUrl,
          "_blank",
          "noopener,noreferrer"
        );
      } finally {
        setDownloading(false);
      }
    };

  /* =======================================================
     PAGE
  ======================================================= */

  return (
    <div
      className="
        min-h-screen

        bg-slate-50
        text-slate-900

        dark:bg-slate-900
        dark:text-white
      "
    >
      {/* ===================================================
          HEADER
      =================================================== */}

      <header
        className="
          sticky
          top-0
          z-40

          border-b
          border-slate-200

          bg-white/95

          backdrop-blur-xl

          dark:border-slate-700
          dark:bg-slate-900/95
        "
      >
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link
            to="/"
            className="
              inline-flex
              items-center
              gap-2

              text-sm
              font-medium
              text-slate-600

              transition

              hover:text-indigo-600

              dark:text-slate-300
              dark:hover:text-white
            "
          >
            <FiArrowLeft
              size={18}
            />

            <span className="hidden sm:inline">
              Back to Portfolio
            </span>

            <span className="sm:hidden">
              Back
            </span>
          </Link>

          <div className="text-right sm:text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              Saleha Imtiaz
            </p>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
              Professional Resume
            </p>
          </div>
        </div>
      </header>

      {/* ===================================================
          CONTENT
      =================================================== */}

      <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-8 sm:px-6 sm:pt-10">
        {/* =================================================
            INTRO
        ================================================= */}

        <section className="mx-auto mb-8 max-w-4xl text-center sm:mb-10">
          <div
            className="
              mx-auto
              flex
              h-14
              w-14
              items-center
              justify-center

              rounded-2xl

              bg-indigo-50
              text-indigo-600

              dark:bg-indigo-500/10
              dark:text-indigo-400
            "
          >
            <FiFileText
              size={27}
            />
          </div>

          <p className="mt-5 text-xs font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            Resume
          </p>

          <h1
            className="
              mt-2

              text-3xl
              font-bold
              tracking-tight
              text-slate-900

              dark:text-white

              sm:text-4xl
            "
          >
            {resume?.title ||
              "Saleha Imtiaz - CV / Resume"}
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400 sm:text-base">
            {resume?.description ||
              "View my professional experience, technical skills, projects, certifications and education."}
          </p>

          {/* ACTIONS */}

          {resumeUrl && (
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href={
                  resumeUrl
                }
                target="_blank"
                rel="noopener noreferrer"
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2

                  rounded-xl
                  border
                  border-slate-200

                  bg-white

                  px-5
                  py-3

                  text-sm
                  font-semibold
                  text-slate-700

                  shadow-sm

                  transition
                  duration-300

                  hover:border-indigo-200
                  hover:text-indigo-600

                  dark:border-slate-700
                  dark:bg-slate-800
                  dark:text-slate-200
                  dark:hover:border-indigo-500/30
                  dark:hover:text-white
                "
              >
                <FiExternalLink
                  size={17}
                />

                Open Full Resume
              </a>

              <button
                type="button"
                onClick={
                  handleDownload
                }
                disabled={
                  downloading
                }
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2

                  rounded-xl

                  bg-indigo-600

                  px-5
                  py-3

                  text-sm
                  font-semibold
                  text-white

                  shadow-sm

                  transition
                  duration-300

                  hover:bg-indigo-500

                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {downloading ? (
                  <FiRefreshCw
                    size={17}
                    className="animate-spin"
                  />
                ) : (
                  <FiDownload
                    size={17}
                  />
                )}

                {downloading
                  ? "Downloading..."
                  : "Download PDF"}
              </button>
            </div>
          )}
        </section>

        {/* =================================================
            INITIAL LOADING
        ================================================= */}

        {loading &&
          !resume && (
            <section className="mx-auto max-w-4xl">
              <div
                className="
                  overflow-hidden

                  rounded-3xl
                  border
                  border-slate-200

                  bg-white

                  shadow-sm

                  dark:border-slate-700
                  dark:bg-slate-800
                "
              >
                <div
                  className="
                    flex
                    items-center
                    gap-3

                    border-b
                    border-slate-200

                    px-5
                    py-4

                    dark:border-slate-700
                  "
                >
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-500 dark:border-slate-700 dark:border-t-indigo-400" />

                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Preparing resume preview...
                  </p>
                </div>

                <div className="p-5">
                  <div
                    className="
                      mx-auto
                      max-w-3xl
                      rounded-2xl

                      bg-slate-100

                      dark:bg-slate-700/60
                    "
                    style={{
                      height:
                        "min(70vh, 760px)",

                      minHeight:
                        "420px",
                    }}
                  />
                </div>
              </div>
            </section>
          )}

        {/* =================================================
            ERROR
        ================================================= */}

        {!loading &&
          error &&
          !resume && (
            <section
              className="
                mx-auto
                max-w-xl

                rounded-3xl
                border
                border-slate-200

                bg-white

                p-8
                text-center

                shadow-sm

                dark:border-slate-700
                dark:bg-slate-800
              "
            >
              <FiFileText
                size={34}
                className="mx-auto text-indigo-600 dark:text-indigo-400"
              />

              <h2 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
                Resume unavailable
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                {error}
              </p>

              <button
                type="button"
                onClick={
                  loadResume
                }
                className="
                  mt-6
                  inline-flex
                  items-center
                  gap-2

                  rounded-xl

                  bg-indigo-600

                  px-5
                  py-3

                  text-sm
                  font-semibold
                  text-white

                  transition

                  hover:bg-indigo-500
                "
              >
                <FiRefreshCw
                  size={16}
                />

                Try Again
              </button>
            </section>
          )}

        {/* =================================================
            PDF PREVIEW
        ================================================= */}

        {resume &&
          isPdf && (
            <section className="mx-auto max-w-4xl">
              <div
                className="
                  overflow-hidden

                  rounded-3xl
                  border
                  border-slate-200

                  bg-white

                  shadow-xl

                  dark:border-slate-700
                  dark:bg-slate-800
                "
              >
                {/* PREVIEW HEADER */}

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    gap-4

                    border-b
                    border-slate-200

                    bg-slate-50

                    px-4
                    py-3

                    dark:border-slate-700
                    dark:bg-slate-900

                    sm:px-5
                  "
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-200">
                      Professional Resume
                    </p>

                    <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
                      {resume.fileName ||
                        "Saleha-Imtiaz-Resume.pdf"}
                    </p>
                  </div>

                  <span
                    className="
                      rounded-full

                      bg-emerald-50

                      px-3
                      py-1

                      text-xs
                      font-medium
                      text-emerald-600

                      dark:bg-emerald-500/10
                      dark:text-emerald-400
                    "
                  >
                    PDF
                  </span>
                </div>

                {/* PDF AREA */}

                <div
                  className="
                    relative

                    bg-slate-100

                    p-2

                    dark:bg-slate-800

                    sm:p-5
                  "
                >
                  {!previewLoaded && (
                    <div
                      className="
                        absolute
                        inset-2
                        z-10

                        flex
                        items-center
                        justify-center

                        rounded-xl

                        bg-slate-100

                        dark:bg-slate-900

                        sm:inset-5
                      "
                    >
                      <div className="text-center">
                        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-500 dark:border-slate-700 dark:border-t-indigo-400" />

                        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                          Loading preview...
                        </p>
                      </div>
                    </div>
                  )}

                  <iframe
                    src={
                      previewUrl
                    }
                    title="Saleha Imtiaz Resume"
                    onLoad={() =>
                      setPreviewLoaded(
                        true
                      )
                    }
                    className="
                      mx-auto
                      block
                      w-full
                      max-w-3xl

                      rounded-xl

                      bg-white

                      shadow-sm
                    "
                    style={{
                      height:
                        "min(78vh, 900px)",

                      minHeight:
                        "500px",
                    }}
                  />
                </div>
              </div>

              <p className="mt-4 text-center text-xs leading-5 text-slate-500 dark:text-slate-400">
                Use Open Full Resume for the complete browser PDF view.
              </p>
            </section>
          )}

        {/* =================================================
            NON PDF
        ================================================= */}

        {resume &&
          !isPdf && (
            <section
              className="
                mx-auto
                max-w-3xl

                rounded-3xl
                border
                border-slate-200

                bg-white

                p-8
                text-center

                shadow-sm

                dark:border-slate-700
                dark:bg-slate-800

                sm:p-12
              "
            >
              <div
                className="
                  mx-auto
                  flex
                  h-20
                  w-20
                  items-center
                  justify-center

                  rounded-3xl

                  bg-indigo-50
                  text-indigo-600

                  dark:bg-indigo-500/10
                  dark:text-indigo-400
                "
              >
                <FiFileText
                  size={38}
                />
              </div>

              <h2 className="mt-6 text-2xl font-bold text-slate-900 dark:text-white">
                Resume Ready
              </h2>

              <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-600 dark:text-slate-400">
                Use the buttons above to open or download the resume.
              </p>
            </section>
          )}
      </main>
    </div>
  );
}

export default Resume;