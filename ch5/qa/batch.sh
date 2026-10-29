#!/bin/bash
# 第 5 章批处理：batch.sh "p3 p4 p5" "p1:C04 p2:C10" —— 新段整段配音 + 旧段问题句强制补配（同一次 9880），豆包句另起 9881，最后逐段 ASR
cd /e/AI/AI娘课程/AI娘微积分课/ch1
P=/e/AI/TTS/GPT-SoVITS-v2pro-20261006nvidia50x0/runtime/python.exe; T=/e/AI/TTS/GPT-SoVITS-v2pro-20261006nvidia50x0
export PYTHONIOENCODING=utf-8 QA_DEVICE=cpu ASR_DEV=cpu
Q=../ch5/qa; LOG=$Q/batch.log; : > $LOG
NEW="$1"; FIX="$2"
up() { for i in $(seq 1 40); do c=$(curl -s -m 3 -o /dev/null -w "%{http_code}" http://127.0.0.1:$1/); [ "$c" = 404 ] && return 0; sleep 5; done; return 1; }
kill_api() { for pid in $(powershell -c "Get-CimInstance Win32_Process | Where-Object { \$_.CommandLine -match 'api_v2.py' } | ForEach-Object { \$_.ProcessId }" | tr -d "\r"); do taskkill //PID $pid //F > /dev/null 2>&1; done; sleep 5; }
ids() { $P -c "import json,sys; d=json.load(open('../ch5/$1/script.json',encoding='utf-8')); print(' '.join(k for k in d if (k[0]=='B')==($2==1)))"; }
declare -A FX; for pr in $FIX; do FX[${pr%%:*}]="${FX[${pr%%:*}]} ${pr#*:}"; done
ALL=$(echo $NEW ${!FX[@]} | tr ' ' '\n' | sort -u | tr '\n' ' ')
for p in $ALL; do $P ../ch5/$p/lines_src.py >> $LOG 2>&1; done
run_phase() {  # $1 = 0 普通 / 1 豆包
  for p in $NEW; do I=$(ids $p $1); [ -n "$I" ] && { $P tts_gen.py --ep ../ch5/$p --only $I >> $Q/${p}_tts.log 2>&1; echo "$p tts[$1] $?" >> $LOG; }; done
  for p in ${!FX[@]}; do I=""; for k in ${FX[$p]}; do if [ $1 = 1 ]; then [ "${k:0:1}" = B ] && I="$I $k"; else [ "${k:0:1}" != B ] && I="$I $k"; fi; done
    [ -n "$I" ] && { $P tts_gen.py --ep ../ch5/$p --only $I --force >> $Q/${p}_tts.log 2>&1; echo "$p fix[$1]$I $?" >> $LOG; }; done
}
(cd $T && runtime/python.exe api_v2.py -a 127.0.0.1 -p 9880 -c GPT_SoVITS/configs/tts_infer.yaml > /e/AI/AI娘课程/AI娘微积分课/ch5/qa/api9880.log 2>&1 &)
up 9880 && echo "9880 up" >> $LOG || { echo "9880 FAIL" >> $LOG; kill_api; exit 1; }
run_phase 0; kill_api; echo "9880 stopped" >> $LOG
NB=0; for p in $NEW; do [ -n "$(ids $p 1)" ] && NB=1; done; for pr in $FIX; do case "${pr#*:}" in B*) NB=1;; esac; done
if [ $NB = 1 ]; then
  (cd $T && runtime/python.exe api_v2.py -a 127.0.0.1 -p 9881 -c GPT_SoVITS/configs/tts_doubao.yaml > /e/AI/AI娘课程/AI娘微积分课/ch5/qa/api9881.log 2>&1 &)
  up 9881 && echo "9881 up" >> $LOG || { echo "9881 FAIL" >> $LOG; kill_api; exit 1; }
  run_phase 1; kill_api; echo "9881 stopped" >> $LOG
fi
for p in $ALL; do echo "$p vo $(ls ../ch5/$p/vo | wc -l)" >> $LOG; $P qa/qa_asr.py --ep ../ch5/$p > $Q/${p}_asr.log 2>&1; echo "$p asr $? $(grep -o 'flagged.*' $Q/${p}_asr.log)" >> $LOG; done
echo ALLDONE >> $LOG
