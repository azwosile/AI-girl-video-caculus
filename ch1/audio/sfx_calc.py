# 微积分课 ch1 新增音效 + 深空 BGM（numpy 合成，可复现）。Git 课原有音效在 build 前复制到 audio/sfx/。
# 用法：python sfx_calc.py   → audio/sfx/{riser,hum,tinkle,thud,sting,tick,tick2,shimmer,slam,slap,ding2}.flac + bgm.flac
import numpy as np, soundfile as sf
from pathlib import Path
SR = 48000; rng = np.random.default_rng(11); OUT = Path(__file__).resolve().parent / 'sfx'; OUT.mkdir(exist_ok=True)
def t_(d): return np.arange(int(d * SR)) / SR
def env(n, a=0.005, c=4):
    e = np.exp(-c * np.linspace(0, 1, n)); k = max(1, int(a * SR)); e[:k] *= np.linspace(0, 1, k); return e
def noise_bp(n, f0, f1):
    X = np.fft.rfft(rng.standard_normal(n)); f = np.fft.rfftfreq(n, 1 / SR); X[(f < f0) | (f > f1)] = 0
    y = np.fft.irfft(X, n); return y / (np.abs(y).max() + 1e-9)
def norm(x, p=0.8): return x / (np.abs(x).max() + 1e-9) * p
def sine(f, d, ph=0):
    t = t_(d); f = np.broadcast_to(f, t.shape) if np.ndim(f) else np.full(t.shape, f)
    return np.sin(2 * np.pi * np.cumsum(f) / SR + ph)
S = {}
# riser：2.6 s 上升，滤波噪声 + 上滑正弦
d = 2.6; t = t_(d); f = 180 * (8 ** (t / d)); r = sine(f, d) * 0.4 + sine(f * 1.5, d) * 0.2
nz = np.zeros_like(t); seg = 2048
for i in range(0, len(t), seg):
    fc = 400 * (12 ** (i / len(t))); nz[i:i + seg] = noise_bp(seg, fc * .7, fc * 1.4)[:len(nz[i:i + seg])]
S['riser'] = norm((r + 0.5 * nz) * (t / d) ** 1.6 * np.r_[np.ones(len(t) - 2400), np.linspace(1, 0, 2400)], 0.6)
# hum：本轮转动，低频 + 拍频
d = 2.2; t = t_(d); S['hum'] = norm((sine(110, d) + 0.6 * sine(110.8, d) + 0.3 * sine(220.5, d)) * np.sin(np.pi * t / d) ** 0.6, 0.5)
# tinkle：玻璃碎片
d = 0.9; x = np.zeros(int(d * SR))
for i in range(18):
    o = int(rng.random() * 0.5 * SR); fr = 2500 + rng.random() * 4500; s = sine(fr, .25) * env(int(.25 * SR), .001, 18)
    x[o:o + len(s)] += s[:len(x) - o] * (1 - o / len(x))
S['tinkle'] = norm(x + 0.25 * noise_bp(len(x), 3000, 9000) * env(len(x), .001, 14), 0.55)
# thud：卡片重落
d = 0.6; t = t_(d); S['thud'] = norm(np.tanh(3 * (sine(70 * np.exp(-t * 4) + 40, d) * env(len(t), .002, 7) + 0.4 * noise_bp(len(t), 80, 900) * env(len(t), .001, 20))), 0.9)
# slam：大标题落版（更亮）
d = 0.7; t = t_(d); S['slam'] = norm(np.tanh(2.5 * (sine(90 * np.exp(-t * 5) + 45, d) * env(len(t), .001, 6) + 0.7 * noise_bp(len(t), 500, 7000) * env(len(t), .001, 16))), 0.9)
# slap：卡片/术语卡贴上
d = 0.18; t = t_(d); S['slap'] = norm(noise_bp(len(t), 700, 5000) * env(len(t), .0005, 30) + 0.5 * sine(220, d) * env(len(t), .001, 25), 0.7)
# sting：惊讶（下滑小三度 + 颤音）
d = 0.9; t = t_(d); S['sting'] = norm(sum(sine(f * (1 - 0.06 * t / d) * (1 + 0.01 * np.sin(2 * np.pi * 7 * t)), d) * g for f, g in [(622, 1), (740, .7), (932, .5)]) * env(len(t), .003, 3.5), 0.55)
# tick / tick2：点点、计数
d = 0.06; S['tick'] = norm(sine(1900, d) * env(int(d * SR), .0005, 40) + 0.3 * noise_bp(int(d * SR), 3000, 8000) * env(int(d * SR), .0005, 60), 0.5)
S['tick2'] = norm(sine(1300, d) * env(int(d * SR), .0005, 40), 0.45)
# ding2：两声不同音高（金高 / 青低）
d = 1.0; S['ding_hi'] = norm(sum(sine(f, d) * g * env(int(d * SR), .002, c) for f, g, c in [(1568, 1, 4), (3136, .35, 7)]), 0.5)
S['ding_lo'] = norm(sum(sine(f, d) * g * env(int(d * SR), .002, c) for f, g, c in [(1046.5, 1, 4), (2093, .35, 7)]), 0.5)
# shimmer：粒子流
d = 2.0; t = t_(d); x = np.zeros(len(t))
for i in range(40):
    o = int(rng.random() * 1.6 * SR); fr = 1800 + rng.random() * 3000; s = sine(fr, .3) * env(int(.3 * SR), .02, 8)
    x[o:o + len(s)] += s[:len(x) - o]
