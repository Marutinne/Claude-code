# 公開前に実行：chapters/ にある章だけを READY にする。
import os, re
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
js = os.path.join(root, "assets", "book.js")
s = open(js, encoding="utf-8").read()
order = re.findall(r'\{ id: "([a-z0-9]+)"', s)
have = [i for i in order if os.path.exists(os.path.join(root, "chapters", i + ".html"))]
s = re.sub(r'var READY = "[^"]*"', 'var READY = "' + " ".join(have) + '"', s)
open(js, "w", encoding="utf-8").write(s)
print(f"READY {len(have)}/{len(order)}:", " ".join(have))
