/* Vistas: cada función devuelve el HTML de una pestaña */

function nav() {
  $('nav').innerHTML = TABS.map((t, i) =>
    `<button class="nb${i == tab ? ' on' : ''}" onclick="go(${i})"${i == tab ? ' aria-current="page"' : ''}>${t}</button>`).join('');
}

function go(i) { tab = i; nav(); view(); scrollTo(0, 0); }

function view() {
  $('v').innerHTML = [rRes, rCos, rCla, () => rKar(0), () => rKar(1), () => rKar(2), () => rKar(3)][tab]();
}

/* ---- Resumen cliente y ganancias ---- */
function rRes() {
  const c = calc(), u = S.cfg.unit, cl = {};
  S.mov.filter(m => m.t == 'V').forEach(m => {
    const n = m.cli || 'Sin nombre';
    cl[n] = cl[n] || { q: 0, b: 0 };
    cl[n].q += m.cant; cl[n].b += m.cant * m.pu;
  });

  const rc = c.q.map(o =>
    `<tr><td>${o.n}</td><td>${o.e}</td><td>${o.v}</td><td>${o.m}</td><td><b>${o.s}</b></td><td>${f(o.ing)}</td><td>${f(o.s * c.cu)}</td></tr>`).join('')
    + `<tr><th>Total</th><th>${c.E}</th><th>${c.V}</th><th>${c.M}</th><th>${c.S}</th><th>${f(c.ING)}</th><th>${f(c.S * c.cu)}</th></tr>`;
  const rl = Object.entries(cl).map(([n, o]) => `<tr><td>${esc(n)}</td><td>${o.q}</td><td>${f(o.b)}</td></tr>`).join('');

  return `<div class="card"><h2>Datos del reporte</h2><div class="row">
    <label>Productor o cliente<input id="cp" value="${esc(S.cfg.prod)}" onchange="cfg()" placeholder="Nombre"></label>
    <label>Unidad de venta (cien, cuarta, bolsa…)<input id="cun" value="${esc(u)}" onchange="cfg()"></label></div></div>
  <div class="kp">
    ${k('Ingresos por ventas', 'Bs ' + f(c.ING))}
    ${k('Costo total de producción', 'Bs ' + f(c.tc))}
    ${k('Costo por ' + esc(u), 'Bs ' + f(c.cu))}
    ${k('Pérdida por mermas', c.M + ' ' + esc(u) + ' · Bs ' + f(c.cm), c.M ? 'bad' : '')}
    ${k('Precio mínimo para no perder', 'Bs ' + f(c.pmin) + ' / ' + esc(u))}
    ${k('Utilidad neta real', 'Bs ' + f(c.ut), c.ut < 0 ? 'bad' : 'ok')}
  </div>
  <p class="mu">Precio mínimo = costo total ÷ (cosechado − mermas). Utilidad neta = ventas − costo de lo vendido − costo de las mermas. Cantidades en ${esc(u)}.</p>
  <h2>Inventario por calidad</h2>${tbl(['Calidad', 'Cosechado', 'Vendido', 'Merma', 'Stock', 'Ingresos Bs', 'Stock valorado Bs'], rc)}
  <h2>Ventas por cliente</h2>${tbl(['Cliente', 'Cantidad', 'Total Bs'], rl)}
  <details class="card np"><summary>Copia de seguridad y borrado</summary>
    <p class="mu">Tus datos se guardan en este navegador. Copia este texto y guárdalo (WhatsApp, Drive); para restaurar, pégalo abajo.</p>
    <textarea rows="3" readonly onclick="this.select()">${esc(JSON.stringify(S))}</textarea><p></p>
    <textarea id="rs" rows="3" placeholder="Pega aquí la copia"></textarea>
    <p><button class="btn" onclick="rest()">Restaurar copia</button> <button class="btn o" onclick="borrar(this)">Borrar todos los datos</button></p>
  </details>`;
}

