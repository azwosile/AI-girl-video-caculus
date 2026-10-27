# 微积分课 ch1 混音：人声 + 音效 + BGM（人声闪避）
import json, numpy as np, soundfile as sf
from pathlib import Path
import os
EP = Path(os.environ.get('EP_DIR') or Path(__file__).resolve().parents[1]); ROOT = EP.parent
SFXD = (EP / 'audio' if (EP / 'audio' / 'sfx48').exists() else EP.parent / 'audio') / 'sfx48'
tl = json.loads((EP / 'web' / 'out' / 'timeline.json').read_text(encoding='utf-8'))
SR = 48000; N = int((tl['total'] + 0.5) * SR)
vo = np.zeros((N, 2), np.float32); fx = np.zeros((N, 2), np.float32)
cache = {}
def load(p):
    if p not in cache: cache[p] = sf.read(p, dtype='float32')[0]
    return cache[p]
def place(buf, x, t, g=1.0, pan=0.0):
    if x.ndim == 1: x = np.stack([x * (1 - pan), x * (1 + pan)], 1)
    i = int(t * SR); n = min(len(x), N - i)
    if n > 0 and i >= 0: buf[i:i + n] += x[:n] * g
for s in tl['seq']:
    PAN = {'C': -0.05, 'G': 0.05, 'D': 0.05, 'Q': 0.05}
    place(vo, load(EP / 'vo48' / f"{s['id']}.wav"), s['vo'], 0.95, PAN.get(s['id'][0], 0))
for e in tl['sfx']:
    place(fx, load(SFXD / f"{e['name']}.wav"), e['t'], 0.5 * e['gain'])
bg = load(SFXD / 'bgm.wav')
XF = int(2.0 * SR)   # 循环处 2 s 交叉淡化（BGM 比段落短时）
while len(bg) < N:
    src = load(SFXD / 'bgm.wav'); r = np.linspace(0, 1, XF)[:, None]
    bg = np.concatenate([bg[:-XF], bg[-XF:] * (1 - r) + src[:XF] * r, src[XF:]])
bg = bg[:N]
lv = np.abs(vo).max(1); k = int(0.05 * SR); lv = np.convolve(lv, np.ones(k) / k, 'same')
duck = 1 - 0.6 * np.clip(lv / 0.12, 0, 1)
a = np.exp(-64 / (0.15 * SR)); env = np.empty_like(duck); s = 1.0
for i in range(0, N, 64): s = a * s + (1 - a) * duck[i]; env[i:i + 64] = s
envd = env.copy()  # 未做首尾淡入淡出的闪避包络（0.4~1）
fade = int(0.5 * SR); env[:fade] *= np.linspace(0, 1, fade); env[-int(2 * SR):] *= np.linspace(1, 0, int(2 * SR))
mix = vo + fx + bg * 0.30 * env[:, None]   # 授权曲已在 prep 统一到 RMS 0.12；“稍微配一下”
mix = np.tanh(mix * 1.1) / np.tanh(1.1); mix *= 0.95 / max(1e-6, np.abs(mix).max())
sf.write(EP / 'web' / 'out' / 'mix.wav', mix, SR, subtype='PCM_16'); print('mix', round(N / SR, 2), 's')
