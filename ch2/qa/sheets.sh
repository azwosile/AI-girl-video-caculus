#!/bin/bash
R=/e/AI/AI娘课程/AI娘微积分课/ch2; L=$R/qa/build.log; echo "--- sheets $(date +%T)" >> $L
for p in "$@"; do cd $R/$p/web && bash build.sh --sheet > out_sheet.log 2>&1; echo "$p sheet $? $(grep -o 'total.*' out_sheet.log) $(date +%T)" >> $L; done
echo SHEETSDONE >> $L
