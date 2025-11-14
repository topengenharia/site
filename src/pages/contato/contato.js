export function enviarArquivoNome() {
  const inputFile = document.getElementById('file');
  const labelText = document.querySelector('#formArquivo span');
  const btnText = document.querySelector('#formArquivo label');
  const textoPadrao = labelText.textContent;

  inputFile.addEventListener('change', (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const nomeDoArquivo = e.target.files[0].name;
      labelText.textContent = nomeDoArquivo;
      btnText.textContent = 'Selecionado';
    } else labelText.textContent = textoPadrao;
  });
}

export function opcaoAssuntoSelecionado() {
  const valorSelecionado = document.getElementById('selected-value');
  const checkbox = document.getElementById('assunto');
  const opcoesInput = document.querySelectorAll('.option input');

  opcoesInput.forEach((input) => {
    input.addEventListener('click', (e) => {
      valorSelecionado.textContent = input.dataset.label;

      const ehMouseOuToque =
        e.pointerType == 'mouse' || e.pointerType == 'touch';

      ehMouseOuToque && checkbox.click();
    });
  });
}

export function oberservadorAssunto() {
  const curriculoSelecionado = document.querySelector(
    'input[value="curriculo"]'
  );
  const botaoEnviarArquivo = document.getElementById('formArquivo');
  const todosOsRadios = document.querySelectorAll('input[name="category"]');

  todosOsRadios.forEach((radio) => {
    radio.addEventListener('change', () => {
      if (curriculoSelecionado.checked) {
        botaoEnviarArquivo.classList.add('mostrar');
      } else {
        botaoEnviarArquivo.classList.remove('mostrar');
      }
    });
  });
}
