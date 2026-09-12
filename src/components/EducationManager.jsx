import { useEffect, useState } from "react";

import {
  getEducation,
  deleteEducation,
} from "../services/educationService";

import EducationForm from "./EducationForm";

function EducationManager() {
  const [education, setEducation] = useState([]);
  const [editingEducation, setEditingEducation] =
    useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadEducation = async () => {
    try {
      const data = await getEducation();

      const sortedEducation = [
        ...(Array.isArray(data) ? data : []),
      ].sort((a, b) =>
        String(b.startDate || "").localeCompare(
          String(a.startDate || "")
        )
      );

      setEducation(sortedEducation);
    } catch (error) {
      console.error(
        "Failed to load education:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEducation();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this education record?"
    );

    if (!confirmed) return;

    try {
      await deleteEducation(id);
      await loadEducation();
    } catch (error) {
      console.error(
        "Failed to delete education:",
        error
      );

      alert("Failed to delete education.");
    }
  };

  const handleSaved = async () => {
    setEditingEducation(null);
    setShowForm(false);

    await loadEducation();
  };

  const handleEdit = (item) => {
    setEditingEducation(item);
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

  const getAchievements = (achievements) => {
    if (!achievements) {
      return [];
    }

    if (Array.isArray(achievements)) {
      return achievements
        .map((item) =>
          String(item).trim()
        )
        .filter(Boolean);
    }

    if (typeof achievements === "string") {
      return achievements
        .split("\n")
        .map((item) =>
          item.trim()
        )
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
            Education
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Manage your academic background and
            qualifications.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingEducation(null);
            setShowForm(
              (previous) => !previous
            );
          }}
          className="rounded-lg bg-indigo-600 px-5 py-3 font-semibold transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
        >
          {showForm
            ? "Close"
            : "+ Add Education"}
        </button>
      </div>

      {/* FORM */}
      {showForm && (
        <div className="mb-8">
          <EducationForm
            education={editingEducation}
            onSaved={handleSaved}
            onCancel={() => {
              setEditingEducation(null);
              setShowForm(false);
            }}
          />
        </div>
      )}

      {/* CONTENT */}
      {loading ? (
        <p className="text-slate-400">
          Loading education...
        </p>
      ) : education.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center">
          <p className="text-slate-400">
            No education records added yet.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {education.map((item) => {
            const achievements =
              getAchievements(
                item.achievements
              );

            return (
              <article
                key={item.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-6"
              >
                {/* TOP */}
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h3 className="text-xl font-semibold">
                      {item.degree ||
                        item.qualification ||
                        "Education"}
                    </h3>

                    {item.institution && (
                      <p className="mt-1 text-indigo-400">
                        {item.institution}
                      </p>
                    )}

                    {item.fieldOfStudy && (
                      <p className="mt-1 text-sm text-slate-400">
                        {item.fieldOfStudy}
                      </p>
                    )}

                    {item.location && (
                      <p className="mt-1 text-sm text-slate-500">
                        {item.location}
                      </p>
                    )}
                  </div>

                  {item.current && (
                    <span className="w-fit rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400">
                      Currently Studying
                    </span>
                  )}
                </div>

                {/* DATE */}
                {(item.startDate ||
                  item.endDate ||
                  item.current) && (
                  <p className="mt-4 text-sm text-slate-400">
                    {formatDate(
                      item.startDate
                    )}

                    {" — "}

                    {item.current
                      ? "Present"
                      : formatDate(
                          item.endDate
                        )}
                  </p>
                )}

                {/* DESCRIPTION */}
                {item.description && (
                  <p className="mt-4 text-sm leading-6 text-slate-400">
                    {item.description}
                  </p>
                )}

                {/* ACHIEVEMENTS */}
                {achievements.length > 0 && (
                  <div className="mt-5">
                    <p className="mb-2 text-sm font-semibold text-slate-200">
                      Achievements & Highlights
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

                {/* ACTIONS */}
                <div className="mt-6 flex gap-3 border-t border-white/10 pt-4">
                  <button
                    type="button"
                    onClick={() =>
                      handleEdit(item)
                    }
                    className="rounded-lg border border-white/10 px-4 py-2 text-sm transition hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(item.id)
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

export default EducationManager;