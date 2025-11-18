export default class Modal {
  constructor(e) {
    this.image = e;
    this.modal = this.criarModal();
    document.body.append(this.modal);

    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.fecharModal();
      }
    });
  }

  limparImagem() {
    const background = window.getComputedStyle(this.image).backgroundImage;
    const backgroundLimpo = background.split('"')[1];
    const modalImage = document.createElement('img');
    modalImage.setAttribute('src', backgroundLimpo);
    return modalImage;
  }

  criarModal() {
    const modalTip = document.createElement('dialog');
    modalTip.setAttribute('id', 'modal');
    const displayImage = this.limparImagem();
    modalTip.append(displayImage);
    return modalTip;
  }

  mostrarModal() {
    this.modal.showModal();
  }

  fecharModal() {
    this.modal.close();
  }

  iniciarModal() {
    this.mostrarModal();
  }
}
