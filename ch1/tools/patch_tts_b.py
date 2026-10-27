# -*- coding: utf-8 -*-
# 给 tts_gen.py 加豆包（B）声线：自训练 GPT-SoVITS 模型，走 9881 端口（tts_doubao.yaml），参数同 Git 课 ep3/tts_doubao.py
from pathlib import Path
p = Path(__file__).resolve().parents[1] / 'tts_gen.py'; s = p.read_text(encoding='utf-8')
if 'API_B' in s: raise SystemExit('already patched')
s = s.replace("API = 'http://127.0.0.1:9880/tts'\n",
"API = 'http://127.0.0.1:9880/tts'\n"
"# 豆包（B）：自训练模型（doubao-e15.ckpt + doubao_e10_s250.pth），需单独起 9881：api_v2.py -p 9881 -c GPT_SoVITS/configs/tts_doubao.yaml\n"
"# 9880 与 9881 不能同时开（显存）；参数同 Git 课 ep3/tts_doubao.py（参考 r19）\n"
"API_B = 'http://127.0.0.1:9881/tts'\n"
"B_REF = ('E:/AI/TTS/doubao_train/sliced/raw_vocals.wav_0004232320_0004344320.wav', '休闲时的聊天陪伴，都可以为你提供帮助。')\n", 1)
s = s.replace("    k = uid[0]\n    if k == 'G':",
"    k = uid[0]\n"
"    if k == 'B':\n"
"        ov = OVERRIDE.get(uid, {})\n"
"        return dict(text=text, text_lang='zh', ref_audio_path=B_REF[0], prompt_text=B_REF[1], prompt_lang='zh',\n"
"                    text_split_method='cut5', speed_factor=1.0, seed=ov.get('seed', SEED), top_k=15, top_p=1.0,\n"
"                    temperature=1.0, repetition_penalty=1.35, media_type='wav', batch_size=1)\n"
"    if k == 'G':", 1)
s = s.replace("req = urllib.request.Request(API, json.dumps(b)", "req = urllib.request.Request(API_B if u[0] == 'B' else API, json.dumps(b)", 1)
assert s.count('API_B') == 2
p.write_text(s, encoding='utf-8'); print('patched')
