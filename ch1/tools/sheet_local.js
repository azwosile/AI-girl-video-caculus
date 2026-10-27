// 沙箱本地预览：node tools/sheet_local.js [t1,t2,...]  → web/out/local_sheet.jpg（用 @napi-rs/canvas 模拟浏览器）
const path = require('path'), fs = require('fs');
const NC = require(process.env.NC || '/tmp/nc/node_modules/@napi-rs/canvas');
const { createCanvas, loadImage, GlobalFonts } = NC;
const WEB = path.resolve(__dirname, '../web');
GlobalFonts.registerFromPath(path.join('/tmp/smiley/SmileySans-Oblique.ttf'), 'Smiley');
const cv = createCanvas(1920, 1080);
const imgs = {};
class Image { set src(s) { this._s = s; loadImage(path.join(WEB, s)).then(im => { this._im = im; this.width = im.width; this.height = im.height; imgs[s] = im; this.onload && this.onload(); }).catch(e => this.onerror && this.onerror(e)); } }
const ctx0 = cv.getContext('2d');
const realDraw = ctx0.drawImage.bind(ctx0);
ctx0.drawImage = function (im, ...a) { return realDraw(im && im._im ? im._im : im, ...a); };
global.window = { __EXPORT__: true, DUR: fs.existsSync(path.join(WEB, 'durations.json')) ? JSON.parse(fs.readFileSync(path.join(WEB, 'durations.json'))) : {} };
global.document = { createElement: () => createCanvas(1600, 500), getElementById: () => cv, fonts: { load: async () => { }, ready: Promise.resolve() } };
global.Image = Image; global.performance = { now: () => 0 };
eval(fs.readFileSync(path.join(WEB, 'lines.js'), 'utf8').replace('window.LINES', 'global.window.LINES'));
const src = fs.readFileSync(path.join(WEB, 'engine.js'), 'utf8');
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
  fs.writeFileSync(path.join(WEB, 'out', 'local_sheet.jpg'), await sheet.encode('jpeg', 82));
  if (process.env.FULL) { window.renderAt(Number(process.env.FULL)); fs.writeFileSync(path.join(WEB, 'out', 'local_full.jpg'), await cv.encode('jpeg', 85)); }
  console.log('total', tl.total.toFixed(2), 'frames', times.length, 'ms/frame', ((Date.now() - t0) / times.length).toFixed(0), 'sfx', tl.sfx.length);
})().catch(e => { console.error(e); process.exit(1); });
