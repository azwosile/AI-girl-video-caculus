#!/bin/bash
# edges.sh N : 第 N 章每段首尾抽帧拼图（6 帧开头 + 6 帧结尾）→ chN/qa/edges/PN.jpg；用于段间衔接目检
cd /e/AI/AI娘课程/AI娘微积分课; N=$1; O=ch$N/qa/edges; mkdir -p $O; : > $O/audio.txt
for f in $(ls ch$N/p*/web/out/AI娘微积分课_第${N}章_P*.mp4 | sort -V); do
  P=$(echo $f | grep -o "_P[0-9]*_" | tr -d _); D=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$f")
  i=0; for t in 0 0.4 1.0 2.0 3.5 $(python -c "d=$D;print(' '.join(str(round(d-x,2)) for x in (9,6,4,2.5,1.2,0.3)))"); do
    ffmpeg -loglevel error -y -ss $t -i "$f" -frames:v 1 -vf "scale=384:-1" $O/_${P}_$(printf %02d $i).jpg; i=$((i+1)); done
  ffmpeg -loglevel error -y -i $O/_${P}_%02d.jpg -vf tile=6x2 -q:v 6 $O/${P}.jpg 2>/dev/null
  rm -f $O/_${P}_*.jpg
  H=x
  T=x
  S=x
  echo "$P dur=$D head3s=$H tail3s=$T | $S" >> $O/audio.txt
done; echo EDGESDONE >> $O/audio.txt
