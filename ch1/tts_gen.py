# -*- coding: utf-8 -*-
"""AI娘微积分课 第1章 配音：GPT-SoVITS v5 零样本，本地 API（127.0.0.1:9880）。
声线与 AI娘Git课 保持一致（参考音直接取 Git 课目录，不复制、不改动）：
  G = GPT（Git 课 G 组声线 audio/ref_g/G07_01.ogg）
  C = Claude小姐（Git 课 audio/ref_squad/c_ref.wav，御姐 v3）
  D = 大肥鱼（Git 课 audio/ref/dwg_*.wav，按情绪选参考）
用法（先启动 GPT-SoVITS API）：
    PY=/e/AI/TTS/GPT-SoVITS-v2pro-20261006nvidia50x0/runtime/python.exe
    $PY tts_gen.py                    # 生成缺失句 → vo/*.wav
    $PY tts_gen.py --only C06 --force [--seed 42]
"""
import argparse, json, sys, time, urllib.request
from pathlib import Path

EP = Path(__file__).resolve().parent          # 默认 = ch1（P0）；--ep p1 切到分段目录
GIT = Path(__file__).resolve().parent.parent.parent / 'AI娘GIt课'
API = 'http://127.0.0.1:9880/tts'
# 豆包（B）：自训练模型（doubao-e15.ckpt + doubao_e10_s250.pth），需单独起 9881：api_v2.py -p 9881 -c GPT_SoVITS/configs/tts_doubao.yaml
# 9880 与 9881 不能同时开（显存）；参数同 Git 课 ep3/tts_doubao.py（参考 r19）
API_B = 'http://127.0.0.1:9881/tts'
B_REF = ('E:/AI/TTS/doubao_train/sliced/raw_vocals.wav_0004232320_0004344320.wav', '休闲时的聊天陪伴，都可以为你提供帮助。')
G_REF = ('G07_01', '用 git log，就能看到所有的存档记录。')
D_REF = {
    'panic': ('dwg_0036', '别、别突然从后面叫我，我真的会被你吓到。刚才屏幕为什么自己亮了？我明明没有碰它。'),
    'think': ('dwg_0053', '嗯，让我想想，这件事其实没有你想象中那么复杂。'),
    'daily': ('dwg_0002', '什么嘛，这么简单的事情，你居然专门跑来问我。'),
    'sigh': ('dwg_0033', '你又订阅别的人工智能了？行吧，我就当没看见。'),
    'easy': ('dwg_0031', '今天的海水温度刚刚好，特别适合一边摸鱼，一边认真工作。'),
}
D_MOOD = {'D01': 'daily', 'D02': 'think', 'D03': 'panic'}   # P0；分段目录按 lines.json 的立绘自动选（POSE_MOOD），tts_override.json 可用 {"mood": ...} 覆盖
POSE_MOOD = {'d_panic': 'panic', 'd_shock': 'panic', 'd_think': 'think', 'd_curious': 'think', 'd_relief': 'sigh', 'd_ok': 'easy'}
SQ = json.loads((GIT / 'audio' / 'ref_squad' / 'refs.json').read_text(encoding='utf-8'))
CALC_REF = Path(__file__).resolve().parent.parent / 'ch2' / 'audio' / 'ref'   # 第 2 章新角色参考音（Arena TTS 试听选定 → 本课自己的目录，不写进 Git 课）
SQ2 = json.loads((CALC_REF / 'refs.json').read_text(encoding='utf-8')) if (CALC_REF / 'refs.json').exists() else {}
READ = {'Claude': '克劳德', 'Grok': '格洛克', 'Gemini': '杰米奈', 'MiniMax': '迷你麦克斯', 'Mistral': '米斯特拉尔', 'MiMo': '米莫', 'Llama': '拉玛', 'GLM': '智谱'}   # 同 Git 课读法（10-27 第 2 章起台词里会念名字）
SPEED = {'G': 1.0, 'C': 1.0, 'D': 1.08}   # 生成时只给大肥鱼提速（同 Git 课），其余在 prep.py 用 atempo
SEED = 1234
OVERRIDE = {'C01': {'seed': 42}, 'C06': {'seed': 42}, 'C07': {'seed': 42}, 'G03': {'seed': 7}}   # P0 的 ASR 抽查结果（10-26）；分段目录用自己的 tts_override.json


