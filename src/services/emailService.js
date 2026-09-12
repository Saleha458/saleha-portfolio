import emailjs from "@emailjs/browser";

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

/**
 * Send a notification to the portfolio owner's email
 * whenever someone submits the public contact form.
 */
export const sendContactNotification = async ({
  name,
  email,
  subject,
  message,
}) => {
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    throw new Error(
      "EmailJS configuration is missing. Please check your .env file."
    );
  }

  const templateParams = {
    name: name || "Unknown Visitor",
    email: email || "",
    reply_to: email || "",
    title: subject || "New Portfolio Contact Message",
    subject: subject || "New Portfolio Contact Message",
    message: message || "",
    time: new Date().toLocaleString(),
  };

  const response = await emailjs.send(
    SERVICE_ID,
    TEMPLATE_ID,
    templateParams,
    {
      publicKey: PUBLIC_KEY,
    }
  );

  return response;
};