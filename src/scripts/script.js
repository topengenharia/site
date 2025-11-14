import initCareousel from "../pages/index/js/carousel.js";
import Modal from "./modules/modal.js";
import menuMobile from "./modules/menu-mobile.js";

menuMobile();

const bodyId = document.body.getAttribute("id");

if (bodyId === "index" && typeof initCareousel === "function") {
  initCareousel();
}

if (bodyId === "contato") {
  import("../pages/contato/contato.js").then(({ enviarArquivoNome, opcaoAssuntoSelecionado, oberservadorAssunto }) => {
    enviarArquivoNome();
    opcaoAssuntoSelecionado();
    oberservadorAssunto();
  });
}

const imagesModal = document.querySelectorAll('[data-img="modal"] li');
if (imagesModal.length > 0) {
  imagesModal.forEach((image) => {
    image.addEventListener("click", (e) => {
      const novoModal = new Modal(e.currentTarget);
      novoModal.iniciarModal();
    });
  });
}
