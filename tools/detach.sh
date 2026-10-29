#!/bin/bash
# detach.sh NAME 'command' : 用 Start-Process 脱离 ShunCode 终端运行（隧道断开不受影响）；输出写 release/detach_NAME.log
N=$1; shift; ROOT=/e/AI/AI娘课程/AI娘微积分课; F=$ROOT/tools/_job_$N.sh
printf '#!/bin/bash\ncd /e/AI/AI娘课程/AI娘微积分课\n%s\necho "DETACH_EXIT $?"\n' "$*" > "$F"
B=$(cygpath -w "$(which bash)"); W=$(cygpath -w "$F"); O=$(cygpath -w "$ROOT/release/detach_$N.log"); E2=$(cygpath -w "$ROOT/release/detach_$N.err")
powershell -NoProfile -c "Start-Process -WindowStyle Hidden -FilePath '$B' -ArgumentList '\"$W\"' -RedirectStandardOutput '$O' -RedirectStandardError '$E2'"
echo "started $N"
