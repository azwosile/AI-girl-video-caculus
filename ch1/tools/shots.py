# 质检截图：python tools/shots.py pN "C03:0.6,C04:0.9,123.4" [--w 960] → pN/web/out/shots/*.jpg + shots_sheet_k.jpg（每张 2×2）
import sys, json, base64, io, functools, threading, http.server, argparse
from pathlib import Path
from playwright.sync_api import sync_playwright
from PIL import Image
ap = argparse.ArgumentParser(); ap.add_argument('ep'); ap.add_argument('specs'); ap.add_argument('--w', type=int, default=960); ap.add_argument('--channel', default='chrome')
a = ap.parse_args()
HERE = Path(__file__).resolve().parents[1] / a.ep / 'web'
DUR = json.loads((HERE / 'durations.json').read_text(encoding='utf-8'))
class H(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *x): pass
srv = http.server.ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(H, directory=str(HERE)))
threading.Thread(target=srv.serve_forever, daemon=True).start()
out = HERE / 'out' / 'shots'; out.mkdir(parents=True, exist_ok=True)
for f in out.glob('*.jpg'): f.unlink()
with sync_playwright() as p:
    br = p.chromium.launch(channel=a.channel, args=['--force-device-scale-factor=1'])
    pg = br.new_page(viewport={'width': 1920, 'height': 1080})
    pg.add_init_script(f'window.__EXPORT__=true; window.DUR={json.dumps(DUR)};')
    pg.goto(f'http://127.0.0.1:{srv.server_address[1]}/index.html'); pg.evaluate('window.ready')
    tl = pg.evaluate('window.TIMELINE'); seq = {s['id']: s for s in tl['seq']}
    print('total', round(tl['total'], 2))
    ims = []
    for sp in a.specs.split(','):
        if ':' in sp: i, f = sp.split(':'); t = seq[i]['vo'] + float(f) * seq[i]['dur']
        else: t = float(sp)
        d = pg.evaluate("t => { window.renderAt(t); return document.getElementById('c').toDataURL('image/jpeg', 0.92); }", t)
        im = Image.open(io.BytesIO(base64.b64decode(d.split(',')[1]))).resize((a.w, a.w * 9 // 16))
        im.save(out / f'{len(ims):02d}_{sp.replace(":", "_")}.jpg', quality=88); ims.append(im)
    br.close()
w, h = a.w, a.w * 9 // 16
for k in range(0, len(ims), 4):
    sh = Image.new('RGB', (w * 2, h * 2), 'black')
    for j, im in enumerate(ims[k:k + 4]): sh.paste(im, ((j % 2) * w, (j // 2) * h))
    sh.save(out / f'sheet_{k // 4:02d}.jpg', quality=85)
print('ok', len(ims))
