# 公用尾部：由各段 lines_src.py exec 调用，写 script.json / web/lines.json / web/lines.js
import json, re
def write(EP, L, tag):
    lines = [dict(id=i, b=b, spk=i[0], pose=p, sub=s, tts=t or s) for i, b, p, s, t in L]
    (EP / 'web').mkdir(exist_ok=True)
    (EP / 'script.json').write_text(json.dumps({l['id']: [l['tts']] for l in lines}, ensure_ascii=False, indent=1), encoding='utf-8')
    (EP / 'web' / 'lines.json').write_text(json.dumps(lines, ensure_ascii=False, indent=1), encoding='utf-8')
    (EP / 'web' / 'lines.js').write_text(f'// 由 ch2/{tag}/lines_src.py 生成的台词表（字幕稿）\nwindow.LINES = ' + json.dumps(lines, ensure_ascii=False) + ';\n', encoding='utf-8')
    n = sum(len(re.findall(r'[\u4e00-\u9fff]', l['tts'])) for l in lines)
    print(len(lines), 'lines', n, '汉字（朗读稿）≈', round(n / 276, 2), 'min 人声 @276')