/* ---- Costos de sembrado ---- */
function rCos() {
  const by = {};
  S.costos.forEach(c => (by[c.cat] = (by[c.cat] || 0) + c.cant * c.pu));
  const r = S.costos.slice().sort((a, b) => (a.fecha < b.fecha ? 1 : -1)).map(c =>
    `<tr><td>${c.fecha}</td><td>${c.cat}</td><td>${esc(c.det)}</td><td>${c.cant}</td><td>${f(c.pu)}</td><td>${f(c.cant * c.pu)}</td><td><button class="x" onclick="del(${c.id})" aria-label="Eliminar">✕</button></td></tr>`).join('');

  return `<div class="card"><h2>Anotar gasto del campo</h2><div class="row">
    <label>Fecha<input type="date" id="cf" value="${today()}"></label>
    <label>Tipo<select id="cc">${CAT.map(x => `<option>${x}</option>`).join('')}</select></label>
    <label>Detalle<input id="cd" placeholder="Ej: semilla hualtaco"></label>
    <label>Cantidad<input type="number" id="cq" value="1" min="0" step="any"></label>
    <label>Precio unitario (Bs)<input type="number" id="cpu" min="0" step="any"></label></div>
    <button class="btn" onclick="addC()">Agregar gasto</button></div>
  <div class="kp">${CAT.map(x => k(x, 'Bs ' + f(by[x]))).join('')}${k('Total invertido', 'Bs ' + f(calc().tc), 'ok')}</div>
  ${tbl(['Fecha', 'Tipo', 'Detalle', 'Cant.', 'P. unit.', 'Total Bs', ''], r)}`;
}

/* ---- Clasificación de la cosecha ---- */
function rCla() {
  const r = S.mov.filter(m => m.t == 'E').sort((a, b) => (a.fecha < b.fecha ? 1 : -1)).map(m =>
    `<tr><td>${m.fecha}</td><td>${CAL[m.cal]}</td><td>${m.cant}</td><td><button class="x" onclick="del(${m.id})" aria-label="Eliminar">✕</button></td></tr>`).join('');

  return `<div class="card"><h2>Registrar cosecha clasificada (en ${esc(S.cfg.unit)})</h2><div class="row">
    <label>Fecha<input type="date" id="qf" value="${today()}"></label>
    ${CAL.map((n, i) => `<label>${n}<input type="number" id="q${i}" min="0" step="any" placeholder="0"></label>`).join('')}</div>
    <button class="btn" onclick="addE()">Registrar cosecha</button>
    <p class="mu">Lo que anotes aquí entra solo como “Entrada” al kárdex de cada calidad.</p></div>
  ${tbl(['Fecha', 'Calidad', 'Cantidad', ''], r)}`;
}

/* ---- Kárdex por calidad ---- */
function rKar(i) {
  const c = calc(), o = c.q[i], u = S.cfg.unit;
  let s = 0;
  const r = S.mov.filter(m => m.cal == i)
    .sort((a, b) => (a.fecha < b.fecha ? -1 : a.fecha > b.fecha ? 1 : a.id - b.id))
    .map(m => {
      const e = m.t == 'E' ? m.cant : 0, x = m.t == 'E' ? 0 : m.cant;
      s += e - x;
      const det = { E: 'Entrada (cosecha)', V: 'Venta' + (m.cli ? ' · ' + esc(m.cli) : ''), M: 'Merma (secado)' }[m.t];
      return `<tr><td>${m.fecha}</td><td>${det}</td><td>${e || ''}</td><td>${x || ''}</td><td class="${s < 0 ? 'bad' : ''}"><b>${s}</b></td><td>${m.t == 'V' ? f(m.pu) : ''}</td><td>${m.t == 'V' ? f(m.cant * m.pu) : ''}</td><td><button class="x" onclick="del(${m.id})" aria-label="Eliminar">✕</button></td></tr>`;
    }).join('');

  return `<div class="card"><h2>Anotar salida de choclo ${CAL[i].toLowerCase()}</h2><div class="row">
    <label>Tipo<select id="kt"><option value="V">Venta</option><option value="M">Merma (seco o arruinado)</option></select></label>
    <label>Fecha<input type="date" id="kf" value="${today()}"></label>
    <label>Cantidad (${esc(u)})<input type="number" id="kq" min="0" step="any"></label>
    <label>Precio por ${esc(u)} (Bs)<input type="number" id="kp" min="0" step="any"></label>
    <label>Cliente (solo venta)<input id="kc"></label></div>
    <button class="btn" onclick="addM(${i})">Guardar movimiento</button></div>
  <div class="kp">${k('Entradas', o.e)}${k('Ventas', o.v)}${k('Mermas', o.m, o.m ? 'bad' : '')}${k('Stock actual', o.s, 'ok')}${k('Costo unitario', 'Bs ' + f(c.cu))}${k('Stock valorado', 'Bs ' + f(o.s * c.cu))}</div>
  ${tbl(['Fecha', 'Detalle', 'Entra', 'Sale', 'Saldo', 'Precio', 'Total Bs', ''], r)}`;
}
