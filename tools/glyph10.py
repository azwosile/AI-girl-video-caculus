# 从得意黑（SmileySans）读取字形轮廓控制点，导出 JSON（只取点，不嵌入字体）
import json, sys
from fontTools.ttLib import TTFont
from fontTools.pens.recordingPen import RecordingPen
f = TTFont('ch10/web/fonts/SmileySans-Oblique.ttf.woff2')
gs = f.getGlyphSet(); cmap = f.getBestCmap(); upm = f['head'].unitsPerEm
print('upm', upm, 'tables', sorted(f.keys())[:30], 'glyf' in f, 'CFF ' in f)
out = {}
for ch in '曲鲸线OS':
    g = gs[cmap[ord(ch)]]; p = RecordingPen(); g.draw(p)
    out[ch] = {'adv': g.width, 'ops': [[op, [list(map(lambda v: round(v, 1), pt)) for pt in pts]] for op, pts in p.value]}
    from collections import Counter; print(ch, g.width, Counter(op for op, _ in p.value))
json.dump({'upm': upm, 'g': out}, open('ch10/shared/glyphs10.json', 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
