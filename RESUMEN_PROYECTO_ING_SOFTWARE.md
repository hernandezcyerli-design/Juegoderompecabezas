# Proyecto: Juego de Rompecabezas Web

## I. Presentación

El presente documento resume el proyecto **Juego de Rompecabezas Web**, desarrollado como una aplicación web funcional utilizando HTML5, CSS y JavaScript. El proyecto tiene como finalidad aplicar conocimientos básicos de ingeniería de software en el análisis, diseño, construcción y prueba de una solución interactiva orientada al entretenimiento y al registro de desempeño de usuarios.

El sistema permite que un usuario se registre, inicie sesión, visualice una imagen original, arme un rompecabezas a partir de fragmentos mezclados y obtenga un resultado basado en el tiempo empleado y la cantidad de movimientos realizados. También cuenta con un ranking de jugadores para comparar resultados.

Este resumen fue elaborado siguiendo la estructura indicada en la **Guía de Elaboración del Proyecto de Ingeniería de Software**.

## II. Índice Referencial

1. Presentación
2. Índice referencial
3. Resumen ejecutivo
4. Introducción
5. Definición del proyecto
6. Objetivos
7. Propuesta técnica del proyecto
8. Conclusiones
9. Recomendaciones
10. Anexos

## III. Resumen Ejecutivo

El proyecto **Juego de Rompecabezas Web** consiste en una aplicación desarrollada con HTML5, CSS y JavaScript, cuyo objetivo principal es permitir que un usuario juegue un rompecabezas digital desde el navegador. El sistema incluye un módulo de registro e inicio de sesión, un módulo de juego con imágenes de paisajes, conteo de movimientos, medición del tiempo y un módulo de resultados con ranking de jugadores.

Durante el desarrollo se implementó una versión funcional que permite seleccionar imágenes aleatorias, dividirlas en fragmentos y mezclarlas para que el usuario pueda reconstruirlas mediante acciones de arrastre con el mouse. Al finalizar la partida, el sistema calcula un puntaje considerando el tiempo y los movimientos realizados, de forma que los mejores resultados sean aquellos con menor tiempo y menor cantidad de movimientos.

Como resultado principal, se obtuvo un prototipo funcional que demuestra el flujo completo de la aplicación: registro, autenticación, juego, resultado y ranking. La información se almacena de manera local usando `localStorage`, simulando el uso de archivos planos para una versión inicial de prueba. El proyecto permite validar aspectos funcionales antes de incorporar una base de datos o un backend más avanzado.

## IV. Introducción

En la actualidad, las aplicaciones web interactivas son una forma práctica de aplicar conceptos de programación, diseño de interfaces e ingeniería de software. Un juego sencillo, como un rompecabezas digital, permite trabajar diferentes elementos importantes de un sistema: manejo de usuarios, interacción visual, control de eventos, almacenamiento de información y presentación de resultados.

El presente proyecto nace como una práctica funcional para desarrollar una aplicación web usando tecnologías básicas del lado del cliente. La idea principal es construir un juego donde el usuario pueda registrarse, iniciar sesión y resolver un rompecabezas generado a partir de imágenes de paisajes. El sistema debe medir el desempeño del jugador mediante tiempo, cantidad de movimientos y puntaje final.

Desde el punto de vista de ingeniería de software, el proyecto permite aplicar una organización por módulos, definir requisitos, crear un prototipo funcional y realizar pruebas básicas. Aunque se trata de una versión inicial, el sistema deja preparada una base para futuras mejoras, como el uso de una base de datos, niveles de dificultad, carga personalizada de imágenes y autenticación más segura.

La estructura de este documento presenta primero la definición general del proyecto, luego los objetivos, la propuesta técnica, las conclusiones, recomendaciones y anexos relacionados con el desarrollo realizado.

## V. Definición del Proyecto

### a. Descripción del Proyecto

El proyecto consiste en una aplicación web llamada **Juego de Rompecabezas Web**. Su función principal es mostrar una imagen original, dividirla en fragmentos y permitir que el usuario la reconstruya arrastrando las piezas hasta completar correctamente el rompecabezas.

El software cuenta con los siguientes módulos principales:

- Módulo de usuario: permite crear una cuenta e iniciar sesión.
- Módulo de juego: muestra una imagen, la desarma y permite mover los fragmentos.
- Módulo de medición: registra el tiempo total y la cantidad de movimientos.
- Módulo de resultados: calcula el puntaje obtenido por el jugador.
- Módulo de ranking: muestra una lista de jugadores ordenados por puntaje.

La aplicación está diseñada para ejecutarse directamente en el navegador y utiliza almacenamiento local para guardar usuarios y resultados en esta versión de prueba.

### b. Origen del Proyecto

El proyecto surge de la necesidad de construir una aplicación web sencilla pero completa que permita demostrar el uso de tecnologías básicas de desarrollo web y conceptos de ingeniería de software. También responde a la oportunidad de crear un prototipo funcional que integre interfaz gráfica, lógica de juego, almacenamiento local y control de resultados.

