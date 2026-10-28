#!/bin/bash
# P8/P10 直接出片；P5/P6/P7/P9 改版后重出联系表
cd /e/AI/AI娘课程/AI娘微积分课/ch3
bash qa/fulls.sh p8 p10; cp qa/fulls.log qa/fulls_p8p10.log
bash qa/sheets.sh p5 p6 p7 p9
echo CHAIN4DONE >> qa/sheets.log
