import { useEffect, useState } from "react";

import {
  addSkill,
  updateSkill,
} from "../services/skillService";

const emptySkill = {
  name: "",
  category: "Frontend",
  proficiency: "Intermediate",
  experience: "1",
  featured: false,
};

const skillOptions = {
  "Programming Languages": [
    "JavaScript",
    "TypeScript",
    "Python",
    "Java",
    "C",
    "C++",
    "C#",
    "Go",
    "Rust",
    "PHP",
    "Ruby",
    "Kotlin",
    "Swift",
    "Dart",
    "R",
    "MATLAB",
    "Scala",
    "Perl",
    "Lua",
    "Objective-C",
    "Shell Scripting",
    "Bash",
    "PowerShell",
  ],

  Frontend: [
    "HTML5",
    "CSS3",
    "JavaScript",
    "TypeScript",
    "React",
    "Next.js",
    "Vue.js",
    "Nuxt.js",
    "Angular",
    "Svelte",
    "SvelteKit",
    "Astro",
    "jQuery",
    "Redux",
    "Redux Toolkit",
    "Zustand",
    "React Query",
    "TanStack Query",
    "Tailwind CSS",
    "Bootstrap",
    "Material UI",
    "Chakra UI",
    "Ant Design",
    "Sass",
    "Less",
    "Vite",
    "Webpack",
    "Babel",
  ],

  Backend: [
    "Node.js",
    "Express.js",
    "NestJS",
    "Django",
    "Django REST Framework",
    "Flask",
    "FastAPI",
    "Spring Boot",
    "Spring",
    "Laravel",
    "ASP.NET Core",
    "Ruby on Rails",
    "GraphQL",
    "REST API",
    "WebSockets",
    "Socket.IO",
    "Microservices",
    "API Development",
  ],

  "Mobile Development": [
    "Flutter",
    "React Native",
    "Android Development",
    "iOS Development",
    "Android SDK",
    "Jetpack Compose",
    "SwiftUI",
    "Kotlin Multiplatform",
    "Ionic",
    "Expo",
    "Dart",
    "Swift",
    "Kotlin",
  ],

  "AI & Machine Learning": [
    "Artificial Intelligence",
    "Machine Learning",
    "Deep Learning",
    "Generative AI",
    "Large Language Models",
    "LLM",
    "Natural Language Processing",
    "NLP",
    "Computer Vision",
    "Speech Recognition",
    "Recommendation Systems",
    "Predictive Analytics",
    "Reinforcement Learning",
    "Neural Networks",
    "Transformers",
    "RAG",
    "Prompt Engineering",
    "AI Agents",
    "Multi-Agent Systems",
    "LangChain",
    "LangGraph",
    "OpenAI API",
    "Hugging Face",
    "TensorFlow",
    "Keras",
    "PyTorch",
    "Scikit-learn",
    "OpenCV",
    "XGBoost",
    "Pandas",
    "NumPy",
    "Matplotlib",
    "Plotly",
  ],

  Databases: [
    "MongoDB",
    "MongoDB Atlas",
    "MySQL",
    "PostgreSQL",
    "SQLite",
    "Oracle Database",
    "Microsoft SQL Server",
    "Redis",
    "Firebase Firestore",
    "Firebase Realtime Database",
    "Supabase",
    "Cassandra",
    "DynamoDB",
    "Neo4j",
    "Elasticsearch",
    "Database Design",
    "SQL",
    "NoSQL",
  ],

  Cloud: [
    "AWS",
    "Amazon EC2",
    "Amazon S3",
    "Amazon RDS",
    "AWS Lambda",
    "AWS CloudFormation",
    "Microsoft Azure",
    "Google Cloud Platform",
    "Google Cloud",
    "Firebase",
    "Vercel",
    "Netlify",
    "Heroku",
    "DigitalOcean",
    "Cloudflare",
    "Cloud Functions",
    "Serverless Architecture",
  ],

  DevOps: [
    "Git",
    "GitHub",
    "GitLab",
    "Bitbucket",
    "Docker",
    "Docker Compose",
    "Kubernetes",
    "Jenkins",
    "GitHub Actions",
    "GitLab CI/CD",
    "CI/CD",
    "Terraform",
    "Ansible",
    "Linux",
    "Ubuntu",
    "Nginx",
    "Apache",
    "Bash",
    "DevOps",
    "Infrastructure as Code",
    "Monitoring",
  ],

  Testing: [
    "Software Testing",
    "Manual Testing",
    "Automated Testing",
    "Unit Testing",
    "Integration Testing",
    "System Testing",
    "End-to-End Testing",
    "Regression Testing",
    "Jest",
    "Vitest",
    "Cypress",
    "Playwright",
    "Selenium",
    "Postman",
    "API Testing",
    "Test-Driven Development",
    "TDD",
  ],

  "UI/UX & Design": [
    "UI Design",
    "UX Design",
    "UI/UX Design",
    "Figma",
    "Adobe XD",
    "Adobe Photoshop",
    "Adobe Illustrator",
    "Wireframing",
    "Prototyping",
    "Design Systems",
    "Responsive Design",
    "Accessibility",
    "User Research",
    "Interaction Design",
  ],

  "Cybersecurity": [
    "Cybersecurity",
    "Web Security",
    "Network Security",
    "Application Security",
    "Authentication",
    "Authorization",
    "OAuth",
    "JWT",
    "Encryption",
    "Penetration Testing",
    "Ethical Hacking",
    "OWASP",
    "Secure Coding",
    "Identity Management",
  ],

  "Tools & Platforms": [
    "VS Code",
    "Visual Studio",
    "IntelliJ IDEA",
    "PyCharm",
    "Jupyter Notebook",
    "Google Colab",
    "Postman",
    "Swagger",
    "npm",
    "Yarn",
    "pnpm",
    "Firebase",
    "GitHub",
    "Jira",
    "Trello",
    "Notion",
    "Slack",
    "Docker",
  ],

  "Software Engineering": [
    "Software Architecture",
    "System Design",
    "Object-Oriented Programming",
    "Data Structures",
    "Algorithms",
    "Design Patterns",
    "Clean Code",
    "SOLID Principles",
    "Agile",
    "Scrum",
    "Software Development Life Cycle",
    "SDLC",
    "Version Control",
    "Code Review",
    "Technical Documentation",
  ],
};