La elección de un rompecabezas se debe a que este tipo de juego permite aplicar interactividad de forma clara y medible. Además, facilita evaluar el desempeño del usuario mediante variables concretas como tiempo, movimientos y puntaje.

### c. Justificación

Este proyecto es importante porque permite aplicar conocimientos de programación web en un caso práctico y funcional. A través del desarrollo del juego se trabajan temas como estructura HTML, estilos CSS, manipulación del DOM con JavaScript, eventos de arrastre, almacenamiento local y organización modular del código.

También es relevante porque funciona como una base inicial para un sistema más completo. En futuras versiones se podría integrar un backend, una base de datos real, autenticación segura, diferentes niveles de dificultad y estadísticas avanzadas de los jugadores.

El beneficio principal del proyecto es que permite validar la lógica y experiencia de usuario antes de realizar una inversión mayor en infraestructura o tecnologías más complejas.

### d. Target del Proyecto

El público objetivo del proyecto está compuesto por:

- Estudiantes que desean practicar lógica, memoria visual y resolución de problemas.
- Usuarios generales interesados en juegos web sencillos.
- Docentes o evaluadores que quieran revisar un prototipo funcional de ingeniería de software.
- Desarrolladores principiantes que necesiten una base para estudiar HTML, CSS y JavaScript.

## VI. Objetivos

### a. Objetivo General

Desarrollar una aplicación web funcional de rompecabezas que permita a los usuarios registrarse, iniciar sesión, resolver una imagen dividida en fragmentos y visualizar su desempeño mediante tiempo, movimientos, puntaje y ranking.

### b. Objetivos Específicos

- Implementar un módulo de registro e inicio de sesión para controlar el acceso de los usuarios.
- Diseñar una interfaz web clara, responsive y fácil de utilizar.
- Crear un módulo de juego que muestre una imagen original y luego la divida en fragmentos mezclados.
- Permitir que el usuario mueva libremente los fragmentos mediante arrastre con el mouse.
- Medir el tiempo total que tarda el usuario en resolver el rompecabezas.
- Contabilizar la cantidad de movimientos realizados durante la partida.
- Calcular un puntaje final basado en el tiempo y los movimientos.
- Guardar y mostrar un ranking de jugadores.
- Realizar pruebas básicas para validar recursos y funcionamiento general del sistema.

## VII. Propuesta Técnica del Proyecto

### a. Modelo de Ciclo de Vida y Metodología de Desarrollo

Para este proyecto se aplicó un modelo de desarrollo incremental. La aplicación se construyó por módulos, agregando funcionalidad de forma progresiva y verificando cada avance.

Las etapas desarrolladas fueron:

1. Inicialización del proyecto y repositorio Git.
2. Creación de la estructura base en HTML, CSS y JavaScript.
3. Implementación del módulo de autenticación.
4. Implementación del módulo de juego.
5. Implementación de resultados y ranking.
6. Incorporación de imágenes de prueba.
7. Ajuste de la mecánica para mover fragmentos mediante arrastre.
8. Pruebas básicas y documentación.

Esta metodología fue adecuada porque permitió construir una versión funcional paso a paso, controlando los cambios mediante commits en Git.

### b. Herramientas de Desarrollo

Las herramientas utilizadas fueron:

- **HTML5**: para la estructura de la aplicación.
- **CSS3**: para el diseño visual y adaptación responsive.
- **JavaScript**: para la lógica del juego, eventos, temporizador, movimientos y almacenamiento.
- **localStorage**: para guardar usuarios y ranking en el navegador.
- **SVG**: para crear imágenes locales de paisajes usadas en las pruebas.
- **Git**: para control de versiones.
- **GitHub**: para almacenar el repositorio remoto del proyecto.
- **Node.js**: para validar la sintaxis de los archivos JavaScript con `node --check`.

### c. Ingeniería de Requisitos

#### Requisitos Funcionales

- El sistema debe permitir crear un usuario con contraseña.
- El sistema debe permitir iniciar sesión con un usuario existente.
- El sistema debe mostrar una imagen original antes de iniciar la partida.
- El sistema debe dividir la imagen en fragmentos y mezclarlos.
- El sistema debe permitir mover los fragmentos arrastrándolos con el mouse.
- El sistema debe contar los movimientos realizados por el usuario.
- El sistema debe medir el tiempo total de la partida.
- El sistema debe detectar cuando el rompecabezas está resuelto.
- El sistema debe calcular un puntaje final.
- El sistema debe mostrar una pantalla de resultados.
- El sistema debe guardar y mostrar un ranking de jugadores.
- El sistema debe permitir volver a jugar.

#### Requisitos No Funcionales

- La aplicación debe ejecutarse en un navegador web moderno.
- La interfaz debe ser sencilla y comprensible para el usuario.
- El diseño debe adaptarse a pantallas de escritorio y móviles.
- El código debe estar separado en archivos HTML, CSS y JavaScript.
- El sistema debe poder funcionar sin conexión a internet después de descargarse, ya que las imágenes son locales.
- La información debe almacenarse localmente para esta versión de prueba.

