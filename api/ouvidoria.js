import nodemailer from "nodemailer";

const RECAPTCHA_VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

async function verifyRecaptcha(token) {
  if (!token) return false;
  const params = new URLSearchParams();
  params.append("secret", process.env.RECAPTCHA_SECRET_KEY);
  params.append("response", token);
  const res = await fetch(RECAPTCHA_VERIFY_URL, { method: "POST", body: params });
  const json = await res.json();
  return json.success === true;
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Método não permitido" });

  try {
    const { message, recaptchaToken } = req.body;
    if (!message || !recaptchaToken) return res.status(400).json({ error: "Dados incompletos" });

    const ok = await verifyRecaptcha(recaptchaToken);
    if (!ok) return res.status(400).json({ error: "Falha no reCAPTCHA" });

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "email-ssl.com.br",
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      tls: { rejectUnauthorized: false },
    });

    const mailOptions = {
      from: `"Ouvidoria Anônima - Top Engenharia" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_RECEIVER,
      subject: `Mensagem anônima (ouvidoria)`,
      html: `<p>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>`,
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("ouvidoria error:", err);
    return res.status(500).json({ error: "Erro no servidor" });
  }
}

function escapeHtml(str = "") {
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
