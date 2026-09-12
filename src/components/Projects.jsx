import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { motion } from "framer-motion";

import { getProjects } from "../services/projectService";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";

function Projects() {
  const [projects, setProjects] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [
    selectedProject,
    setSelectedProject,
  ] = useState(null);

  const [
    activeFilter,
    setActiveFilter,
  ] = useState("All");

  const loadProjects =
    useCallback(async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          await getProjects();

        setProjects(
          Array.isArray(data)
            ? data
            : []
        );
      } catch (loadError) {
        console.error(
          "Failed to load projects:",
          loadError
        );

        setError(
          "Unable to load projects. Please try again."
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  useEffect(() => {
    if (!selectedProject) {
      return undefined;
    }

    const handleEscape = (
      event
    ) => {
      if (
        event.key ===
        "Escape"
      ) {
        setSelectedProject(null);
      }
    };

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );

      document.body.style.overflow =
        previousOverflow;
    };
  }, [selectedProject]);

  const sortedProjects = [
    ...projects,
  ].sort((a, b) => {
    const statusA =
      a.status?.toLowerCase() ===
      "completed"
        ? 0
        : 1;

    const statusB =
      b.status?.toLowerCase() ===
      "completed"
        ? 0
        : 1;

    if (statusA !== statusB) {
      return statusA - statusB;
    }

    const featuredA =
      a.featured ? 0 : 1;

    const featuredB =
      b.featured ? 0 : 1;

    if (
      featuredA !== featuredB
    ) {
      return (
        featuredA - featuredB
      );
    }

    const dateA =
      a.createdAt?.seconds || 0;

    const dateB =
      b.createdAt?.seconds || 0;

    return dateB - dateA;
  });

  const filters = [
    "All",
    "Completed",
    "In Progress",
  ];

  const filteredProjects =
    activeFilter === "All"
      ? sortedProjects
      : sortedProjects.filter(
          (project) =>
            project.status?.toLowerCase() ===
            activeFilter.toLowerCase()
        );

  if (loading) {
    return (
      <section
        id="projects"
        className="flex min-h-[70vh] items-center justify-center bg-white px-4 py-20 dark:bg-slate-950"
      >
        <div className="w-full max-w-lg">
          <LoadingState message="Loading projects..." />
        </div>
      </section>
    );
  }

  return (
    <>
      <section
        id="projects"
        className="scroll-mt-24 bg-white px-4 py-20 text-slate-900 dark:bg-slate-950 dark:text-white sm:px-6 sm:py-24 lg:px-8"
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
            className="mb-10 text-center sm:mb-12"
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Projects
            </h2>

            <div className="mx-auto mt-5 h-px w-16 bg-indigo-500" />

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-400 sm:text-lg">
              Selected projects showcasing my work across
              full-stack development, AI and modern web technologies.
            </p>
          </motion.div>

          {error && (
            <div className="mb-8">
              <ErrorState
                title="Unable to load projects"
                message={error}
                onRetry={loadProjects}
              />
            </div>
          )}

          {!error &&
            projects.length > 0 && (
              <div className="mb-10 flex flex-wrap justify-center gap-2">
                {filters.map(
                  (filter) => {
                    const isActive =
                      activeFilter ===
                      filter;

                    return (
                      <button
                        key={filter}
                        type="button"
                        onClick={() =>
                          setActiveFilter(
                            filter
                          )
                        }
                        className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
                          isActive
                            ? "border-indigo-600 bg-indigo-600 text-white"
                            : "border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-indigo-500/30 dark:hover:text-white"
                        }`}
                      >
                        {filter}
                      </button>
                    );
                  }
                )}
              </div>
            )}

          {!error &&
          projects.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center dark:border-slate-700 dark:bg-slate-900">
              <p className="text-slate-500 dark:text-slate-400">
                No projects added yet.
              </p>
            </div>
          ) : !error &&
            filteredProjects.length ===
              0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center dark:border-slate-700 dark:bg-slate-900">
              <p className="text-slate-500 dark:text-slate-400">
                No projects found in this category.
              </p>
            </div>
          ) : (
            !error && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredProjects.map(
                  (item, index) => {
                    const techStack =
                      Array.isArray(
                        item.techStack
                      )
                        ? item.techStack
                        : Array.isArray(
                            item.technologies
                          )
                        ? item.technologies
                        : [];

                    const isFeatured =
                      Boolean(
                        item.featured
                      );

                    return (
                      <motion.article
                        key={item.id}
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
                        className={`relative flex h-full flex-col rounded-2xl border bg-slate-50 p-6 shadow-sm transition duration-300 hover:-translate-y-1 dark:bg-slate-900 ${
                          isFeatured
                            ? "border-indigo-200 dark:border-indigo-500/30"
                            : "border-slate-200 hover:border-indigo-200 dark:border-slate-800 dark:hover:border-indigo-500/30"
                        }`}
                      >
                        {isFeatured && (
                          <div className="absolute right-5 top-5">
                            <span className="rounded-full bg-indigo-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                              Featured
                            </span>
                          </div>
                        )}

                        <div
                          className={
                            isFeatured
                              ? "pr-20"
                              : "pr-2"
                          }
                        >
                          <h3 className="wrap-break-word text-xl font-semibold leading-8 text-slate-900 dark:text-white">
                            {item.title ||
                              "Untitled Project"}
                          </h3>
                        </div>

                        {item.status && (
                          <div className="mt-3">
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                                item.status?.toLowerCase() ===
                                "completed"
                                  ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                                  : "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
                              }`}
                            >
                              {item.status}
                            </span>
                          </div>
                        )}

                        {item.shortDescription && (
                          <p className="mt-4 line-clamp-3 leading-7 text-slate-600 dark:text-slate-400">
                            {
                              item.shortDescription
                            }
                          </p>
                        )}

                        {techStack.length >
                          0 && (
                          <div className="mt-6 flex flex-wrap gap-2">
                            {techStack
                              .slice(0, 6)
                              .map(
                                (
                                  technology,
                                  technologyIndex
                                ) => (
                                  <span
                                    key={`${technology}-${technologyIndex}`}
                                    className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                                  >
                                    {
                                      technology
                                    }
                                  </span>
                                )
                              )}

                            {techStack.length >
                              6 && (
                              <span className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-800">
                                +
                                {techStack.length -
                                  6}{" "}
                                more
                              </span>
                            )}
                          </div>
                        )}

                        <div className="mt-auto pt-6">
                          <div className="flex flex-wrap items-center gap-3 border-t border-slate-200 pt-5 dark:border-slate-800">
                            <button
                              type="button"
                              onClick={() =>
                                setSelectedProject(
                                  item
                                )
                              }
                              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-indigo-200 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-indigo-500/30 dark:hover:text-white"
                            >
                              Read More
                            </button>

                            {item.githubUrl && (
                              <a
                                href={
                                  item.githubUrl
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-indigo-200 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-indigo-500/30 dark:hover:text-white"
                              >
                                GitHub
                              </a>
                            )}

                            {item.liveUrl && (
                              <a
                                href={
                                  item.liveUrl
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500"
                              >
                                Live Demo
                              </a>
                            )}
                          </div>
                        </div>
                      </motion.article>
                    );
                  }
                )}
              </div>
            )
          )}
        </div>
      </section>

      {selectedProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 py-6 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setSelectedProject(
                null
              );
            }
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-modal-title"
        >
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.96,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            className="relative w-full max-w-3xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 text-slate-900 shadow-2xl dark:border-slate-700 dark:bg-slate-900 dark:text-white sm:p-8"
            style={{
              maxHeight: "90vh",
            }}
          >
            <button
              type="button"
              onClick={() =>
                setSelectedProject(
                  null
                )
              }
              aria-label="Close project details"
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-xl text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white"
            >
              ×
            </button>

            <div className="pr-12">
              <div className="flex flex-wrap items-center gap-3">
                <h3
                  id="project-modal-title"
                  className="wrap-break-word text-2xl font-bold sm:text-3xl"
                >
                  {selectedProject.title ||
                    "Untitled Project"}
                </h3>

                {selectedProject.status && (
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      selectedProject.status?.toLowerCase() ===
                      "completed"
                        ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                        : "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
                    }`}
                  >
                    {
                      selectedProject.status
                    }
                  </span>
                )}
              </div>
            </div>

            {selectedProject.shortDescription && (
              <p className="mt-5 text-base leading-7 text-slate-600 dark:text-slate-400">
                {
                  selectedProject.shortDescription
                }
              </p>
            )}

            {selectedProject.description && (
              <div className="mt-8">
                <h4 className="text-lg font-semibold">
                  About the Project
                </h4>

                <p className="mt-3 whitespace-pre-line leading-7 text-slate-600 dark:text-slate-400">
                  {
                    selectedProject.description
                  }
                </p>
              </div>
            )}

            {(() => {
              const techStack =
                Array.isArray(
                  selectedProject.techStack
                )
                  ? selectedProject.techStack
                  : Array.isArray(
                      selectedProject.technologies
                    )
                  ? selectedProject.technologies
                  : [];

              if (!techStack.length) {
                return null;
              }

              return (
                <div className="mt-8">
                  <h4 className="text-lg font-semibold">
                    Technologies
                  </h4>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {techStack.map(
                      (
                        technology,
                        technologyIndex
                      ) => (
                        <span
                          key={`${technology}-${technologyIndex}`}
                          className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        >
                          {technology}
                        </span>
                      )
                    )}
                  </div>
                </div>
              );
            })()}

            {Array.isArray(
              selectedProject.features
            ) &&
              selectedProject.features.length >
                0 && (
                <div className="mt-8">
                  <h4 className="text-lg font-semibold">
                    Key Features
                  </h4>

                  <ul className="mt-4 space-y-3">
                    {selectedProject.features.map(
                      (
                        feature,
                        featureIndex
                      ) => (
                        <li
                          key={`${feature}-${featureIndex}`}
                          className="flex items-start gap-3 text-sm leading-6 text-slate-600 dark:text-slate-400"
                        >
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />

                          <span>
                            {feature}
                          </span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}

            {(selectedProject.githubUrl ||
              selectedProject.liveUrl) && (
              <div className="mt-8 flex flex-wrap gap-3 border-t border-slate-200 pt-6 dark:border-slate-700">
                {selectedProject.githubUrl && (
                  <a
                    href={
                      selectedProject.githubUrl
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:border-indigo-200 hover:text-indigo-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-indigo-500/30 dark:hover:text-white"
                  >
                    View on GitHub
                  </a>
                )}

                {selectedProject.liveUrl && (
                  <a
                    href={
                      selectedProject.liveUrl
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500"
                  >
                    Open Live Demo
                  </a>
                )}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </>
  );
}

export default Projects;