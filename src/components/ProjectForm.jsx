import { useEffect, useState } from "react";
import {
  addProject,
  updateProject,
} from "../services/projectService";

const TECH_OPTIONS = [
  // Frontend
  "HTML",
  "CSS",
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Vue.js",
  "Angular",
  "Vite",
  "Tailwind CSS",
  "Bootstrap",

  // Backend
  "Node.js",
  "Express.js",
  "Django",
  "Flask",
  "FastAPI",
  "Spring Boot",
  "Laravel",

  // Databases
  "MongoDB",
  "Firebase",
  "Firestore",
  "MySQL",
  "PostgreSQL",
  "SQLite",

  // Mobile
  "Flutter",
  "React Native",
  "Android",

  // AI / ML
  "Python",
  "TensorFlow",
  "Keras",
  "scikit-learn",
  "Pandas",
  "NumPy",
  "OpenCV",
  "Generative AI",
  "OpenAI API",
  "LangChain",
  "LangGraph",
  "RAG",

  // Cloud / DevOps
  "Docker",
  "Git",
  "GitHub",
  "GitHub Actions",
  "Vercel",
  "Netlify",
  "AWS",

  // Other
  "REST API",
  "JWT",
  "WebSocket",
];

const emptyProject = {
  title: "",
  shortDescription: "",
  description: "",
  techStack: [],
  features: "",
  githubUrl: "",
  liveUrl: "",
  imageUrl: "",
  status: "Completed",
  featured: false,
};

