# usage: bash tools/frame_at.sh EP ID OUT  (from ch1) - grab frame at middle of line ID from final mp4
EP=$1; ID=$2; OUT=$3
T=$(/e/AI/TTS/GPT-SoVITS-v2pro-20261006nvidia50x0/runtime/python.exe -c "
import json;d=json.load(open('$EP/web/out/timeline.json',encoding='utf-8'))
s=[x for x in d['seq'] if x['id']=='$ID'][0];print(s['vo']+s['dur']*0.6)")
F=$(ls $EP/web/out/AI*.mp4)
ffmpeg -v error -y -ss $T -i "$F" -frames:v 1 -vf scale=960:-1 -q:v 4 "$OUT"
echo "$EP $ID t=$T"
