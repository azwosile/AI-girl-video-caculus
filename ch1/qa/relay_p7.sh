#!/bin/bash
cd /e/AI/AI娘课程/AI娘微积分课; Q=ch1/qa; L=$Q/relay_p7fix.log; : > $L
SKIP_PREP=1 bash ch1/p7/web/build.sh > $Q/relay_p7.log 2>&1; echo "p7 build $?" >> $L
F=ch1/p7/web/out/AI娘微积分课_第1章_P7_收束.mp4; ls $F >> $L 2>&1
ffmpeg -loglevel error -y -i "$F" -frames:v 1 $Q/seam/first7.png
echo "seam P6>P7 $(ffmpeg -i $Q/seam/last6.png -i $Q/seam/first7.png -lavfi psnr -f null - 2>&1 | grep -o 'average:[0-9.inf]*')" >> $L
bash tools/edges.sh 1 > /dev/null 2>&1; echo "P7 dur $(ffprobe -v error -show_entries format=duration -of csv=p=0 $F)" >> $L; echo P7DONE >> $L
