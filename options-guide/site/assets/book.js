/* オプション完全読本 — router, table of contents, and chart renderer.
   Chapter bodies live in chapters/<id>.html and are fetched on demand. */
(function () {
  "use strict";

  // ----- table of contents ------------------------------------------------
  // ready: true when chapters/<id>.html exists. plan: shown on not-yet-written pages.
  var PARTS = [
    { part: "第0部", title: "はじめに", lv: "", ch: [
      { id: "ch00", n: "0", t: "本書の使い方と最初に知るべきこと", ready: true }
    ]},
    { part: "第1部", title: "ゼロから学ぶ基礎", lv: "Lv.1", ch: [
      { id: "ch01", n: "1", t: "オプションとは何か", ready: true },
      { id: "ch02", n: "2", t: "必須の基本用語", ready: true },
      { id: "ch03", n: "3", t: "損益図の読み方", ready: true },
      { id: "ch04", n: "4", t: "オプション価格はどう決まるか", ready: true },
      { id: "ch05", n: "5", t: "グリークス", ready: true },
      { id: "ch06", n: "6", t: "取引の実務", ready: true }
    ]},
    { part: "第2部", title: "日本と米国の市場", lv: "Lv.1〜2", ch: [
      { id: "ch07", n: "7", t: "日本のオプション市場", ready: true },
      { id: "ch08", n: "8", t: "米国のオプション市場", ready: true },
      { id: "ch09", n: "9", t: "日米比較と使い分け", ready: true }
    ]},
    { part: "第3部", title: "オプション戦略", lv: "Lv.2〜3", ch: [
      { id: "ch10", n: "10", t: "戦略の地図", ready: true },
      { id: "ch11", n: "11", t: "単一オプション戦略", ready: true },
      { id: "ch12", n: "12", t: "原資産と組み合わせる戦略", ready: true },
      { id: "ch13", n: "13", t: "垂直スプレッド", ready: true },
      { id: "ch14", n: "14", t: "ボラティリティ戦略", ready: true },
      { id: "ch15", n: "15", t: "レンジ戦略（バタフライ・コンドル系）", ready: true },
      { id: "ch16", n: "16", t: "時間差戦略", ready: true },
      { id: "ch17", n: "17", t: "合成ポジションと裁定取引", ready: true },
      { id: "ch18", n: "18", t: "特殊・上級戦略", ready: true },
      { id: "ch19", n: "19", t: "戦略実行可否マップ（日本／米国）", ready: true }
    ]},
    { part: "第4部", title: "管理とリスク", lv: "Lv.3", ch: [
      { id: "ch20", n: "20", t: "建てた後の管理と調整", plan: ["利益確定・損切りルール", "ロール", "調整とデルタ・ヘッジ", "割当を受けたときの対処"] },
      { id: "ch21", n: "21", t: "リスク管理と資金管理", ready: true },
      { id: "ch22", n: "22", t: "トレーダーの心理と記録", plan: ["よくある失敗パターン", "トレード日誌"] }
    ]},
    { part: "第5部", title: "狙える年利と税制", lv: "Lv.3〜4", ch: [
      { id: "ch23", n: "23", t: "オプション戦略で狙える年利", plan: ["年利の正しい測り方", "戦略別の現実的なレンジ", "長期実績のある指数", "ボラティリティ・リスク・プレミアム", "誇大広告の見抜き方"] },
      { id: "ch24", n: "24", t: "オプション取引の税制（日本居住者）", ready: true }
    ]},
    { part: "第6部", title: "自動売買", lv: "Lv.4", ch: [
      { id: "ch25", n: "25", t: "対応証券会社と接続方式", ready: true }
    ]},
    { part: "第7部", title: "習熟度テスト", lv: "", ch: [
      { id: "ex1", n: "試1", t: "Lv.1 初級認定試験", plan: ["第1〜2部の範囲"] },
      { id: "ex2", n: "試2", t: "Lv.2 中級認定試験", plan: ["第10〜14章の範囲"] },
      { id: "ex3", n: "試3", t: "Lv.3 上級認定試験", plan: ["第15〜22章の範囲"] },
      { id: "ex4", n: "試4", t: "Lv.4 マスター試験", plan: ["全範囲の総合ケーススタディ"] }
    ]},
    { part: "第8部", title: "小話", lv: "", ch: [
      { id: "hist", n: "話1", t: "オプションの歴史", plan: ["古代〜近世", "堂島米会所", "CBOE開設とブラック・ショールズ", "日経225オプションの歩み", "0DTEの時代"] },
      { id: "stories", n: "話2", t: "オプション小話集", plan: ["LTCM", "ベアリングズ銀行と日経225", "VIX誕生", "ボルマゲドン", "ゲームストップ", "2024年8月5日", "戦略名の由来"] }
    ]},
    { part: "第9部", title: "質問コーナー", lv: "", ch: [
      { id: "qa", n: "Q&A", t: "質問コーナー", ready: true }
    ]},
    { part: "付録", title: "", lv: "", ch: [
      { id: "glossary", n: "A", t: "用語集（日英対照）", plan: [] },
      { id: "cheatsheet", n: "B", t: "全戦略早見表", plan: [] },
      { id: "formulas", n: "C", t: "公式集", plan: [] },
      { id: "refs", n: "D", t: "参考資料・データソース", plan: [] }
    ]}
  ];

  var FLAT = [];
  PARTS.forEach(function (p) { p.ch.forEach(function (c) { c.partRef = p; FLAT.push(c); }); });
  function findCh(id) { for (var i = 0; i < FLAT.length; i++) if (FLAT[i].id === id) return i; return -1; }

  // ----- per-viewer progress (convenience only) ----------------------------
  var DONE_KEY = "optbook-done-v1";
  function loadDone() { try { return JSON.parse(localStorage.getItem(DONE_KEY) || "{}") || {}; } catch (e) { return {}; } }
  function saveDone(d) { try { localStorage.setItem(DONE_KEY, JSON.stringify(d)); } catch (e) { /* storage unavailable */ } }
  var done = loadDone();

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  function renderToc(current) {
    var html = "";
    PARTS.forEach(function (p) {
      html += '<div class="toc-part"><p class="toc-part-title">' + esc(p.part + (p.title ? "　" + p.title : "")) + (p.lv ? "　" + esc(p.lv) : "") + "</p><ol>";
      p.ch.forEach(function (c) {
        html += '<li><a href="#' + c.id + '"' + (c.id === current ? ' aria-current="page"' : "") + '><span class="num">' + esc(c.n) + '</span><span class="t">' + esc(c.t) + "</span>" +
          (done[c.id] ? '<span class="done" aria-label="読了">✓</span>' : c.ready ? "" : '<span class="soon">準備中</span>') + "</a></li>";
      });
      html += "</ol></div>";
    });
    document.getElementById("toc").innerHTML = html;
    var readyCount = FLAT.filter(function (c) { return c.ready; }).length;
    var doneCount = FLAT.filter(function (c) { return done[c.id]; }).length;
    document.getElementById("topbar-progress").innerHTML = "読了 " + doneCount + '<span class="long"> / 公開 ' + readyCount + " / 全 " + FLAT.length + "</span>";
  }

  // ----- pages -------------------------------------------------------------
  var main = document.getElementById("main");

  function homePage() {
    var readyCount = FLAT.filter(function (c) { return c.ready; }).length;
    var doneCount = FLAT.filter(function (c) { return done[c.id]; }).length;
    var rows = PARTS.map(function (p) {
      var r = p.ch.filter(function (c) { return c.ready; }).length;
      var first = p.ch[0];
      return '<li><span class="pn">' + esc(p.part) + '</span><span class="pt"><a href="#' + first.id + '">' + esc(p.title || "付録") + "</a><small>" +
        esc(p.ch.map(function (c) { return c.t; }).join("／")) + '</small></span><span class="pc">' + (p.lv ? esc(p.lv) + "　" : "") + r + "/" + p.ch.length + "</span></li>";
    }).join("");
    return '<section class="hero"><p class="eyebrow">ゼロから「全て」をマスターする</p><h1>オプション完全読本</h1>' +
      '<p class="hero-sub">コールとプットの意味から、約60の戦略、日本と米国の市場、年利の現実、日本居住者の税金、自動売買の接続方式まで。損益図はすべて実際に計算して描いています。</p>' +
      '<div class="bar" aria-hidden="true"><span style="width:' + Math.round(100 * doneCount / FLAT.length) + '%"></span></div>' +
      '<p class="eyebrow" style="margin-top:6px">読了 ' + doneCount + " 章　／　公開済み " + readyCount + " 章　／　全 " + FLAT.length + " 章</p></section>" +
      "<h2>学習の4段階</h2>" +
      '<div class="levels"><div><b>Lv.1 初級</b>用語・損益図・価格の仕組み・グリークスが分かる</div><div><b>Lv.2 中級</b>基本戦略を相場観に合わせて選べる</div><div><b>Lv.3 上級</b>応用戦略を建て、調整し、リスクを管理できる</div><div><b>Lv.4 マスター</b>収益を設計し、税金と自動化まで扱える</div></div>' +
      '<h2>全体の流れ</h2><ol class="roadmap">' + rows + "</ol>" +
      '<p><a href="#ch00">第0部「本書の使い方と最初に知るべきこと」から読み始める →</a></p>';
  }

  function soonPage(c) {
    var plan = (c.plan || []).map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("");
    return '<div class="soon-page"><p class="eyebrow">' + esc(c.partRef.part + "　" + c.partRef.title) + "</p><h1>" + esc(c.t) + "</h1>" +
      "<p>この章は執筆予定です。扱う予定の内容は次のとおりです。</p>" + (plan ? '<ul class="plan">' + plan + "</ul>" : "") + "</div>";
  }

  function pager(i) {
    var prev = FLAT[i - 1], next = FLAT[i + 1];
    return '<nav class="pager" aria-label="前後の章">' +
      (prev ? '<a class="prev" href="#' + prev.id + '">← ' + esc(prev.n === "0" ? "" : "") + esc(prev.t) + "</a>" : "<span></span>") +
      (next ? '<a class="next" href="#' + next.id + '">' + esc(next.t) + " →</a>" : "") + "</nav>";
  }

  function doneToggle(id) {
    return '<label class="done-toggle"><input type="checkbox" id="done-' + id + '"' + (done[id] ? " checked" : "") + "> この章を読み終えた</label>";
  }

  var cache = {};
  function route() {
    var hash = (location.hash || "").replace(/^#/, "");
    var chId = hash.split("-")[0] || "home";
    var sec = hash.indexOf("-") > 0 ? hash : "";
    var i = findCh(chId);
    renderToc(i >= 0 ? chId : "");
    document.getElementById("toc").classList.remove("open");
    document.getElementById("menu-btn").setAttribute("aria-expanded", "false");

    if (i < 0) { main.innerHTML = homePage(); window.scrollTo(0, 0); return; }
    var c = FLAT[i];
    if (!c.ready) { main.innerHTML = soonPage(c) + pager(i); window.scrollTo(0, 0); return; }

    var show = function (html) {
      main.innerHTML = html + doneToggle(c.id) + pager(i);
      renderCharts(main);
      var cb = document.getElementById("done-" + c.id);
      if (cb) cb.addEventListener("change", function () { if (cb.checked) done[c.id] = 1; else delete done[c.id]; saveDone(done); renderToc(c.id); });
      var target = sec && document.getElementById(sec);
      if (target) target.scrollIntoView(); else window.scrollTo(0, 0);
    };
    if (cache[c.id]) { show(cache[c.id]); return; }
    main.innerHTML = '<p class="eyebrow">読み込み中…</p>';
    fetch("chapters/" + c.id + ".html").then(function (r) {
      if (!r.ok) throw new Error(r.status);
      return r.text();
    }).then(function (t) { cache[c.id] = t; show(t); })
      .catch(function () { main.innerHTML = "<h1>" + esc(c.t) + "</h1><p>この章を読み込めませんでした。通信状態を確認して、ページを再読み込みしてください。</p>"; });
  }

  document.getElementById("menu-btn").addEventListener("click", function () {
    var toc = document.getElementById("toc");
    var open = toc.classList.toggle("open");
    this.setAttribute("aria-expanded", open ? "true" : "false");
  });
  document.addEventListener("click", function (e) {
    var toc = document.getElementById("toc");
    if (toc.classList.contains("open") && !toc.contains(e.target) && e.target.id !== "menu-btn") toc.classList.remove("open");
  });
  window.addEventListener("hashchange", route);

  // ----- math: Black–Scholes (r = interest, q = 0) ---------------------------
  function ncdf(x) {
    var t = 1 / (1 + 0.2316419 * Math.abs(x));
    var d = 0.3989422804014327 * Math.exp(-x * x / 2);
    var p = d * t * (0.319381530 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
    return x >= 0 ? 1 - p : p;
  }
  function npdf(x) { return 0.3989422804014327 * Math.exp(-x * x / 2); }
  function bs(type, S, K, T, v, r) {
    r = r || 0;
    if (T <= 0 || v <= 0) return type === "call" ? Math.max(S - K, 0) : Math.max(K - S, 0);
    if (S <= 0) return type === "call" ? 0 : K * Math.exp(-r * T);
    var sq = v * Math.sqrt(T), d1 = (Math.log(S / K) + (r + v * v / 2) * T) / sq, d2 = d1 - sq;
    return type === "call" ? S * ncdf(d1) - K * Math.exp(-r * T) * ncdf(d2) : K * Math.exp(-r * T) * ncdf(-d2) - S * ncdf(-d1);
  }
  function greek(kind, type, S, K, T, v, r) {
    r = r || 0;
    if (kind === "value") return bs(type, S, K, T, v, r);
    if (kind === "timevalue") return bs(type, S, K, T, v, r) - (type === "call" ? Math.max(S - K, 0) : Math.max(K - S, 0));
    if (kind === "intrinsic") return type === "call" ? Math.max(S - K, 0) : Math.max(K - S, 0);
    if (T <= 0) T = 1e-6;
    var sq = v * Math.sqrt(T), d1 = (Math.log(S / K) + (r + v * v / 2) * T) / sq, d2 = d1 - sq;
    if (kind === "delta") return type === "call" ? ncdf(d1) : ncdf(d1) - 1;
    if (kind === "gamma") return npdf(d1) / (S * sq);
    if (kind === "vega") return S * npdf(d1) * Math.sqrt(T) / 100;          // per 1 vol point
    if (kind === "theta") {                                                   // per calendar day
      var a = -S * npdf(d1) * v / (2 * Math.sqrt(T));
      var th = type === "call" ? a - r * K * Math.exp(-r * T) * ncdf(d2) : a + r * K * Math.exp(-r * T) * ncdf(-d2);
      return th / 365;
    }
    if (kind === "prob") return type === "call" ? ncdf(d2) : ncdf(-d2);      // risk-neutral P(ITM at expiry)
    return NaN;
  }

  // ----- chart helpers -----------------------------------------------------
  var uid = 0;
  function niceTicks(lo, hi, n) {
    var span = hi - lo; if (span <= 0) return [lo];
    var step = Math.pow(10, Math.floor(Math.log10(span / n)));
    var err = (n * step) / span;
    if (err <= 0.15) step *= 10; else if (err <= 0.35) step *= 5; else if (err <= 0.75) step *= 2;
    var out = [], start = Math.ceil(lo / step) * step;
    for (var x = start; x <= hi + step * 1e-9; x += step) out.push(Math.abs(x) < step * 1e-9 ? 0 : x);
    return out;
  }
  function fmt(x, digits) {
    if (!isFinite(x)) return "—";
    var a = Math.abs(x);
    var d = digits != null ? digits : a >= 1000 ? 0 : 2;
    return x.toLocaleString("ja-JP", { maximumFractionDigits: d, minimumFractionDigits: 0 });
  }
  function num(el, name, dflt) { var v = el.getAttribute("data-" + name); return v == null || v === "" ? dflt : parseFloat(v); }
  function parseList(s) { return (s || "").split(",").map(function (x) { return parseFloat(x); }).filter(function (x) { return isFinite(x); }); }

  var W = 640, H = 300, PL = 64, PR = 16, PT = 16, PB = 34;
  // Size the drawing to the element so axis text stays ~11px on phones.
  function sizeFor(el) {
    var w = el.clientWidth || 640;
    W = Math.max(340, Math.min(640, Math.round(w - 24)));
    H = W < 480 ? Math.round(W * 0.68) : 300;
    PL = W < 480 ? 54 : 64;
  }

  function frame(xlo, xhi, ylo, yhi, opts) {
    opts = opts || {};
    var sx = opts.reverse
      ? function (x) { return PL + (xhi - x) / (xhi - xlo) * (W - PL - PR); }
      : function (x) { return PL + (x - xlo) / (xhi - xlo) * (W - PL - PR); };
    var sy = function (y) { return PT + (yhi - y) / (yhi - ylo) * (H - PT - PB); };
    var g = "";
    niceTicks(ylo, yhi, 5).forEach(function (t) {
      g += '<line x1="' + PL + '" x2="' + (W - PR) + '" y1="' + sy(t) + '" y2="' + sy(t) + '" stroke="var(--line)" stroke-width="1"/>' +
        '<text x="' + (PL - 6) + '" y="' + (sy(t) + 4) + '" text-anchor="end">' + fmt(t) + "</text>";
    });
    niceTicks(xlo, xhi, W < 480 ? 4 : 6).forEach(function (t) {
      g += '<line x1="' + sx(t) + '" x2="' + sx(t) + '" y1="' + (H - PB) + '" y2="' + (H - PB + 4) + '" stroke="var(--muted)"/>' +
        '<text x="' + sx(t) + '" y="' + (H - PB + 16) + '" text-anchor="middle">' + fmt(t) + "</text>";
    });
    if (opts.xlabel) g += '<text x="' + (W - PR) + '" y="' + (H - 2) + '" text-anchor="end">' + esc(opts.xlabel) + "</text>";
    if (opts.ylabel) g += '<text x="' + 4 + '" y="' + (PT - 4) + '" text-anchor="start">' + esc(opts.ylabel) + "</text>";
    return { sx: sx, sy: sy, grid: g };
  }
  function pathOf(pts, sx, sy) {
    var d = "";
    pts.forEach(function (p, i) { if (isFinite(p[1])) d += (d ? "L" : "M") + sx(p[0]).toFixed(1) + "," + sy(p[1]).toFixed(1); });
    return d;
  }

  // ----- payoff chart --------------------------------------------------------
  // <div class="payoff" data-legs='[{"type":"call","k":100,"qty":1,"prem":3}]' data-spot="100"
  //      data-range="70,130" data-curves="30,10" data-iv="0.2" data-dte="30" data-mult="1" data-title="..."></div>
  // leg.type: call | put | stock (stock uses "price"); qty>0 long, <0 short; optional leg.dte / leg.iv.
  var TYPE_JA = { call: "コール", put: "プット", stock: "原資産" };
  function legLabel(l, showDte) {
    var side = l.qty > 0 ? "買い" : "売り";
    var n = Math.abs(l.qty) !== 1 ? " ×" + Math.abs(l.qty) : "";
    if (l.type === "stock") return TYPE_JA.stock + side + n + " @" + fmt(l.price);
    return TYPE_JA[l.type] + side + n + " K=" + fmt(l.k) + (l.prem != null ? " @" + fmt(l.prem) : "") + (showDte ? "（残" + l.dte + "日）" : "");
  }
  function renderPayoff(el) {
    sizeFor(el);
    var legs;
    try { legs = JSON.parse(el.getAttribute("data-legs")); } catch (e) { el.textContent = "（図の設定に誤りがあります）"; return; }
    var iv = num(el, "iv", 0.2), r = num(el, "r", 0), baseDte = num(el, "dte", 30), mult = num(el, "mult", 1);
    legs.forEach(function (l) { if (l.type !== "stock" && l.dte == null) l.dte = baseDte; });
    var optLegs = legs.filter(function (l) { return l.type !== "stock"; });
    var firstExp = optLegs.length ? Math.min.apply(null, optLegs.map(function (l) { return l.dte; })) : 0;
    var mixed = optLegs.some(function (l) { return l.dte !== firstExp; });
    var strikes = optLegs.map(function (l) { return l.k; });
    var spot = num(el, "spot", strikes.length ? strikes.reduce(function (a, b) { return a + b; }, 0) / strikes.length : legs[0].price);
    var range = parseList(el.getAttribute("data-range"));
    var kmin = Math.min.apply(null, strikes.concat([spot])), kmax = Math.max.apply(null, strikes.concat([spot]));
    var xlo = range.length === 2 ? range[0] : Math.max(0, kmin - (kmax - kmin) * 0.6 - spot * 0.12);
    var xhi = range.length === 2 ? range[1] : kmax + (kmax - kmin) * 0.6 + spot * 0.12;

    // P/L at a point in time: daysLeft = days remaining until the first expiry
    function pl(S, daysLeft) {
      var tot = 0;
      legs.forEach(function (l) {
        if (l.type === "stock") { tot += l.qty * (S - l.price); return; }
        var T = (l.dte - firstExp + daysLeft) / 365;
        tot += l.qty * (bs(l.type, S, l.k, T, l.iv || iv, r) - (l.prem || 0));
      });
      return tot * mult;
    }
    var N = 240, curves = [{ d: 0, pts: [] }];
    parseList(el.getAttribute("data-curves")).forEach(function (d) { curves.push({ d: d, pts: [] }); });
    curves.forEach(function (c) { for (var i = 0; i <= N; i++) { var S = xlo + (xhi - xlo) * i / N; c.pts.push([S, pl(S, c.d)]); } });
    var ys = []; curves.forEach(function (c) { c.pts.forEach(function (p) { ys.push(p[1]); }); });
    var ymin = Math.min.apply(null, ys.concat([0])), ymax = Math.max.apply(null, ys.concat([0]));
    var pad = (ymax - ymin) * 0.1 || 1; ymin -= pad; ymax += pad;
    var f = frame(xlo, xhi, ymin, ymax, { xlabel: "満期時の原資産価格 →", ylabel: "損益" + (el.getAttribute("data-unit") ? "（" + el.getAttribute("data-unit") + "）" : mult !== 1 ? "（円）" : "") });
    var id = "po" + (++uid), y0 = f.sy(0);
    var exp = curves[0].pts, line = pathOf(exp, f.sx, f.sy);
    var area = line + "L" + f.sx(xhi).toFixed(1) + "," + y0 + "L" + f.sx(xlo).toFixed(1) + "," + y0 + "Z";
    var svg = '<svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="損益図">' +
      '<defs><clipPath id="' + id + 'u"><rect x="0" y="0" width="' + W + '" height="' + y0 + '"/></clipPath>' +
      '<clipPath id="' + id + 'd"><rect x="0" y="' + y0 + '" width="' + W + '" height="' + (H - y0) + '"/></clipPath></defs>' + f.grid +
      '<path d="' + area + '" fill="var(--gain-soft)" clip-path="url(#' + id + 'u)"/>' +
      '<path d="' + area + '" fill="var(--loss-soft)" clip-path="url(#' + id + 'd)"/>' +
      '<line x1="' + PL + '" x2="' + (W - PR) + '" y1="' + y0 + '" y2="' + y0 + '" stroke="var(--fg)" stroke-width="1.2"/>';
    // strikes
    var seen = {};
    strikes.forEach(function (k) {
      if (seen[k] || k < xlo || k > xhi) return; seen[k] = 1;
      svg += '<line x1="' + f.sx(k) + '" x2="' + f.sx(k) + '" y1="' + PT + '" y2="' + (H - PB) + '" stroke="var(--muted)" stroke-dasharray="2 3" stroke-width="1"/>' +
        '<text x="' + (f.sx(k) + 3) + '" y="' + (PT + 10) + '">K ' + fmt(k) + "</text>";
    });
    var colors = ["var(--accent)", "var(--curve2)", "var(--curve3)"];
    for (var ci = curves.length - 1; ci >= 1; ci--) {
      svg += '<path d="' + pathOf(curves[ci].pts, f.sx, f.sy) + '" fill="none" stroke="' + colors[(ci - 1) % 3] + '" stroke-width="1.6" stroke-dasharray="6 4"/>';
    }
    svg += '<path d="' + line + '" fill="none" stroke="var(--fg)" stroke-width="2.4" stroke-linejoin="round"/>';
    // breakevens on the expiry curve
    var bes = [];
    for (var i = 1; i < exp.length; i++) {
      var a = exp[i - 1], b = exp[i];
      if ((a[1] < 0 && b[1] >= 0) || (a[1] > 0 && b[1] <= 0)) bes.push(a[0] + (0 - a[1]) * (b[0] - a[0]) / (b[1] - a[1]));
    }
    bes.forEach(function (x) {
      svg += '<circle cx="' + f.sx(x) + '" cy="' + y0 + '" r="4" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.5"/>' +
        '<text class="lbl" x="' + f.sx(x) + '" y="' + (y0 + 16) + '" text-anchor="middle">' + fmt(x) + "</text>";
    });
    if (spot >= xlo && spot <= xhi) {
      var sxp = f.sx(spot);
      svg += '<path d="M' + sxp + "," + (H - PB - 9) + "l-5,9h10z" + '" fill="var(--accent)"/>';
    }
    svg += "</svg>";

    // stats (expiry, all legs expiring together); scan wide to catch the tails
    var stats = "";
    if (!mixed) {
      var hiScan = Math.max(xhi, kmax * 3, spot * 3), mx = -Infinity, mn = Infinity;
      for (var j = 0; j <= 3000; j++) { var S = hiScan * j / 3000, v = pl(S, 0); if (v > mx) mx = v; if (v < mn) mn = v; }
      // the expiry line only bends at strikes, so check them exactly (a peak between scan points would be missed)
      strikes.forEach(function (k) { var vk = pl(k, 0); if (vk > mx) mx = vk; if (vk < mn) mn = vk; });
      var slope = legs.reduce(function (s, l) { return s + (l.type === "put" ? 0 : l.qty); }, 0);
      var allBe = [];
      var prev = pl(0, 0);
      for (j = 1; j <= 3000; j++) { var S2 = hiScan * j / 3000, v2 = pl(S2, 0); if ((prev < 0 && v2 >= 0) || (prev > 0 && v2 <= 0)) { var S1 = hiScan * (j - 1) / 3000; allBe.push(S1 + (0 - prev) * (S2 - S1) / (v2 - prev)); } prev = v2; }
      var net = legs.reduce(function (s, l) { return s + (l.type === "stock" ? 0 : -l.qty * (l.prem || 0)); }, 0) * mult;
      stats = '<dl class="chart-stats">' +
        "<div><dt>最大利益</dt><dd>" + (slope > 1e-9 ? "無制限" : fmt(mx)) + "</dd></div>" +
        "<div><dt>最大損失</dt><dd>" + (slope < -1e-9 ? "無制限" : fmt(mn)) + "</dd></div>" +
        "<div><dt>損益分岐点</dt><dd>" + (allBe.length ? allBe.map(function (x) { return fmt(x); }).join("／") : "なし") + "</dd></div>" +
        (optLegs.length ? "<div><dt>建てた時の" + (net >= 0 ? "受取" : "支払") + "</dt><dd>" + fmt(Math.abs(net)) + "</dd></div>" : "") + "</dl>";
    } else {
      stats = '<p class="chart-caption">満期の異なるオプションを含むため、太線は「期近の満期日」時点の損益（期先は理論価格 IV ' + Math.round(iv * 100) + "% で評価）です。</p>";
    }
    var key = '<div class="chart-key"><span><i style="border-color:var(--fg)"></i>' + (mixed ? "期近満期時" : "満期時") + "</span>";
    for (ci = 1; ci < curves.length; ci++) key += '<span><i style="border-color:' + colors[(ci - 1) % 3] + ';border-top-style:dashed"></i>満期まで残り' + curves[ci].d + "日</span>";
    key += '<span><i style="border-color:var(--accent);width:0;border-top:0"></i>▲ 現在値 ' + fmt(spot) + "</span></div>";
    var title = el.getAttribute("data-title");
    var hide = el.getAttribute("data-hide") || "";   // quiz use: "legs,stats,be"
    if (/\bstats\b/.test(hide)) stats = "";
    if (/\bbe\b/.test(hide)) svg = svg.replace(/<text class="lbl"[^>]*>[^<]*<\/text>/g, "");
    el.classList.add("chart");
    el.innerHTML = (title ? '<p class="chart-title">' + esc(title) + "</p>" : "") + svg + key +
      (/\blegs\b/.test(hide) ? "" : '<ul class="chart-legs">' + legs.map(function (l) { return '<li class="' + (l.qty > 0 ? "long" : "short") + '">' + esc(legLabel(l, mixed)) + "</li>"; }).join("") + "</ul>") + stats +
      (el.getAttribute("data-caption") ? '<p class="chart-caption">' + esc(el.getAttribute("data-caption")) + "</p>" : "");
  }

  // ----- greek / price curves ------------------------------------------------
  // <div class="greek" data-greek="delta" data-type="call" data-k="100" data-iv="0.2" data-days="60,30,7" data-range="70,130"></div>
  // data-greek: value | timevalue | intrinsic | delta | gamma | theta | vega | prob | decay
  // decay: x = days to expiry (data-maxdays → 0), one line per strike in data-ks, spot fixed at data-spot.
  var GREEK_JA = { value: "オプション価格", timevalue: "時間的価値", intrinsic: "本質的価値", delta: "デルタ", gamma: "ガンマ", theta: "セータ（1日あたり）", vega: "ベガ（IV 1%あたり）", prob: "満期にITMとなる確率（目安）", decay: "オプション価格" };
  function renderGreek(el) {
    sizeFor(el);
    var kind = el.getAttribute("data-greek") || "value", type = el.getAttribute("data-type") || "call";
    var K = num(el, "k", 100), iv = num(el, "iv", 0.2), r = num(el, "r", 0);
    var colors = ["var(--fg)", "var(--accent)", "var(--curve2)", "var(--curve3)"];
    var series = [], xlo, xhi, xlabel;
    if (kind === "decay") {
      var S0 = num(el, "spot", K), maxd = num(el, "maxdays", 90);
      var ks = parseList(el.getAttribute("data-ks")); if (!ks.length) ks = [K];
      xlo = 0; xhi = maxd; xlabel = "満期までの残り日数（右端＝満期日）";
      ks.forEach(function (k) {
        var pts = [];
        for (var i = 0; i <= 180; i++) { var d = maxd * i / 180; pts.push([d, bs(type, S0, k, d / 365, iv, r)]); }
        series.push({ name: (type === "call" ? "コール" : "プット") + " K=" + fmt(k) + (k === S0 ? "（ATM）" : ""), pts: pts });
      });
    } else {
      var range = parseList(el.getAttribute("data-range"));
      xlo = range.length === 2 ? range[0] : K * 0.7; xhi = range.length === 2 ? range[1] : K * 1.3; xlabel = "原資産価格 →";
      var days = parseList(el.getAttribute("data-days")); if (!days.length) days = [30];
      days.forEach(function (d) {
        var pts = [];
        for (var i = 0; i <= 200; i++) { var S = xlo + (xhi - xlo) * i / 200; pts.push([S, greek(kind, type, S, K, d / 365, iv, r)]); }
        series.push({ name: d === 0 ? "満期時" : "残り" + d + "日", pts: pts });
      });
      if (el.hasAttribute("data-intrinsic")) {
        var ip = []; for (var i2 = 0; i2 <= 200; i2++) { var S3 = xlo + (xhi - xlo) * i2 / 200; ip.push([S3, greek("intrinsic", type, S3, K, 0, iv, r)]); }
        series.push({ name: "本質的価値", pts: ip, dash: true });
      }
    }
    var ys = []; series.forEach(function (s) { s.pts.forEach(function (p) { if (isFinite(p[1])) ys.push(p[1]); }); });
    var ymin = Math.min.apply(null, ys.concat(kind === "theta" ? [] : [0])), ymax = Math.max.apply(null, ys.concat(kind === "theta" ? [0] : []));
    var pad = (ymax - ymin) * 0.08 || 0.1; ymin -= pad; ymax += pad;
    var f = frame(xlo, xhi, ymin, ymax, { xlabel: xlabel, ylabel: GREEK_JA[kind], reverse: kind === "decay" });
    var svg = '<svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="' + esc(GREEK_JA[kind]) + 'の図">' + f.grid;
    if (ymin < 0 && ymax > 0) svg += '<line x1="' + PL + '" x2="' + (W - PR) + '" y1="' + f.sy(0) + '" y2="' + f.sy(0) + '" stroke="var(--fg)" stroke-width="1"/>';
    if (kind !== "decay" && K >= xlo && K <= xhi) svg += '<line x1="' + f.sx(K) + '" x2="' + f.sx(K) + '" y1="' + PT + '" y2="' + (H - PB) + '" stroke="var(--muted)" stroke-dasharray="2 3"/><text x="' + (f.sx(K) + 3) + '" y="' + (PT + 10) + '">K ' + fmt(K) + "</text>";
    series.forEach(function (s, i) {
      svg += '<path d="' + pathOf(s.pts, f.sx, f.sy) + '" fill="none" stroke="' + (s.dash ? "var(--muted)" : colors[i % 4]) + '" stroke-width="' + (i === 0 ? 2.4 : 1.8) + '"' + (s.dash ? ' stroke-dasharray="5 4"' : "") + "/>";
    });
    svg += "</svg>";
    var key = '<div class="chart-key">' + series.map(function (s, i) { return '<span><i style="border-color:' + (s.dash ? "var(--muted)" : colors[i % 4]) + (s.dash ? ";border-top-style:dashed" : "") + '"></i>' + esc(s.name) + "</span>"; }).join("") + "</div>";
    var title = el.getAttribute("data-title") || ((type === "call" ? "コール" : "プット") + "の" + GREEK_JA[kind]);
    el.classList.add("chart");
    el.innerHTML = '<p class="chart-title">' + esc(title) + "</p>" + svg + key +
      '<p class="chart-caption">' + esc(el.getAttribute("data-caption") || ("ブラック・ショールズ式で計算（IV " + Math.round(iv * 100) + "%、金利 " + (r * 100) + "%）")) + "</p>";
  }

  function renderCharts(root) {
    Array.prototype.forEach.call(root.querySelectorAll(".payoff"), renderPayoff);
    Array.prototype.forEach.call(root.querySelectorAll(".greek"), renderGreek);
  }

  window.OptBook = { bs: bs, greek: greek, renderCharts: renderCharts };
  route();
})();