S['shimmer'] = norm((x + 0.3 * noise_bp(len(t), 4000, 10000)) * np.sin(np.pi * t / d), 0.5)
# warp：曲速跃迁（噪声带通上扫 + 低频下潜）
d = 1.6; t = t_(d); nz = np.zeros(len(t)); seg = 2048
for i in range(0, len(t), seg):
    fc = 300 * (20 ** (i / len(t))); nz[i:i + seg] = noise_bp(seg, fc * .6, fc * 1.5)[:len(nz[i:i + seg])]
S['warp'] = norm((0.7 * nz + 0.5 * sine(60 + 400 * (t / d) ** 2, d)) * np.sin(np.pi * np.clip(t / d, 0, 1)) ** 1.5, 0.7)
# laser：激光切割
d = 0.4; t = t_(d); S['laser'] = norm((sine(2600 * np.exp(-t * 7) + 250, d) + 0.35 * noise_bp(len(t), 2000, 9000)) * env(len(t), .001, 6), 0.6)
# zap：小粒子爆点
d = 0.25; t = t_(d); S['zap'] = norm((sine(1800 * np.exp(-t * 14) + 400, d) * 0.7 + 0.4 * noise_bp(len(t), 3000, 10000)) * env(len(t), .0008, 14), 0.5)
# ===== 柔和音色组（10-26：“咚”太频繁，落点默认用这些） =====
def soft_env(n, a=0.008, c=6):
    e = np.exp(-c * np.linspace(0, 1, n)); k = max(1, int(a * SR)); e[:k] *= np.sin(np.linspace(0, np.pi / 2, k)); return e
def lp(x, fc):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR); X *= 1 / np.sqrt(1 + (f / fc) ** 4); return np.fft.irfft(X, len(x))
def mar(f, d=0.55):
    n = int(d * SR); return sine(f, d) * soft_env(n, .003, 7) + 0.25 * sine(f * 4, d) * soft_env(n, .002, 22) + 0.08 * sine(f * 9.2, d) * soft_env(n, .001, 40)
d = 0.4; t = t_(d); S['soft_hit'] = norm(lp(sine(240 * np.exp(-t * 3) + 120, d) * soft_env(len(t), .01, 8) + 0.15 * sine(480, d) * soft_env(len(t), .005, 14), 1800), 0.42)
S['marimba'] = norm(mar(523.25), 0.45); S['marimba_hi'] = norm(mar(783.99), 0.42); S['marimba_lo'] = norm(mar(392.0), 0.45)
x = np.zeros(int(0.7 * SR)); a = mar(659.25, 0.5); b = mar(880.0, 0.55); x[:len(a)] += a; o = int(0.11 * SR); x[o:o + len(b)] += b[:len(x) - o]; S['check'] = norm(x, 0.45)
d = 1.3; t = t_(d); mi = 2.2 * np.exp(-t * 4); S['bell_soft'] = norm(np.sin(2 * np.pi * 1046.5 * t + mi * np.sin(2 * np.pi * 1046.5 * 1.41 * t)) * soft_env(len(t), .004, 4.5) + 0.3 * sine(523.25, d) * soft_env(len(t), .01, 5), 0.38)
def ks(f, d):
    n = int(d * SR); L = int(SR / f); buf = rng.uniform(-1, 1, L); out = np.zeros(n)
    for i in range(n): out[i] = buf[i % L]; buf[i % L] = 0.5 * (buf[i % L] + buf[(i + 1) % L]) * 0.996
    return out
