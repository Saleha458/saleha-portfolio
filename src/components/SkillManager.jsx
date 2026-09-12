import { useEffect, useState } from "react";

import {
  getSkills,
  deleteSkill,
} from "../services/skillService";

import SkillForm from "./SkillForm";

function SkillManager() {
  const [skills, setSkills] = useState([]);
  const [editingSkill, setEditingSkill] =
    useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadSkills = async () => {
    try {
      const data = await getSkills();

      const sortedSkills = [...(data || [])].sort(
        (a, b) => {
          const featuredA = a.featured ? 1 : 0;
          const featuredB = b.featured ? 1 : 0;

          if (featuredA !== featuredB) {
            return featuredB - featuredA;
          }

          return String(a.name || "").localeCompare(
            String(b.name || "")
          );
        }
      );

      setSkills(sortedSkills);
    } catch (error) {
      console.error(
        "Failed to load skills:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSkills();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this skill?"
    );

    if (!confirmed) return;

    try {
      await deleteSkill(id);
      await loadSkills();
    } catch (error) {
      console.error(
        "Failed to delete skill:",
        error
      );

      alert("Failed to delete skill.");
    }
  };

  const handleSaved = async () => {
    setEditingSkill(null);
    setShowForm(false);

    await loadSkills();
  };

  const handleEdit = (skill) => {
    setEditingSkill(skill);
    setShowForm(true);
  };

  const getProficiencyWidth = (proficiency) => {
    const value = String(
      proficiency || ""
    ).toLowerCase();

    if (value === "expert") {
      return "w-full";
    }

    if (value === "advanced") {
      return "w-4/5";
    }

    if (value === "intermediate") {
      return "w-3/5";
    }

    if (value === "beginner") {
      return "w-2/5";
    }

    return "w-1/2";
  };

  const formatExperience = (experience) => {
    if (
      experience === undefined ||
      experience === null ||
      experience === ""
    ) {
      return "";
    }

    const numericExperience = Number(
      experience
    );

    if (Number.isNaN(numericExperience)) {
      return String(experience);
    }

    if (numericExperience <= 0) {
      return "Less than 1 year";
    }

    if (numericExperience === 1) {
      return "1 year";
    }

    if (numericExperience >= 5) {
      return "5+ years";
    }

    return `${numericExperience} years`;
  };

  return (
    <div>
      {/* HEADER */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            Skills
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Manage your technical and professional
            skills.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingSkill(null);
            setShowForm(
              (previous) => !previous
            );
          }}
          className="rounded-lg bg-indigo-600 px-5 py-3 font-semibold transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
        >
          {showForm
            ? "Close"
            : "+ Add Skill"}
        </button>
      </div>

      {/* FORM */}
      {showForm && (
        <div className="mb-8">
          <SkillForm
            skill={editingSkill}
            onSaved={handleSaved}
            onCancel={() => {
              setEditingSkill(null);
              setShowForm(false);
            }}
          />
        </div>
      )}

      {/* CONTENT */}
      {loading ? (
        <p className="text-slate-400">
          Loading skills...
        </p>
      ) : skills.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center">
          <p className="text-slate-400">
            No skills added yet.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {skills.map((skill) => {
            const proficiency =
              skill.proficiency ||
              skill.level ||
              "Intermediate";

            const experience =
              skill.experience ?? "";

            return (
              <article
                key={skill.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-indigo-500/30"
              >
                {/* TOP */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-semibold">
                      {skill.name ||
                        "Unnamed Skill"}
                    </h3>

                    {skill.category && (
                      <p className="mt-1 text-sm text-indigo-400">
                        {skill.category}
                      </p>
                    )}
                  </div>

                  {skill.featured && (
                    <span className="shrink-0 rounded-full bg-amber-500/10 px-3 py-1 text-xs text-amber-400">
                      Featured
                    </span>
                  )}
                </div>

                {/* PROFICIENCY */}
                <div className="mt-5">
                  <div className="mb-2 flex items-center justify-between gap-3 text-xs">
                    <span className="text-slate-400">
                      Proficiency
                    </span>

                    <span className="text-slate-300">
                      {proficiency}
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className={`h-full rounded-full bg-indigo-500 transition-all ${getProficiencyWidth(
                        proficiency
                      )}`}
                    />
                  </div>
                </div>

                {/* EXPERIENCE */}
                {experience !== "" && (
                  <p className="mt-4 text-sm text-slate-400">
                    Experience:{" "}
                    <span className="text-slate-300">
                      {formatExperience(
                        experience
                      )}
                    </span>
                  </p>
                )}

                {/* DESCRIPTION */}
                {skill.description && (
                  <p className="mt-4 text-sm leading-6 text-slate-400">
                    {skill.description}
                  </p>
                )}

                {/* ACTIONS */}
                <div className="mt-5 flex gap-3 border-t border-white/10 pt-4">
                  <button
                    type="button"
                    onClick={() =>
                      handleEdit(skill)
                    }
                    className="rounded-lg border border-white/10 px-4 py-2 text-sm transition hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(skill.id)
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

export default SkillManager;