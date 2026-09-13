import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  motion,
} from "framer-motion";

import {
  getSkills,
} from "../services/skillService";

import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";

/* =========================================================
   CATEGORY ORDER
========================================================= */

const categoryOrder = {
  frontend: 1,

  backend: 2,

  "mobile development": 3,
  mobile: 3,

  "databases & cloud": 4,
  databases: 4,
  database: 4,
  cloud: 4,

  "ai & data": 5,
  "ai & machine learning": 5,
  ai: 5,
  "machine learning": 5,

  "programming languages": 6,

  "tools & workflow": 7,
  "tools & platforms": 7,
  tools: 7,
};

function getCategoryRank(
  category
) {
  if (!category) {
    return 99;
  }

  const normalized =
    String(category)
      .toLowerCase()
      .trim();

  return (
    categoryOrder[
      normalized
    ] || 99
  );
}

/* =========================================================
   NORMALIZE CATEGORY
========================================================= */

function normalizeCategory(
  category
) {
  const value =
    String(
      category || ""
    )
      .toLowerCase()
      .trim();

  if (
    value.includes(
      "frontend"
    ) ||
    value === "web" ||
    value.includes(
      "web development"
    )
  ) {
    return "Frontend";
  }

  if (
    value.includes(
      "backend"
    )
  ) {
    return "Backend";
  }

  if (
    value.includes(
      "mobile"
    ) ||
    value.includes(
      "app development"
    )
  ) {
    return "Mobile Development";
  }

  if (
    value.includes(
      "database"
    ) ||
    value.includes(
      "cloud"
    )
  ) {
    return "Databases & Cloud";
  }

  if (
    value.includes("ai") ||
    value.includes(
      "machine"
    ) ||
    value.includes(
      "data"
    )
  ) {
    return "AI & Data";
  }

  if (
    value.includes(
      "programming"
    )
  ) {
    return "Programming Languages";
  }

  if (
    value.includes(
      "tool"
    ) ||
    value.includes(
      "devops"
    )
  ) {
    return "Tools & Workflow";
  }

  return (
    category ||
    "Other"
  );
}

/* =========================================================
   SKILLS
========================================================= */

function Skills() {
  const [skills, setSkills] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /* =======================================================
     LOAD
  ======================================================= */

  const loadSkills =
    useCallback(
      async () => {
        try {
          setLoading(true);
          setError("");

          const data =
            await getSkills();

          setSkills(
            Array.isArray(
              data
            )
              ? data
              : []
          );
        } catch (
          loadError
        ) {
          console.error(
            "Failed to load skills:",
            loadError
          );

          setError(
            "Skills could not be loaded right now."
          );
        } finally {
          setLoading(
            false
          );
        }
      },
      []
    );

  useEffect(() => {
    loadSkills();
  }, [loadSkills]);

  /* =======================================================
     GROUP INTO STACKS
  ======================================================= */

  const stacks =
    useMemo(() => {
      const groups = {};

      skills.forEach(
        (skill) => {
          const name =
            String(
              skill.name ||
                skill.title ||
                ""
            ).trim();

          if (!name) {
            return;
          }

          const category =
            normalizeCategory(
              skill.category
            );

          if (
            !groups[
              category
            ]
          ) {
            groups[
              category
            ] = [];
          }

          const exists =
            groups[
              category
            ].some(
              (
                item
              ) =>
                String(
                  item.name
                ).toLowerCase() ===
                name.toLowerCase()
            );

          if (!exists) {
            groups[
              category
            ].push({
              ...skill,
              name,
            });
          }
        }
      );

      return Object.entries(
        groups
      )
        .map(
          ([
            category,
            items,
          ]) => ({
            category,

            items: [
              ...items,
            ].sort(
              (a, b) => {
                const featuredA =
                  a.featured
                    ? 1
                    : 0;

                const featuredB =
                  b.featured
                    ? 1
                    : 0;

                if (
                  featuredA !==
                  featuredB
                ) {
                  return (
                    featuredB -
                    featuredA
                  );
                }

                return a.name.localeCompare(
                  b.name
                );
              }
            ),
          })
        )
        .sort(
          (a, b) =>
            getCategoryRank(
              a.category
            ) -
            getCategoryRank(
              b.category
            )
        );
    }, [skills]);

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <section
        id="skills"
        className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4 py-20 dark:bg-slate-900"
      >
        <div className="w-full max-w-lg">
          <LoadingState message="Loading technologies..." />
        </div>
      </section>
    );
  }

  /* =======================================================
     UI
  ======================================================= */

  return (
    <section
      id="skills"
      className="scroll-mt-24 bg-slate-50 px-4 py-20 text-slate-900 dark:bg-slate-900 dark:text-white sm:px-6 sm:py-24 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        {/* HEADER */}

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
            Tech Stack
          </h2>

          <div className="mx-auto mt-5 h-px w-16 bg-indigo-500" />

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-400 sm:text-lg">
            Technologies and tools
            I work with to build
            modern, scalable and
            user-focused
            applications.
          </p>
        </motion.div>

        {/* ERROR */}

        {error && (
          <div className="mb-8">
            <ErrorState
              title="Unable to load technologies"
              message={error}
              onRetry={
                loadSkills
              }
            />
          </div>
        )}

        {/* EMPTY */}

        {!error &&
        stacks.length ===
          0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-800">
            <p className="text-slate-500 dark:text-slate-400">
              Technologies will
              be displayed here
              soon.
            </p>
          </div>
        ) : (
          !error && (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {stacks.map(
                (
                  stack,
                  index
                ) => (
                  <motion.article
                    key={
                      stack.category
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
                      amount:
                        0.15,
                    }}
                    transition={{
                      duration:
                        0.42,

                      delay:
                        Math.min(
                          index *
                            0.04,
                          0.2
                        ),
                    }}
                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:shadow-none dark:hover:border-indigo-500/30"
                  >
                    {/* STACK TITLE */}

                    <div className="mb-5">
                      <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                        {
                          stack.category
                        }
                      </h3>

                      <div className="mt-3 h-px w-10 bg-indigo-500" />
                    </div>

                    {/* TECHNOLOGIES */}

                    <div className="flex flex-wrap gap-2.5">
                      {stack.items.map(
                        (
                          skill
                        ) => (
                          <span
                            key={
                              skill.id ||
                              `${stack.category}-${skill.name}`
                            }
                            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-indigo-200 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:border-indigo-500/30 dark:hover:text-indigo-400"
                          >
                            {
                              skill.name
                            }
                          </span>
                        )
                      )}
                    </div>
                  </motion.article>
                )
              )}
            </div>
          )
        )}
      </div>
    </section>
  );
}

export default Skills;