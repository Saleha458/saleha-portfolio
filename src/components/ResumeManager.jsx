import { useEffect, useState } from "react";

import {
  getResume,
  addResume,
  updateResume,
  deleteResume,
  uploadResumeFile,
} from "../services/resumeService";

const emptyResume = {
  title: "Saleha Imtiaz - CV / Resume",
  description: "",
  resumeUrl: "",
  fileName: "",
  fileType: "",
  fileSize: 0,
  publicId: "",
};

const buildDownloadUrl = (url) => {
  if (!url) return "";

  try {
    const parsed = new URL(url);

    if (
      parsed.hostname.includes("res.cloudinary.com") &&
      parsed.pathname.includes("/raw/upload/")
    ) {
      parsed.pathname = parsed.pathname.replace(
        "/raw/upload/",
        "/raw/upload/fl_attachment/"
      );
    }

    return parsed.toString();
  } catch {
    return url;
  }
};

function ResumeManager() {
  const [resume, setResume] = useState(null);
  const [form, setForm] = useState(emptyResume);
  const [selectedFile, setSelectedFile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");

  const loadResume = async () => {
    try {
      setError("");

      const data = await getResume();

      setResume(data);

      if (data) {
        setForm({
          title: data.title || "Saleha Imtiaz - CV / Resume",
          description: data.description || "",
          resumeUrl: data.resumeUrl || "",
          fileName: data.fileName || "",
          fileType: data.fileType || "",
          fileSize: data.fileSize || 0,
          publicId: data.publicId || "",
        });
      } else {
        setResume(null);
        setForm({ ...emptyResume });
      }
    } catch (loadError) {
      console.error("Failed to load resume:", loadError);
      setError("Unable to load CV / Resume information.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResume();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    const allowedExtensions = [".pdf", ".doc", ".docx"];

    const fileName = file.name.toLowerCase();

    const hasAllowedType = allowedTypes.includes(file.type);
    const hasAllowedExtension = allowedExtensions.some((extension) =>
      fileName.endsWith(extension)
    );

    if (!hasAllowedType && !hasAllowedExtension) {
      alert("Only PDF, DOC and DOCX files are allowed.");
      event.target.value = "";
      return;
    }

    const maxSize = 10 * 1024 * 1024;

    if (file.size > maxSize) {
      alert("File size must be less than 10 MB.");
      event.target.value = "";
      return;
    }

    setSelectedFile(file);
    setError("");
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 KB";

    const megabytes = bytes / (1024 * 1024);

    if (megabytes >= 1) {
      return `${megabytes.toFixed(2)} MB`;
    }

    return `${Math.ceil(bytes / 1024)} KB`;
  };

  const resetFileInput = () => {
    const fileInput = document.getElementById("resume-file");

    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSaving(true);
    setError("");
    setUploadProgress(0);

    try {
      const title = form.title.trim();

      if (!title) {
        throw new Error("Please enter a CV / Resume title.");
      }

      let resumeData = {
        title,
        description: form.description.trim(),
        resumeUrl: form.resumeUrl || "",
        fileName: form.fileName || "",
        fileType: form.fileType || "",
        fileSize: form.fileSize || 0,
        publicId: form.publicId || "",
      };

      if (selectedFile) {
        const uploaded = await uploadResumeFile(
          selectedFile,
          (progress) => {
            setUploadProgress(progress);
          }
        );

        resumeData = {
          ...resumeData,
          resumeUrl: uploaded.url,
          publicId: uploaded.publicId || "",
          fileName: selectedFile.name,
          fileType: selectedFile.type,
          fileSize: selectedFile.size,
        };
      }

      if (!resume?.id) {
        if (!resumeData.resumeUrl) {
          throw new Error("Please select a CV / Resume file.");
        }

        await addResume(resumeData);
      } else {
        await updateResume(resume.id, resumeData);
      }

      setSelectedFile(null);
      setUploadProgress(0);

      resetFileInput();

      await loadResume();

      alert("CV / Resume saved successfully.");
    } catch (saveError) {
      console.error("Failed to save CV / Resume:", saveError);

      setError(
        saveError?.message || "Failed to save CV / Resume."
      );

      alert(
        saveError?.message || "Failed to save CV / Resume."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!resume?.id) return;

    const confirmed = window.confirm(
      "Are you sure you want to remove your CV / Resume?"
    );

    if (!confirmed) return;

    setDeleting(true);
    setError("");

    try {
      await deleteResume(resume.id);

      setResume(null);
      setSelectedFile(null);
      setForm({ ...emptyResume });

      resetFileInput();

      alert("CV / Resume removed successfully.");
    } catch (deleteError) {
      console.error("Failed to remove CV / Resume:", deleteError);

      setError("Failed to remove CV / Resume.");
      alert("Failed to remove CV / Resume.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
        <p className="text-sm text-slate-400">
          Loading CV / Resume...
        </p>
      </div>
    );
  }

  const downloadUrl = buildDownloadUrl(resume?.resumeUrl);

  return (
    <div>
      {/* HEADER */}
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-400">
          Professional Documents
        </p>

        <h2 className="mt-2 text-2xl font-bold text-white">
          CV / Resume Management
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
          Upload and manage the CV or Resume displayed on your
          public portfolio.
        </p>
      </div>

      {/* ERROR */}
      {error && (
        <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6"
      >
        <div className="grid gap-5">
          {/* TITLE */}
          <div>
            <label
              htmlFor="resume-title"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              CV / Resume Title
            </label>

            <input
              id="resume-title"
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Saleha Imtiaz - CV / Resume"
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label
              htmlFor="resume-description"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Description
            </label>

            <textarea
              id="resume-description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder="My latest CV containing my skills, projects, education and professional experience."
              className="w-full resize-y rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* FILE */}
          <div>
            <label
              htmlFor="resume-file"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Upload CV / Resume
            </label>

            <input
              id="resume-file"
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleFileChange}
              disabled={saving}
              className="block w-full cursor-pointer rounded-xl border border-white/10 bg-slate-950 px-3 py-3 text-sm text-slate-300 file:mr-4 file:rounded-lg file:border-0 file:bg-indigo-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
            />

            <p className="mt-2 text-xs leading-5 text-slate-500">
              Accepted formats: PDF, DOC, DOCX • Maximum size:
              10 MB
            </p>
          </div>

          {/* SELECTED FILE */}
          {selectedFile && (
            <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-indigo-300">
                New File Selected
              </p>

              <p className="mt-2 break-all text-sm font-medium text-slate-200">
                {selectedFile.name}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {formatFileSize(selectedFile.size)}
              </p>
            </div>
          )}

          {/* PROGRESS */}
          {saving && selectedFile && (
            <div>
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="text-slate-400">
                  Uploading CV / Resume...
                </span>

                <span className="font-medium text-indigo-400">
                  {uploadProgress}%
                </span>
              </div>

              <div
                className="h-2 overflow-hidden rounded-full bg-white/10"
                aria-hidden="true"
              >
                <div
                  className="h-full rounded-full bg-indigo-600 transition-all"
                  style={{
                    width: `${uploadProgress}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* BUTTONS */}
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={saving || deleting}
            className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving
              ? selectedFile
                ? "Uploading..."
                : "Saving..."
              : resume
              ? selectedFile
                ? "Replace CV / Resume"
                : "Update Details"
              : "Upload CV / Resume"}
          </button>

          {resume && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={saving || deleting}
              className="rounded-xl bg-red-500/10 px-5 py-3 text-sm font-semibold text-red-400 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {deleting ? "Removing..." : "Remove"}
            </button>
          )}
        </div>
      </form>

      {/* CURRENT FILE */}
      {resume && (
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-start gap-4">
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-xl"
                aria-hidden="true"
              >
                📄
              </div>

              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Current CV / Resume
                </p>

                <h3 className="mt-1 break-all text-sm font-semibold text-slate-200 sm:text-base">
                  {resume.fileName || resume.title}
                </h3>

                <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500">
                  {resume.fileSize > 0 && (
                    <span>
                      {formatFileSize(resume.fileSize)}
                    </span>
                  )}

                  {resume.fileType && (
                    <span>
                      {resume.fileType.includes("pdf")
                        ? "PDF"
                        : resume.fileType.includes("word")
                        ? "Word"
                        : "Document"}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {resume.resumeUrl && (
                <a
                  href={resume.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-4 py-2.5 text-sm font-medium text-indigo-300 transition hover:bg-indigo-500/20"
                >
                  View
                </a>
              )}

              {downloadUrl && (
                <a
                  href={downloadUrl}
                  download
                  className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
                >
                  Download
                </a>
              )}
            </div>
          </div>

          {resume.description && (
            <p className="mt-5 border-t border-white/10 pt-5 text-sm leading-6 text-slate-400">
              {resume.description}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default ResumeManager;