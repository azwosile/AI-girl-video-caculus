#!/bin/bash
R=/e/AI/AI娘课程/AI娘微积分课/ch2; L=$R/qa/build.log; echo "--- fulls2 $(date +%T)" >> $L
for p in "$@"; do cd $R/$p/web && bash build.sh --sheet > out_sheet.log 2>&1 && SKIP_PREP=1 bash build.sh > out_full.log 2>&1; echo "$p full $? $(grep -o 'total [0-9.]* s' out_sheet.log) $(grep -o 'mix.*' out_full.log) $(date +%T)" >> $L; done
echo FULLSDONE >> $L
