#!/bin/bash
cd /e/AI/AI娘课程/AI娘微积分课
Q=ch4/qa; L=$Q/chain5.log; : > $L
for i in $(seq 1 600); do grep -q CHAIN4DONE $Q/chain4.log 2>/dev/null && break; sleep 20; done
cp $Q/fulls.log $Q/fulls_chain4.log; echo "chain4 done $(date +%T)" >> $L
bash $Q/batch.sh "" "p11:D01 p11:G01 p12:Z02"; echo "batch $(tail -1 $Q/batch.log) $(date +%T)" >> $L
bash $Q/sheets.sh p11 p12; echo "sheets $(date +%T)" >> $L
bash $Q/fulls.sh p11 p12; echo "fulls $(date +%T)" >> $L
echo CHAIN5DONE >> $L
