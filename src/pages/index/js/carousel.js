export default function initCareousel() {
  const carouselWrapper = document.querySelector('[data-wrapper]');
  const slides = document.querySelectorAll('.slide');
  const totalSlides = slides.length;
  const btnLeft = document.querySelector('.arrow.left');
  const btnRight = document.querySelector('.arrow.right');

  let indiceAtual = 0;
  let intervalo;
  let isTransitioning = false;

  function atualizarSlide() {
    const deslocamento = indiceAtual * -100;
    carouselWrapper.style.marginLeft = `${deslocamento}%`;
  }

  function proximaImagem() {
    if (isTransitioning) return;
    isTransitioning = true;

    indiceAtual = (indiceAtual + 1) % totalSlides;
    atualizarSlide();
  }

  function imagemAnterior() {
    if (isTransitioning) return;
    isTransitioning = true;

    indiceAtual = (indiceAtual - 1 + totalSlides) % totalSlides;
    atualizarSlide();
  }

  function iniciarIntervalo() {
    intervalo = setInterval(proximaImagem, 5000);
  }

  function resetarIntervalo() {
    clearInterval(intervalo);
    iniciarIntervalo();
  }

  btnRight.addEventListener('click', () => {
    proximaImagem();
    resetarIntervalo();
  });

  btnLeft.addEventListener('click', () => {
    imagemAnterior();
    resetarIntervalo();
  });

  carouselWrapper.addEventListener('transitionend', () => {
    isTransitioning = false;
  });

  carouselWrapper.style.marginLeft = '0%';
  iniciarIntervalo();
}
