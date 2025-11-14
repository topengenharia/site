export default function menuMobile() {
  const btnMobile = document.getElementById('btn-mobile');
  const body = document.body;
  const html = document.documentElement;
  const navbar = document.getElementById('header-navbar');

  const alternarMenu = function () {
    navbar.classList.toggle('ativo');
    body.classList.toggle('menu-aberto');
    html.classList.toggle('menu-aberto');
  };

  btnMobile.addEventListener('click', alternarMenu);

  const obversadorDaTela = () => {
    const breakpoint = 690;

    if (window.innerWidth > breakpoint) {
      navbar.classList.remove('ativo');
      body.classList.remove('menu-aberto');
      html.classList.remove('menu-aberto');
    }
  };

  window.addEventListener('resize', obversadorDaTela);

  const itensHasArrow = document.querySelectorAll(
    '#header-navbar-list .has-arrow'
  );

  function toggleSubmenu(event) {
    if (window.innerWidth <= 690) {
      this.classList.toggle('submenu-ativo');
    }
  }

  itensHasArrow.forEach((item) => {
    item.addEventListener('click', toggleSubmenu);
  });
}
