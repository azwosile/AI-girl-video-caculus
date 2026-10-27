#!/bin/bash
# 改写句重配（9880）→ 停 9880 → 9881 生成豆包台词 → 停 9881 → ASR
cd /e/AI/AI娘课程/AI娘微积分课/ch1
P=/e/AI/TTS/GPT-SoVITS-v2pro-20261006nvidia50x0/runtime/python.exe; T=/e/AI/TTS/GPT-SoVITS-v2pro-20261006nvidia50x0
export PYTHONIOENCODING=utf-8 QA_DEVICE=cpu ASR_DEV=cpu
Q=../ch2/qa; LOG=$Q/regen.log; echo "--- regen2" >> $LOG
up() { for i in $(seq 1 40); do c=$(curl -s -m 3 -o /dev/null -w "%{http_code}" http://127.0.0.1:$1/); [ "$c" = 404 ] && return 0; sleep 5; done; return 1; }
kill_api() { for pid in $(powershell -c "Get-CimInstance Win32_Process | Where-Object { \$_.CommandLine -match 'api_v2.py' } | ForEach-Object { \$_.ProcessId }" | tr -d "\r"); do taskkill //PID $pid //F > /dev/null 2>&1; done; sleep 5; }
gen() { p=$1; shift; $P ../ch2/$p/lines_src.py > /dev/null; $P tts_gen.py --ep ../ch2/$p --only "$@" --force >> $Q/regen_tts.log 2>&1; echo "$p $* $?" >> $LOG; }
(cd $T && runtime/python.exe api_v2.py -a 127.0.0.1 -p 9881 -c GPT_SoVITS/configs/tts_doubao.yaml > /e/AI/AI娘课程/AI娘微积分课/ch1/qa/api9881.log 2>&1 &)
up 9881 && echo "9881 up" >> $LOG || { echo "9881 FAIL" >> $LOG; exit 1; }
gen p3 B01 B02; gen p9 B01 B02 B03 B04 B05
kill_api; echo "9881 stopped" >> $LOG
echo ALLDONE >> $LOG
