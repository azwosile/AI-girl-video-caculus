#!/bin/bash
cd /e/AI/AI娘课程/AI娘微积分课; for n in "$@"; do echo "ch$n start $(date +%T)" >> release/relay_all.log; bash tools/relay_chap.sh $n; echo "ch$n done $(date +%T)" >> release/relay_all.log; done
