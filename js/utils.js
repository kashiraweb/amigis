/* Utilidades generales: DOM, formato y componentes HTML pequeños */

const $ = id => document.getElementById(id);
const num = id => parseFloat($(id).value) || 0;

// Escapa texto del usuario antes de insertarlo como HTML
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// Número con 2 decimales en formato boliviano (1.234,50)
const f = n => Number(n || 0).toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// Fecha de hoy en hora local (AAAA-MM-DD)
const today = () => {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
};

let toastTimer;
function toast(msg) {
  const t = $('toast');
  t.textContent = msg;
  t.style.display = 'block';
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (t.style.display = 'none'), 2800);
}

// Tarjeta de indicador
const k = (label, value, cls = '') => `<div class="k ${cls}"><small>${label}</small><b>${value}</b></div>`;

// Tabla con encabezados `h` (array) y filas `r` (HTML)
const tbl = (h, r) => r
  ? `<div class="sc"><table><tr>${h.map(x => `<th>${x}</th>`).join('')}</tr>${r}</table></div>`
  : '<p class="mu">Todavía no hay registros.</p>';
