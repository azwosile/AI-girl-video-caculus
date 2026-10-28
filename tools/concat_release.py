# 拼接每章分段成片 → release/AI娘微积分课_第N章_合集.mp4（无损 -c copy，带章节标记）
import subprocess, glob, re, os, json, sys
ROOT = 'E:/AI/AI娘课程/AI娘微积分课'; OUT = ROOT + '/release'; os.makedirs(OUT, exist_ok=True)
def dur(f): return float(subprocess.run(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',f],capture_output=True,text=True).stdout)
IJ = OUT + '/release_info.json'
info = json.load(open(IJ, encoding='utf-8')) if os.path.exists(IJ) else {}
for ch in [int(c) for c in sys.argv[1:]] or [1, 2]:
    fs = sorted(glob.glob(f'{ROOT}/ch{ch}/p[0-9]*/web/out/AI娘微积分课_第{ch}章_P*.mp4'), key=lambda p: int(re.search(r'_P(\d+)_', p).group(1)))
    lst = f'{OUT}/ch{ch}_list.txt'; meta = f'{OUT}/ch{ch}_meta.txt'
    open(lst, 'w', encoding='utf-8').write(''.join(f"file '{f}'\n" for f in fs))
    m = [';FFMETADATA1', f'title=AI娘微积分课 第{ch}章 合集']; t = 0.0; segs = []
    for f in fs:
        d = dur(f); name = re.search(r'_(P\d+_.*)\.mp4$', f).group(1)
        m += ['[CHAPTER]', 'TIMEBASE=1/1000', f'START={int(t*1000)}', f'END={int((t+d)*1000)}', f'title={name}']
        segs.append({'file': f, 'name': name, 'start': round(t, 2), 'dur': round(d, 2), 'size': os.path.getsize(f)}); t += d
    open(meta, 'w', encoding='utf-8').write('\n'.join(m) + '\n')
    out = f'{OUT}/AI娘微积分课_第{ch}章_合集.mp4'
    r = subprocess.run(['ffmpeg','-loglevel','error','-y','-f','concat','-safe','0','-i',lst,'-i',meta,'-map','0','-map_metadata','1','-map_chapters','1','-c','copy','-movflags','+faststart',out])
    info[str(ch)] = {'full': out, 'rc': r.returncode, 'sum': round(t, 2), 'full_dur': round(dur(out), 2), 'full_size': os.path.getsize(out), 'segs': segs}
    print(ch, r.returncode, round(t, 2), info[str(ch)]['full_dur'], info[str(ch)]['full_size'])
json.dump(info, open(f'{OUT}/release_info.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
