/** login.js – Auto-SAC */

function doLogin() {
  const user = document.getElementById('loginUser').value.trim();
  const pass = document.getElementById('loginPass').value.trim();
  const err  = document.getElementById('loginError');

  if (user === CONFIG.LOGIN_USER && pass === CONFIG.LOGIN_PASS) {
    err.textContent = '';
    const login = document.getElementById('loginScreen');
    login.classList.add('fade-out');
    setTimeout(() => {
      login.style.display = 'none';
      const sac = document.getElementById('sacScreen');
      sac.classList.remove('hidden');
      requestAnimationFrame(() => requestAnimationFrame(() => sac.classList.add('visible')));
    }, 380);
  } else {
    err.textContent = '❌ Usuario o clave incorrectos.';
    document.getElementById('loginPass').value = '';
    document.getElementById('loginPass').focus();
  }
}

function doLogout() {
  const sac = document.getElementById('sacScreen');
  sac.classList.remove('visible');
  setTimeout(() => {
    sac.classList.add('hidden');
    const login = document.getElementById('loginScreen');
    login.style.display = 'flex';
    login.style.flexDirection = 'column';
    login.classList.remove('fade-out');
    document.getElementById('loginPass').value = '';
  }, 380);
}

function goAdmin() {
  window.location.href = 'admin.html';
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('loginUser')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('loginPass').focus();
  });
  document.getElementById('loginPass')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') doLogin();
  });
});
