#!/bin/bash
cd /e/AI/AI娘课程/AI娘微积分课/ch3
pick() { p=$1; shift; for kv in "$@"; do id=${kv%=*}; s=${kv#*=}; cp -f $p/vo_try$s/$id.wav $p/vo/$id.wav && echo "$p $id <- s$s"; done
  PYTHONIOENCODING=utf-8 /e/AI/TTS/GPT-SoVITS-v2pro-20261006nvidia50x0/runtime/python.exe -c "
import json,os,sys; p='E:/AI/AI娘课程/AI娘微积分课/ch3/$p/tts_override.json'
d=json.load(open(p,encoding='utf-8')) if os.path.exists(p) else {}
for kv in sys.argv[1:]: i,s=kv.split('='); d[i]={'seed':int(s)}
json.dump(d,open(p,'w',encoding='utf-8')); print(d)" "$@"; }
pick p5 C02=7 C04=7 R01=7 R02=7
pick p6 C03=42 C10=2026 Z02=42
pick p8 C04=7 D03=7
pick p9 C01=7 C04=7 G01=7 G02=2026
