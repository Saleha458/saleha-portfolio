import { useEffect, useState } from "react";

import {
  getProjects,
  deleteProject,
} from "../services/projectService";

import ProjectForm from "./ProjectForm";

function ProjectManager() {
  const [projects, setProjects] = useState([]);
  const [editingProject, setEditingProject] =
    useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [expandedProjects, setExpandedProjects] =
    useState({});

  const loadProjects = async () => {
    try {
      const data = await getProjects();

      const sortedProjects = [...(data || [])].sort(
        (a, b) => {
          const statusA =
            String(a.status || "").toLowerCase();

          const statusB =
            String(b.status || "").toLowerCase();

          const completedA =
            statusA === "completed" ? 1 : 0;

          const completedB =
            statusB === "completed" ? 1 : 0;

          if (completedA !== completedB) {
            return completedB - completedA;
          }

          const featuredA = a.featured ? 1 : 0;
          const featuredB = b.featured ? 1 : 0;

          if (featuredA !== featuredB) {
            return featuredB - featuredA;
          }

          return String(
            b.createdAt || b.startDate || ""
          ).localeCompare(
            String(a.createdAt || a.startDate || "")
          );
        }
      );

      setProjects(sortedProjects);
    } catch (error) {
      console.error(
        "Failed to load projects:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmed) return;

    try {
      await deleteProject(id);
      await loadProjects();
    } catch (error) {
      console.error(
        "Failed to delete project:",
        error
      );

      alert("Failed to delete project.");
    }
  };

  const handleSaved = async () => {
    setEditingProject(null);
    setShowForm(false);
    await loadProjects();
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const toggleFeatures = (id) => {
    setExpandedProjects((previous) => ({
      ...previous,
      [id]: !previous[id],
    }));
  };

  const getFeatures = (project) => {
    if (Array.isArray(project.features)) {
      return project.features
        .map((feature) =>
          String(feature).trim()
        )
        .filter(Boolean);
    }

    if (typeof project.features === "string") {
      return project.features
        .split("\n")
        .map((feature) =>
          feature.trim()
        )
        .filter(Boolean);
    }

    return [];
  };

  const getTechStack = (project) => {
    if (Array.isArray(project.techStack)) {
      return project.techStack;
    }

    if (Array.isArray(project.technologies)) {
      return project.technologies;
    }

    if (typeof project.techStack === "string") {
      return project.techStack
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }

    return [];
  };

  return (
    <div>
      {/* HEADER */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            Projects
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Manage the projects displayed on your
            portfolio.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingProject(null);
            setShowForm((previous) => !previous);
          }}
          className="rounded-lg bg-indigo-600 px-5 py-3 font-semibold transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
        >
          {showForm ? "Close" : "+ Add Project"}
        </button>
      </div>

      {/* FORM */}
      {showForm && (
        <div className="mb-8">
          <ProjectForm
            project={editingProject}
            onSaved={handleSaved}
            onCancel={() => {
              setEditingProject(null);
              setShowForm(false);
            }}
          />
        </div>
      )}

      {/* CONTENT */}
      {loading ? (
        <p className="text-slate-400">
          Loading projects...
        </p>
      ) : projects.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center">
          <p className="text-slate-400">
            No projects added yet.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => {
            const features = getFeatures(project);
            const techStack = getTechStack(project);

            const isExpanded =
              expandedProjects[project.id];

            const isCompleted =
              String(project.status || "")
                .toLowerCase() === "completed";

            return (
              <article
                key={project.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-indigo-500/30"
              >
                {/* IMAGE */}
                {project.imageUrl && (
                  <img
                    src={project.imageUrl}
                    alt={
                      project.title ||
                      "Project preview"
                    }
                    className="mb-4 h-40 w-full rounded-xl object-cover"
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.style.display =
                        "none";
                    }}
                  />
                )}

                {/* TITLE + STATUS */}
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-xl font-semibold">
                    {project.title ||
                      "Untitled Project"}
                  </h3>

                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                      isCompleted
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-amber-500/10 text-amber-400"
                    }`}
                  >
                    {isCompleted
                      ? "Completed"
                      : project.status ||
                        "In Progress"}
                  </span>
                </div>

                {/* FEATURED */}
                {project.featured && (
                  <span className="mt-3 inline-block rounded-full bg-indigo-500/10 px-3 py-1 text-xs text-indigo-300">
                    ⭐ Featured
                  </span>
                )}

                {/* SHORT DESCRIPTION */}
                {project.shortDescription && (
                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    {project.shortDescription}
                  </p>
                )}

                {/* DESCRIPTION */}
                {project.description && (
                  <div className="mt-4">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Description
                    </p>

                    <p className="text-sm leading-6 text-slate-400">
                      {project.description}
                    </p>
                  </div>
                )}

                {/* TECH STACK */}
                {techStack.length > 0 && (
                  <div className="mt-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Tech Stack
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {techStack.map(
                        (tech, index) => (
                          <span
                            key={`${tech}-${index}`}
                            className="rounded-md bg-white/5 px-2 py-1 text-xs text-slate-300"
                          >
                            {tech}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* FEATURES */}
                {features.length > 0 && (
                  <div className="mt-5">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Features
                    </p>

                    <ul className="space-y-1">
                      {(isExpanded
                        ? features
                        : features.slice(0, 3)
                      ).map(
                        (feature, index) => (
                          <li
                            key={index}
                            className="flex gap-2 text-sm text-slate-400"
                          >
                            <span className="shrink-0 text-indigo-400">
                              ✓
                            </span>

                            <span>
                              {feature}
                            </span>
                          </li>
                        )
                      )}
                    </ul>

                    {features.length > 3 && (
                      <button
                        type="button"
                        onClick={() =>
                          toggleFeatures(
                            project.id
                          )
                        }
                        className="mt-2 text-sm text-indigo-400 transition hover:text-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                      >
                        {isExpanded
                          ? "Show Less"
                          : `Show More (${
                              features.length - 3
                            })`}
                      </button>
                    )}
                  </div>
                )}

                {/* LINKS */}
                {(project.githubUrl ||
                  project.liveUrl) && (
                  <div className="mt-5 flex flex-wrap gap-3">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                      >
                        GitHub ↗
                      </a>
                    )}

                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                      >
                        Live Demo ↗
                      </a>
                    )}
                  </div>
                )}

                {/* ACTIONS */}
                <div className="mt-5 flex gap-3 border-t border-white/10 pt-4">
                  <button
                    type="button"
                    onClick={() =>
                      handleEdit(project)
                    }
                    className="rounded-lg border border-white/10 px-4 py-2 text-sm transition hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(project.id)
                    }
                    className="rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-400 transition hover:bg-red-500/20 focus:outline-none focus:ring-2 focus:ring-red-500/30"
                  >
                    Delete
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ProjectManager;