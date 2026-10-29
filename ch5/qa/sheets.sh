#!/bin/bash
# 第 5 章：联系表（含 prep 测时长）
cd /e/AI/AI娘课程/AI娘微积分课/ch5
LOG=qa/sheets.log; : > $LOG
for p in "$@"; do (cd $p/web && bash build.sh --sheet > ../../qa/${p}_sheet.log 2>&1); echo "$p sheet $?" >> $LOG; done
echo ALLDONE >> $LOG
