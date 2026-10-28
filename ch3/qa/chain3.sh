#!/bin/bash
# 等 fulls 结束再出 P5–P10 联系表（重活串行）
cd /e/AI/AI娘课程/AI娘微积分课/ch3
for i in $(seq 1 360); do grep -q ALLDONE qa/fulls.log 2>/dev/null && break; sleep 10; done
bash qa/sheets.sh p5 p6 p7 p8 p9 p10
echo CHAIN3DONE >> qa/sheets.log
