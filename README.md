# Juego de Rompecabezas

Proyecto web de prueba construido con HTML5, CSS y JavaScript.

## Objetivo

Crear un juego que muestre una imagen original, la desarme en piezas y permita al usuario volver a armarla mientras se mide el tiempo y la cantidad de movimientos.

## Almacenamiento

Esta version usa `localStorage` para guardar usuarios y ranking desde el navegador. Los archivos `data/users.txt` y `data/ranking.txt` documentan el modelo de datos plano propuesto para una version posterior con backend.

## Modulos

1. Usuario e ingreso

Permite crear un usuario con contrasena e iniciar sesion con una cuenta existente.

2. Juego

Muestra la imagen original, la mezcla automaticamente y permite armarla como rompecabezas deslizante de 3x3.

3. Resultado y ranking

Al resolver el rompecabezas se muestra el tiempo, movimientos y puntaje. Luego se puede finalizar para ver el ranking de jugadores y volver a jugar.

## Puntaje

El puntaje se calcula asi:

```js
puntaje = Math.max(1000 - Math.round(tiempo * movimientos), 0)
```

Esto premia partidas con menor tiempo y menor cantidad de movimientos.

## Uso

Abre `index.html` en el navegador.

Flujo recomendado:

1. Crear usuario.
2. Ingresar con ese usuario.
3. Presionar `Iniciar`.
4. Memorizar la imagen original.
5. Resolver el rompecabezas.
6. Finalizar y revisar el ranking.

## Imagenes de prueba

El proyecto incluye 5 imagenes SVG locales de paisajes en `assets/images/`. En cada partida se selecciona una imagen aleatoria.

## Pruebas

Abre `tests.html` en el navegador para ejecutar pruebas automatizadas basicas sobre recursos y compatibilidad del navegador.
