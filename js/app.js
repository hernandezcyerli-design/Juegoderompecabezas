const app = document.querySelector('#app');
const USERS_KEY = 'puzzleUsers';
const SESSION_KEY = 'puzzleCurrentUser';
const RANKING_KEY = 'puzzleRanking';
const BOARD_SIZE = 3;
const TOTAL_TILES = BOARD_SIZE * BOARD_SIZE;
const EMPTY_TILE = TOTAL_TILES - 1;
const PUZZLE_IMAGE = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' x2='1' y1='0' y2='1'%3E%3Cstop stop-color='%232563eb'/%3E%3Cstop offset='1' stop-color='%23f59e0b'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' fill='url(%23g)'/%3E%3Ccircle cx='155' cy='145' r='82' fill='%23ffffff' opacity='.9'/%3E%3Ccircle cx='445' cy='455' r='96' fill='%230f172a' opacity='.25'/%3E%3Cpath d='M95 430 C190 270 320 540 505 225' fill='none' stroke='%23ffffff' stroke-width='38' stroke-linecap='round' opacity='.88'/%3E%3Ctext x='300' y='330' text-anchor='middle' font-family='Arial' font-size='82' font-weight='800' fill='%23ffffff'%3EPUZZLE%3C/text%3E%3C/svg%3E`;

const state = {
  currentUser: localStorage.getItem(SESSION_KEY) || '',
  tiles: [],
  moves: 0,
  seconds: 0,
  timerId: null,
  isPlaying: false,
};

function escapeHtml(value) {
  return value.replace(/[&<>"]/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
  }[char]));
}

function getUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getRanking() {
  return JSON.parse(localStorage.getItem(RANKING_KEY) || '[]');
}

function saveRanking(ranking) {
  localStorage.setItem(RANKING_KEY, JSON.stringify(ranking));
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
  stopTimer();
  state.isPlaying = false;
  app.innerHTML = `
    <section class="panel game-home">
      <div class="game-home-copy">
        <p class="eyebrow">Jugador activo</p>
        <h2>${escapeHtml(state.currentUser)}</h2>
        <p>Presiona iniciar para ver la imagen original. Luego se desarmara y podras volver a armarla.</p>
        <div class="actions">
          <button type="button" id="start-button">Iniciar</button>
          <button type="button" class="secondary" id="logout-button">Cerrar sesion</button>
        </div>
      </div>
      <img class="preview-image" src="${PUZZLE_IMAGE}" alt="Imagen original del rompecabezas">
    </section>
  `;

  document.querySelector('#start-button').addEventListener('click', startGame);
  document.querySelector('#logout-button').addEventListener('click', () => {
    stopTimer();
    state.currentUser = '';
    localStorage.removeItem(SESSION_KEY);
    renderAuth();
  });
}

function startGame() {
  state.moves = 0;
  state.seconds = 0;
  state.tiles = createShuffledTiles();
  state.isPlaying = false;
  renderOriginalImage();

  window.setTimeout(() => {
    state.isPlaying = true;
    renderPuzzle();
    startTimer();
  }, 1800);
}

function renderOriginalImage() {
  app.innerHTML = `
    <section class="panel puzzle-stage">
      <div class="stage-header">
        <div>
          <p class="eyebrow">Memoriza la imagen</p>
          <h2>La partida esta por comenzar</h2>
          <p>Observa la imagen original. En unos segundos se mezclara automaticamente.</p>
        </div>
      </div>
      <img class="original-large" src="${PUZZLE_IMAGE}" alt="Imagen original del rompecabezas">
    </section>
  `;
}

function renderPuzzle() {
  app.innerHTML = `
    <section class="panel puzzle-stage">
      <div class="stage-header">
        <div>
          <p class="eyebrow">Arma el rompecabezas</p>
          <h2>Turno de ${escapeHtml(state.currentUser)}</h2>
        </div>
        <div class="stats">
          <span>Movimientos: <strong id="moves-count">${state.moves}</strong></span>
          <span>Tiempo: <strong id="time-count">${formatTime(state.seconds)}</strong></span>
        </div>
      </div>

      <div class="puzzle-layout">
        <div class="board" aria-label="Tablero de rompecabezas">
          ${state.tiles.map((tile, index) => renderTile(tile, index)).join('')}
        </div>
        <aside class="side-reference">
          <h3>Imagen original</h3>
          <img src="${PUZZLE_IMAGE}" alt="Referencia de imagen original">
          <p>Toca una pieza junto al espacio vacio para moverla.</p>
        </aside>
      </div>
    </section>
  `;

  document.querySelectorAll('.tile:not(.empty)').forEach((tile) => {
    tile.addEventListener('click', () => moveTile(Number(tile.dataset.index)));
  });
}

function renderTile(tile, index) {
  if (tile === EMPTY_TILE) {
    return `<button type="button" class="tile empty" data-index="${index}" aria-label="Espacio vacio"></button>`;
  }

  const x = tile % BOARD_SIZE;
  const y = Math.floor(tile / BOARD_SIZE);

  return `
    <button
      type="button"
      class="tile"
      data-index="${index}"
      style="background-image: url('${PUZZLE_IMAGE}'); background-position: ${x * 50}% ${y * 50}%;"
      aria-label="Pieza ${tile + 1}"
    ></button>
  `;
}

function createShuffledTiles() {
  const tiles = Array.from({ length: TOTAL_TILES }, (_, index) => index);
  let emptyIndex = EMPTY_TILE;

  for (let i = 0; i < 90; i += 1) {
    const neighbors = getMovableIndexes(emptyIndex);
    const randomIndex = neighbors[Math.floor(Math.random() * neighbors.length)];
    [tiles[emptyIndex], tiles[randomIndex]] = [tiles[randomIndex], tiles[emptyIndex]];
    emptyIndex = randomIndex;
  }

  return tiles;
}

function getMovableIndexes(index) {
  const row = Math.floor(index / BOARD_SIZE);
  const col = index % BOARD_SIZE;
  const indexes = [];

  if (row > 0) indexes.push(index - BOARD_SIZE);
  if (row < BOARD_SIZE - 1) indexes.push(index + BOARD_SIZE);
  if (col > 0) indexes.push(index - 1);
  if (col < BOARD_SIZE - 1) indexes.push(index + 1);

  return indexes;
}

function moveTile(index) {
  const emptyIndex = state.tiles.indexOf(EMPTY_TILE);

  if (!state.isPlaying || !getMovableIndexes(emptyIndex).includes(index)) {
    return;
  }

  [state.tiles[emptyIndex], state.tiles[index]] = [state.tiles[index], state.tiles[emptyIndex]];
  state.moves += 1;
  renderPuzzle();

  if (isSolved()) {
    stopTimer();
    state.isPlaying = false;
    saveCurrentResult();
    renderResult();
  }
}

function isSolved() {
  return state.tiles.every((tile, index) => tile === index);
}

function startTimer() {
  stopTimer();
  state.timerId = window.setInterval(() => {
    state.seconds += 1;
    const timer = document.querySelector('#time-count');
    if (timer) timer.textContent = formatTime(state.seconds);
  }, 1000);
}

function stopTimer() {
  if (state.timerId) {
    window.clearInterval(state.timerId);
    state.timerId = null;
  }
}

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

function calculateScore(seconds, moves) {
  return Math.max(1000 - Math.round(seconds * moves), 0);
}

function saveCurrentResult() {
  const ranking = getRanking();
  const result = {
    username: state.currentUser,
    seconds: state.seconds,
    moves: state.moves,
    score: calculateScore(state.seconds, state.moves),
    date: new Date().toISOString(),
  };

  ranking.push(result);
  ranking.sort((a, b) => b.score - a.score || a.seconds - b.seconds || a.moves - b.moves);
  saveRanking(ranking.slice(0, 10));
}

function renderResult() {
  const score = calculateScore(state.seconds, state.moves);

  app.innerHTML = `
    <section class="panel result-panel">
      <p class="eyebrow">Rompecabezas resuelto</p>
      <h2>Buen trabajo, ${escapeHtml(state.currentUser)}</h2>
      <div class="result-grid">
        <article>
          <span>${formatTime(state.seconds)}</span>
          <strong>Tiempo total</strong>
        </article>
        <article>
          <span>${state.moves}</span>
          <strong>Movimientos</strong>
        </article>
        <article>
          <span>${score}</span>
          <strong>Puntaje</strong>
        </article>
      </div>
      <p>El puntaje premia resolver el juego con menos tiempo y menos movimientos.</p>
      <button type="button" id="finish-button">Finalizar</button>
    </section>
  `;

  document.querySelector('#finish-button').addEventListener('click', renderRanking);
}

function renderRanking() {
  const ranking = getRanking();

  app.innerHTML = `
    <section class="panel ranking-panel">
      <div class="stage-header">
        <div>
          <p class="eyebrow">Ranking</p>
          <h2>Mejores jugadores</h2>
        </div>
        <button type="button" id="play-again-button">Volver a jugar</button>
      </div>

      <div class="ranking-list">
        ${ranking.length ? ranking.map((item, index) => `
          <article class="ranking-item">
            <span class="rank-number">#${index + 1}</span>
            <strong>${escapeHtml(item.username)}</strong>
            <span>${item.score} puntos</span>
            <small>${formatTime(item.seconds)} · ${item.moves} movimientos</small>
          </article>
        `).join('') : '<p>No hay resultados guardados todavia.</p>'}
      </div>
    </section>
  `;

  document.querySelector('#play-again-button').addEventListener('click', renderGameHome);
}

if (state.currentUser) {
  renderGameHome();
} else {
  renderAuth();
}
