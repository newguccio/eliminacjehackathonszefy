const test = require('node:test');
const assert = require('node:assert/strict');
const { createApp } = require('./app.cjs');

function setup() {
  const run = createApp();
  run(`
    state = { doc: { wersja: 1, zadania: [] }, meta: emptyMeta() };
    function add(label, day, priority = "niski", extra = {}) {
      tasks().push({id: nextId(), tytul: label, termin: addDays(today(), day),
        priorytet: priority, opis: "", tagi: [], wykonane: false, ...extra});
    }
  `);
  return run;
}

test('relief offers only flexible candidates from a crowded day and prefers an earlier date', () => {
  const run = setup();
  run(`
    add("Kolokwium", 2);
    add("Powtórka", 2, "niski", {opis: "Plan nauki (#1), sesja 1 z 1"});
    add("Oddanie raportu", 2, "wysoki");
    add("Kupić zeszyt", 2);
    add("Drukować notatki", 2, "niski", {wykonane: true});
    add("Czytanie", 5);
  `);
  assert.equal(run('reliefOptions().length'), 1);
  assert.equal(run('reliefOptions()[0].title'), 'Kupić zeszyt');
  assert.equal(run('reliefOptions()[0].to'), run('addDays(today(), 1)'));
  assert.equal(run('byId(4).termin'), run('addDays(today(), 2)'));
});

test('relief skips overdue tasks displayed today and a destination which would become busy', () => {
  const run = setup();
  run(`
    add("Oddanie projektu", 0, "wysoki"); add("Laboratorium", 0, "wysoki");
    add("Zrobić zakupy", 0); add("Zaległa książka", -2);
    add("Praktyki", 1, "wysoki");
  `);
  assert.equal(run('reliefOptions().length'), 1);
  assert.equal(run('reliefOptions()[0].to'), run('addDays(today(), 2)'));
  run('for (let i = 2; i <= 7; i++) add("Projekt", i, "wysoki");');
  assert.equal(run('reliefOptions().length'), 0);
});

test('choosing a proposal changes only that task and supports undo', () => {
  const run = setup();
  run(`
    add("Projekt", 0, "wysoki"); add("Laborka", 0, "wysoki");
    add("Zakupy", 0); add("Księgarnia", 0);
    const form = {};
    let choice = null, undo = null;
    openSheet = (title, body, {onMount}) => onMount({
      querySelector: selector => selector === "#relief-form" ? form : choice
    });
    closeSheet = () => {};
    render = () => {};
    timerTick = () => {};
    toast = (message, action) => { undo = action; };
    openRelief();
    form.onsubmit({preventDefault() {}});
  `);
  assert.equal(run('tasks().every(t => t.termin === today())'), true);
  run('choice = {value: "3"}; form.onsubmit({preventDefault() {}})');
  assert.equal(run('byId(3).termin'), run('addDays(today(), 1)'));
  assert.equal(run('byId(4).termin'), run('today()'));
  run('undo()');
  assert.equal(run('tasks().every(t => t.termin === today())'), true);
});
