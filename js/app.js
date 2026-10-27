/* Formularios (altas) e inicio de la aplicación */

function addC() {
  const cant = num('cq'), pu = num('cpu');
  if (cant <= 0 || pu <= 0) return toast('Escribe cantidad y precio mayores a cero');
  S.costos.push({ id: ++seq, fecha: $('cf').value || today(), cat: $('cc').value, det: $('cd').value, cant, pu });
  save(); view(); toast('Gasto agregado');
}

function addE() {
  let n = 0;
  CAL.forEach((_, i) => {
    const q = num('q' + i);
    if (q > 0) { S.mov.push({ id: ++seq, fecha: $('qf').value || today(), cal: i, t: 'E', cant: q }); n++; }
  });
  if (!n) return toast('Escribe al menos una cantidad');
  save(); view(); toast('Cosecha registrada');
}

function addM(i) {
  const t = $('kt').value, q = num('kq'), pu = num('kp'), st = calc().q[i].s;
  if (q <= 0) return toast('Escribe una cantidad mayor a cero');
  if (q > st) return toast('No hay tanto stock: quedan ' + st);
  if (t == 'V' && pu <= 0) return toast('Escribe el precio de venta');
  S.mov.push({ id: ++seq, fecha: $('kf').value || today(), cal: i, t, cant: q, pu: t == 'V' ? pu : 0, cli: t == 'V' ? $('kc').value.trim() : '' });
  save(); view(); toast('Movimiento guardado');
}

// Inicio
nav();
view();
