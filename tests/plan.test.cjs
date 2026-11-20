const test = require('node:test');
const assert = require('node:assert/strict');
const {createApp} = require('./app.cjs');

function weekWithExam(){
  const run = createApp();
  run(`
    const exam = {id: 1, tytul: 'Kolokwium z sieci', opis: 'Rozdziały 3–8',
      termin: addDays(today(), 7), priorytet: 'wysoki', wykonane: false, tagi: ['studia']};
    const report = {...exam, id: 2, tytul: 'Raport z laboratorium', termin: addDays(today(), 4)};
    replaceDocument({wersja: 1, zadania: [exam, report]});
    const plan = studyPlan(exam);
  `);
  return run;
}

test('propozycja uwzględnia termin raportu i wymaga zatwierdzenia', () => {
  const run = weekWithExam();
  assert.equal(run('plan.length'), 3);
  assert.equal(run('plan[1].tytul'), 'Kolokwium z sieci: rozdz. 6–8');
  assert.equal(run('fitStudyPlan(exam, plan)[1].date'), run('addDays(today(), 3)'));
  assert.match(run('fitStudyPlan(exam, plan)[1].reason'), /Raport z laboratorium/);
  assert.equal(run('plan[1].termin'), run('report.termin'));
  assert.equal(run('tasks().length'), 2);
});

test('sesje nie generują sprawdzianów ani podwójnego przygotowania', () => {
  const run = weekWithExam();
  run('for (const session of plan) tasks().push({...session, id: nextId()});');
  assert.equal(run('tasks().filter(isExam).length'), 1);
  assert.equal(run('examClusters().length'), 0);
  assert.equal(run('radar().every(day => day.prep === 0)'), true);
  assert.equal(run('hasPlan(exam)'), true);
  assert.equal(run('tasks().slice(2).every(t => studyParentId(t) === 1)'), true);
});

test('sesje przed przyszłym egzaminem zachowują kolejność i przerwy', () => {
  const run = weekWithExam();
  for (const distance of [1, 2, 3, 5, 6, 8, 10, 14, 30, 365]){
    run('exam.termin = addDays(today(), ' + distance + ')');
    assert.equal(run(`fitStudyPlan(exam, studyPlan(exam)).every(({date}, i, days) =>
      date >= today() && date < exam.termin && (!i || diffDays(date, days[i-1].date) >= 2))`), true);
  }
});
