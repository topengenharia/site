import initCareousel from '../pages/index/js/carousel.js';
import Modal from './modules/modal.js';
import menuMobile from './modules/menu-mobile.js';
import verificarAnonimo from '../pages/ouvidoria/ouvidoria.js';
import imgNoDraggable from './modules/imgnodraggable.js';

menuMobile();

const bodyId = document.body.getAttribute('id');

if (bodyId === 'index' && typeof initCareousel === 'function') {
  initCareousel();
}

if (bodyId === 'contato' || bodyId === 'ouvidoria') {
  import('../pages/contato/contato.js').then(
    ({ opcaoAssuntoSelecionado, oberservadorAssunto }) => {
      opcaoAssuntoSelecionado();
      oberservadorAssunto();
    }
  );

  import('./modules/forms.js').then(({ default: enviarArquivoNome }) => {
    enviarArquivoNome();
  });
}

if (bodyId === 'ouvidoria') {
  verificarAnonimo();
  const formFile = document.getElementById('formArquivo');
  formFile.style.display = 'block';
}

const imagesModal = document.querySelectorAll('[data-img="modal"] li');
if (imagesModal.length > 0) {
  imagesModal.forEach((image) => {
    image.addEventListener('click', (e) => {
      const novoModal = new Modal(e.currentTarget);
      novoModal.iniciarModal();
    });
  });
}

document.addEventListener('DOMContentLoaded', imgNoDraggable());
