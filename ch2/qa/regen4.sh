#!/bin/bash
cd /e/AI/AI娘课程/AI娘微积分课/ch1
P=/e/AI/TTS/GPT-SoVITS-v2pro-20261006nvidia50x0/runtime/python.exe; T=/e/AI/TTS/GPT-SoVITS-v2pro-20261006nvidia50x0
export PYTHONIOENCODING=utf-8
Q=../ch2/qa; LOG=$Q/regen.log; echo "--- regen4" >> $LOG
cp ../ch2/p3/vo_try7/B02.wav ../ch2/p3/vo/B02.wav; cp ../ch2/p5/vo_try99/C08.wav ../ch2/p5/vo/C08.wav; cp ../ch2/p6/vo_try2026/C04.wav ../ch2/p6/vo/C04.wav; echo "copied $?" >> $LOG
up() { for i in $(seq 1 40); do c=$(curl -s -m 3 -o /dev/null -w "%{http_code}" http://127.0.0.1:$1/); [ "$c" = 404 ] && return 0; sleep 5; done; return 1; }
kill_api() { for pid in $(powershell -c "Get-CimInstance Win32_Process | Where-Object { \$_.CommandLine -match 'api_v2.py' } | ForEach-Object { \$_.ProcessId }" | tr -d "\r"); do taskkill //PID $pid //F > /dev/null 2>&1; done; sleep 5; }
$P ../ch2/p3/lines_src.py > /dev/null
(cd $T && runtime/python.exe api_v2.py -a 127.0.0.1 -p 9880 -c GPT_SoVITS/configs/tts_infer.yaml > /e/AI/AI娘课程/AI娘微积分课/ch1/qa/api9880.log 2>&1 &)
up 9880 && echo "9880 up" >> $LOG || { echo "9880 FAIL" >> $LOG; exit 1; }
for s in 7 99 2026; do $P tts_gen.py --ep ../ch2/p3 --only C11 --force --seed $s --out vo_try$s >> $Q/regen_tts.log 2>&1; echo "p3 C11 s$s $?" >> $LOG; done
kill_api; echo "9880 stopped" >> $LOG; echo ALLDONE4 >> $LOG
