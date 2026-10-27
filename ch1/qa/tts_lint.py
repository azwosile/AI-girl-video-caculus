# -*- coding: utf-8 -*-
"""朗读稿逐句审核（配音前必跑）：python qa/tts_lint.py --ep p2
规则（制作规范 4.3）：
  E1 朗读稿里不许出现数学符号 / 上下标 / 括号公式（= + − × ÷ · / ^ √ ≤ ≥ ≠ ∈ ∀ ∃ ( ) [ ] { } | ² ³ ⁿ 等）——必须写成中文读法
  E2 不许出现多字母英文单词（专名用中文谐音写，见 EN_OK 白名单）；单个字母可以，但要和前后字用空格隔开
  E3 句首 / 逗号后的单字母 a、o、e（会读成 啊 哦 呃，如“a 倍的”→“阿倍的”）→ 改语序
  W1 多音字提醒：长 重 行 调 还 得 只 数 处 应 差 传 降 空 种 为 乐 量 便 —— 列出后人工确认语境
  W2 句中含单字母 a / o / e，ASR 核对时重点听
  W3 单句朗读稿超过 60 字（建议拆句）
输出 qa/tts_lint_<ep>.txt，并打印 E 类错误数；E>0 时退出码 1。"""
import argparse, json, re, sys
from pathlib import Path
QA = Path(__file__).resolve().parent; ROOT = QA.parent
ap = argparse.ArgumentParser(); ap.add_argument('--ep', required=True); a = ap.parse_args()
sc = json.loads((ROOT / a.ep / 'script.json').read_text(encoding='utf-8'))
SYM = set('=+−-×÷·/^√≤≥≠∈∉∀∃()[]{}|²³⁰¹⁴⁵⁶⁷⁸⁹ⁿᵐ₀₁₂₃<>∞∪∩⊂⊆→↦⇒⇔′%*&#@~`_')
POLY = '长重行调还得只处差传降空乐量便'
SAFE = ['增长', '成长', '生长', '还有', '还要', '还是', '还能', '还在', '只有', '只要', '只看', '只是', '只能', '只在', '运行', '进行', '平行', '可行', '行为', '重新', '重要', '重复', '处理', '到处', '处处', '差不多', '空集', '量词', '方便', '便于', '降低', '得到', '得出', '记得', '觉得', '使得', '取得', '值得', '懂得', '变得', '音乐', '只关心', '不行', '单调', '就行', '强调', '说得清', '经得起']
EN_OK = set()
out, nE = [], 0
for k in sorted(sc):
    t = sc[k][0]; msg = []
    bad = sorted({c for c in t if c in SYM})
    if bad: msg.append('E1 符号 ' + ' '.join(bad))
    words = re.findall(r'[A-Za-z]{2,}', t)
    words = [w for w in words if w.lower() not in EN_OK]
    if words: msg.append('E2 英文词 ' + ' '.join(words))
    for m in re.finditer(r'(?<![A-Za-z ])[A-Za-z](?=[\u4e00-\u9fff])|(?<=[\u4e00-\u9fff])[A-Za-z](?![A-Za-z ])', t):
        msg.append(f'E2 字母未隔开 “{t[max(0, m.start() - 2):m.end() + 2]}”')
    if re.match(r'^\s*[aoeAOE]\s', t) or re.search(r'[。！？；，：]\s*[aoeAOE]\s', t): msg.append('E3 句首/句读后单字母 a/o/e（会读成 啊/哦/呃）')
    elif re.search(r'(?<![A-Za-z])[aoe](?![A-Za-z])', t): msg.append('W2 含单字母 a/o/e，确认没被读成语气词')
    t2 = t
    for w in SAFE: t2 = t2.replace(w, '')
    p = [c for c in t2 if c in POLY]
    if p: msg.append('W1 多音字 ' + ''.join(dict.fromkeys(p)))
    n = len(re.findall(r'[\u4e00-\u9fff]', t))
    if n > 60: msg.append(f'W3 {n} 字，建议拆句')
    e = sum(1 for m_ in msg if m_.startswith('E')); nE += e
    out.append(f"{'ERR' if e else ('warn' if msg else 'ok  ')} {k} | {t}" + (('\n      ' + '；'.join(msg)) if msg else ''))
(QA / f'tts_lint_{a.ep}.txt').write_text('\n'.join(out) + f'\n\nE 类错误：{nE}\n', encoding='utf-8')
print('\n'.join(o for o in out if not o.startswith('ok')))
print('lines', len(sc), 'E', nE)
sys.exit(1 if nE else 0)
