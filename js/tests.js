const testResults = document.querySelector('#test-results');
const landscapeImages = [
  'assets/images/landscape-1.svg',
  'assets/images/landscape-2.svg',
  'assets/images/landscape-3.svg',
  'assets/images/landscape-4.svg',
  'assets/images/landscape-5.svg',
];

const tests = [
  {
    name: 'localStorage disponible',
    run: () => {
      localStorage.setItem('puzzleTest', 'ok');
      const value = localStorage.getItem('puzzleTest');
      localStorage.removeItem('puzzleTest');
      return value === 'ok';
    },
  },
  {
    name: 'Existen 5 imagenes de prueba',
    run: () => landscapeImages.length === 5,
  },
  {
    name: 'El documento HTML esta cargado',
    run: () => document.readyState !== 'loading' && Boolean(document.querySelector('h1')),
  },
  {
    name: 'El navegador soporta plantillas HTML',
    run: () => 'content' in document.createElement('template'),
  },
];

async function imageExists(src) {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve(true);
    image.onerror = () => resolve(false);
    image.src = src;
  });
}

async function runTests() {
  const results = [];

  for (const test of tests) {
    try {
      results.push({ name: test.name, passed: Boolean(test.run()) });
    } catch (error) {
      results.push({ name: test.name, passed: false, detail: error.message });
    }
  }

  for (const image of landscapeImages) {
    try {
      results.push({ name: `Carga ${image}`, passed: await imageExists(image) });
    } catch (error) {
      results.push({ name: `Carga ${image}`, passed: false, detail: error.message });
    }
  }

  const passed = results.filter((result) => result.passed).length;
  testResults.innerHTML = `
    <h2>${passed}/${results.length} pruebas aprobadas</h2>
    <div class="test-list">
      ${results.map((result) => `
        <article class="test-item ${result.passed ? 'passed' : 'failed'}">
          <strong>${result.passed ? 'OK' : 'FALLO'}</strong>
          <span>${result.name}</span>
          ${result.detail ? `<small>${result.detail}</small>` : ''}
        </article>
      `).join('')}
    </div>
  `;
}

runTests();
