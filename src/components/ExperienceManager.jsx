import { useEffect, useState } from "react";

import {
  getExperiences,
  deleteExperience,
} from "../services/experienceService";

import ExperienceForm from "./ExperienceForm";

function ExperienceManager() {
  const [experiences, setExperiences] =
    useState([]);

  const [editingExperience, setEditingExperience] =
    useState(null);

  const [showForm, setShowForm] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const loadExperiences = async () => {
    try {
      const data = await getExperiences();

      setExperiences(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(
        "Failed to load experiences:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExperiences();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this experience?"
    );

    if (!confirmed) return;

    try {
      await deleteExperience(id);
      await loadExperiences();
    } catch (error) {
      console.error(
        "Failed to delete experience:",
        error
      );

      alert("Failed to delete experience.");
    }
  };

  const handleSaved = async () => {
    setEditingExperience(null);
    setShowForm(false);

    await loadExperiences();
  };

  const handleEdit = (experience) => {
    setEditingExperience(experience);
    setShowForm(true);
  };

  const formatDate = (date) => {
    if (!date) return "";

    if (
      typeof date !== "string" ||
      !date.includes("-")
    ) {
      return date;
    }

    const [year, month] = date.split("-");

    if (!year || !month) {
      return date;
    }

    const monthName = new Date(
      Number(year),
      Number(month) - 1
    ).toLocaleString("en-US", {
      month: "short",
    });

    return `${monthName} ${year}`;
  };

  const getList = (value) => {
    if (Array.isArray(value)) {
      return value
        .map((item) => String(item).trim())
        .filter(Boolean);
    }

    if (typeof value === "string") {
      return value
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean);
    }

    return [];
  };

  const sortedExperiences = [
    ...experiences,
  ].sort((a, b) => {
    const featuredA = a.featured ? 1 : 0;
    const featuredB = b.featured ? 1 : 0;

    if (featuredA !== featuredB) {
      return featuredB - featuredA;
    }

    return String(
      b.startDate || ""
    ).localeCompare(
      String(a.startDate || "")
    );
  });

  return (
    <div>
      {/* HEADER */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            Experience
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Manage your professional experience.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingExperience(null);
            setShowForm(
              (previous) => !previous
            );
          }}
          className="rounded-lg bg-indigo-600 px-5 py-3 font-semibold transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
        >
          {showForm
            ? "Close"
            : "+ Add Experience"}
        </button>
      </div>

      {/* FORM */}
      {showForm && (
        <div className="mb-8">
          <ExperienceForm
            experience={editingExperience}
            onSaved={handleSaved}
            onCancel={() => {
              setEditingExperience(null);
              setShowForm(false);
            }}
          />
        </div>
      )}

      {/* CONTENT */}
      {loading ? (
        <p className="text-slate-400">
          Loading experiences...
        </p>
      ) : experiences.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center">
          <p className="text-slate-400">
            No experience added yet.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {sortedExperiences.map(
            (experience) => {
              const achievements = getList(
                experience.achievements
              );

              const technologies = getList(
                experience.technologies ||
                  experience.techStack
              );

              return (
                <article
                  key={experience.id}
                  className={`rounded-2xl border p-6 transition ${
                    experience.featured
                      ? "border-indigo-500/30 bg-indigo-500/5"
                      : "border-white/10 bg-white/5"
                  }`}
                >
                  {/* TOP */}
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-xl font-semibold">
                          {experience.role ||
                            "Professional Experience"}
                        </h3>

                        {experience.featured && (
                          <span className="rounded-full bg-indigo-500/10 px-2.5 py-1 text-xs font-medium text-indigo-400">
                            ⭐ Featured
                          </span>
                        )}
                      </div>

                      {experience.company && (
                        <p className="mt-1 text-indigo-400">
                          {experience.company}
                        </p>
                      )}

                      {experience.location && (
                        <p className="mt-1 text-sm text-slate-500">
                          {experience.location}
                        </p>
                      )}
                    </div>

                    {experience.employmentType && (
                      <span className="w-fit rounded-full bg-indigo-500/10 px-3 py-1 text-xs text-indigo-400">
                        {experience.employmentType}
                      </span>
                    )}
                  </div>

                  {/* DATE */}
                  {(experience.startDate ||
                    experience.endDate ||
                    experience.current) && (
                    <p className="mt-4 text-sm text-slate-400">
                      {formatDate(
                        experience.startDate
                      )}

                      {experience.startDate ||
                      experience.endDate ||
                      experience.current
                        ? " — "
                        : ""}

                      {experience.current
                        ? "Present"
                        : formatDate(
                            experience.endDate
                          )}
                    </p>
                  )}

                  {/* DESCRIPTION */}
                  {experience.description && (
                    <p className="mt-4 text-sm leading-6 text-slate-400">
                      {experience.description}
                    </p>
                  )}

                  {/* ACHIEVEMENTS */}
                  {achievements.length > 0 && (
                    <div className="mt-5">
                      <p className="mb-2 text-sm font-semibold text-slate-200">
                        Key Achievements
                      </p>

                      <ul className="list-disc space-y-1 pl-5 text-sm text-slate-400">
                        {achievements.map(
                          (
                            achievement,
                            index
                          ) => (
                            <li key={index}>
                              {achievement}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}

                  {/* TECHNOLOGIES */}
                  {technologies.length > 0 && (
                    <div className="mt-5">
                      <p className="mb-2 text-sm font-semibold text-slate-200">
                        Technologies
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {technologies.map(
                          (
                            technology,
                            index
                          ) => (
                            <span
                              key={`${technology}-${index}`}
                              className="rounded-md bg-white/5 px-2.5 py-1 text-xs text-slate-300"
                            >
                              {technology}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {/* ACTIONS */}
                  <div className="mt-6 flex gap-3 border-t border-white/10 pt-4">
                    <button
                      type="button"
                      onClick={() =>
                        handleEdit(
                          experience
                        )
                      }
                      className="rounded-lg border border-white/10 px-4 py-2 text-sm transition hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(
                          experience.id
                        )
                      }
                      className="rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-400 transition hover:bg-red-500/20 focus:outline-none focus:ring-2 focus:ring-red-500/30"
                    >
                      Delete
                    </button>
                  </div>
                </article>
              );
            }
          )}
        </div>
      )}
    </div>
  );
}

export default ExperienceManager;