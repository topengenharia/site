import nodemailer from "nodemailer";

export const config = {
  api: { bodyParser: { sizeLimit: "1mb" } },
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
    const { mensagem, categoria, emailOpcional, recaptchaToken } = req.body;

    if (!mensagem || !categoria) {
      return res.status(400).json({ error: "Dados incompletos" });
    }

    const ok = await verifyRecaptcha(recaptchaToken);
    if (!ok) return res.status(400).json({ error: "Falha no reCAPTCHA" });

    // SMTP igual ao endpoint que funciona
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    let contatoTexto = emailOpcional
      ? `Email para retorno: ${emailOpcional}`
      : "Email não informado (ouvidoria anônima).";

    await transporter.sendMail({
      from: `"Ouvidoria" <${process.env.SMTP_USER}>`,
      to: process.env.OUVIDORIA_RECEIVER,
      subject: `Mensagem de ouvidoria — ${categoria}`,
      html: `
        <h3>Nova manifestação de ouvidoria</h3>
        <p><strong>Categoria:</strong> ${categoria}</p>
        <p><strong>Mensagem:</strong></p>
        <p>${mensagem}</p>
        <br/>
        <p>${contatoTexto}</p>
      `,
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("send-ouvidoria:", err);
    return res.status(500).json({ error: "Erro ao enviar ouvidoria" });
  }
}
