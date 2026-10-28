#!/bin/bash
# 第 3 章：P2–P4 采用种子 7 补配 → P5–P10 配音 + ASR → P2–P4 联系表（全部串行）
cd /e/AI/AI娘课程/AI娘微积分课/ch3
for u in C01 D03; do cp p2/vo_try7/$u.wav p2/vo/$u.wav; done; echo '{"C01": {"seed": 7}, "D03": {"seed": 7}}' > p2/tts_override.json
cp p3/vo_try7/C01.wav p3/vo/C01.wav; echo '{"C01": {"seed": 7}}' > p3/tts_override.json
for u in C02 C03 C06; do cp p4/vo_try7/$u.wav p4/vo/$u.wav; done; echo '{"C02": {"seed": 7}, "C03": {"seed": 7}, "C06": {"seed": 7}}' > p4/tts_override.json
bash qa/tts.sh p5 p6 p7 p8 p9 p10
bash qa/sheets.sh p2 p3 p4
echo CHAIN2DONE >> qa/sheets.log
