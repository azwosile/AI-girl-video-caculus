#!/bin/bash
# chain4: 等 chain3 成片跑完 → 补配问题句 → 受影响段重出联系表与成片
cd /e/AI/AI娘课程/AI娘微积分课
Q=ch4/qa; L=$Q/chain4.log; : > $L
for i in $(seq 1 600); do grep -q CHAIN3DONE $Q/fulls.log 2>/dev/null && break; sleep 20; done
echo "chain3 done $(date +%T)" >> $L
bash $Q/batch.sh "" "p6:G01 p8:C04 p8:C07 p8:C08 p8:G01 p9:C07 p11:C02 p11:D01 p11:G01 p11:K01 p12:C03 p12:Z02 p13:M03"
echo "batch $(tail -1 $Q/batch.log) $(date +%T)" >> $L
bash $Q/sheets.sh p6 p8 p9 p11 p12 p13; echo "sheets $(date +%T)" >> $L
cp $Q/fulls.log $Q/fulls_chain3.log
bash $Q/fulls.sh p6 p8 p9 p11 p12 p13; echo "fulls $(date +%T)" >> $L
echo CHAIN4DONE >> $L
