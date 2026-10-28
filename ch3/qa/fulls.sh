#!/bin/bash
# 第 3 章：整段出片（串行）
cd /e/AI/AI娘课程/AI娘微积分课/ch3
LOG=qa/fulls.log; : > $LOG
for p in "$@"; do (cd $p/web && SKIP_PREP=1 bash build.sh > ../../qa/${p}_full.log 2>&1); echo "$p full $? $(ls $p/web/out/*.mp4 2>/dev/null | tr '\n' ' ')" >> $LOG; done
echo ALLDONE >> $LOG