def body(uid, text):
    for a, b in READ.items(): text = text.replace(a, b)
    k = uid[0]
    if k == 'B':
        ov = OVERRIDE.get(uid, {})
        return dict(text=text, text_lang='zh', ref_audio_path=B_REF[0], prompt_text=B_REF[1], prompt_lang='zh',
                    text_split_method='cut5', speed_factor=1.0, seed=ov.get('seed', SEED), top_k=15, top_p=1.0,
                    temperature=1.0, repetition_penalty=1.35, media_type='wav', batch_size=1)
    if k == 'G':
        ref, prompt = str(GIT / 'audio' / 'ref_g' / f'{G_REF[0]}.ogg'), G_REF[1]
    elif k == 'C':
        ref, prompt = str(GIT / 'audio' / 'ref_squad' / SQ['C']['file']), SQ['C']['text']
    elif k in SQ2:   # 第 2 章新客串（混元 H、GLM Z、Mistral R、MiMo T、Llama L、MiniMax N）
        ref, prompt = str(CALC_REF / SQ2[k]['file']), SQ2[k]['text']
    elif k in SQ:   # 客串（千问 Q 等）：Git 课 ref_squad
        ref, prompt = str(GIT / 'audio' / 'ref_squad' / SQ[k]['file']), SQ[k]['text']
    else:
        ov0 = OVERRIDE.get(uid, {})
        r, prompt = D_REF[ov0.get('mood') or D_MOOD.get(uid, 'daily')]; ref = str(GIT / 'audio' / 'ref' / f'{r}.wav')
    ov = OVERRIDE.get(uid, {})
    return dict(text=text, text_lang='zh', ref_audio_path=ref, prompt_text=prompt, prompt_lang='zh',
                speed_factor=SPEED.get(k, 1.0), media_type='wav', seed=ov.get('seed', SEED),
                text_split_method='cut0', batch_size=1, top_k=15, top_p=1, temperature=1)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--only', nargs='*'); ap.add_argument('--force', action='store_true')
    ap.add_argument('--seed', type=int, default=None); ap.add_argument('--out', default='vo')
    ap.add_argument('--ep', default=None, help='分段目录（相对 ch1），如 p1；第 2 章用 ../ch2/p0')
    a = ap.parse_args()
    global EP, OVERRIDE
    if a.ep:
        EP = EP / a.ep; f = EP / 'tts_override.json'
        OVERRIDE = json.loads(f.read_text(encoding='utf-8')) if f.exists() else {}
        lj = EP / 'web' / 'lines.json'
        if lj.exists():
            D_MOOD.clear(); D_MOOD.update({l['id']: POSE_MOOD.get(l['pose'], 'daily') for l in json.loads(lj.read_text(encoding='utf-8')) if l['id'][0] == 'D'})
    out = EP / a.out; out.mkdir(exist_ok=True)
    sc = json.loads((EP / 'script.json').read_text(encoding='utf-8'))
    todo = [(u, v[0]) for u, v in sc.items() if not a.only or u in a.only]
    for n, (u, t) in enumerate(todo, 1):
        f = out / f'{u}.wav'
        if f.exists() and not a.force: continue
        b = body(u, t)
        if a.seed is not None: b['seed'] = a.seed
        req = urllib.request.Request(API_B if u[0] == 'B' else API, json.dumps(b).encode('utf-8'), {'Content-Type': 'application/json'})
        t0 = time.time()
        for attempt in range(3):
            try:
                data = urllib.request.urlopen(req, timeout=300).read(); break
            except Exception as e:
                detail = e.read().decode('utf-8', 'ignore')[:300] if hasattr(e, 'read') else ''
                print(f'  {u} 第 {attempt + 1} 次失败：{e} {detail}', file=sys.stderr); time.sleep(3)
        else:
            raise SystemExit(f'{u} 生成失败')
        f.write_bytes(data)
        print(f'[{n}/{len(todo)}] {u} {time.time() - t0:.1f}s {t}', flush=True)


if __name__ == '__main__':
    main()
