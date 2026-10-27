# -*- coding: utf-8 -*-
"""只做 ASR：给 pN/vo_try{seed}/ID.wav 打分（tts_try 的 ASR 半段）。用法：$PY asr_try.py p5 C04 --seeds 3 42；ASR_DEV=cpu 可改用 CPU"""
import argparse, json, os, re, sys, difflib
from pathlib import Path
CH1 = Path(__file__).resolve().parents[1]
ap = argparse.ArgumentParser(); ap.add_argument('ep'); ap.add_argument('ids', nargs='+'); ap.add_argument('--seeds', nargs='+', type=int); a = ap.parse_args()
EP = CH1 / a.ep
sc = json.loads((EP / 'script.json').read_text(encoding='utf-8'))
G = 'E:/AI/TTS/GPT-SoVITS-v2pro-20261006nvidia50x0'; os.chdir(G); sys.path.insert(0, G)
from funasr import AutoModel
from pypinyin import lazy_pinyin
m = AutoModel(model='tools/asr/models/speech_paraformer-large_asr_nat-zh-cn-16k-common-vocab8404-pytorch', disable_update=True, device=os.environ.get('ASR_DEV', 'cuda'))
def norm(s):
    s = s.lower(); s = re.sub(r'(?<![a-z])x(?![a-z])', '艾克斯', s); s = re.sub(r'(?<![a-z])y(?![a-z])', '歪', s)
    return ''.join(lazy_pinyin(re.sub(r'[^\w]', '', s)))
for u in a.ids:
    for s in a.seeds:
        f = EP / f'vo_try{s}' / f'{u}.wav'
        t = m.generate(input=str(f))[0]['text'].replace(' ', '')
        r = difflib.SequenceMatcher(None, norm(t), norm(sc[u][0])).ratio()
        print(f'{u} seed {s}: {r:.3f} | {t}', flush=True)
