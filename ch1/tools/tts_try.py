# -*- coding: utf-8 -*-
"""多种子试配 + ASR 打分，挑最好的放进 vo/。用法：$PY tts_try.py p1 C09 C10 --seeds 1234 42 7 99"""
import argparse, json, os, re, shutil, subprocess, sys, difflib
from pathlib import Path
CH1 = Path(__file__).resolve().parents[1]
ap = argparse.ArgumentParser(); ap.add_argument('ep'); ap.add_argument('ids', nargs='+'); ap.add_argument('--seeds', nargs='+', type=int, default=[1234, 42, 7, 99]); a = ap.parse_args()
PY = sys.executable
EP = CH1 / a.ep
for s in a.seeds:
    subprocess.run([PY, str(CH1 / 'tts_gen.py'), '--ep', a.ep, '--only', *a.ids, '--force', '--seed', str(s), '--out', f'vo_try{s}'], check=True)
sc = json.loads((EP / 'script.json').read_text(encoding='utf-8'))
G = 'E:/AI/TTS/GPT-SoVITS-v2pro-20261006nvidia50x0'; os.chdir(G); sys.path.insert(0, G)
from funasr import AutoModel
from pypinyin import lazy_pinyin
m = AutoModel(model='tools/asr/models/speech_paraformer-large_asr_nat-zh-cn-16k-common-vocab8404-pytorch', disable_update=True, device='cuda')
def norm(s):
    s = s.lower(); s = re.sub(r'(?<![a-z])x(?![a-z])', '艾克斯', s); s = re.sub(r'(?<![a-z])y(?![a-z])', '歪', s)
    for e, z in {'h': '艾尺', 'k': '开', 'm': '艾姆', 'gemini': '杰米奈'}.items(): s = re.sub(rf'(?<![a-z]){e}(?![a-z])', z, s)
    return ''.join(lazy_pinyin(re.sub(r'[^\w]', '', s)))
res = {}
for u in a.ids:
    best = None
    for s in a.seeds:
        f = EP / f'vo_try{s}' / f'{u}.wav'
        t = m.generate(input=str(f))[0]['text'].replace(' ', '')
        r = difflib.SequenceMatcher(None, norm(t), norm(sc[u][0])).ratio()
        print(f'{u} seed {s}: {r:.3f} | {t}', flush=True)
        if best is None or r > best[0]: best = (r, s, t)
    res[u] = best
    shutil.copy(EP / f'vo_try{best[1]}' / f'{u}.wav', EP / 'vo' / f'{u}.wav')
    print(f'==> {u} pick seed {best[1]} {best[0]:.3f} | {best[2]}', flush=True)
ov = EP / 'tts_override.json'; o = json.loads(ov.read_text(encoding='utf-8')) if ov.exists() else {}
for u, (r, s, t) in res.items(): o[u] = dict(o.get(u, {}), seed=s)
ov.write_text(json.dumps(o, ensure_ascii=False), encoding='utf-8')
for s in a.seeds: shutil.rmtree(EP / f'vo_try{s}', ignore_errors=True)