function ProjectForm({ project, onSaved, onCancel }) {
  const [form, setForm] = useState(emptyProject);
  const [loading, setLoading] = useState(false);
  const [techOpen, setTechOpen] = useState(false);
  const [customTech, setCustomTech] = useState("");

  useEffect(() => {
    if (project) {
      setForm({
        ...emptyProject,
        ...project,
        techStack: Array.isArray(project.techStack)
          ? project.techStack
          : project.techStack
          ? project.techStack
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean)
          : [],
        features: Array.isArray(project.features)
          ? project.features.join("\n")
          : project.features || "",
      });
    } else {
      setForm(emptyProject);
    }

    setCustomTech("");
  }, [project]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Toggle predefined technology
  const handleTechChange = (tech) => {
    setForm((prev) => {
      const exists = prev.techStack.includes(tech);

      return {
        ...prev,
        techStack: exists
          ? prev.techStack.filter((item) => item !== tech)
          : [...prev.techStack, tech],
      };
    });
  };

  // Add custom technology
  const handleAddCustomTech = () => {
    const tech = customTech.trim();

    if (!tech) return;

    setForm((prev) => {
      if (
        prev.techStack.some(
          (item) => item.toLowerCase() === tech.toLowerCase()
        )
      ) {
        return prev;
      }

      return {
        ...prev,
        techStack: [...prev.techStack, tech],
      };
    });

    setCustomTech("");
  };

  // Remove selected technology
  const removeTech = (techToRemove) => {
    setForm((prev) => ({
      ...prev,
      techStack: prev.techStack.filter(
        (tech) => tech !== techToRemove
      ),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const projectData = {
        title: form.title.trim(),
        shortDescription: form.shortDescription.trim(),
        description: form.description.trim(),

        techStack: form.techStack,

        features: form.features
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),

        githubUrl: form.githubUrl.trim(),
        liveUrl: form.liveUrl.trim(),
        imageUrl: form.imageUrl.trim(),

        status: form.status,
        featured: form.featured,
      };

      if (project?.id) {
        await updateProject(project.id, projectData);
      } else {
        await addProject(projectData);
      }

      onSaved();
      setForm(emptyProject);
      setCustomTech("");
    } catch (error) {
      console.error("Project save error:", error);
      alert("Failed to save project.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-white/10 bg-white/5 p-6"
    >
      {/* HEADER */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            {project ? "Edit Project" : "Add New Project"}
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Add or update your portfolio project.
          </p>
        </div>

        {project && (
          <button
            type="button"
            onClick={onCancel}
            className="text-sm text-slate-400 hover:text-white"
          >
            Cancel
          </button>
        )}
      </div>

      <div className="grid gap-5 md:grid-cols-2">

        {/* TITLE */}
        <div>
          <label className="mb-2 block text-sm text-slate-300">
            Project Title *
          </label>

          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            placeholder="e.g. CalcAI Pro"
            className="w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-3 outline-none focus:border-indigo-500"
          />
        </div>

        {/* STATUS */}
        <div>
          <label className="mb-2 block text-sm text-slate-300">
            Status
          </label>

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
          >
            <option value="Completed">Completed</option>
            <option value="In Progress">In Progress</option>
          </select>
        </div>

        {/* SHORT DESCRIPTION */}
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm text-slate-300">
            Short Description *
          </label>

          <input
            name="shortDescription"
            value={form.shortDescription}
            onChange={handleChange}
            required
            placeholder="A short description for project cards"
            className="w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-3 outline-none focus:border-indigo-500"
          />
        </div>

        {/* FULL DESCRIPTION */}
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm text-slate-300">
            Full Description
          </label>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="5"
            placeholder="Detailed project description..."
            className="w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-3 outline-none focus:border-indigo-500"
          />
        </div>

        {/* TECH STACK */}
        <div className="relative md:col-span-2">
          <label className="mb-2 block text-sm text-slate-300">
            Tech Stack
          </label>

          <button
            type="button"
            onClick={() => setTechOpen(!techOpen)}
            className="flex w-full items-center justify-between rounded-lg border border-white/10 bg-slate-950 px-4 py-3 text-left outline-none hover:border-indigo-500"
          >
            <span className="text-slate-300">
              {form.techStack.length > 0
                ? `${form.techStack.length} technologies selected`
                : "Select technologies"}
            </span>

            <span className="text-slate-400">
              {techOpen ? "▲" : "▼"}
            </span>
          </button>

          {techOpen && (
            <div className="absolute z-50 mt-2 max-h-80 w-full overflow-y-auto rounded-xl border border-white/10 bg-slate-950 p-4 shadow-2xl">

              {/* CUSTOM TECHNOLOGY */}
              <div className="mb-4 border-b border-white/10 pb-4">
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Add Custom Technology
                </label>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customTech}
                    onChange={(e) =>
                      setCustomTech(e.target.value)
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddCustomTech();
                      }
                    }}
                    placeholder="e.g. Java, C++, Figma..."
                    className="min-w-0 flex-1 rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
                  />

                  <button
                    type="button"
                    onClick={handleAddCustomTech}
                    className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium hover:bg-indigo-500"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* PREDEFINED TECHNOLOGIES */}
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                {TECH_OPTIONS.map((tech) => (
                  <label
                    key={tech}
                    className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/5"
                  >
                    <input
                      type="checkbox"
                      checked={form.techStack.includes(tech)}
                      onChange={() => handleTechChange(tech)}
                      className="h-4 w-4 accent-indigo-600"
                    />

                    {tech}
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* SELECTED TECHNOLOGIES */}
          {form.techStack.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {form.techStack.map((tech) => (
                <span
                  key={tech}
                  className="flex items-center gap-2 rounded-full bg-indigo-500/10 px-3 py-1 text-xs text-indigo-300"
                >
                  {tech}

                  <button
                    type="button"
                    onClick={() => removeTech(tech)}
                    className="text-indigo-400 hover:text-white"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* FEATURES */}
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm text-slate-300">
            Features
          </label>

          <textarea
            name="features"
            value={form.features}
            onChange={handleChange}
            rows="6"
            placeholder={`User authentication
AI recommendations
Responsive dashboard
Real-time data`}
            className="w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-3 outline-none focus:border-indigo-500"
          />

          <p className="mt-1 text-xs text-slate-500">
            Put each feature on a new line.
          </p>
        </div>

        {/* GITHUB */}
        <div>
          <label className="mb-2 block text-sm text-slate-300">
            GitHub URL
          </label>

          <input
            name="githubUrl"
            value={form.githubUrl}
            onChange={handleChange}
            placeholder="https://github.com/username/project"
            className="w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-3 outline-none focus:border-indigo-500"
          />
        </div>

        {/* LIVE DEMO */}
        <div>
          <label className="mb-2 block text-sm text-slate-300">
            Live Demo URL
          </label>

          <input
            name="liveUrl"
            value={form.liveUrl}
            onChange={handleChange}
            placeholder="https://your-project.vercel.app"
            className="w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-3 outline-none focus:border-indigo-500"
          />
        </div>

        {/* IMAGE URL */}
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm text-slate-300">
            Project Image URL
          </label>

          <input
            name="imageUrl"
            value={form.imageUrl}
            onChange={handleChange}
            placeholder="https://..."
            className="w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-3 outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* FEATURED */}
      <label className="mt-5 flex items-center gap-3">
        <input
          type="checkbox"
          name="featured"
          checked={form.featured}
          onChange={handleChange}
          className="h-4 w-4 accent-indigo-600"
        />

        <span className="text-sm text-slate-300">
          Featured project
        </span>
      </label>

      {/* SUBMIT */}
      <button
        type="submit"
        disabled={loading}
        className="mt-6 rounded-lg bg-indigo-600 px-6 py-3 font-semibold hover:bg-indigo-500 disabled:opacity-50"
      >
        {loading
          ? "Saving..."
          : project
          ? "Update Project"
          : "Add Project"}
      </button>
    </form>
  );
}

export default ProjectForm;