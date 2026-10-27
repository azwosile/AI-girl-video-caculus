#!/bin/bash
cd /e/AI/AI娘课程/AI娘微积分课/ch2; mkdir -p qa/frames
P=/e/AI/TTS/GPT-SoVITS-v2pro-20261006nvidia50x0/runtime/python.exe
for spec in p3:H01 p3:B02 p4:Z01 p4:R01 p5:T01 p6:L02 p7:N01 p8:X01 p9:C07 p9:D03; do p=${spec%%:*}; id=${spec##*:}
t=$(PYTHONIOENCODING=utf-8 $P -c "import json;tl=json.load(open('$p/web/out/timeline.json',encoding='utf-8'));s=[x for x in tl['seq'] if x['id']=='$id'];print(s[0]['vo']+1.2 if s else 5)")
ffmpeg -loglevel error -y -ss $t -i $p/web/out/preview_720p.mp4 -frames:v 1 -q:v 3 qa/frames/${p}_$id.jpg; echo "$spec $t"; done
