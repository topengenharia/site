export function enviarArquivoNome() {
  const inputFile = document.getElementById("file");
  const labelText = document.querySelector("#formArquivo span");
  const btnText = document.querySelector("#formArquivo label");
  const textoPadrao = labelText.textContent;

  inputFile.addEventListener("change", (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const nomeDoArquivo = e.target.files[0].name;
      labelText.textContent = nomeDoArquivo;
      btnText.textContent = "Selecionado";
    } else labelText.textContent = textoPadrao;
  });
}

export function opcaoAssuntoSelecionado() {
  const valorSelecionado = document.getElementById("selected-value");
  const checkbox = document.getElementById("assunto");
  const opcoesInput = document.querySelectorAll(".option input");

  opcoesInput.forEach((input) => {
    input.addEventListener("click", (e) => {
      valorSelecionado.textContent = input.dataset.label;

      const ehMouseOuToque = e.pointerType == "mouse" || e.pointerType == "touch";

      ehMouseOuToque && checkbox.click();
    });
  });
}

export function oberservadorAssunto() {
  const curriculoSelecionado = document.querySelector('input[value="curriculo"]');
  const botaoEnviarArquivo = document.getElementById("formArquivo");
  const todosOsRadios = document.querySelectorAll('input[name="category"]');

  todosOsRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      if (curriculoSelecionado.checked) {
        botaoEnviarArquivo.classList.add("mostrar");
      } else {
        botaoEnviarArquivo.classList.remove("mostrar");
      }
    });
  });
}

document.getElementById("formContato").addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;
  const mensagem = document.getElementById("mensagem").value;
  const categoria = document.querySelector("input[name='category']:checked")?.value;

  const fileInput = document.getElementById("file");
  let fileBase64 = null;
  let filename = null;

  if (categoria === "curriculo") {
    if (!fileInput.files[0]) {
      alert("Envie um arquivo de currículo.");
      return;
    }

    const file = fileInput.files[0];
    filename = file.name;

    fileBase64 = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(",")[1]);
      reader.readAsDataURL(file);
    });
  }

  const recaptchaToken = await grecaptcha.execute("6Lfm6wwsAAAAAPSXjRMWlwWxs8XkcZ_Knd9nOvzU", {
    action: "submit",
  });

  const payload = {
    name: nome,
    email,
    message: mensagem,
    recaptchaToken,
    filename,
    fileBase64,
  };

  const endpoint = categoria === "curriculo" ? "/api/send-curriculo" : "/api/send-email";

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const json = await res.json();

  if (json.success) {
    alert("Mensagem enviada com sucesso!");
    e.target.reset();
  } else {
    alert("Erro ao enviar. Tente novamente.");
  }
});
