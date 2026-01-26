import { Resend } from "resend";

export async function sendEmail({ to, subject, react }) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  // 1. Define your primary Resend account email
  const authorizedEmail = "lakshshetty206@gmail.com";

  // 2. Strict check: Skip if the recipient is NOT your account email
  if (to.toLowerCase().trim() !== authorizedEmail) {
    console.log(`[SKIPPED] Recipient ${to} is not the authorized account email.`);
    return { data: null, skipped: true }; 
  }

  try {
    const { data, error } = await resend.emails.send({
      // Must stay as onboarding@resend.dev without a domain
      from: "Traco <onboarding@resend.dev>",
      to: authorizedEmail, // Using the variable directly for safety
      subject,
      react,
    });

    if (error) {
      console.error("❌ Resend error:", error.message);
      return { error };
    }

    console.log("✅ Email sent successfully to authorized user.");
    return { data };
  } catch (err) {
    console.error("❌ Unexpected Email Error:", err);
    return { error: err.message };
  }
}