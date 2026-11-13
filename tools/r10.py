import pymupdf, glob, os, sys
from PIL import Image
f = glob.glob('教材PPT/*CALCULUS*.pdf')[0]; d = pymupdf.open(f); out = 'ch10/qa/pdf'; os.makedirs(out, exist_ok=True)
pairs = [(int(a), int(b)) for a, b in (x.split('-') for x in sys.argv[1:])]
for a, b in pairs:
    ims = []
    for p in (a, b):
        pix = d[p - 1].get_pixmap(matrix=pymupdf.Matrix(1.15, 1.15), colorspace=pymupdf.csGRAY)
        ims.append(Image.frombytes('L', (pix.width, pix.height), pix.samples))
    W = sum(i.width for i in ims); H = max(i.height for i in ims); o = Image.new('L', (W, H), 255); x = 0
    for i in ims: o.paste(i, (x, 0)); x += i.width
    o.save(f'{out}/p{a}_{b}.jpg', quality=55); print(a, b, o.size, os.path.getsize(f'{out}/p{a}_{b}.jpg'))
