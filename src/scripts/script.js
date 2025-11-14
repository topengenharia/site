import initCareousel from '../pages/index/js/carousel.js';
import Modal from './modules/modal.js';
import {
  enviarArquivoNome,
  opcaoAssuntoSelecionado,
  oberservadorAssunto,
} from '../pages/contato/contato.js';
import menuMobile from './modules/menu-mobie.js';

menuMobile();

const body = document.querySelector('body').getAttribute('id');
const index = body == 'index';

if (index) {
  initCareousel();
}

const imagesModal = document.querySelectorAll('[data-img="modal"] li');

imagesModal.forEach((image) => {
  image.addEventListener('click', (e) => {
    const image = e;
    const novoModal = new Modal(image);
    return novoModal.iniciarModal();
  });
});

const contato = body == 'contato';

if (contato) {
  enviarArquivoNome();
  opcaoAssuntoSelecionado();
  oberservadorAssunto();
}