S['pluck'] = norm(lp(ks(392.0, 0.7), 3500) * soft_env(int(0.7 * SR), .002, 3), 0.45)
d = 0.55; t = t_(d); S['swoosh_soft'] = norm(lp(noise_bp(len(t), 250, 3000), 2500) * np.sin(np.pi * t / d) ** 2, 0.32)
d = 1.4; t = t_(d); S['swell'] = norm(sum(sine(f, d) * g for f, g in [(261.63, 1), (329.63, .7), (392.0, .6), (523.25, .3)]) * (np.sin(np.pi * np.clip(t / d, 0, 1)) ** 1.5), 0.3)
d = 0.9; t = t_(d); S['count'] = norm(sine(660, d) * soft_env(len(t), .004, 9) + 0.2 * sine(1320, d) * soft_env(len(t), .003, 16), 0.38)
d = 1.0; t = t_(d); S['count_go'] = norm(sum(sine(f, d) * g for f, g in [(880, 1), (1108.7, .6), (1318.5, .5)]) * soft_env(len(t), .004, 5), 0.42)
for k, v in S.items(): sf.write(OUT / f'{k}.flac', np.r_[v, np.zeros(int(.02 * SR))].astype(np.float32), SR)
# ---------- BGM：深空氛围电子，92 BPM，Dm–B♭–F–C 慢 pad + 琶音 + 轻拍 ----------
BPM = 92; beat = 60 / BPM; bars = 44; L = int(bars * 4 * beat * SR) + SR; out = np.zeros((L, 2))
def add(sig, t0, pan=0.0, g=1.0):
    i = int(t0 * SR); n = min(len(sig), L - i)
    if n > 0: out[i:i + n, 0] += sig[:n] * g * (1 - pan); out[i:i + n, 1] += sig[:n] * g * (1 + pan)
m2f = lambda m: 440 * 2 ** ((m - 69) / 12)
CH = [[50, 53, 57, 62], [46, 50, 53, 58], [41, 45, 48, 53], [48, 52, 55, 60]]
def pad(notes, d):
    t = t_(d); y = sum(sine(m2f(n), d) + 0.5 * sine(m2f(n) * 1.003, d) + 0.25 * sine(m2f(n) * 2.001, d) for n in notes)
    a = np.minimum(1, t / 0.8) * np.minimum(1, (d - t) / 0.8); return y * a
def pluck(f, d=0.5):
    t = t_(d); return (sine(f, d) + 0.4 * sine(2 * f, d) + 0.15 * sine(3 * f, d)) * env(len(t), .002, 9)
def kick():
    d = .4; t = t_(d); return sine(45 + 90 * np.exp(-t * 28), d) * env(len(t), .001, 7)
def hat():
    n = int(.05 * SR); return noise_bp(n, 6000, 14000) * env(n, .0005, 35)
ARP = [0, 2, 1, 3, 2, 1, 3, 2]
for bar in range(bars):
    t0 = bar * 4 * beat; ch = CH[bar % 4]; sec = bar // 8
    add(pad([n - 12 for n in ch[:3]], 4 * beat + 0.8), t0, 0, 0.06)
    add(pluck(m2f(ch[0] - 24), 4 * beat) * 1.0, t0, 0, 0.18)
    for e in range(8):
        add(pluck(m2f(ch[ARP[e]] + 12)), t0 + e * beat / 2, 0.35 * (1 if e % 2 else -1), 0.07 if sec else 0.04)
    if bar >= 2:
        for b in range(4):
            if b in (0, 2): add(kick(), t0 + b * beat, 0, 0.35)
            add(hat(), t0 + b * beat + beat / 2, 0.25, 0.12)
x = out[:L]; k = int(0.2 * beat * SR)  # 轻延迟
x[k:] += 0.25 * x[:-k][:, ::-1]
x = np.tanh(x * 1.2); x /= np.abs(x).max() + 1e-9; x *= 0.85
sf.write(OUT / 'bgm_synth.flac', x.astype(np.float32), SR)
print(sorted(S), 'bgm', round(L / SR, 1), 's')
