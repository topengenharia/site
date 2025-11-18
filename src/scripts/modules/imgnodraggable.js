export default function imgNoDraggable() {
  const images = document.querySelectorAll('img');

  images.forEach(function (img) {
    img.setAttribute('draggable', 'false');

    img.addEventListener('contextmenu', function (e) {
      e.preventDefault();
    });

    img.addEventListener('dragstart', function (e) {
      e.preventDefault();
    });
  });
}
