import {
  useEffect,
  useState,
} from "react";

import {
  getSkills,
  deleteSkill,
} from "../services/skillService";

import SkillForm from "./SkillForm";

/* =========================================================
   CATEGORY ORDER
========================================================= */

const categoryOrder = {
  Frontend: 1,
  Backend: 2,
  "Mobile Development": 3,
  "Databases & Cloud": 4,
  "AI & Data": 5,
  "Programming Languages": 6,
  "Tools & Workflow": 7,
};

function SkillManager() {
  const [skills, setSkills] =
    useState([]);

  const [
    editingSkill,
    setEditingSkill,
  ] = useState(null);

  const [
    showForm,
    setShowForm,
  ] = useState(false);

  const [loading, setLoading] =
    useState(true);

  /* =======================================================
     LOAD
  ======================================================= */

  const loadSkills =
    async () => {
      try {
        setLoading(true);

        const data =
          await getSkills();

        const safeData =
          Array.isArray(data)
            ? data
            : [];

        const sortedSkills = [
          ...safeData,
        ].sort((a, b) => {
          const rankA =
            categoryOrder[
              a.category
            ] || 99;

          const rankB =
            categoryOrder[
              b.category
            ] || 99;

          if (
            rankA !== rankB
          ) {
            return (
              rankA - rankB
            );
          }

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

          return String(
            a.name || ""
          ).localeCompare(
            String(
              b.name || ""
            )
          );
        });

        setSkills(
          sortedSkills
        );
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

  /* =======================================================
     DELETE
  ======================================================= */

  const handleDelete =
    async (id) => {
      const confirmed =
        window.confirm(
          "Are you sure you want to delete this technology?"
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

        alert(
          "Failed to delete technology."
        );
      }
    };

  /* =======================================================
     SAVE / EDIT
  ======================================================= */

  const handleSaved =
    async () => {
      setEditingSkill(null);
      setShowForm(false);

      await loadSkills();
    };

  const handleEdit = (
    skill
  ) => {
    setEditingSkill(
      skill
    );

    setShowForm(true);
  };

  /* =======================================================
     GROUP BY STACK
  ======================================================= */

  const groupedSkills =
    skills.reduce(
      (
        groups,
        skill
      ) => {
        const category =
          skill.category ||
          "Other";

        if (
          !groups[
            category
          ]
        ) {
          groups[
            category
          ] = [];
        }

        groups[
          category
        ].push(skill);

        return groups;
      },
      {}
    );

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div>
      {/* HEADER */}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Skills & Stacks
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Manage the technologies
            displayed in each
            professional stack.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (showForm) {
              setShowForm(
                false
              );

              setEditingSkill(
                null
              );
            } else {
              setEditingSkill(
                null
              );

              setShowForm(
                true
              );
            }
          }}
          className="rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
        >
          {showForm
            ? "Close"
            : "+ Add Technology"}
        </button>
      </div>

      {/* FORM */}

      {showForm && (
        <div className="mb-8">
          <SkillForm
            skill={
              editingSkill
            }
            onSaved={
              handleSaved
            }
            onCancel={() => {
              setEditingSkill(
                null
              );

              setShowForm(
                false
              );
            }}
          />
        </div>
      )}

      {/* CONTENT */}

      {loading ? (
        <p className="text-slate-400">
          Loading technologies...
        </p>
      ) : skills.length ===
        0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center">
          <p className="text-slate-400">
            No technologies
            added yet.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(
            groupedSkills
          )
            .sort(
              ([categoryA],
               [categoryB]) =>
                (categoryOrder[
                  categoryA
                ] || 99) -
                (categoryOrder[
                  categoryB
                ] || 99)
            )
            .map(
              ([
                category,
                categorySkills,
              ]) => (
                <section
                  key={
                    category
                  }
                >
                  <div className="mb-4 flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-white">
                      {
                        category
                      }
                    </h3>

                    <span className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-slate-400">
                      {
                        categorySkills.length
                      }
                    </span>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {categorySkills.map(
                      (
                        skill
                      ) => (
                        <article
                          key={
                            skill.id
                          }
                          className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-indigo-500/30"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h4 className="text-lg font-semibold text-white">
                                {skill.name ||
                                  "Unnamed Technology"}
                              </h4>

                              <p className="mt-1 text-sm text-indigo-400">
                                {
                                  category
                                }
                              </p>
                            </div>

                            {skill.featured && (
                              <span className="shrink-0 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300">
                                Priority
                              </span>
                            )}
                          </div>

                          <div className="mt-5 flex gap-3 border-t border-white/10 pt-4">
                            <button
                              type="button"
                              onClick={() =>
                                handleEdit(
                                  skill
                                )
                              }
                              className="rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(
                                  skill.id
                                )
                              }
                              className="rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-400 transition hover:bg-red-500/20"
                            >
                              Delete
                            </button>
                          </div>
                        </article>
                      )
                    )}
                  </div>
                </section>
              )
            )}
        </div>
      )}
    </div>
  );
}

export default SkillManager;