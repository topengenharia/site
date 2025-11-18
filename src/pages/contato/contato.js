export function opcaoAssuntoSelecionado() {
  const valorSelecionado = document.getElementById('selected-value');
  const checkbox = document.getElementById('assunto');
  const opcoesInput = document.querySelectorAll('.option input');

  opcoesInput.forEach((input) => {
    input.addEventListener('click', (e) => {
      valorSelecionado.textContent = input.dataset.label;

      const eventoEhMouseOuToque =
        e.pointerType === 'mouse' || e.pointerType === 'touch';

      if (eventoEhMouseOuToque) checkbox.click();
    });
  });
}

export function oberservadorAssunto() {
  const curriculoSelecionado = document.querySelector(
    'input[value="curriculo"]'
  );
  const campoArquivo = document.getElementById('formArquivo');
  const radios = document.querySelectorAll('input[name="category"]');

  radios.forEach((radio) => {
    radio.addEventListener('change', () => {
      if (curriculoSelecionado.checked) {
        campoArquivo.classList.add('mostrar');
      } else {
        campoArquivo.classList.remove('mostrar');
      }
    });
  });
}
