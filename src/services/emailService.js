import emailjs from "@emailjs/browser";

const SERVICE_ID =
  import.meta.env.VITE_EMAILJS_SERVICE_ID;

const TEMPLATE_ID =
  import.meta.env.VITE_EMAILJS_TEMPLATE_ID;

const PUBLIC_KEY =
  import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

/* =========================================================
   SEND CONTACT EMAIL
========================================================= */

/**
 * Sends a notification email when a visitor submits
 * the portfolio contact form.
 *
 * Important:
 * The visitor's email is passed as `reply_to`.
 * The EmailJS template must use {{reply_to}}
 * in its Reply-To field.
 */
export const sendContactNotification =
  async ({
    name,
    email,
    subject,
    message,
  }) => {
    if (
      !SERVICE_ID ||
      !TEMPLATE_ID ||
      !PUBLIC_KEY
    ) {
      throw new Error(
        "EmailJS configuration is missing. Please check your environment variables."
      );
    }

    const visitorName =
      String(
        name || "Portfolio Visitor"
      ).trim();

    const visitorEmail =
      String(
        email || ""
      ).trim();

    const emailSubject =
      String(
        subject ||
          "New Portfolio Contact Message"
      ).trim();

    const emailMessage =
      String(
        message || ""
      ).trim();

    if (!visitorEmail) {
      throw new Error(
        "Visitor email is required."
      );
    }

    const templateParams = {
      /* Visitor information */

      name: visitorName,

      email: visitorEmail,

      /*
       * Main variable EmailJS should use
       * for the email Reply-To header.
       */

      reply_to: visitorEmail,

      /*
       * Additional aliases make the template
       * compatible if an older EmailJS template
       * uses a different variable name.
       */

      user_email:
        visitorEmail,

      from_email:
        visitorEmail,

      from_name:
        visitorName,

      /* Message */

      title:
        emailSubject,

      subject:
        emailSubject,

      message:
        emailMessage,

      time:
        new Date().toLocaleString(
          "en-US",
          {
            dateStyle:
              "medium",

            timeStyle:
              "short",
          }
        ),
    };

    const response =
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        templateParams,
        {
          publicKey:
            PUBLIC_KEY,
        }
      );

    return response;
  };