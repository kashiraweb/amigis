# Sistema de Inventarios y Costos – Choclo Hualtaco

Aplicación web (HTML + CSS + JavaScript puro, sin dependencias) para llevar costos de siembra,
clasificación de la cosecha, kárdex por calidad y utilidad neta.

## Estructura
```
choclo-hualtaco/
├── index.html          Página principal
├── css/
│   └── styles.css      Estilos (tema claro/oscuro, móvil, impresión)
├── js/
│   ├── utils.js        Utilidades y componentes HTML pequeños
│   ├── estado.js       Datos, guardado en el navegador y cálculos
│   ├── vistas.js       Pantallas de cada pestaña
│   └── app.js          Formularios e inicio
└── assets/
    └── favicon.svg
```
El orden de los `<script>` en `index.html` importa: utils → estado → vistas → app.

## Uso
- Local: abrir `index.html` con doble clic.
- En línea: subir toda la carpeta a GitHub Pages, Netlify, Vercel o cualquier hosting estático.

Los datos se guardan en el navegador (`localStorage`, clave `choclo_v1`, compatible con la versión anterior).
Usa "Copia de seguridad y borrado" en la primera pestaña para respaldar o pasar los datos a otro equipo.
