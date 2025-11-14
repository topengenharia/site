import nodemailer from "nodemailer";

const RECAPTCHA_VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

function escapeHtml(str = "") {
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

async function verifyRecaptcha(token) {
  if (!token) return false;

  const params = new URLSearchParams();
  params.append("secret", process.env.RECAPTCHA_SECRET_KEY);
  params.append("response", token);

  const res = await fetch(RECAPTCHA_VERIFY_URL, {
    method: "POST",
    body: params,
  });

  const json = await res.json();
  return json.success === true;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { name, email, message, recaptchaToken } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Dados incompletos" });
    }

    const recaptchaOk = await verifyRecaptcha(recaptchaToken);
    if (!recaptchaOk) {
      return res.status(400).json({ error: "Falha no reCAPTCHA" });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true, // usa SSL
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Site Top Engenharia" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_RECEIVER,
      subject: `Contato pelo site — ${escapeHtml(name)}`,
      html: `
        <h3>Novo contato recebido</h3>
        <p><strong>Nome:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Mensagem:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>
      `,
      replyTo: email,
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("send-email error:", err);
    return res.status(500).json({ error: "Erro no servidor" });
  }
}
