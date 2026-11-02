// 章ファイルの検査: node tools/check.js ch03 ch04 [--shot]
// 1) HTML構造（h1・見出しID・クイズ・内部リンク） 2) ブラウザで描画（エラー・図の設定ミス・NaN・横はみ出し）
const fs = require("fs"), path = require("path"), http = require("http");
const { chromium } = require("playwright");
const ROOT = path.resolve(__dirname, "..");
const args = process.argv.slice(2), shot = args.includes("--shot"), ids = args.filter(a => !a.startsWith("--"));
const js = fs.readFileSync(path.join(ROOT, "assets/book.js"), "utf8");
const known = new Set([...js.matchAll(/\{ id: "([a-z0-9]+)"/g)].map(m => m[1]));
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css" };
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split("?")[0]); if (p === "/") p = "/index.html";
  const f = path.join(ROOT, p);
  if (!f.startsWith(ROOT) || !fs.existsSync(f)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { "content-type": TYPES[path.extname(f)] || "application/octet-stream" });
  if (p === "/assets/book.js") return res.end(fs.readFileSync(f, "utf8").replace(/var READY = "[^"]*"/, 'var READY = "' + [...known].join(" ") + '"'));
  fs.createReadStream(f).pipe(res);
});
function staticChecks(id, html) {
  const out = [];
  if (!/<h1[\s>]/.test(html)) out.push("h1 がありません");
  if (/<(html|head|body|script|style)[\s>]/i.test(html)) out.push("html/head/body/script/style タグは章ファイルに書かないでください");
  for (const m of html.matchAll(/<h2\b([^>]*)>/g)) {
    const idm = /id="([^"]+)"/.exec(m[1]);
    if (!idm) out.push("id のない h2: " + m[0]);
    else if (!idm[1].startsWith(id + "-")) out.push("h2 の id は「" + id + "-」で始めてください: " + idm[1]);
  }
  const seen = new Set();
  for (const m of html.matchAll(/\sid="([^"]+)"/g)) { if (seen.has(m[1])) out.push("id の重複: " + m[1]); seen.add(m[1]); }
  for (const m of html.matchAll(/href="#([^"]*)"/g)) {
    const ch = m[1].split("-")[0];
    if (ch && ch !== "home" && !known.has(ch)) out.push("存在しない章へのリンク: #" + m[1]);
  }
  for (const m of html.matchAll(/data-(series|steps|points|inputs|outputs|vars|vlines|hlines)='([^']*)'/g)) {
    try { JSON.parse(m[2]); } catch (e) { out.push("data-" + m[1] + " の JSON が不正: " + m[2].slice(0, 80)); }
  }
  if (/data-[a-z]+="\[/.test(html)) out.push("JSON を含む data-* 属性はシングルクォートで囲んでください");
  return out;
}
(async () => {
  await new Promise(r => server.listen(0, r));
  const port = server.address().port;
  const browser = await chromium.launch();
  let bad = 0;
  for (const id of ids) {
    const file = path.join(ROOT, "chapters", id + ".html");
    if (!fs.existsSync(file)) { console.log(`✗ ${id}: chapters/${id}.html がありません`); bad++; continue; }
    const html = fs.readFileSync(file, "utf8");
    const probs = staticChecks(id, html);
    for (const [w, h, tag] of [[390, 844, "phone"], [1280, 900, "desktop"]]) {
      const page = await browser.newPage({ viewport: { width: w, height: h } });
      const errs = [];
      page.on("pageerror", e => errs.push("JSエラー: " + e.message));
      page.on("console", m => { if (m.type() === "error" && !/fonts\.g|ERR_|Failed to load resource/.test(m.text())) errs.push("console: " + m.text()); });
      await page.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
      await page.goto(`http://127.0.0.1:${port}/index.html#${id}`);
      await page.waitForSelector(".pager", { timeout: 8000 }).catch(() => errs.push("章が表示されませんでした"));
      const r = await page.evaluate(() => {
        const main = document.getElementById("main");
        const brokenFigs = [...main.querySelectorAll(".chart-caption")].filter(e => /図の設定に誤り/.test(e.textContent)).map(e => e.textContent);
        const nan = /NaN|undefined|Infinity/.test(main.innerText) ? (main.innerText.match(/.{0,30}(NaN|undefined|Infinity).{0,20}/) || [""])[0] : "";
        const comps = {};
        for (const s of [".linechart", ".barchart", ".waterfall", ".scatter", ".sens", ".calc", ".quiz", "table", "figure"]) comps[s] = main.querySelectorAll(s).length;
        const wide = [...main.querySelectorAll("*")].filter(e => { const b = e.getBoundingClientRect(); return b.right > window.innerWidth + 1 && !e.closest(".tbl,.fig-svg,.formula .eq"); }).slice(0, 3).map(e => e.tagName + "." + e.className);
        return { brokenFigs, nan, comps, sw: document.documentElement.scrollWidth, chars: main.innerText.length, wide };
      });
      errs.forEach(e => probs.push(`[${tag}] ${e}`));
      r.brokenFigs.forEach(e => probs.push(`[${tag}] ${e}`));
      if (r.nan) probs.push(`[${tag}] 表示に NaN/undefined/Infinity: …${r.nan}…`);
      if (r.sw > w + 1) probs.push(`[${tag}] 横にはみ出しています（幅 ${r.sw}px）: ${r.wide.join(", ")}`);
      if (tag === "desktop") console.log(`  ${id}: 本文 ${r.chars} 字 / 部品 ` + Object.entries(r.comps).filter(([, n]) => n).map(([k, n]) => k.replace(".", "") + "×" + n).join(" "));
      if (shot) {
        const dir = process.env.SHOT_DIR || path.join(ROOT, "tools", "shots"); fs.mkdirSync(dir, { recursive: true });
        await page.screenshot({ path: path.join(dir, `${id}-${tag}.png`), fullPage: true });
      }
      await page.close();
    }
    if (probs.length) { bad++; console.log(`✗ ${id}`); [...new Set(probs)].forEach(p => console.log("   - " + p)); }
    else console.log(`✓ ${id}`);
  }
  await browser.close(); server.close();
  process.exit(bad ? 1 : 0);
})();
