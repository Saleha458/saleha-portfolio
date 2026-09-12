import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { motion } from "framer-motion";

import { getExperiences } from "../services/experienceService";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";

function Experience() {
  const [experiences, setExperiences] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const loadExperiences = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getExperiences();

      const safeData =
        Array.isArray(data)
          ? data
          : [];

      const sortedExperiences = [
        ...safeData,
      ].sort((a, b) => {
        const featuredA =
          a.featured === true;

        const featuredB =
          b.featured === true;

        if (featuredA !== featuredB) {
          return featuredA ? -1 : 1;
        }

        const dateA =
          a.startDate || "";

        const dateB =
          b.startDate || "";

        return dateB.localeCompare(dateA);
      });

      setExperiences(sortedExperiences);
    } catch (loadError) {
      console.error(
        "Failed to load experiences:",
        loadError
      );

      setError(
        "Experience information could not be loaded."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadExperiences();
  }, [loadExperiences]);

  const formatDate = (date) => {
    if (!date) return "";

    const [year, month] =
      String(date).split("-");

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
        month: "long",
        year: "numeric",
      }
    );
  };

  if (loading) {
    return (
      <section
        id="experience"
        className="flex min-h-[70vh] items-center justify-center bg-white px-4 py-20 dark:bg-slate-950"
      >
        <div className="w-full max-w-lg">
          <LoadingState message="Loading experience..." />
        </div>
      </section>
    );
  }

  return (
    <section
      id="experience"
      className="scroll-mt-24 bg-white px-4 py-20 text-slate-900 dark:bg-slate-950 dark:text-white sm:px-6 sm:py-24 lg:px-8"
    >
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Experience
          </h2>

          <div className="mx-auto mt-5 h-px w-16 bg-indigo-500" />

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-400 sm:text-lg">
            Professional experience, internships and roles
            that have shaped my technical and collaborative skills.
          </p>
        </motion.div>

        {error ? (
          <ErrorState
            title="Unable to load experience"
            message={error}
            onRetry={loadExperiences}
          />
        ) : experiences.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center dark:border-slate-700 dark:bg-slate-900">
            <p className="text-slate-500 dark:text-slate-400">
              Experience will be displayed here soon.
            </p>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute bottom-0 left-4 top-0 hidden w-px bg-slate-200 dark:bg-slate-800 sm:block" />

            <div className="space-y-8">
              {experiences.map(
                (experience, index) => {
                  const isFeatured =
                    experience.featured === true;

                  return (
                    <motion.article
                      key={experience.id}
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
                        amount: 0.15,
                      }}
                      transition={{
                        duration: 0.48,
                        delay: Math.min(
                          index * 0.05,
                          0.2
                        ),
                      }}
                      className="relative sm:pl-12"
                    >
                      <div className="absolute left-0 top-7 hidden h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 sm:flex">
                        <div className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
                      </div>

                      <div
                        className={`rounded-2xl border p-5 transition duration-300 hover:-translate-y-1 sm:p-6 ${
                          isFeatured
                            ? "border-indigo-200 bg-indigo-50/50 shadow-sm dark:border-indigo-500/30 dark:bg-indigo-500/5"
                            : "border-slate-200 bg-slate-50 shadow-sm hover:border-indigo-200 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-500/30"
                        }`}
                      >
                        {isFeatured && (
                          <span className="mb-5 inline-flex rounded-full bg-indigo-100 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400">
                            Featured
                          </span>
                        )}

                        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                          <div className="min-w-0">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
                              {experience.role ||
                                "Role"}
                            </h3>

                            {experience.company && (
                              <p className="mt-2 text-base font-medium text-indigo-600 dark:text-indigo-400">
                                {experience.company}
                              </p>
                            )}

                            {experience.location && (
                              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                {experience.location}
                              </p>
                            )}
                          </div>

                          {experience.employmentType && (
                            <span className="w-fit shrink-0 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                              {experience.employmentType}
                            </span>
                          )}
                        </div>

                        {(experience.startDate ||
                          experience.endDate ||
                          experience.current) && (
                          <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                            {formatDate(
                              experience.startDate
                            )}
                            {" — "}
                            {experience.current
                              ? "Present"
                              : formatDate(
                                  experience.endDate
                                )}
                          </p>
                        )}

                        {experience.description && (
                          <p className="mt-5 text-sm leading-7 text-slate-600 dark:text-slate-400 sm:text-base">
                            {experience.description}
                          </p>
                        )}

                        {Array.isArray(
                          experience.achievements
                        ) &&
                          experience.achievements.length >
                            0 && (
                            <div className="mt-6">
                              <p className="mb-3 text-sm font-semibold text-slate-800 dark:text-slate-200">
                                Key Achievements
                              </p>

                              <ul className="space-y-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                                {experience.achievements.map(
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
                                        {achievement}
                                      </span>
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                          )}

                        {Array.isArray(
                          experience.technologies
                        ) &&
                          experience.technologies.length >
                            0 && (
                            <div className="mt-6 flex flex-wrap gap-2">
                              {experience.technologies.map(
                                (
                                  technology,
                                  technologyIndex
                                ) => (
                                  <span
                                    key={`${technology}-${technologyIndex}`}
                                    className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                                  >
                                    {technology}
                                  </span>
                                )
                              )}
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

export default Experience;