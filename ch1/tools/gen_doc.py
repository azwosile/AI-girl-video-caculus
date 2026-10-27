# -*- coding: utf-8 -*-
"""文稿逐句表从 lines.json 生成/刷新（制作规范 7：每次迭代翻新文档）。
用法：
  python tools/gen_doc.py --ep p2 --doc <文稿.md>            # 刷新已有文稿：角色/字幕稿/朗读稿三栏以 lines.json 为准，保留画面与音效栏
  python tools/gen_doc.py --ep p2 --doc <文稿.md> --notes pN/doc_notes.json --new   # 新建：head + 分块表格 + tail
doc_notes.json：{"head": md, "blocks": {"b": "标题"}, "rows": {"ID": ["画面", "音效"]}, "tail": md}
"""
import argparse, json, re, sys
from pathlib import Path
CH1 = Path(__file__).resolve().parents[1]
NAME = {'C': 'Claude小姐', 'G': 'GPT', 'D': '大肥鱼', 'Q': '千问', 'M': 'Gemini', 'K': 'Kimi', 'X': 'Grok', 'B': '豆包'}
ap = argparse.ArgumentParser(); ap.add_argument('--ep', required=True); ap.add_argument('--doc', required=True); ap.add_argument('--notes'); ap.add_argument('--new', action='store_true'); a = ap.parse_args()
L = json.loads((CH1 / a.ep / 'web' / 'lines.json').read_text(encoding='utf-8'))
esc = lambda s: (s or '').replace('|', '\\|')
def cells(l):
    tts = '' if l['tts'] == l['sub'] else l['tts']
    return [l['id'], f"{NAME[l['id'][0]]} · `{l['pose']}`", esc(l['sub']), esc(tts)]
doc = Path(a.doc)
if a.new:
    N = json.loads(Path(a.notes).read_text(encoding='utf-8'))
    out = [N['head'].rstrip(), '', '## 逐句文稿', '', '“朗读稿”一栏留空表示与字幕相同；朗读稿送 TTS，字幕稿上屏。本表由 `ch1/tools/gen_doc.py` 从 `lines.json` 生成。', '']
    cur = None
    for l in L:
        if l['b'] != cur:
            cur = l['b']; out += ['', f"### 块 `{cur}`｜{N['blocks'].get(cur, cur)}", '', '| ID | 角色 · 表情 | 字幕稿 | 朗读稿 | 画面 / 动效 | 音效 |', '|---|---|---|---|---|---|']
        v, s = N['rows'].get(l['id'], ['', ''])
        out.append('| ' + ' | '.join(cells(l) + [esc(v), esc(s)]) + ' |')
    out += ['', N['tail'].rstrip(), '']
    doc.write_text('\n'.join(out), encoding='utf-8'); print('new', doc, len(L), 'rows'); sys.exit()
txt = doc.read_text(encoding='utf-8').split('\n'); byid = {l['id']: l for l in L}; seen = set(); n = 0
for i, row in enumerate(txt):
    m = re.match(r'^\| ([A-Z]\d\d) \|', row)
    if not m or m.group(1) not in byid: continue
    parts = re.split(r'(?<!\\)\|', row)[1:-1]
    if len(parts) < 6: continue
    new = cells(byid[m.group(1)]) + [p.strip() for p in parts[4:]]
    txt[i] = '| ' + ' | '.join(new) + ' |'; seen.add(m.group(1)); n += 1
doc.write_text('\n'.join(txt), encoding='utf-8')
miss = [l['id'] for l in L if l['id'] not in seen]
print('refreshed', n, 'rows', '缺行:' if miss else '', ' '.join(miss))
