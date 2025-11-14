export function enviarArquivoNome() {
  const inputFile = document.getElementById("file");
  const labelText = document.querySelector("#formArquivo span");
  const btnText = document.querySelector("#formArquivo label");
  const textoPadrao = labelText.textContent;

  inputFile.addEventListener("change", (e) => {
    const file = e.target.files?.[0];
    if (file) {
      labelText.textContent = file.name;
      btnText.textContent = "Selecionado";
    } else {
      labelText.textContent = textoPadrao;
      btnText.textContent = "Escolher Arquivo";
    }
  });
}

export function opcaoAssuntoSelecionado() {
  const valorSelecionado = document.getElementById("selected-value");
  const checkbox = document.getElementById("assunto");
  const opcoesInput = document.querySelectorAll(".option input");

  opcoesInput.forEach((input) => {
    input.addEventListener("click", (e) => {
      valorSelecionado.textContent = input.dataset.label;

      const eventoEhMouseOuToque = e.pointerType === "mouse" || e.pointerType === "touch";

      if (eventoEhMouseOuToque) checkbox.click();
    });
  });
}

export function oberservadorAssunto() {
  const curriculoSelecionado = document.querySelector('input[value="curriculo"]');
  const campoArquivo = document.getElementById("formArquivo");
  const radios = document.querySelectorAll('input[name="category"]');

  radios.forEach((radio) => {
    radio.addEventListener("change", () => {
      if (curriculoSelecionado.checked) {
        campoArquivo.classList.add("mostrar");
      } else {
        campoArquivo.classList.remove("mostrar");
      }
    });
  });
}

document.getElementById("formContato").addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const email = document.getElementById("email").value.trim();
  const mensagem = document.getElementById("mensagem").value.trim();
  const categoria = document.querySelector("input[name='category']:checked")?.value;

  if (!categoria) {
    alert("Selecione um assunto.");
    return;
  }

  let fileBase64 = null;
  let filename = null;

  if (categoria === "curriculo") {
    const fileInput = document.getElementById("file");

    if (!fileInput.files[0]) {
      alert("Envie um arquivo de currículo.");
      return;
    }

    const file = fileInput.files[0];
    filename = file.name;

    try {
      fileBase64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    } catch (error) {
      console.error("Erro ao ler arquivo:", error);
      alert("Erro ao processar o arquivo. Tente novamente.");
      return;
    }
  }

  const recaptchaToken = document.querySelector("[name='g-recaptcha-response']")?.value;

  if (!recaptchaToken) {
    alert("Por favor, marque o reCAPTCHA.");
    return;
  }

  const payload = {
    name: nome,
    email,
    message: mensagem,
    recaptchaToken,
    filename,
    fileBase64,
  };

  const endpoint = categoria === "curriculo" ? "/api/send-curriculo" : "/api/send-email";

  /* -------------------------- */
  /* Enviar dados ao backend */
  /* -------------------------- */
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const json = await res.json();

    if (json.success) {
      alert("Mensagem enviada com sucesso!");
      e.target.reset();
      document.querySelector("#formArquivo span").textContent = "Nenhum arquivo selecionado.";
    } else {
      alert(json.error || "Erro ao enviar. Tente novamente.");
    }
  } catch (error) {
    console.error("Erro no envio:", error);
    alert("Erro inesperado. Verifique sua conexão e tente de novo.");
  }
});
