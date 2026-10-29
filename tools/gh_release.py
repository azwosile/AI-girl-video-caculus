# 创建 chN-vX Release（用法：gh_release.py 3；VER=v1.1 gh_release.py 1 发新版本） 并上传合集与分段成片（凭据取自 Git Credential Manager，不落盘、不打印）
import json, subprocess, os, sys, time, requests
ROOT = 'E:/AI/AI娘课程/AI娘微积分课'; REPO = 'azwosile/AI-girl-video-caculus'
GCM = 'D:/DeepSeek Harness WorkSpace/ShunCode/resources/app/extensions/shuncode/runtime/git/mingw64/bin/git-credential-manager.exe'
LOG = open(ROOT + '/release/upload.log', 'a', encoding='utf-8')
def log(*a): print(*a, file=LOG, flush=True)
out = subprocess.run([GCM, 'get'], input='protocol=https\nhost=github.com\n\n', capture_output=True, text=True, env={**os.environ, 'GCM_INTERACTIVE': 'never'}).stdout
TOK = dict(l.split('=', 1) for l in out.splitlines() if '=' in l).get('password')
if not TOK: log('NO TOKEN'); sys.exit(1)
S = requests.Session(); S.headers.update({'Authorization': f'Bearer {TOK}', 'Accept': 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28'})
info = json.load(open(ROOT + '/release/release_info.json', encoding='utf-8'))
TITLE = {'1': '第 1 章 · 函数与模型', '2': '第 2 章 · 极限与导数', '3': '第 3 章 · 求导法则', '4': '第 4 章 · 导数的应用'}
def mmss(s): s = int(round(s)); return f'{s // 60}:{s % 60:02d}'
def mm(s): s = int(round(s)); return f'{s // 60}′{s % 60:02d}″'
VER = os.environ.get('VER', 'v1.0')
CHANGES = {'v1.1': '**v1.1 更新**：加入段间衔接。每段开头是接棒卡、结尾是接力卡，两张卡共用一条章节路线图，上一段的最后一帧就是下一段的第一帧。原来每段末尾的署名卡改为页脚一行，完整署名放在章末段。台词与配音不变。\n\n'}
for ch in sys.argv[1:] or ['1', '2']:
    I = info[ch]; tag = f'ch{ch}-{VER}'
    rows = '\n'.join(f"| {mmss(g['start'])} | {g['name'].split('_', 1)[0]} | {g['name'].split('_', 1)[1]} | {g['dur']:.1f} s | `ch{ch}-{g['name'].split('_', 1)[0]}.mp4` |" for g in I['segs'])
    body = CHANGES.get(VER, '') + f"""AI娘微积分课 **{TITLE[ch]}**，共 {len(I['segs'])} 段，总长 {mm(I['sum'])}（{I['sum']:.1f} s）。1080p30，H.264 + AAC 48 kHz，响度 −16 LUFS。

- `calculus-ch{ch}-full.mp4`：整章合集，各段无损拼接，带章节标记（播放器里可以按段跳转）
- `ch{ch}-PN.mp4`：分段成片

| 合集内起点 | 段 | 标题 | 时长 | 分段文件 |
|---|---|---|---|---|
{rows}

台词稿、制作记录见仓库 `docs/` 与 `ch{ch}/`。素材来源与许可见 [docs/素材与授权.md](https://github.com/{REPO}/blob/main/docs/素材与授权.md)：整体按非商用处理，成片按 CC BY-NC-SA 4.0 分享；角色为社区同人形象，名称与商标归各自权利人。"""
    r = S.get(f'https://api.github.com/repos/{REPO}/releases/tags/{tag}')
    if r.status_code == 200: rel = r.json(); S.patch(rel['url'], json={'body': body}); log(tag, 'exists', rel['id'])
    else:
        r = S.post(f'https://api.github.com/repos/{REPO}/releases', json={'tag_name': tag, 'target_commitish': 'main', 'name': f'AI娘微积分课 {TITLE[ch]}' + ('' if VER == 'v1.0' else f'（{VER}）'), 'body': body, 'make_latest': 'true' if VER == 'v1.0' else 'false'})
        if r.status_code >= 300: log(tag, 'CREATE FAIL', r.status_code, r.text[:300]); continue
        rel = r.json(); log(tag, 'created', rel['id'])
    have = {a['name']: a for a in S.get(rel['url'] + '/assets?per_page=100').json()}
    jobs = [(I['full'], f'calculus-ch{ch}-full.mp4', f'第{ch}章 合集（{mm(I["sum"])}，带章节）')] + \
           [(g['file'], f"ch{ch}-{g['name'].split('_', 1)[0]}.mp4", f"第{ch}章 {g['name'].replace('_', ' ', 1)}") for g in I['segs']]
    for f, name, label in jobs:
        size = os.path.getsize(f)
        if name in have:
            if have[name]['state'] == 'uploaded' and have[name]['size'] == size: log(name, 'skip'); continue
            S.delete(have[name]['url'])
        t0 = time.time()
        for k in range(3):
            try:
                with open(f, 'rb') as fh:
                    r = S.post(f"https://uploads.github.com/repos/{REPO}/releases/{rel['id']}/assets", params={'name': name, 'label': label},
                               data=fh, headers={'Content-Type': 'video/mp4', 'Content-Length': str(size)}, timeout=(30, 3600))
                if r.status_code < 300: break
                log(name, 'try', k, r.status_code, r.text[:200])
                for a in S.get(rel['url'] + '/assets?per_page=100').json():
                    if a['name'] == name: S.delete(a['url'])
            except Exception as e: log(name, 'try', k, 'ERR', repr(e)[:200])
        log(name, r.status_code, f'{size / 1e6:.1f} MB', f'{time.time() - t0:.0f} s')
log('DONE', *sys.argv[1:])
