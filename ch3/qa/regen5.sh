#!/bin/bash
# 第 3 章 P5–P10 补配：ASR 吞字/改稿的句子，三个种子试配
cd /e/AI/AI娘课程/AI娘微积分课/ch1
P=/e/AI/TTS/GPT-SoVITS-v2pro-20261006nvidia50x0/runtime/python.exe; T=/e/AI/TTS/GPT-SoVITS-v2pro-20261006nvidia50x0
export PYTHONIOENCODING=utf-8 QA_DEVICE=cpu ASR_DEV=cpu
Q=../ch3/qa; LOG=$Q/regen5.log; : > $LOG
up() { for i in $(seq 1 40); do c=$(curl -s -m 3 -o /dev/null -w "%{http_code}" http://127.0.0.1:$1/); [ "$c" = 404 ] && return 0; sleep 5; done; return 1; }
kill_api() { for pid in $(powershell -c "Get-CimInstance Win32_Process | Where-Object { \$_.CommandLine -match 'api_v2.py' } | ForEach-Object { \$_.ProcessId }" | tr -d "\r"); do taskkill //PID $pid //F > /dev/null 2>&1; done; sleep 5; }
for p in p5 p6 p8 p9 p10; do $P ../ch3/$p/lines_src.py >> $LOG 2>&1; done
declare -A IDS=([p5]="C02 C04 R01 R02" [p6]="C03 C10 Z02" [p8]="C04 D03" [p9]="C01 C04 G01 G02" [p10]="X03")
(cd $T && runtime/python.exe api_v2.py -a 127.0.0.1 -p 9880 -c GPT_SoVITS/configs/tts_infer.yaml > /e/AI/AI娘课程/AI娘微积分课/ch3/qa/api9880.log 2>&1 &)
up 9880 && echo "9880 up" >> $LOG || { echo "9880 FAIL" >> $LOG; exit 1; }
for s in 7 42 2026; do for p in p5 p6 p8 p9 p10; do $P tts_gen.py --ep ../ch3/$p --only ${IDS[$p]} --force --seed $s --out vo_try$s >> $Q/regen_tts.log 2>&1; done; echo "tts s$s $?" >> $LOG; done
kill_api; echo "9880 stopped" >> $LOG
for p in p5 p6 p8 p9 p10; do echo "== $p" >> $LOG; $P tools/asr_try.py ../ch3/$p ${IDS[$p]} --seeds 7 42 2026 2>/dev/null | grep seed >> $LOG; done
echo ALLDONE >> $LOG
