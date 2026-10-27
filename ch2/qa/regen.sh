#!/bin/bash
# 改写句重配（9880）→ 停 9880 → 9881 生成豆包台词 → 停 9881 → ASR
cd /e/AI/AI娘课程/AI娘微积分课/ch1
P=/e/AI/TTS/GPT-SoVITS-v2pro-20261006nvidia50x0/runtime/python.exe; T=/e/AI/TTS/GPT-SoVITS-v2pro-20261006nvidia50x0
export PYTHONIOENCODING=utf-8 QA_DEVICE=cpu ASR_DEV=cpu
Q=../ch2/qa; LOG=$Q/regen.log; : > $LOG
up() { for i in $(seq 1 40); do c=$(curl -s -m 3 -o /dev/null -w "%{http_code}" http://127.0.0.1:$1/); [ "$c" = 404 ] && return 0; sleep 5; done; return 1; }
kill_api() { for pid in $(powershell -c "Get-CimInstance Win32_Process | Where-Object { \$_.CommandLine -match 'api_v2.py' } | ForEach-Object { \$_.ProcessId }"); do taskkill //PID $pid //F > /dev/null 2>&1; done; sleep 5; }
(cd $T && runtime/python.exe api_v2.py -a 127.0.0.1 -p 9880 -c GPT_SoVITS/configs/tts_infer.yaml > /e/AI/AI娘课程/AI娘微积分课/ch1/qa/api9880.log 2>&1 &)
up 9880 && echo "9880 up" >> $LOG || { echo "9880 FAIL" >> $LOG; exit 1; }
gen() { p=$1; shift; $P ../ch2/$p/lines_src.py > /dev/null; $P tts_gen.py --ep ../ch2/$p --only "$@" --force >> $Q/regen_tts.log 2>&1; echo "$p $* $?" >> $LOG; }
gen p2 M01; gen p3 C11 C13; gen p5 C07 C08; gen p6 C04 C11; gen p8 C01 C10
for S in 7 99; do $P tts_gen.py --ep ../ch2/p4 --only C08 --force --seed $S --out vo_try$S >> $Q/regen_tts.log 2>&1; done; echo "p4 C08 tries" >> $LOG
kill_api; echo "9880 stopped" >> $LOG
(cd $T && runtime/python.exe api_v2.py -a 127.0.0.1 -p 9881 -c GPT_SoVITS/configs/tts_doubao.yaml > /e/AI/AI娘课程/AI娘微积分课/ch1/qa/api9881.log 2>&1 &)
up 9881 && echo "9881 up" >> $LOG || { echo "9881 FAIL" >> $LOG; exit 1; }
gen p3 B01 B02; gen p9 B01 B02 B03 B04 B05
kill_api; echo "9881 stopped" >> $LOG
for p in p2 p3 p5 p6 p8 p9; do $P qa/qa_asr.py --ep ../ch2/$p > $Q/${p}_asr2.log 2>&1; echo "asr $p $? $(grep -o 'flagged.*' $Q/${p}_asr2.log)" >> $LOG; done
$P tools/asr_try.py ../ch2/p4 C08 --seeds 7 99 > $Q/p4_retry.log 2>&1; echo "asr p4 try $?" >> $LOG
echo ALLDONE >> $LOG
