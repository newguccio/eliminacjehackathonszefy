const test = require('node:test');
const assert = require('node:assert/strict');
const {createApp} = require('./app.cjs');

function documentWith(zadania) { return {wersja: 1, zadania}; }
function task(id, tytul, extra = {}) {
  return {id, tytul, opis: '', termin: null, priorytet: 'sredni', wykonane: false, tagi: [], ...extra};
}

test('import i eksport zachowują przykładowe dane oraz wartości z obcego pliku', () => {
  const run = createApp();
  const sample = JSON.parse(run('JSON.stringify(SAMPLE)'));
  const other = {wersja: 1, notatka: 'Semestr', zadania: [
    task(0, '"Próba" — Łódź', {opis: '\u0000TAGI3\u0000', tagi: [' tag ', 'tag', 'tag'], extra: 123}),
    task(-2, 'Zrobione', {wykonane: true, termin: '2028-02-29', priorytet: 'wysoki'}),
    task(4, 'Bez opisu', {termin: '2026-03-29', priorytet: 'niski'})
  ]};
  for (const doc of [sample, other, documentWith([])]) {
    const text = JSON.stringify('\uFEFF' + JSON.stringify(doc));
    assert.deepEqual(JSON.parse(run(`serializeDoc(parseDoc(${text}).doc)`)), doc);
    assert.equal(run(`parseDoc(${text}).warn.length`), 0);
  }
  assert.throws(() => run("parseDoc('broken')"));
  assert.throws(() => run("parseDoc('{}')"));
});

test('scalanie zachowuje wolne ID oraz naprawia odnośnik sesji występującej przed kolokwium', () => {
  const run = createApp();
  const current = documentWith([task(5, 'Dotychczasowe')]);
  const incoming = documentWith([
    task(6, 'Powtórka', {opis: 'Plan nauki (#5), sesja 1 z 1\nCzytaj'}),
    task(5, 'Kolokwium'),
    task(7, 'Notatka', {opis: 'Wzmianka (#5)'})
  ]);
  run(`replaceDocument(${JSON.stringify(current)}); mergeDocument(${JSON.stringify(incoming)})`);
  assert.equal(run('byId(5).tytul'), 'Dotychczasowe');
  assert.equal(run('byId(8).tytul'), 'Kolokwium');
  assert.equal(run('byId(6).opis'), 'Plan nauki (#8), sesja 1 z 1\nCzytaj');
  assert.equal(run('byId(7).opis'), 'Wzmianka (#5)');
  run('removeTask(8)');
  assert.equal(run('nextId()'), 9);
});

test('zastąpienie czyści historię i zatrzymuje sesję, cofnięcie przywraca oba elementy', () => {
  const run = createApp();
  run(`let undo; render = timerTick = () => {}; toast = (msg, action) => { if (action) undo = action; };
       timer.id = 1; timer.left = 800; logFocus(8); setDone(byId(1), true);`);
  const input = JSON.stringify(documentWith([task(1, 'Nowe')]));
  run(`commit('Wczytano', () => replaceDocument(${input}))`);
  assert.equal(run('timer.id'), null);
  assert.equal(run('JSON.stringify(state.meta)'), run('JSON.stringify(emptyMeta())'));
  run('undo()');
  assert.equal(run('state.meta.focus.byTask[1]'), 8);
  assert.equal(run('state.meta.doneAt[1]'), run('today()'));
  assert.equal(run('timer.id'), 1);
  assert.equal(run('timer.left'), 800);
});

test('wykreślanie, przywracanie i usuwanie działa dla ID 0, bez przenoszenia minut', () => {
  const run = createApp();
  run(`render = timerTick = toast = () => {}; replaceDocument(${JSON.stringify(documentWith([task(0, 'Zero')]))});
       timer.id = 0; logFocus(3); toggleTask(0);`);
  assert.equal(run('byId(0).wykonane'), true);
  run('toggleTask(0);');
  assert.equal(run('byId(0).wykonane'), false);
  run('deleteTask(0);');
  assert.equal(run('tasks().length'), 0);
  assert.equal(run('timer.id'), null);
  assert.equal(run('state.meta.focus.byTask[0]'), undefined);
  assert.equal(run('state.meta.focus.byDay[today()]'), 3);
});

test('wczytanie starszego zapisu uzupełnia brakujące liczniki', () => {
  const run = createApp();
  run('localStorage.setItem(KEY, JSON.stringify({doc:state.doc, meta:{focus:{byTask:{1:25,999:15}}}})); load()');
  assert.equal(run('state.meta.focus.byTask[1]'), 25);
  assert.equal(run('state.meta.focus.byTask[999]'), undefined);
  assert.equal(run('Object.keys(state.meta.focus.byDay).length'), 0);
});
