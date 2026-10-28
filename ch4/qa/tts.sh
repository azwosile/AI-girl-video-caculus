#!/bin/bash
# 第 4 章通用配音 + ASR 链：tts.sh p2 p3 ...（非豆包句走 9880；豆包 B 句再起 9881；两个接口不同时开）
cd /e/AI/AI娘课程/AI娘微积分课/ch1
P=/e/AI/TTS/GPT-SoVITS-v2pro-20261006nvidia50x0/runtime/python.exe; T=/e/AI/TTS/GPT-SoVITS-v2pro-20261006nvidia50x0
export PYTHONIOENCODING=utf-8 QA_DEVICE=cpu ASR_DEV=cpu
Q=../ch4/qa; LOG=$Q/tts_$(echo "$@" | tr ' ' '_').log; : > $LOG
up() { for i in $(seq 1 40); do c=$(curl -s -m 3 -o /dev/null -w "%{http_code}" http://127.0.0.1:$1/); [ "$c" = 404 ] && return 0; sleep 5; done; return 1; }
kill_api() { for pid in $(powershell -c "Get-CimInstance Win32_Process | Where-Object { \$_.CommandLine -match 'api_v2.py' } | ForEach-Object { \$_.ProcessId }" | tr -d "\r"); do taskkill //PID $pid //F > /dev/null 2>&1; done; sleep 5; }
ids() { $P -c "import json,sys; d=json.load(open('../ch4/$1/script.json',encoding='utf-8')); print(' '.join(k for k in d if (k[0]=='B')==($2==1)))"; }
for p in "$@"; do $P ../ch4/$p/lines_src.py >> $LOG 2>&1; done
(cd $T && runtime/python.exe api_v2.py -a 127.0.0.1 -p 9880 -c GPT_SoVITS/configs/tts_infer.yaml > /e/AI/AI娘课程/AI娘微积分课/ch4/qa/api9880.log 2>&1 &)
up 9880 && echo "9880 up" >> $LOG || { echo "9880 FAIL" >> $LOG; exit 1; }
for p in "$@"; do $P tts_gen.py --ep ../ch4/$p --only $(ids $p 0) > $Q/${p}_tts.log 2>&1; echo "$p tts $?" >> $LOG; done
kill_api; echo "9880 stopped" >> $LOG
NB=0; for p in "$@"; do [ -n "$(ids $p 1)" ] && NB=1; done
if [ $NB = 1 ]; then
  (cd $T && runtime/python.exe api_v2.py -a 127.0.0.1 -p 9881 -c GPT_SoVITS/configs/tts_doubao.yaml > /e/AI/AI娘课程/AI娘微积分课/ch4/qa/api9881.log 2>&1 &)
  up 9881 && echo "9881 up" >> $LOG || { echo "9881 FAIL" >> $LOG; exit 1; }
  for p in "$@"; do B=$(ids $p 1); [ -n "$B" ] && { $P tts_gen.py --ep ../ch4/$p --only $B >> $Q/${p}_tts.log 2>&1; echo "$p B tts $?" >> $LOG; }; done
  kill_api; echo "9881 stopped" >> $LOG
fi
for p in "$@"; do echo "$p vo $(ls ../ch4/$p/vo | wc -l)" >> $LOG; $P qa/qa_asr.py --ep ../ch4/$p > $Q/${p}_asr.log 2>&1; echo "$p asr $? $(grep -o 'flagged.*' $Q/${p}_asr.log)" >> $LOG; done
echo ALLDONE >> $LOG
