#!/bin/bash
cd /e/AI/AI娘课程/AI娘微积分课/ch1
P=/e/AI/TTS/GPT-SoVITS-v2pro-20261006nvidia50x0/runtime/python.exe; T=/e/AI/TTS/GPT-SoVITS-v2pro-20261006nvidia50x0
export PYTHONIOENCODING=utf-8
Q=../ch2/qa; LOG=$Q/regen.log; echo "--- regen3" >> $LOG
up() { for i in $(seq 1 40); do c=$(curl -s -m 3 -o /dev/null -w "%{http_code}" http://127.0.0.1:$1/); [ "$c" = 404 ] && return 0; sleep 5; done; return 1; }
kill_api() { for pid in $(powershell -c "Get-CimInstance Win32_Process | Where-Object { \$_.CommandLine -match 'api_v2.py' } | ForEach-Object { \$_.ProcessId }" | tr -d "\r"); do taskkill //PID $pid //F > /dev/null 2>&1; done; for i in $(seq 1 30); do m=$(nvidia-smi --query-gpu=memory.used --format=csv,noheader,nounits | tr -d "\r "); [ "$m" -lt 600 ] && break; sleep 3; done; echo "vram $m" >> $LOG; }
tries() { p=$1; shift; $P ../ch2/$p/lines_src.py > /dev/null; for s in 7 99 2026; do $P tts_gen.py --ep ../ch2/$p --only "$@" --force --seed $s --out vo_try$s >> $Q/regen_tts.log 2>&1; echo "$p $* s$s $?" >> $LOG; done; }
for p in p3 p5 p6; do $P ../ch2/$p/lines_src.py > /dev/null; done
(cd $T && runtime/python.exe api_v2.py -a 127.0.0.1 -p 9880 -c GPT_SoVITS/configs/tts_infer.yaml > /e/AI/AI娘课程/AI娘微积分课/ch1/qa/api9880.log 2>&1 &)
up 9880 && echo "9880 up" >> $LOG || { echo "9880 FAIL" >> $LOG; exit 1; }
tries p3 C11; tries p5 C08; tries p6 C04
kill_api; echo "9880 stopped" >> $LOG
(cd $T && runtime/python.exe api_v2.py -a 127.0.0.1 -p 9881 -c GPT_SoVITS/configs/tts_doubao.yaml > /e/AI/AI娘课程/AI娘微积分课/ch1/qa/api9881.log 2>&1 &)
up 9881 && echo "9881 up" >> $LOG || { echo "9881 FAIL" >> $LOG; kill_api; exit 1; }
tries p3 B02
kill_api; echo "9881 stopped" >> $LOG; echo ALLDONE3 >> $LOG