### d. Diseño de Software

El diseño del software se organizó en una arquitectura simple del lado del cliente. La aplicación se compone de una página principal `index.html`, una hoja de estilos `css/styles.css` y un archivo principal de lógica `js/app.js`.

La estructura general del sistema es la siguiente:

- **Interfaz principal**: contiene el contenedor donde se renderizan las pantallas de autenticación, juego, resultados y ranking.
- **Gestión de usuarios**: utiliza `localStorage` para guardar y consultar las cuentas registradas.
- **Gestión del juego**: controla la selección de imagen, mezcla de piezas, eventos de arrastre y validación de solución.
- **Gestión de resultados**: calcula puntaje, guarda resultados y organiza el ranking.
- **Pruebas**: incluye una página `tests.html` para validar recursos básicos y compatibilidad del navegador.

El flujo principal del usuario es:

1. Registrar usuario.
2. Iniciar sesión.
3. Presionar el botón iniciar.
4. Observar la imagen original.
5. Armar el rompecabezas arrastrando piezas.
6. Ver resultado final.
7. Finalizar y consultar ranking.
8. Volver a jugar.

### e. Prototipo Funcional

El prototipo funcional ya se encuentra implementado. Sus principales características son:

- Pantalla de registro e inicio de sesión.
- Selección aleatoria de una de cinco imágenes de paisajes.
- Visualización previa de la imagen original.
- Tablero de rompecabezas 3x3.
- Movimiento de piezas mediante arrastre con el mouse.
- Contador de movimientos.
- Temporizador de partida.
- Cálculo de puntaje.
- Pantalla de resultado.
- Ranking de jugadores.
- Página de pruebas automatizadas básicas.

El prototipo utiliza archivos SVG locales ubicados en `assets/images/` y almacena la información funcional mediante `localStorage`. También existen archivos de referencia en `data/users.txt` y `data/ranking.txt`, los cuales representan el formato de almacenamiento plano propuesto para futuras versiones.

## VIII. Conclusiones

- Se logró desarrollar un prototipo funcional de un juego de rompecabezas web utilizando HTML5, CSS y JavaScript.
- El sistema cumple con los módulos principales solicitados: autenticación, juego, medición de desempeño, resultados y ranking.
- La implementación por etapas facilitó el control del avance y permitió mantener un historial de cambios mediante Git.
- El uso de `localStorage` fue adecuado para una versión inicial de prueba, aunque no reemplaza una base de datos real en un sistema de producción.
- La mecánica de arrastrar piezas mejora la interacción del usuario en comparación con un tablero únicamente deslizante.
- El proyecto permite demostrar conceptos básicos de ingeniería de software aplicados a un producto funcional.

## IX. Recomendaciones

- Implementar un backend para guardar usuarios y ranking en archivos planos reales o en una base de datos.
- Agregar validación más segura para contraseñas y autenticación.
- Crear niveles de dificultad, por ejemplo 3x3, 4x4 y 5x5.
- Permitir que el usuario cargue sus propias imágenes.
- Mejorar la compatibilidad con dispositivos móviles mediante eventos táctiles avanzados.
- Agregar pruebas automatizadas más completas para validar el flujo completo del juego.
- Publicar el proyecto con GitHub Pages para facilitar su acceso desde cualquier navegador.
- Mejorar la fórmula del puntaje con una escala más clara para diferentes niveles de dificultad.

## X. Anexos

### Anexo 1. Archivos principales del proyecto

- `index.html`: página principal de la aplicación.
- `css/styles.css`: estilos visuales del proyecto.
- `js/app.js`: lógica principal del juego.
- `tests.html`: página de pruebas automatizadas básicas.
- `js/tests.js`: script de pruebas.
- `assets/images/`: carpeta con cinco imágenes SVG de paisajes.
- `data/users.txt`: archivo de referencia para usuarios.
- `data/ranking.txt`: archivo de referencia para ranking.
- `README.md`: documentación básica del proyecto.

### Anexo 2. Repositorio

Repositorio GitHub del proyecto:

```text
https://github.com/hernandezcyerli-design/Juegoderompecabezas.git
```

### Anexo 3. Fórmula de puntaje

La fórmula usada para calcular el puntaje es:

```js
puntaje = Math.max(1000 - Math.round(tiempo * movimientos), 0)
```

Esta fórmula busca premiar al usuario que resuelve el rompecabezas en menor tiempo y con menos movimientos.

### Anexo 4. Requisitos formales de presentación

Para entregar este contenido como documento formal, se recomienda aplicar los requisitos de la guía:

- Letra Arial tamaño 12.
- Color negro.
- Interlineado 1.5.
- Papel tamaño carta.
- Márgenes: superior 2.5 cm, inferior 2.5 cm, derecha 2.5 cm e izquierda 3.0 cm.
- Numeración de páginas en la esquina inferior derecha.
- Revisión de ortografía, redacción, presentación y contenido.
