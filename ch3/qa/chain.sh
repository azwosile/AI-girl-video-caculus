#!/bin/bash
# 第 3 章 P0/P1 配音 + 逐句 ASR 串行链（9880 用完即关）
cd /e/AI/AI娘课程/AI娘微积分课/ch1
P=/e/AI/TTS/GPT-SoVITS-v2pro-20261006nvidia50x0/runtime/python.exe; T=/e/AI/TTS/GPT-SoVITS-v2pro-20261006nvidia50x0
export PYTHONIOENCODING=utf-8 QA_DEVICE=cpu ASR_DEV=cpu
Q=../ch3/qa; LOG=$Q/chain.log; : > $LOG
up() { for i in $(seq 1 40); do c=$(curl -s -m 3 -o /dev/null -w "%{http_code}" http://127.0.0.1:$1/); [ "$c" = 404 ] && return 0; sleep 5; done; return 1; }
kill_api() { for pid in $(powershell -c "Get-CimInstance Win32_Process | Where-Object { \$_.CommandLine -match 'api_v2.py' } | ForEach-Object { \$_.ProcessId }" | tr -d "\r"); do taskkill //PID $pid //F > /dev/null 2>&1; done; sleep 5; }
for p in p0 p1; do $P ../ch3/$p/lines_src.py >> $LOG 2>&1; done
(cd $T && runtime/python.exe api_v2.py -a 127.0.0.1 -p 9880 -c GPT_SoVITS/configs/tts_infer.yaml > /e/AI/AI娘课程/AI娘微积分课/ch3/qa/api9880.log 2>&1 &)
up 9880 && echo "9880 up" >> $LOG || { echo "9880 FAIL" >> $LOG; exit 1; }
for p in p0 p1; do $P tts_gen.py --ep ../ch3/$p > $Q/${p}_tts.log 2>&1; echo "$p tts $? $(ls ../ch3/$p/vo | wc -l)" >> $LOG; done
kill_api; echo "9880 stopped" >> $LOG
for p in p0 p1; do $P qa/qa_asr.py --ep ../ch3/$p > $Q/${p}_asr.log 2>&1; echo "$p asr $? $(grep -o 'flagged.*' $Q/${p}_asr.log)" >> $LOG; done
echo ALLDONE >> $LOG
