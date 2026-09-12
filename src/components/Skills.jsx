import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { motion } from "framer-motion";

import { getSkills } from "../services/skillService";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";

const categoryOrder = {
  web: 1,
  frontend: 1,
  backend: 1,
  "web development": 1,

  mobile: 2,
  app: 2,
  "mobile development": 2,
  "app development": 2,

  database: 3,
  databases: 3,

  ai: 4,
  "ai & machine learning": 4,
  "ai & ml": 4,
  "artificial intelligence": 4,
  "machine learning": 4,

  testing: 5,
  tools: 6,
};

function getCategoryRank(category) {
  if (!category) return 99;

  const normalized = String(category)
    .toLowerCase()
    .trim();

  if (categoryOrder[normalized] !== undefined) {
    return categoryOrder[normalized];
  }

  if (
    normalized.includes("web") ||
    normalized.includes("frontend") ||
    normalized.includes("backend")
  ) {
    return 1;
  }

  if (
    normalized.includes("mobile") ||
    normalized.includes("app")
  ) {
    return 2;
  }

  if (
    normalized.includes("database") ||
    normalized.includes("db")
  ) {
    return 3;
  }

  if (
    normalized.includes("artificial") ||
    normalized.includes("machine") ||
    normalized.includes("generative") ||
    normalized.includes("ai")
  ) {
    return 4;
  }

  if (normalized.includes("test")) {
    return 5;
  }

  if (normalized.includes("tool")) {
    return 6;
  }

  return 99;
}

function Skills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadSkills = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getSkills();

      const safeData = Array.isArray(data)
        ? data
        : [];

      const sortedSkills = [...safeData].sort(
        (a, b) => {
          const featuredA = a.featured === true;
          const featuredB = b.featured === true;

          if (featuredA !== featuredB) {
            return featuredA ? -1 : 1;
          }

          return (
            getCategoryRank(a.category) -
            getCategoryRank(b.category)
          );
        }
      );

      setSkills(sortedSkills);
    } catch (loadError) {
      console.error(
        "Failed to load skills:",
        loadError
      );

      setError(
        "Skills could not be loaded right now."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSkills();
  }, [loadSkills]);

  if (loading) {
    return (
      <section
        id="skills"
        className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4 py-20 dark:bg-slate-900"
      >
        <div className="w-full max-w-lg">
          <LoadingState message="Loading skills..." />
        </div>
      </section>
    );
  }

  return (
    <section
      id="skills"
      className="scroll-mt-24 bg-slate-50 px-4 py-20 text-slate-900 dark:bg-slate-900 dark:text-white sm:px-6 sm:py-24 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Skills & Technologies
          </h2>

          <div className="mx-auto mt-5 h-px w-16 bg-indigo-500" />

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-400 sm:text-lg">
            Technologies and tools I use to build modern,
            scalable and user-focused applications.
          </p>
        </motion.div>

        {error && (
          <div className="mb-8">
            <ErrorState
              title="Unable to load skills"
              message={error}
              onRetry={loadSkills}
            />
          </div>
        )}

        {!error && skills.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-800">
            <p className="text-slate-500 dark:text-slate-400">
              Skills will be displayed here soon.
            </p>
          </div>
        ) : (
          !error && (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {skills.map((skill, index) => {
                const isFeatured =
                  skill.featured === true;

                const proficiency =
                  skill.proficiency ||
                  skill.level ||
                  "";

                const experience =
                  skill.experience || "";

                return (
                  <motion.article
                    key={skill.id}
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
                        index * 0.035,
                        0.2
                      ),
                    }}
                    className={`relative rounded-2xl border p-6 transition duration-300 hover:-translate-y-1 ${
                      isFeatured
                        ? "border-indigo-200 bg-white shadow-md shadow-indigo-100/70 dark:border-indigo-500/30 dark:bg-slate-800 dark:shadow-none"
                        : "border-slate-200 bg-white shadow-sm hover:border-indigo-200 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-indigo-500/30"
                    }`}
                  >
                    {isFeatured && (
                      <span className="absolute right-4 top-4 rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                        Featured
                      </span>
                    )}

                    <h3 className="pr-20 text-xl font-semibold text-slate-900 dark:text-white">
                      {skill.name ||
                        skill.title ||
                        "Skill"}
                    </h3>

                    {skill.category && (
                      <p className="mt-2 text-sm font-medium text-indigo-600 dark:text-indigo-400">
                        {skill.category}
                      </p>
                    )}

                    {skill.description && (
                      <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                        {skill.description}
                      </p>
                    )}

                    {proficiency && (
                      <div className="mt-5 border-t border-slate-100 pt-4 dark:border-slate-700">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-xs text-slate-500">
                            Proficiency
                          </span>

                          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            {proficiency}
                          </span>
                        </div>
                      </div>
                    )}

                    {experience && (
                      <p className="mt-3 text-xs text-slate-500">
                        Experience:{" "}
                        <span className="text-slate-600 dark:text-slate-400">
                          {experience}
                        </span>
                      </p>
                    )}
                  </motion.article>
                );
              })}
            </div>
          )
        )}
      </div>
    </section>
  );
}

export default Skills;