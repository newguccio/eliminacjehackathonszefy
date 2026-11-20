"""Osadza przykładowe zadania w samodzielnym pliku aplikacji."""
import json
from pathlib import Path

source = Path(__file__).resolve().parent
app = source.parent
template = (source / "index.html").read_text(encoding="utf-8")
sample = json.loads((app / "zadania.json").read_text(encoding="utf-8-sig"))
if template.count("__SAMPLE__") != 1:
    raise ValueError("Szablon powinien zawierać jeden znacznik __SAMPLE__")
encoded = json.dumps(sample, ensure_ascii=False).replace("<", "\\u003c")
target = app / "index.html"
target.write_text(template.replace("__SAMPLE__", encoded), encoding="utf-8")
print(target)
