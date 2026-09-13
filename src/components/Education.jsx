import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { motion } from "framer-motion";

import { getEducation } from "../services/educationService";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";

/* =========================================================
   HELPERS
========================================================= */

const formatDate = (date) => {
  if (!date) return "";

  const value = String(date).trim();

  if (!value) return "";

  const parts = value.split("-");

  if (parts.length >= 2) {
    const year = Number(parts[0]);
    const month = Number(parts[1]);

    if (
      Number.isFinite(year) &&
      Number.isFinite(month) &&
      month >= 1 &&
      month <= 12
    ) {
      const parsedDate = new Date(
        year,
        month - 1
      );

      return parsedDate.toLocaleString(
        "en-US",
        {
          month: "short",
          year: "numeric",
        }
      );
    }
  }

  if (/^\d{4}$/.test(value)) {
    return value;
  }

  return value;
};

const getDegree = (education) =>
  education.degree ||
  education.program ||
  education.qualification ||
  education.title ||
  "Education";

const getInstitution = (education) =>
  education.institution ||
  education.university ||
  education.school ||
  education.college ||
  "";

const getField = (education) =>
  education.fieldOfStudy ||
  education.field ||
  education.major ||
  education.discipline ||
  "";

const isCurrentEducation = (education) =>
  education.current === true ||
  education.isCurrent === true ||
  String(
    education.status || ""
  )
    .toLowerCase()
    .includes("studying") ||
  String(
    education.status || ""
  )
    .toLowerCase()
    .includes("current");

/* =========================================================
   EDUCATION
========================================================= */

function Education() {
  const [educations, setEducations] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /* =======================================================
     LOAD EDUCATION
  ======================================================= */

  const loadEducations =
    useCallback(async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          await getEducation();

        const safeData =
          Array.isArray(data)
            ? data
            : [];

        const sortedEducations = [
          ...safeData,
        ].sort((a, b) => {
          const currentA =
            isCurrentEducation(a)
              ? 1
              : 0;

          const currentB =
            isCurrentEducation(b)
              ? 1
              : 0;

          if (
            currentA !== currentB
          ) {
            return (
              currentB - currentA
            );
          }

          const featuredA =
            a.featured ? 1 : 0;

          const featuredB =
            b.featured ? 1 : 0;

          if (
            featuredA !==
            featuredB
          ) {
            return (
              featuredB -
              featuredA
            );
          }

          return String(
            b.startDate || ""
          ).localeCompare(
            String(
              a.startDate || ""
            )
          );
        });

        setEducations(
          sortedEducations
        );
      } catch (loadError) {
        console.error(
          "Failed to load education:",
          loadError
        );

        setError(
          "Education information could not be loaded right now."
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    loadEducations();
  }, [loadEducations]);

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <section
        id="education"
        className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4 py-20 dark:bg-slate-900"
      >
        <div className="w-full max-w-lg">
          <LoadingState message="Loading education..." />
        </div>
      </section>
    );
  }

  /* =======================================================
     UI
  ======================================================= */

  return (
    <section
      id="education"
      className="scroll-mt-24 bg-slate-50 px-4 py-20 text-slate-900 dark:bg-slate-900 dark:text-white sm:px-6 sm:py-24 lg:px-8"
    >
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{
            opacity: 0,
            y: 18,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.55,
          }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Education
          </h2>

          <div className="mx-auto mt-5 h-px w-16 bg-indigo-500" />

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-400 sm:text-lg">
            My academic background
            and the learning journey
            that built the foundation
            for my software
            development career.
          </p>
        </motion.div>

        {error ? (
          <ErrorState
            title="Unable to load education"
            message={error}
            onRetry={
              loadEducations
            }
          />
        ) : educations.length ===
          0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-800">
            <p className="text-slate-500 dark:text-slate-400">
              Education details
              will be displayed
              here soon.
            </p>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute bottom-0 left-4 top-0 hidden w-px bg-slate-200 dark:bg-slate-700 sm:block" />

            <div className="space-y-8">
              {educations.map(
                (
                  education,
                  index
                ) => {
                  const degree =
                    getDegree(
                      education
                    );

                  const institution =
                    getInstitution(
                      education
                    );

                  const field =
                    getField(
                      education
                    );

                  const current =
                    isCurrentEducation(
                      education
                    );

                  const achievements =
                    Array.isArray(
                      education.achievements
                    )
                      ? education.achievements.filter(
                          Boolean
                        )
                      : [];

                  return (
                    <motion.article
                      key={
                        education.id ||
                        `${institution}-${degree}-${index}`
                      }
                      initial={{
                        opacity: 0,
                        y: 22,
                      }}
                      whileInView={{
                        opacity: 1,
                        y: 0,
                      }}
                      viewport={{
                        once: true,
                        amount:
                          0.15,
                      }}
                      transition={{
                        duration:
                          0.48,

                        delay:
                          Math.min(
                            index *
                              0.05,
                            0.2
                          ),
                      }}
                      className="relative sm:pl-12"
                    >
                      <div className="absolute left-0 top-7 hidden h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900 sm:flex">
                        <div className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
                      </div>

                      <div
                        className={`rounded-2xl border p-5 shadow-sm transition duration-300 hover:-translate-y-1 sm:p-6 ${
                          current ||
                          education.featured
                            ? "border-indigo-200 bg-white hover:border-indigo-300 dark:border-indigo-500/30 dark:bg-slate-800"
                            : "border-slate-200 bg-white hover:border-indigo-200 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-indigo-500/30"
                        }`}
                      >
                        {(current ||
                          education.status) && (
                          <span className="mb-5 inline-flex rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-semibold text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400">
                            {education.status ||
                              "Currently Studying"}
                          </span>
                        )}

                        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                          <div className="min-w-0">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
                              {degree}
                            </h3>

                            {field &&
                              field !==
                                degree && (
                                <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-300">
                                  {
                                    field
                                  }
                                </p>
                              )}

                            {institution && (
                              <p className="mt-2 text-base font-medium text-indigo-600 dark:text-indigo-400">
                                {
                                  institution
                                }
                              </p>
                            )}

                            {education.location && (
                              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                {
                                  education.location
                                }
                              </p>
                            )}
                          </div>
                        </div>

                        {(education.startDate ||
                          education.endDate ||
                          current) && (
                          <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                            {formatDate(
                              education.startDate
                            )}

                            {education.startDate && (
                              <>
                                {
                                  " — "
                                }

                                {current
                                  ? "Present"
                                  : formatDate(
                                      education.endDate
                                    )}
                              </>
                            )}
                          </p>
                        )}

                        {education.description && (
                          <p className="mt-5 text-sm leading-7 text-slate-600 dark:text-slate-400 sm:text-base">
                            {
                              education.description
                            }
                          </p>
                        )}

                        {achievements.length >
                          0 && (
                          <div className="mt-6">
                            <p className="mb-3 text-sm font-semibold text-slate-800 dark:text-slate-200">
                              Highlights
                            </p>

                            <ul className="space-y-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                              {achievements.map(
                                (
                                  achievement,
                                  achievementIndex
                                ) => (
                                  <li
                                    key={`${achievement}-${achievementIndex}`}
                                    className="flex gap-3"
                                  >
                                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />

                                    <span>
                                      {
                                        achievement
                                      }
                                    </span>
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                    </motion.article>
                  );
                }
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default Education;