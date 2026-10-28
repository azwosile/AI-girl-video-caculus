#!/bin/bash
cd /e/AI/AI娘课程/AI娘微积分课/ch1
(cd p1/web && cp ../../shared/core.js core.js && uv run --quiet --with playwright --with pillow python render.py --channel chrome --sheet --times "156.463,157.013,157.463,157.963,158.513,160.353" 2>&1 | grep -v "GET /" | tail -2; cp out/sheet.jpg ../../qa/edges/relay_p1_out.jpg)
(cd p2/web && cp ../../shared/core.js core.js && cp ../../shared/kit.js kit.js && uv run --quiet --with playwright --with pillow python render.py --channel chrome --sheet --times "0,0.6,1.0,1.3,1.6,2.2" 2>&1 | grep -v "GET /" | tail -2; cp out/sheet.jpg ../../qa/edges/relay_p2_in.jpg)
for f in relay_p1_out relay_p2_in; do ffmpeg -loglevel error -y -i qa/edges/$f.jpg -vf scale=1600:-1 -q:v 5 qa/edges/${f}_s.jpg; done; ls -la qa/edges