const categories = Object.keys(skillOptions);

function SkillForm({ skill, onSaved, onCancel }) {
  const [form, setForm] = useState(emptySkill);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (skill) {
      setForm({
        ...emptySkill,
        ...skill,
      });
    } else {
      setForm(emptySkill);
    }
  }, [skill]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name) {
      alert("Please select a skill.");
      return;
    }

    setLoading(true);

    try {
      const skillData = {
        name: form.name,
        category: form.category,
        proficiency: form.proficiency,
        experience: form.experience,
        featured: form.featured,
      };

      if (skill?.id) {
        await updateSkill(skill.id, skillData);
      } else {
        await addSkill(skillData);
      }

      onSaved();
      setForm(emptySkill);
    } catch (error) {
      console.error("Failed to save skill:", error);
      alert("Failed to save skill.");
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
            {skill ? "Edit Skill" : "Add New Skill"}
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Add a technology, tool or professional skill.
          </p>
        </div>

        {skill && (
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

        {/* CATEGORY */}
        <div>
          <label className="mb-2 block text-sm text-slate-300">
            Category *
          </label>

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* SKILL */}
        <div>
          <label className="mb-2 block text-sm text-slate-300">
            Skill *
          </label>

          <select
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
          >
            <option value="">
              Select a skill
            </option>

            {(skillOptions[form.category] || []).map((skillName) => (
              <option
                key={skillName}
                value={skillName}
              >
                {skillName}
              </option>
            ))}
          </select>
        </div>

        {/* PROFICIENCY */}
        <div>
          <label className="mb-2 block text-sm text-slate-300">
            Proficiency *
          </label>

          <select
            name="proficiency"
            value={form.proficiency}
            onChange={handleChange}
            className="w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
          >
            <option value="Beginner">
              Beginner
            </option>

            <option value="Intermediate">
              Intermediate
            </option>

            <option value="Advanced">
              Advanced
            </option>

            <option value="Expert">
              Expert
            </option>
          </select>
        </div>

        {/* EXPERIENCE */}
        <div>
          <label className="mb-2 block text-sm text-slate-300">
            Experience
          </label>

          <select
            name="experience"
            value={form.experience}
            onChange={handleChange}
            className="w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
          >
            <option value="0">Less than 1 year</option>
            <option value="1">1 year</option>
            <option value="2">2 years</option>
            <option value="3">3 years</option>
            <option value="4">4 years</option>
            <option value="5">5+ years</option>
            <option value="6">6+ years</option>
            <option value="7">7+ years</option>
            <option value="8">8+ years</option>
            <option value="9">9+ years</option>
            <option value="10">10+ years</option>
          </select>
        </div>
      </div>

      {/* FEATURED */}
      <label className="mt-6 flex cursor-pointer items-center gap-3">
        <input
          type="checkbox"
          name="featured"
          checked={form.featured}
          onChange={handleChange}
          className="h-4 w-4 rounded"
        />

        <span className="text-sm text-slate-300">
          Show this skill as a featured skill
        </span>
      </label>

      {/* SUBMIT */}
      <button
        type="submit"
        disabled={loading}
        className="mt-6 rounded-lg bg-indigo-600 px-6 py-3 font-semibold transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading
          ? "Saving..."
          : skill
          ? "Update Skill"
          : "Add Skill"}
      </button>
    </form>
  );
}

export default SkillForm;