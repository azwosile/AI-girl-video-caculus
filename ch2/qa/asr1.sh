#!/bin/bash
# 单段 ASR（CPU）：asr1.sh pN [ids...]；有 ids 时跑 asr_try 的种子比对
cd /e/AI/AI娘课程/AI娘微积分课/ch1
P=/e/AI/TTS/GPT-SoVITS-v2pro-20261006nvidia50x0/runtime/python.exe
export PYTHONIOENCODING=utf-8 QA_DEVICE=cpu ASR_DEV=cpu
p=$1; shift; Q=../ch2/qa
if [ -n "$1" ]; then $P tools/asr_try.py ../ch2/$p "$@" > $Q/${p}_retry.log 2>&1; echo "EXIT $?" >> $Q/${p}_retry.log
else $P qa/qa_asr.py --ep ../ch2/$p > $Q/${p}_asr.log 2>&1; echo "EXIT $?" >> $Q/${p}_asr.log; fi
