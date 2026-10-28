#!/bin/bash
# 第 3 章补配 2：采用种子 7 的句子 → vo；P1 C02 / K04 改稿后重配
cd /e/AI/AI娘课程/AI娘微积分课/ch1
P=/e/AI/TTS/GPT-SoVITS-v2pro-20261006nvidia50x0/runtime/python.exe; T=/e/AI/TTS/GPT-SoVITS-v2pro-20261006nvidia50x0
export PYTHONIOENCODING=utf-8 QA_DEVICE=cpu ASR_DEV=cpu
Q=../ch3/qa; LOG=$Q/regen2.log; : > $LOG
up() { for i in $(seq 1 40); do c=$(curl -s -m 3 -o /dev/null -w "%{http_code}" http://127.0.0.1:$1/); [ "$c" = 404 ] && return 0; sleep 5; done; return 1; }
kill_api() { for pid in $(powershell -c "Get-CimInstance Win32_Process | Where-Object { \$_.CommandLine -match 'api_v2.py' } | ForEach-Object { \$_.ProcessId }" | tr -d "\r"); do taskkill //PID $pid //F > /dev/null 2>&1; done; sleep 5; }
cp ../ch3/p0/vo_try7/G02.wav ../ch3/p0/vo/G02.wav
for u in C11 G02 K05 K02; do cp ../ch3/p1/vo_try7/$u.wav ../ch3/p1/vo/$u.wav; done
echo '{"G02": {"seed": 7}}' > ../ch3/p0/tts_override.json
echo '{"C11": {"seed": 7}, "G02": {"seed": 7}, "K05": {"seed": 7}, "K02": {"seed": 7}}' > ../ch3/p1/tts_override.json
$P ../ch3/p1/lines_src.py >> $LOG 2>&1
(cd $T && runtime/python.exe api_v2.py -a 127.0.0.1 -p 9880 -c GPT_SoVITS/configs/tts_infer.yaml > /e/AI/AI娘课程/AI娘微积分课/ch3/qa/api9880.log 2>&1 &)
up 9880 && echo "9880 up" >> $LOG || { echo "9880 FAIL" >> $LOG; exit 1; }
for s in 1234 7 2026; do $P tts_gen.py --ep ../ch3/p1 --only C02 K04 --force --seed $s --out vo_try$s >> $Q/regen_tts.log 2>&1; echo "tts s$s $?" >> $LOG; done
kill_api; echo "9880 stopped" >> $LOG
$P tools/asr_try.py ../ch3/p1 C02 K04 --seeds 1234 7 2026 2>/dev/null | grep seed >> $LOG
echo ALLDONE >> $LOG
