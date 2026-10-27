// 分段版本地联系表：WEB=p1/web node tools/sheet_seg.js [t1,t2,...]  → $WEB/out/local_sheet.jpg
// 读取 index.html 同样的脚本顺序：lines.js → seg.js → core.js(shared) → scenes.js；缺立绘时用占位图
const path = require('path'), fs = require('fs');
const NC = require(process.env.NC || '/tmp/nc/node_modules/@napi-rs/canvas');
const { createCanvas, loadImage, GlobalFonts } = NC;
const WEB = path.resolve(__dirname, '..', process.env.WEB || 'p1/web');
const SPRD = [path.join(WEB, 'sprites'), path.resolve(__dirname, '../web/sprites')];
GlobalFonts.registerFromPath('/tmp/smiley/SmileySans-Oblique.ttf', 'Smiley');
const cv = createCanvas(1920, 1080);
class Image {
  set src(s) {
    this._s = s; const nm = path.basename(s), f = SPRD.map(d => path.join(d, nm)).find(p => fs.existsSync(p));
    const ph = () => { const c = createCanvas(400, 800), g = c.getContext('2d'); g.fillStyle = 'rgba(255,0,255,0.5)'; g.fillRect(40, 40, 320, 760); g.fillStyle = '#fff'; g.font = '40px sans-serif'; g.fillText(nm.replace('.webp', ''), 60, 120); this._im = c; this.width = 400; this.height = 800; this.onload && this.onload(); };
    if (!f) return setTimeout(ph, 0);
    loadImage(f).then(im => { this._im = im; this.width = im.width; this.height = im.height; this.onload && this.onload(); }).catch(ph);
  }
}
const ctx0 = cv.getContext('2d'); const realDraw = ctx0.drawImage.bind(ctx0);
ctx0.drawImage = function (im, ...a) { return realDraw(im && im._im ? im._im : im, ...a); };
global.window = { __EXPORT__: true, DUR: fs.existsSync(path.join(WEB, 'durations.json')) ? JSON.parse(fs.readFileSync(path.join(WEB, 'durations.json'))) : {} };
global.document = { createElement: () => { const c = createCanvas(1600, 500); const g = c.getContext('2d'); const rd = g.drawImage.bind(g); g.drawImage = (im, ...a) => rd(im && im._im ? im._im : im, ...a); return c; }, getElementById: () => cv, fonts: { load: async () => { }, ready: Promise.resolve() } };
global.Image = Image; global.performance = { now: () => 0 };
const rd = f => fs.readFileSync(f, 'utf8');
const SCR = [...rd(path.join(WEB, 'index.html')).matchAll(/<script src="([^"]+)"/g)].map(m => m[1]);
const src = SCR.map(n => { const sh = path.resolve(__dirname, '../shared', n); return rd(['core.js', 'kit.js'].includes(n) && fs.existsSync(sh) ? sh : path.join(WEB, n)); }).join('\n;\n');
new Function('window', 'document', 'Image', src)(global.window, global.document, Image);
(async () => {
  await window.ready;
  const tl = window.TIMELINE;
  const times = process.argv[2] ? process.argv[2].split(',').map(Number) : tl.seq.map(s => s.vo + 0.7 * s.dur);
  const cols = 4, rows = Math.ceil(times.length / cols), sw = 640, sh = 360;
  const sheet = createCanvas(sw * cols, sh * rows), sc = sheet.getContext('2d');
  const t0 = Date.now();
  times.forEach((t, i) => { window.renderAt(t); sc.drawImage(cv, (i % cols) * sw, Math.floor(i / cols) * sh, sw, sh); sc.fillStyle = '#ff0'; sc.font = '22px sans-serif'; sc.fillText(t.toFixed(2), (i % cols) * sw + 8, Math.floor(i / cols) * sh + 24); });
  fs.mkdirSync(path.join(WEB, 'out'), { recursive: true });
  fs.writeFileSync(path.join(WEB, 'out', process.env.OUT || 'local_sheet.jpg'), await sheet.encode('jpeg', 82));
  if (process.env.FULL) { window.renderAt(Number(process.env.FULL)); fs.writeFileSync(path.join(WEB, 'out', 'local_full.jpg'), await cv.encode('jpeg', 85)); }
  if (process.env.ALL) { const t1 = Date.now(); let n = 0; for (let t = 0; t < tl.total; t += Number(process.env.ALL)) { window.renderAt(t); n++; } console.log('all-frames ok', n, 'ms/frame', ((Date.now() - t1) / n).toFixed(0)); }
  const cnt = {}; tl.sfx.forEach(e => cnt[e.name] = (cnt[e.name] || 0) + 1);
  console.log('total', tl.total.toFixed(2), 'frames', times.length, 'ms/frame', ((Date.now() - t0) / times.length).toFixed(0), 'sfx', tl.sfx.length, JSON.stringify(cnt));
  console.log('blocks', tl.blocks.map(b => b.b + ':' + b.t0.toFixed(1)).join(' '));
})().catch(e => { console.error(e); process.exit(1); });
