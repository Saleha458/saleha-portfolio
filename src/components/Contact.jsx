import { useState } from "react";
import { motion } from "framer-motion";

import {
  addContactMessage,
} from "../services/contactService";

import {
  sendContactNotification,
} from "../services/emailService";

const initialForm = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

function Contact() {
  const [form, setForm] =
    useState(initialForm);

  const [loading, setLoading] =
    useState(false);

  const [success, setSuccess] =
    useState("");

  const [error, setError] =
    useState("");

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setSuccess("");
    setError("");
  };

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    setSuccess("");
    setError("");

    const name =
      form.name.trim();

    const email =
      form.email.trim();

    const subject =
      form.subject.trim();

    const message =
      form.message.trim();

    if (
      !name ||
      !email ||
      !message
    ) {
      setError(
        "Please fill in your name, email and message."
      );

      return;
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email
      )
    ) {
      setError(
        "Please enter a valid email address."
      );

      return;
    }

    if (
      message.length < 10
    ) {
      setError(
        "Please provide a little more detail in your message."
      );

      return;
    }

    setLoading(true);

    try {
      await addContactMessage({
        name,
        email,
        subject,
        message,
      });

      try {
        await sendContactNotification({
          name,
          email,
          subject,
          message,
        });

        setSuccess(
          "Your message has been sent successfully. I'll get back to you soon."
        );
      } catch (emailError) {
        console.error(
          "Email notification failed:",
          emailError
        );

        setSuccess(
          "Your message has been received successfully. Thank you!"
        );
      }

      setForm(initialForm);
    } catch (submitError) {
      console.error(
        "Contact form submission error:",
        submitError
      );

      setError(
        "Something went wrong while sending your message. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClasses =
    "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500";

  return (
    <section
      id="contact"
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
          className="mb-10 text-center"
        >
          <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
            Let's Work Together
          </h2>

          <div className="mx-auto mt-5 h-px w-16 bg-indigo-500" />

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-400 sm:text-lg">
            Have a project, opportunity or collaboration in mind?
            Send me a message and I'll get back to you.
          </p>
        </motion.div>

        <motion.div
          initial={{
            opacity: 0,
            y: 22,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.1,
          }}
          transition={{
            duration: 0.5,
          }}
          className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8"
        >
          {success && (
            <div
              className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300"
              role="status"
              aria-live="polite"
            >
              {success}
            </div>
          )}

          {error && (
            <div
              className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300"
              role="alert"
            >
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="contact-name"
                  className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Your Name
                </label>

                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  required
                  maxLength={100}
                  autoComplete="name"
                  placeholder="Enter your name"
                  className={inputClasses}
                />
              </div>

              <div>
                <label
                  htmlFor="contact-email"
                  className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Your Email
                </label>

                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  maxLength={150}
                  autoComplete="email"
                  placeholder="you@example.com"
                  className={inputClasses}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="contact-subject"
                className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Subject
              </label>

              <input
                id="contact-subject"
                name="subject"
                type="text"
                value={form.subject}
                onChange={handleChange}
                maxLength={150}
                placeholder="Project inquiry / Job opportunity / Collaboration"
                className={inputClasses}
              />
            </div>

            <div>
              <label
                htmlFor="contact-message"
                className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Message
              </label>

              <textarea
                id="contact-message"
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows={7}
                maxLength={3000}
                placeholder="Tell me about your project or opportunity..."
                className={`${inputClasses} resize-y`}
              />

              <p className="mt-2 text-right text-xs text-slate-500">
                {form.message.length}/3000
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-indigo-600 px-6 py-3.5 font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Sending Message..."
                : "Send Message"}
            </button>
          </form>

          <p className="mt-5 text-center text-xs leading-5 text-slate-500">
            Your message will be securely submitted and delivered to my inbox.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export default Contact;