const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

// Uruchamiamy kod aplikacji bez otwierania przeglądarki. Testy wywołują jej rzeczywiste funkcje.
function createApp() {
  const project = path.join(__dirname, '..', 'Ogarniacz');
  const html = fs.readFileSync(path.join(project, 'zrodla', 'index.html'), 'utf8');
  const sample = fs.readFileSync(path.join(project, 'zadania.json'), 'utf8');
  const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
  const source = script.slice(0, script.indexOf('/* ---------- start ---------- */'));
  const element = {addEventListener() {}, classList: {toggle() {}}};
  const storage = new Map();
  const context = vm.createContext({
    URLSearchParams, location: {search: ''},
    window: element, document: {...element, querySelector: () => element},
    navigator: {}, localStorage: {
      getItem: key => storage.get(key) ?? null,
      setItem: (key, value) => storage.set(key, value)
    },
    setInterval: () => 1, clearInterval() {}, setTimeout() {}
  });
  const run = text => vm.runInContext(text, context);
  run(source.replace('__SAMPLE__', () => sample));
  run('load()');
  return run;
}

module.exports = {createApp};
