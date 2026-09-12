import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { motion } from "framer-motion";

import { getCertificates } from "../services/certificateService";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";

function Certificates() {
  const [
    certificates,
    setCertificates,
  ] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [
    selectedCertificate,
    setSelectedCertificate,
  ] = useState(null);

  const loadCertificates =
    useCallback(async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          await getCertificates();

        const safeData =
          Array.isArray(data)
            ? data
            : [];

        const sortedCertificates = [
          ...safeData,
        ].sort((a, b) => {
          const verifiedA =
            a.verified ? 1 : 0;

          const verifiedB =
            b.verified ? 1 : 0;

          if (
            verifiedA !==
            verifiedB
          ) {
            return (
              verifiedB -
              verifiedA
            );
          }

          return String(
            b.issueDate || ""
          ).localeCompare(
            String(
              a.issueDate || ""
            )
          );
        });

        setCertificates(
          sortedCertificates
        );
      } catch (loadError) {
        console.error(
          "Failed to load certificates:",
          loadError
        );

        setError(
          "Certificates could not be loaded right now."
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    loadCertificates();
  }, [loadCertificates]);

  useEffect(() => {
    if (!selectedCertificate) {
      return undefined;
    }

    const handleKeyDown = (
      event
    ) => {
      if (
        event.key ===
        "Escape"
      ) {
        setSelectedCertificate(
          null
        );
      }
    };

    const previousOverflow =
      document.body.style
        .overflow;

    document.body.style.overflow =
      "hidden";

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );

      document.body.style.overflow =
        previousOverflow;
    };
  }, [selectedCertificate]);

  const formatDate = (date) => {
    if (!date) return "";

    if (
      typeof date !==
        "string" ||
      !date.includes("-")
    ) {
      return date;
    }

    const [year, month] =
      date.split("-");

    if (!year || !month) {
      return date;
    }

    const parsedDate = new Date(
      Number(year),
      Number(month) - 1
    );

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return date;
    }

    return parsedDate.toLocaleString(
      "en-US",
      {
        month: "short",
        year: "numeric",
      }
    );
  };

  if (loading) {
    return (
      <section
        id="certificates"
        className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4 py-20 dark:bg-slate-900"
      >
        <div className="w-full max-w-lg">
          <LoadingState message="Loading certificates..." />
        </div>
      </section>
    );
  }

  return (
    <>
      <section
        id="certificates"
        className="scroll-mt-24 bg-slate-50 px-4 py-20 text-slate-900 dark:bg-slate-900 dark:text-white sm:px-6 sm:py-24 lg:px-8"
      >
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{
              opacity: 0,
              y: 18,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{ once: true }}
            transition={{
              duration: 0.55,
            }}
            className="mb-12 text-center"
          >
            <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
              Certificates
            </h2>

            <div className="mx-auto mt-5 h-px w-16 bg-indigo-500" />

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-400 sm:text-lg">
              Professional certifications and achievements
              supporting my technical growth and continuous learning.
            </p>
          </motion.div>

          {error ? (
            <ErrorState
              title="Unable to load certificates"
              message={error}
              onRetry={
                loadCertificates
              }
            />
          ) : certificates.length ===
            0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-800">
              <p className="text-slate-500 dark:text-slate-400">
                Certificates will be displayed here.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {certificates.map(
                (
                  certificate,
                  index
                ) => (
                  <motion.article
                    key={
                      certificate.id
                    }
                    initial={{
                      opacity: 0,
                      y: 20,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                      amount: 0.15,
                    }}
                    transition={{
                      duration: 0.42,
                      delay: Math.min(
                        index * 0.04,
                        0.18
                      ),
                    }}
                    className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:border-indigo-500/30"
                  >
                    <button
                      type="button"
                      disabled={
                        !certificate.imageUrl
                      }
                      onClick={() => {
                        if (
                          certificate.imageUrl
                        ) {
                          setSelectedCertificate(
                            certificate
                          );
                        }
                      }}
                      className="block h-52 w-full overflow-hidden border-b border-slate-200 bg-slate-100 text-left focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 disabled:cursor-default dark:border-slate-700 dark:bg-slate-900"
                      aria-label={
                        certificate.imageUrl
                          ? `View ${certificate.title} certificate`
                          : undefined
                      }
                    >
                      {certificate.imageUrl ? (
                        <img
                          src={
                            certificate.imageUrl
                          }
                          alt={`${certificate.title} certificate`}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          loading="lazy"
                          onError={(
                            event
                          ) => {
                            event.currentTarget.style.display =
                              "none";
                          }}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center px-4 text-center text-sm text-slate-500">
                          Certificate Image Unavailable
                        </div>
                      )}
                    </button>

                    <div className="p-6">
                      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                        {certificate.issueDate && (
                          <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                            {formatDate(
                              certificate.issueDate
                            )}
                          </span>
                        )}

                        {certificate.verified && (
                          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                            ✓ Verified
                          </span>
                        )}
                      </div>

                      <h3 className="wrap-break-word text-xl font-semibold leading-7 text-slate-900 dark:text-white">
                        {certificate.title ||
                          "Professional Certificate"}
                      </h3>

                      {certificate.issuer && (
                        <p className="mt-2 font-medium text-indigo-600 dark:text-indigo-400">
                          {
                            certificate.issuer
                          }
                        </p>
                      )}

                      {certificate.credentialId && (
                        <p className="mt-3 wrap-break-word text-xs text-slate-500">
                          Credential ID:{" "}
                          <span className="text-slate-600 dark:text-slate-400">
                            {
                              certificate.credentialId
                            }
                          </span>
                        </p>
                      )}

                      {certificate.description && (
                        <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-400">
                          {
                            certificate.description
                          }
                        </p>
                      )}

                      {certificate.credentialUrl && (
                        <a
                          href={
                            certificate.credentialUrl
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-indigo-600 transition hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                        >
                          Verify Certificate
                          <span aria-hidden="true">
                            ↗
                          </span>
                        </a>
                      )}
                    </div>
                  </motion.article>
                )
              )}
            </div>
          )}
        </div>
      </section>

      {selectedCertificate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={
            selectedCertificate.title ||
            "Certificate preview"
          }
          onClick={() =>
            setSelectedCertificate(
              null
            )
          }
        >
          <button
            type="button"
            onClick={() =>
              setSelectedCertificate(
                null
              )
            }
            className="absolute right-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-2xl text-white transition hover:bg-white/20 sm:right-6 sm:top-6"
            aria-label="Close certificate preview"
          >
            ×
          </button>

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.96,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            className="relative"
            style={{
              maxHeight: "92vh",
              maxWidth: "95vw",
            }}
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <img
              src={
                selectedCertificate.imageUrl
              }
              alt={
                selectedCertificate.title ||
                "Certificate"
              }
              className="rounded-lg object-contain shadow-2xl"
              style={{
                maxHeight: "88vh",
                maxWidth: "92vw",
              }}
            />
          </motion.div>
        </div>
      )}
    </>
  );
}

export default Certificates;