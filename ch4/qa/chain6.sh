#!/bin/bash
cd /e/AI/AI娘课程/AI娘微积分课
Q=ch4/qa; L=$Q/chain6.log; : > $L
for i in $(seq 1 600); do grep -q CHAIN5DONE $Q/chain5.log 2>/dev/null && break; sleep 20; done
cp $Q/fulls.log $Q/fulls_chain5.log; echo "chain5 done $(date +%T)" >> $L
bash $Q/batch.sh "" "p12:Z02"; echo "batch $(tail -1 $Q/batch.log) $(date +%T)" >> $L
bash $Q/sheets.sh p12; echo "sheets $(date +%T)" >> $L
bash $Q/fulls.sh p12; echo "fulls $(date +%T)" >> $L
echo CHAIN6DONE >> $L
