#!/bin/bash
# relsheet2.sh chN pX "times" tag : 只出指定时刻的联系表
cd /e/AI/AI娘课程/AI娘微积分课/$1/$2/web
cp ../../shared/core.js core.js; cp ../../shared/kit.js kit.js; [ -f ../../shared/c3kit.js ] && cat $(ls ../../shared/c[0-9]kit.js | sort) > scenes0_kit.js
uv run --quiet --with playwright --with pillow python render.py --channel chrome --sheet --times "$3" 2>&1 | grep -v "GET /" | tail -1
mkdir -p ../../qa/edges; ffmpeg -loglevel error -y -i out/sheet.jpg -q:v 4 ../../qa/edges/relay_$4.jpg; ls -la ../../qa/edges/relay_$4.jpg
