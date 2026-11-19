import json, os, shutil
from PIL import Image, ImageDraw
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
src, dist = os.path.join(root,'src'), os.path.join(root,'dist')
os.makedirs(dist, exist_ok=True)
sample = json.load(open(os.path.join(root,'zadania.json'), encoding='utf-8'))
html = open(os.path.join(src,'index.html'), encoding='utf-8').read()
html = html.replace('__SAMPLE__', json.dumps(sample, ensure_ascii=False))
open(os.path.join(dist,'index.html'),'w',encoding='utf-8').write(html)
shutil.copy(os.path.join(root,'zadania.json'), os.path.join(dist,'zadania.json'))

def icon(size, path, maskable=False):
    S = size*4
    im = Image.new('RGBA',(S,S),(0,0,0,0)); d = ImageDraw.Draw(im)
    ink=(35,56,168,255)
    if maskable: d.rectangle([0,0,S,S], fill=ink)
    else: d.rounded_rectangle([0,0,S-1,S-1], radius=int(S*0.225), fill=ink)
    k = S/24
    # highlighter swipe
    hl = Image.new('RGBA',(S,S),(0,0,0,0)); hd = ImageDraw.Draw(hl)
    hd.rounded_rectangle([5*k,14.6*k,19*k,18.8*k], radius=int(1.2*k), fill=(255,224,77,220))
    hl = hl.rotate(4, center=(12*k,17*k), resample=Image.BICUBIC)
    im.alpha_composite(hl)
    pts=[(6*k,13.2*k),(9.6*k,16.4*k),(18*k,7.6*k)]
    d = ImageDraw.Draw(im)
    d.line(pts, fill=(255,255,255,255), width=int(2.7*k), joint='curve')
    r=1.35*k
    for x,y in (pts[0],pts[2]): d.ellipse([x-r,y-r,x+r,y+r], fill=(255,255,255,255))
    im = im.resize((size,size), Image.LANCZOS)
    if not maskable and size==180:
        bg = Image.new('RGBA',(size,size),ink); bg.alpha_composite(im); im = bg
    im.save(os.path.join(dist,path))
icon(180,'icon-180.png'); icon(192,'icon-192.png'); icon(512,'icon-512.png'); icon(512,'icon-maskable.png', True)

manifest = {"name":"Ogarniacz","short_name":"Ogarniacz","description":"Planner zadań dla studenta","lang":"pl",
 "start_url":"./","scope":"./","display":"standalone","background_color":"#FAFBFC","theme_color":"#2338A8",
 "icons":[{"src":"icon-192.png","sizes":"192x192","type":"image/png"},{"src":"icon-512.png","sizes":"512x512","type":"image/png"},
          {"src":"icon-maskable.png","sizes":"512x512","type":"image/png","purpose":"maskable"}]}
json.dump(manifest, open(os.path.join(dist,'manifest.webmanifest'),'w',encoding='utf-8'), ensure_ascii=False, indent=2)
open(os.path.join(dist,'sw.js'),'w').write('''// Ogarniacz: działanie offline. Najpierw sieć (świeża wersja), w razie braku internetu kopia z pamięci.
const C = "ogarniacz-v1";
const FILES = ["./", "index.html", "manifest.webmanifest", "icon-180.png", "icon-192.png", "icon-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(C).then(c => c.addAll(FILES)).catch(() => {})); self.skipWaiting(); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(fetch(e.request).then(r => { const copy = r.clone(); caches.open(C).then(c => c.put(e.request, copy)).catch(() => {}); return r; })
    .catch(() => caches.match(e.request).then(r => r || caches.match("index.html"))));
});
''')
print('ok', len(html))
