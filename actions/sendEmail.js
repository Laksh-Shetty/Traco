import { Resend } from "resend";

export async function sendEmail({
  to,
  subject,
  react,
}) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  // 1. Determine the recipient
  // In development/testing, Resend only allows sending to your verified email.
  const recipient = process.env.NODE_ENV === "development" 
    ? "lakshshetty206@gmail.com" 
    : to;

  try {
    const { data, error } = await resend.emails.send({
      // 2. Note on the 'from' address:
      // Keep "onboarding@resend.dev" ONLY while testing. 
      // Once you verify your domain, change this to "hello@yourdomain.com"
      from: "Traco <onboarding@resend.dev>",
      to: recipient,
      subject,
      react,
    });

    if (error) {
      // Log the error but provide context
      console.error("❌ Resend error:", error.message);
      return { error };
    }

    return { data };
  } catch (err) {
    console.error("❌ Unexpected Email Error:", err);
    return { error: err.message };
  }
}