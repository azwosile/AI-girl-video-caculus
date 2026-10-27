#!/bin/bash
# ch2 P2–P9 配音 + ASR 串行链（不含豆包 B 台词）
cd /e/AI/AI娘课程/AI娘微积分课/ch1
P=/e/AI/TTS/GPT-SoVITS-v2pro-20261006nvidia50x0/runtime/python.exe
export PYTHONIOENCODING=utf-8 QA_DEVICE=cpu ASR_DEV=cpu
Q=../ch2/qa; LOG=$Q/chain.log; : > $LOG
for S in 7 99 2026; do $P tts_gen.py --ep ../ch2/p2 --only C13 G02 M01 --force --seed $S --out vo_try$S > $Q/p2_try$S.log 2>&1; echo "p2 try$S $?" >> $LOG; done
for p in p3 p4 p5 p6 p7 p8 p9; do
  $P ../ch2/$p/lines_src.py > /dev/null
  case $p in
    p3) ONLY="--only D01 C01 C02 C03 C04 D02 C05 C06 C07 H01 C08 H02 C09 C10 D03 C11 C12 C13 H03 C14 C15";;
    p9) ONLY="--only C01 D01 D02 C02 C03 C04 D03 C05 C06 D04";;
    *) ONLY="";;
  esac
  $P tts_gen.py --ep ../ch2/$p $ONLY > $Q/${p}_tts.log 2>&1; echo "$p tts $? $(ls ../ch2/$p/vo | wc -l)" >> $LOG
done
$P tools/asr_try.py ../ch2/p2 C13 G02 M01 --seeds 7 99 2026 > $Q/p2_retry.log 2>&1; echo "p2 retry asr $?" >> $LOG
for p in p3 p4 p5 p6 p7 p8 p9; do $P qa/qa_asr.py --ep ../ch2/$p > $Q/${p}_asr.log 2>&1; echo "$p asr $? $(grep -o 'flagged.*' $Q/${p}_asr.log)" >> $LOG; done
echo ALLDONE >> $LOG
