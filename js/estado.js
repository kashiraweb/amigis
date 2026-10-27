/* Estado de la aplicación, persistencia y cálculos */

const STORAGE_KEY = 'choclo_v1';
const TABS = [
  'Resumen Cliente y Ganancias', 'Costos de Sembrado', 'Clasificación Choclo',
  'Kardex Choclo Grande', 'Kardex Choclo Mediano', 'Kardex Choclo Pequeño', 'Kardex Choclo Menudo'
];
const CAL = ['Grande', 'Mediano', 'Pequeño', 'Menudo'];
const CAT = ['Semilla', 'Abono', 'Fertilizante', 'Jornal', 'Otro'];

const estadoInicial = () => ({ cfg: { prod: '', unit: 'cien' }, costos: [], mov: [] });

let S = estadoInicial();
let tab = 0;
let seq = Date.now();
let resetArmado = 0;

try {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) S = Object.assign(S, JSON.parse(raw));
} catch (e) { /* sin almacenamiento: se trabaja en memoria */ }

const save = () => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(S)); } catch (e) {} };

/* Cálculos: totales por calidad, costo unitario, precio mínimo y utilidad */
function calc() {
  const tc = S.costos.reduce((a, c) => a + c.cant * c.pu, 0);
  const q = CAL.map(n => ({ n, e: 0, v: 0, m: 0, ing: 0 }));
  S.mov.forEach(m => {
    const o = q[m.cal];
    if (m.t == 'E') o.e += m.cant;
    else if (m.t == 'V') { o.v += m.cant; o.ing += m.cant * m.pu; }
    else o.m += m.cant;
  });
  q.forEach(o => (o.s = o.e - o.v - o.m));
  const sm = x => q.reduce((a, o) => a + o[x], 0);
  const E = sm('e'), V = sm('v'), M = sm('m'), ING = sm('ing');
  const cu = E ? tc / E : 0;
  return {
    tc, q, E, V, M, ING, cu,
    cm: M * cu,                                   // costo de las mermas
    ut: ING - (V + M) * cu,                       // utilidad neta real
    pmin: E - M > 0 ? tc / (E - M) : 0,           // precio mínimo para no perder
    S: E - V - M                                  // stock total
  };
}

/* Acciones sobre los datos */
function del(id) {
  S.costos = S.costos.filter(x => x.id != id);
  S.mov = S.mov.filter(x => x.id != id);
  save(); view();
}

function cfg() {
  S.cfg.prod = $('cp').value;
  S.cfg.unit = $('cun').value.trim() || 'cien';
  save(); view();
}

function rest() {
  try {
    const d = JSON.parse($('rs').value);
    if (!d.mov || !d.costos) throw 0;
    S = { cfg: Object.assign({ prod: '', unit: 'cien' }, d.cfg), costos: d.costos, mov: d.mov };
    save(); view(); toast('Copia restaurada');
  } catch (e) { toast('El texto no es una copia válida'); }
}

function borrar(b) {
  if (!resetArmado) {
    resetArmado = 1;
    b.textContent = '¿Seguro? Toca otra vez para borrar';
    setTimeout(() => { resetArmado = 0; b.textContent = 'Borrar todos los datos'; }, 4000);
    return;
  }
  S = estadoInicial();
  save(); resetArmado = 0; view();
}
