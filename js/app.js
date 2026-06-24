const app = document.querySelector('#app');

function renderPlaceholder() {
  app.innerHTML = `
    <section class="panel">
      <h2>Proyecto iniciado</h2>
      <p>La estructura base del juego esta lista.</p>
    </section>
  `;
}

renderPlaceholder();
