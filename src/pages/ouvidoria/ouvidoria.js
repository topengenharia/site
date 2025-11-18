export default function verificarAnonimo() {
  const checkboxAnonima = document.getElementById('anonimo');
  const nome = document.getElementById('nome');
  const email = document.getElementById('email');
  const message = document.querySelector('#formCheckbox label span');
  console.log(message);

  checkboxAnonima.addEventListener('change', () => {
    if (checkboxAnonima.checked) {
      nome.value = '';
      nome.setAttribute('disabled', '');
      message.textContent = '✅';
      email.value = '';
      email.setAttribute('disabled', '');
    } else {
      nome.removeAttribute('disabled');
      message.textContent = '❎';
      email.removeAttribute('disabled');
    }
  });
}
