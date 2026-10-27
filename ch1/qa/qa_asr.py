# -*- coding: utf-8 -*-
"""逐句 ASR 审核（每次重配 / 出片后都跑）：Paraformer 识别 ch1/vo/*.wav，与朗读稿按无调拼音比对。
用法：$PY ch1/qa/qa_asr.py [--src vo|vo48] [--only C02 X03]
输出：ep3/qa/qa_asr.txt；相似度 < 0.92 或朗读稿中的单字母变量没在识别结果里按顺序出现的句子标 ⚠；每句都打印差异片段，人工逐句看，需要人工复听或重配。"""
import argparse, difflib, json, os, re, sys
from pathlib import Path
QA = Path(__file__).resolve().parent; EP = QA.parent
G = 'E:/AI/TTS/GPT-SoVITS-v2pro-20261006nvidia50x0'
ap = argparse.ArgumentParser(); ap.add_argument('--src', default='vo'); ap.add_argument('--only', nargs='*'); ap.add_argument('--ep', default=None); a = ap.parse_args()
if a.ep: EP = EP / a.ep   # 分段目录，如 p1
sc = json.loads((EP / 'script.json').read_text(encoding='utf-8'))
ref = {}
for k, v in sc.items(): ref[k] = v[0]
os.chdir(G); sys.path.insert(0, G)
from funasr import AutoModel
from pypinyin import lazy_pinyin
m = AutoModel(model='tools/asr/models/speech_paraformer-large_asr_nat-zh-cn-16k-common-vocab8404-pytorch', disable_update=True, device=os.environ.get('QA_DEVICE', 'cuda'))
EN = {'claude': '克劳德', 'grok': '格洛克', 'gemini': '杰米奈', 'kimi': '基米', 'github': '吉特哈布', 'git': '吉特', 'main': '曼恩', 'push': '普什', 'pull': '普尔', 'pr': '批阿', 'p r': '批阿', 'approve': '阿普鲁夫', 'readme': '瑞德米', 'read me': '瑞德米', 'env': '一恩威', 'mp4': '艾姆批四', 'force': '佛斯', 'h': '艾尺', 'k': '开', 'm': '艾姆', 'n': '恩', 'log': '洛格', 'ln': '艾尔恩'}
def norm(s):
    s = s.lower()
    s = re.sub(r'(?<![a-z])x(?![a-z])', '艾克斯', s); s = re.sub(r'(?<![a-z])y(?![a-z])', '歪', s)
    for e, z in sorted(EN.items(), key=lambda x: -len(x[0])): s = s.replace(e, z)
    s = re.sub(r'[^\w]', '', s)
    return ''.join(lazy_pinyin(s))
out, bad = [], []
for k in sorted(ref):
    if a.only and k not in a.only: continue
    f = EP / a.src / f'{k}.wav'
    if not f.exists(): out.append(f'?? {k} 缺音频'); continue
    t = m.generate(input=str(f))[0]['text'].replace(' ', '')
    r = difflib.SequenceMatcher(None, norm(t), norm(ref[k])).ratio()
    # 逐字母核对：朗读稿里的单字母序列必须在识别结果中按顺序出现（数学变量读错是最常见的事故）
    lt = re.findall(r'[a-z]', re.sub(r'[a-z]{2,}', '', ref[k].lower())); la = re.findall(r'[a-z]', t.lower())
    miss = ''.join(lt) if not lt else ''
    it = iter(la); miss = [c for c in lt if c not in it]
    # 差异片段（无调拼音层面），供人工逐句审
    A, B = norm(t), norm(ref[k]); sm = difflib.SequenceMatcher(None, A, B)
    diff = [f'{B[j1:j2] or "∅"}→{A[i1:i2] or "∅"}' for op, i1, i2, j1, j2 in sm.get_opcodes() if op != 'equal']
    flag = '⚠' if (r < 0.92 or miss) else 'OK'
    out.append(f'{flag} {k} {r:.2f}' + (f' 缺字母 {"".join(miss)}' if miss else '') + f' | ASR: {t} | 稿: {ref[k]}' + (f'\n      差异: {" ".join(diff)}' if diff else ''))
    if flag != 'OK': bad.append(k)
OUTF = (EP / 'qa_asr.txt') if a.ep and '..' in a.ep else (QA / (f'qa_asr_{a.ep}.txt' if a.ep else 'qa_asr.txt'))   # 第 2 章（--ep ../ch2/pN）写到段目录
OUTF.write_text('\n'.join(out) + f'\n\n需人工复听 / 重配：{" ".join(bad) or "无"}\n', encoding='utf-8')
print('lines', len(out), 'flagged', len(bad), bad)
