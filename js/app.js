const app = document.querySelector('#app');
const USERS_KEY = 'puzzleUsers';
const SESSION_KEY = 'puzzleCurrentUser';

const state = {
  currentUser: localStorage.getItem(SESSION_KEY) || '',
};

function getUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function showMessage(text, type = 'error') {
  const message = document.querySelector('#auth-message');
  if (!message) return;
  message.textContent = text;
  message.className = `message ${type}`;
}

function renderAuth() {
  app.innerHTML = `
    <section class="auth-grid">
      <form class="panel auth-card" id="login-form">
        <h2>Ingresar</h2>
        <p>Usa un usuario existente para entrar al juego.</p>
        <label>
          Usuario
          <input type="text" name="username" autocomplete="username" required>
        </label>
        <label>
          Contrasena
          <input type="password" name="password" autocomplete="current-password" required>
        </label>
        <button type="submit">Ingresar</button>
      </form>

      <form class="panel auth-card" id="register-form">
        <h2>Crear usuario</h2>
        <p>Registra una cuenta nueva para guardar tus resultados.</p>
        <label>
          Usuario
          <input type="text" name="username" autocomplete="username" required>
        </label>
        <label>
          Contrasena
          <input type="password" name="password" autocomplete="new-password" required>
        </label>
        <button type="submit">Crear cuenta</button>
      </form>
    </section>
    <p id="auth-message" class="message" role="status"></p>
  `;

  document.querySelector('#login-form').addEventListener('submit', handleLogin);
  document.querySelector('#register-form').addEventListener('submit', handleRegister);
}

function handleRegister(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const username = form.get('username').trim();
  const password = form.get('password').trim();

  if (!username || !password) {
    showMessage('Completa usuario y contrasena.');
    return;
  }

  const users = getUsers();
  const exists = users.some((user) => user.username.toLowerCase() === username.toLowerCase());

  if (exists) {
    showMessage('Ese usuario ya existe.');
    return;
  }

  users.push({ username, password });
  saveUsers(users);
  showMessage('Usuario creado. Ahora puedes ingresar.', 'success');
  event.currentTarget.reset();
}

function handleLogin(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const username = form.get('username').trim();
  const password = form.get('password').trim();
  const users = getUsers();
  const user = users.find((item) => item.username === username && item.password === password);

  if (!user) {
    showMessage('Usuario o contrasena incorrectos.');
    return;
  }

  state.currentUser = user.username;
  localStorage.setItem(SESSION_KEY, user.username);
  renderGameHome();
}

function renderGameHome() {
  app.innerHTML = `
    <section class="panel welcome-panel">
      <div>
        <p class="eyebrow">Jugador activo</p>
        <h2>${state.currentUser}</h2>
        <p>Tu sesion esta iniciada. El modulo de juego se agregara en el siguiente paso.</p>
      </div>
      <button type="button" class="secondary" id="logout-button">Cerrar sesion</button>
    </section>
  `;

  document.querySelector('#logout-button').addEventListener('click', () => {
    state.currentUser = '';
    localStorage.removeItem(SESSION_KEY);
    renderAuth();
  });
}

if (state.currentUser) {
  renderGameHome();
} else {
  renderAuth();
}
