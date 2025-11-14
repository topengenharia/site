import nodemailer from "nodemailer";

export const config = {
  api: { bodyParser: { sizeLimit: "10mb" } },
};

async function verifyRecaptcha(token) {
  if (!token) return false;
  const params = new URLSearchParams();
  params.append("secret", process.env.RECAPTCHA_SECRET_KEY);
  params.append("response", token);

  const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    body: params,
  });

  const json = await res.json();
  return json.success === true;
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Método não permitido" });

  try {
    const { name, email, filename, fileBase64, recaptchaToken } = req.body;

    if (!name || !email || !filename || !fileBase64 || !recaptchaToken) {
      return res.status(400).json({ error: "Dados incompletos" });
    }

    const ok = await verifyRecaptcha(recaptchaToken);
    if (!ok) return res.status(400).json({ error: "Falha no reCAPTCHA" });

    const buffer = Buffer.from(fileBase64, "base64");

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    await transporter.sendMail({
      from: `"Currículos - Top Engenharia" <${process.env.SMTP_USER}>`,
      to: process.env.CURRICULUM_RECEIVER,
      subject: `Novo currículo enviado — ${name}`,
      text: `Nome: ${name}\nEmail: ${email}`,
      attachments: [
        {
          filename,
          content: buffer,
        },
      ],
      replyTo: email,
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("send-curriculo:", err);
    return res.status(500).json({ error: "Erro ao enviar e-mail" });
  }
}
