#!/bin/bash
# 第 3 章 P0/P1 补配：ASR 有吞字的句子换种子重配，逐个打分
cd /e/AI/AI娘课程/AI娘微积分课/ch1
P=/e/AI/TTS/GPT-SoVITS-v2pro-20261006nvidia50x0/runtime/python.exe; T=/e/AI/TTS/GPT-SoVITS-v2pro-20261006nvidia50x0
export PYTHONIOENCODING=utf-8 QA_DEVICE=cpu ASR_DEV=cpu
Q=../ch3/qa; LOG=$Q/regen.log; : > $LOG
up() { for i in $(seq 1 40); do c=$(curl -s -m 3 -o /dev/null -w "%{http_code}" http://127.0.0.1:$1/); [ "$c" = 404 ] && return 0; sleep 5; done; return 1; }
kill_api() { for pid in $(powershell -c "Get-CimInstance Win32_Process | Where-Object { \$_.CommandLine -match 'api_v2.py' } | ForEach-Object { \$_.ProcessId }" | tr -d "\r"); do taskkill //PID $pid //F > /dev/null 2>&1; done; sleep 5; }
(cd $T && runtime/python.exe api_v2.py -a 127.0.0.1 -p 9880 -c GPT_SoVITS/configs/tts_infer.yaml > /e/AI/AI娘课程/AI娘微积分课/ch3/qa/api9880.log 2>&1 &)
up 9880 && echo "9880 up" >> $LOG || { echo "9880 FAIL" >> $LOG; exit 1; }
P0IDS="G02"; P1IDS="C02 C11 K04 G02 K05 K02"
for s in 7 99 2026; do
  $P tts_gen.py --ep ../ch3/p0 --only $P0IDS --force --seed $s --out vo_try$s >> $Q/regen_tts.log 2>&1
  $P tts_gen.py --ep ../ch3/p1 --only $P1IDS --force --seed $s --out vo_try$s >> $Q/regen_tts.log 2>&1
  echo "tts s$s $?" >> $LOG
done
kill_api; echo "9880 stopped" >> $LOG
$P tools/asr_try.py ../ch3/p0 $P0IDS --seeds 7 99 2026 2>/dev/null | grep seed >> $LOG
$P tools/asr_try.py ../ch3/p1 $P1IDS --seeds 7 99 2026 2>/dev/null | grep seed >> $LOG
echo ALLDONE >> $LOG
