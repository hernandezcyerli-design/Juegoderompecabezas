const app = document.querySelector('#app');
const USERS_KEY = 'puzzleUsers';
const SESSION_KEY = 'puzzleCurrentUser';
const RANKING_KEY = 'puzzleRanking';
const BOARD_SIZE = 3;
const TOTAL_TILES = BOARD_SIZE * BOARD_SIZE;
const LANDSCAPE_IMAGES = [
  'assets/images/landscape-1.svg',
  'assets/images/landscape-2.svg',
  'assets/images/landscape-3.svg',
  'assets/images/landscape-4.svg',
  'assets/images/landscape-5.svg',
];

const state = {
  currentUser: localStorage.getItem(SESSION_KEY) || '',
  tiles: [],
  moves: 0,
  seconds: 0,
  timerId: null,
  isPlaying: false,
  currentImage: LANDSCAPE_IMAGES[0],
  dragFromIndex: null,
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
  state.currentImage = getRandomLandscape();
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
      <img class="preview-image" src="${state.currentImage}" alt="Imagen original del rompecabezas">
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
  state.currentImage = getRandomLandscape();
  state.tiles = createShuffledTiles();
  state.isPlaying = false;
  renderOriginalImage();

  window.setTimeout(() => {
    state.isPlaying = true;
    renderPuzzle();
    startTimer();
  }, 1800);
}

function getRandomLandscape() {
  return LANDSCAPE_IMAGES[Math.floor(Math.random() * LANDSCAPE_IMAGES.length)];
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
      <img class="original-large" src="${state.currentImage}" alt="Imagen original del rompecabezas">
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
          <img src="${state.currentImage}" alt="Referencia de imagen original">
          <p>Arrastra cualquier fragmento y sueltalo sobre otra posicion para intercambiarlos.</p>
        </aside>
      </div>
    </section>
  `;

  document.querySelectorAll('.tile').forEach((tile) => {
    tile.addEventListener('dragstart', handleDragStart);
    tile.addEventListener('dragend', handleDragEnd);
  });

  document.querySelectorAll('.slot').forEach((slot) => {
    slot.addEventListener('dragover', handleDragOver);
    slot.addEventListener('dragleave', handleDragLeave);
    slot.addEventListener('drop', handleDrop);
  });
}

function renderTile(tile, index) {
  const x = tile % BOARD_SIZE;
  const y = Math.floor(tile / BOARD_SIZE);

  return `
    <div class="slot" data-index="${index}">
      <button
        type="button"
        class="tile"
        draggable="true"
        data-index="${index}"
        style="background-image: url('${state.currentImage}'); background-position: ${x * 50}% ${y * 50}%;"
        aria-label="Pieza ${tile + 1}. Arrastrar para mover."
      ></button>
    </div>
  `;
}

function createShuffledTiles() {
  const tiles = Array.from({ length: TOTAL_TILES }, (_, index) => index);

  for (let index = tiles.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [tiles[index], tiles[randomIndex]] = [tiles[randomIndex], tiles[index]];
  }

  if (tiles.every((tile, index) => tile === index)) {
    [tiles[0], tiles[1]] = [tiles[1], tiles[0]];
  }

  return tiles;
}

function handleDragStart(event) {
  if (!state.isPlaying) {
    event.preventDefault();
    return;
  }

  state.dragFromIndex = Number(event.currentTarget.dataset.index);
  event.currentTarget.classList.add('dragging');
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData('text/plain', String(state.dragFromIndex));
}

function handleDragEnd(event) {
  event.currentTarget.classList.remove('dragging');
  state.dragFromIndex = null;
  document.querySelectorAll('.slot.drag-over').forEach((slot) => slot.classList.remove('drag-over'));
}

function handleDragOver(event) {
  if (!state.isPlaying) return;
  event.preventDefault();
  event.currentTarget.classList.add('drag-over');
  event.dataTransfer.dropEffect = 'move';
}

function handleDragLeave(event) {
  event.currentTarget.classList.remove('drag-over');
}

function handleDrop(event) {
  event.preventDefault();
  event.currentTarget.classList.remove('drag-over');

  const fromIndex = state.dragFromIndex ?? Number(event.dataTransfer.getData('text/plain'));
  const toIndex = Number(event.currentTarget.dataset.index);
  moveTile(fromIndex, toIndex);
}

function moveTile(fromIndex, toIndex) {
  if (!state.isPlaying || fromIndex === toIndex || Number.isNaN(fromIndex) || Number.isNaN(toIndex)) {
    return;
  }

  [state.tiles[fromIndex], state.tiles[toIndex]] = [state.tiles[toIndex], state.tiles[fromIndex]];
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
