import { Resend } from "resend";

function getRequiredEnv(key: string) {
  const value = process.env[key];
  if (!value) throw new Error(`Missing ${key}`);
  return value;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as
      | { name?: unknown; email?: unknown; message?: unknown }
      | null;

    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const email = typeof body?.email === "string" ? body.email.trim() : "";
    const message = typeof body?.message === "string" ? body.message.trim() : "";

    if (!name || !email || !message) {
      return Response.json(
        { error: "Please include name, email, and message." },
        { status: 400 },
      );
    }

    if (message.length > 4000) {
      return Response.json(
        { error: "Message is too long." },
        { status: 400 },
      );
    }

    const resend = new Resend(getRequiredEnv("RESEND_API_KEY"));
    const to = getRequiredEnv("CONTACT_TO_EMAIL");
    const from = process.env.CONTACT_FROM_EMAIL || "onboarding@resend.dev";

    await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `New message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    });

    return Response.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    const status = msg.startsWith("Missing ") ? 500 : 500;
    return Response.json(
      {
        error:
          status === 500
            ? "Email sending is not configured yet."
            : "Message failed to send.",
      },
      { status },
    );
  }
}

