/* ファンダメンタルズ投資完全読本 — router, table of contents, charts and calculators.
   Chapter bodies live in chapters/<id>.html and are fetched on demand. */
(function () {
  "use strict";

  // ----- table of contents ------------------------------------------------
  // ready: true when chapters/<id>.html exists. plan: shown on not-yet-written pages.
  var PARTS = [
    { part: "第0部", title: "はじめに", lv: "", ch: [
      { id: "ch00", n: "0", t: "本書の使い方とファンダメンタルズ投資の全体像", plan: ["ファンダメンタルズ投資とは何か", "テクニカル分析・インデックス投資との違い", "「良い会社」と「良い投資」は別物", "学習ロードマップ（Lv.1〜Lv.4）", "最初に知っておくべき落とし穴", "本書の約束事（架空企業・数値例・データ時点）"] }
    ]},
    { part: "第1部", title: "ゼロから学ぶ基礎", lv: "Lv.1", ch: [
      { id: "ch01", n: "1", t: "株式と企業価値の基本", plan: ["株主の権利", "株価・発行済株式数・時価総額", "企業価値（EV）＝時価総額＋純有利子負債", "配当と自社株買いの経済的な意味", "株価は長期的に何に連動するか", "東証の市場区分と米国の主な市場"] },
      { id: "ch02", n: "2", t: "決算書の全体像と入手方法", plan: ["財務3表のつながり", "決算短信・有価証券報告書・半期報告書・決算説明資料・統合報告書", "EDINET・TDnet・IRサイト・会社四季報", "決算スケジュールと四半期開示", "決算短信の1ページ目で見る10項目", "単位・連結/単体・会計期間の読み間違い"] },
      { id: "ch03", n: "3", t: "損益計算書（P/L）を読む", plan: ["5つの段階利益", "利益率の読み方", "固定費・変動費・損益分岐点・営業レバレッジ", "販管費の中身", "営業外損益・特別損益と一過性要因", "親会社株主に帰属する当期純利益"] },
      { id: "ch04", n: "4", t: "貸借対照表（B/S）を読む", plan: ["資産＝負債＋純資産", "流動・固定の区分", "運転資本", "有利子負債・ネットキャッシュ・自己資本比率", "のれん・無形資産・含み益", "純資産の内訳"] },
      { id: "ch05", n: "5", t: "キャッシュフロー計算書（C/F）を読む", plan: ["営業CF・投資CF・財務CF", "間接法の営業CF", "フリーキャッシュフロー", "CFの符号パターン8類型", "利益とキャッシュがずれる理由", "黒字倒産はなぜ起きるか"] },
      { id: "ch06", n: "6", t: "基本の投資指標", plan: ["EPS・BPS・DPS", "PER・PBR・配当利回り・配当性向", "ROE・ROA", "PSR・EV/EBITDA・FCF利回り", "指標を単独で見てはいけない理由", "予想値と実績値、会社予想とコンセンサス"] }
    ]},
    { part: "第2部", title: "企業分析の実践", lv: "Lv.2", ch: [
      { id: "ch07", n: "7", t: "財務分析の4つの視点", plan: ["収益性", "効率性（回転率・CCC）", "安全性", "成長性（CAGR）", "デュポン分析（3段階・5段階）", "時系列比較と同業比較"] },
      { id: "ch08", n: "8", t: "ビジネスモデルと競争優位", plan: ["ビジネスモデルの分解", "ユニットエコノミクス", "5フォースとバリューチェーン", "競争優位（モート）の5類型", "価格決定力の確かめ方", "モートが崩れるとき"] },
      { id: "ch09", n: "9", t: "業界分析", plan: ["業界構造と集中度", "市場規模（TAM・SAM・SOM）", "業界のライフサイクル", "景気敏感業種とディフェンシブ業種", "業界KPIの見つけ方", "業界レポート・統計の使い方"] },
      { id: "ch10", n: "10", t: "経営者・ガバナンス・資本配分", plan: ["経営者を評価する視点", "株主構成", "役員報酬と株式報酬", "取締役会の構成と独立性", "資本配分の5つの選択肢", "中期経営計画・決算説明会・招集通知の読み方"] },
      { id: "ch11", n: "11", t: "会計基準と注記を読みこなす", plan: ["日本基準・IFRS・米国基準の違い", "IFRS第18号と新リース会計基準", "セグメント情報", "注記の要所", "収益認識・減損・引当金と経営者の裁量", "「調整後利益」の読み方"] }
    ]},
    { part: "第3部", title: "バリュエーション", lv: "Lv.2〜3", ch: [
      { id: "ch12", n: "12", t: "資本コストと割引の考え方", plan: ["貨幣の時間価値", "リスクと要求収益率", "CAPMと株主資本コスト", "WACC", "日本企業の資本コストの目安", "割引率1%の重み"] },
      { id: "ch13", n: "13", t: "マルチプル法", plan: ["各マルチプルの使い分け", "類似会社比較の作り方", "理論PER", "理論PBRとPBR＝ROE×PER", "過去レンジ・業界間比較の注意点", "マルチプルが「安い理由」を読む"] },
      { id: "ch14", n: "14", t: "DCF法", plan: ["DCFの考え方", "FCFFとFCFE", "予測期間の組み立て", "ターミナルバリュー", "企業価値から株主価値へ", "感度分析と典型的な間違い10選"] },
      { id: "ch15", n: "15", t: "配当割引・残余利益モデル・EVA", plan: ["DDMとゴードン成長モデル", "多段階DDM", "残余利益モデル", "EVAとMVA", "「ROE−資本コスト」とPBR", "モデルの使い分け"] },
      { id: "ch16", n: "16", t: "業績予想モデルの作り方", plan: ["売上ドライバーの分解", "費用のモデル化", "3表連動モデルの骨組み", "運転資本・設備投資・減価償却の予測", "シナリオ設計", "会社計画・コンセンサスとの比較"] }
    ]},
    { part: "第4部", title: "投資スタイルと銘柄発掘", lv: "Lv.2〜3", ch: [
      { id: "ch17", n: "17", t: "バリュー投資", plan: ["グレアムの思想と安全域", "ネットネット株・資産バリュー", "低PER・低PBR戦略の実証と限界", "バリュートラップの見分け方", "カタリスト", "「素晴らしい企業を適正価格で」"] },
      { id: "ch18", n: "18", t: "グロース投資とGARP", plan: ["フィッシャーの15のポイント", "リンチの6分類", "PEGレシオとGARP", "成長の質", "小型成長株と流動性", "テンバガーの共通点と罠"] },
      { id: "ch19", n: "19", t: "クオリティ・高配当・株主還元", plan: ["クオリティの定義", "複利マシン", "高配当株と利回りの罠", "連続増配・累進配当・総還元性向・DOE", "減配リスクの見抜き方", "配当と自社株買いの比較"] },
      { id: "ch20", n: "20", t: "スクリーニングと銘柄発掘", plan: ["スクリーニング条件の設計", "魔法の公式", "ピオトロスキーのFスコア", "アイデアの出所", "ウォッチリストの運用", "定性分析への橋渡し"] }
    ]},
    { part: "第5部", title: "応用編Ⅰ　高度な企業分析", lv: "Lv.3〜4", ch: [
      { id: "ch21", n: "21", t: "利益の質と粉飾の見抜き方", plan: ["利益の質とは", "アクルーアルと営業CF対純利益", "売上債権・在庫・資産計上費用の異常", "Beneish M-Score", "警告サイン（監査人・内部統制・開示遅延）", "事例研究：エンロン・オリンパス・東芝・ワイヤーカード"] },
      { id: "ch22", n: "22", t: "財務危機と倒産の予兆", plan: ["倒産の典型パターン", "Altman Zスコア", "継続企業の前提に関する注記", "財務制限条項・格付け・社債スプレッド", "資金繰り悪化のサイン", "増資・債務再編局面の株主価値"] },
      { id: "ch23", n: "23", t: "ROICと価値創造", plan: ["投下資本とNOPAT", "ROICツリー", "成長率＝再投資率×ROIC", "ROIC−WACCスプレッドと企業価値", "インクリメンタルROIC", "のれん・リース・研究開発費の調整"] },
      { id: "ch24", n: "24", t: "資本政策とM&Aの分析", plan: ["最適資本構成とレバレッジ", "自社株買いの価値効果", "増資・第三者割当・CBの希薄化分析", "配当政策とシグナリング", "買収側企業の評価（シナジー・PPA・のれん）", "のれん減損の予兆と買収巧者の見分け方"] },
      { id: "ch25", n: "25", t: "業種別分析Ⅰ　金融", plan: ["金融株にEV/EBITDAが使えない理由", "銀行", "保険（生保・損保）", "証券・アセットマネジメント", "ノンバンク・リース", "金融株のバリュエーション"] },
      { id: "ch26", n: "26", t: "業種別分析Ⅱ　景気循環・製造業・資源・商社", plan: ["景気循環株のPERの逆説", "正常化利益", "在庫循環・受注残・稼働率", "資源・素材と商品価格感応度", "総合商社とSOTP", "自動車・機械・化学・鉄鋼の指標"] },
      { id: "ch27", n: "27", t: "業種別分析Ⅲ　テック・SaaS・半導体・バイオ", plan: ["SaaSの指標（ARR・NRR・Rule of 40・LTV/CAC）", "赤字SaaSの見方", "プラットフォームとネットワーク効果", "半導体サイクル", "バイオのrNPV", "株式報酬と希薄化"] },
      { id: "ch28", n: "28", t: "業種別分析Ⅳ　小売・消費・不動産・REIT・インフラ", plan: ["小売（既存店・出店・在庫）", "消費財", "外食・サービス", "不動産（含み益とNAV）", "REIT（FFO・NAV倍率・LTV）", "電力・ガス・通信・鉄道"] }
    ]},
    { part: "第6部", title: "応用編Ⅱ　高度なバリュエーション", lv: "Lv.4", ch: [
      { id: "ch29", n: "29", t: "応用バリュエーションⅠ　SOTP・リバースDCF・赤字成長企業", plan: ["SOTPとコングロマリット・ディスカウント", "リバースDCF", "赤字成長企業の評価", "シナリオ加重評価", "持株会社・上場子会社を持つ企業", "潜在株式を含む1株価値"] },
      { id: "ch30", n: "30", t: "応用バリュエーションⅡ　買収価格・LBO・清算価値・CAPE・リアルオプション", plan: ["支配権プレミアム", "LBO分析", "清算価値・解散価値", "景気調整PER（CAPE）", "リアルオプション", "手法の総合と「価値の幅」"] }
    ]},
    { part: "第7部", title: "応用編Ⅲ　市場・イベント・マクロ", lv: "Lv.3〜4", ch: [
      { id: "ch31", n: "31", t: "決算イベント分析", plan: ["決算サプライズ", "進捗率と季節性", "業績予想の修正と株価", "決算後ドリフト（PEAD）", "ガイダンスの保守性", "決算発表当日のチェックリスト"] },
      { id: "ch32", n: "32", t: "日本株固有のテーマ", plan: ["東証の市場改革", "PBR1倍割れ企業の改善策", "政策保有株の解消", "親子上場", "アクティビスト", "MBO・非公開化と少数株主保護"] },
      { id: "ch33", n: "33", t: "イベントドリブン投資", plan: ["TOB・MBO・スクイーズアウト", "合併裁定", "スピンオフ・事業売却", "指数への採用・除外", "増資・自社株買い・株式分割", "上場廃止リスク"] },
      { id: "ch34", n: "34", t: "米国株の企業分析", plan: ["10-K・10-Q・8-K・Proxy", "GAAPとNon-GAAP", "株式報酬（SBC）", "ガイダンス文化と決算シーズン", "米国企業の資本配分", "日本株との違い"] },
      { id: "ch35", n: "35", t: "マクロ環境と企業業績", plan: ["金利と株価倍率", "為替感応度", "インフレと価格転嫁力", "景気サイクルとセクター", "原材料・エネルギー", "マクロに頼りすぎない分析"] },
      { id: "ch36", n: "36", t: "クオンツ・ファンダメンタル", plan: ["ファクター投資の基礎", "日本株のファクター", "マルチファクター・スコアリング", "バックテストの罠", "個別分析との組み合わせ", "個人投資家の定量ツール"] }
    ]},
    { part: "第8部", title: "実行と管理", lv: "Lv.3〜4", ch: [
      { id: "ch37", n: "37", t: "投資仮説・投資メモ・売却判断", plan: ["投資仮説の書き方", "追跡すべきKPI", "決算ごとの仮説検証", "プレモーテム", "売るべき3つの場面", "投資日誌"] },
      { id: "ch38", n: "38", t: "ポートフォリオ構築と資金管理", plan: ["集中と分散", "ポジションサイズ", "ケリー基準", "相関・セクター・ファクターの偏り", "リバランス・買い増しのルール", "成績評価"] },
      { id: "ch39", n: "39", t: "投資家心理と行動バイアス", plan: ["確証バイアスとアンカリング", "損失回避・処分効果・サンクコスト", "ナラティブの罠と過信", "群集心理とバブル", "チェックリストと記録", "長く続けるための心構え"] }
    ]},
    { part: "第9部", title: "通し演習", lv: "", ch: [
      { id: "ws1", n: "演1", t: "1社を丸ごと分析する（ミナモ精機）", plan: ["決算書5期分の読み込み", "財務分析と同業比較", "競争優位の評価", "業績予想モデル", "DCFとマルチプル", "投資メモと売買判断"] },
      { id: "ws2", n: "演2", t: "割安株か罠か（低PBR企業の分析）", plan: ["PBR0.6倍の理由を探る", "資産の質と含み益", "資本効率改善の余地", "残余利益モデルによる評価", "カタリストとシナリオ", "結論と投資メモ"] }
    ]},
    { part: "第10部", title: "習熟度テスト", lv: "", ch: [
      { id: "ex1", n: "試1", t: "Lv.1 初級認定試験", plan: ["第0〜6章の範囲"] },
      { id: "ex2", n: "試2", t: "Lv.2 中級認定試験", plan: ["第7〜16章の範囲"] },
      { id: "ex3", n: "試3", t: "Lv.3 上級認定試験", plan: ["第17〜28章の範囲"] },
      { id: "ex4", n: "試4", t: "Lv.4 マスター試験", plan: ["第29〜39章と通し演習の範囲"] }
    ]},
    { part: "第11部", title: "小話", lv: "", ch: [
      { id: "hist", n: "話1", t: "ファンダメンタルズ投資の歴史", plan: ["『証券分析』から現代まで"] },
      { id: "legends", n: "話2", t: "名投資家列伝", plan: ["グレアム・フィッシャー・バフェット・リンチほか"] }
    ]},
    { part: "第12部", title: "質問コーナー", lv: "", ch: [
      { id: "qa", n: "Q&A", t: "質問コーナー", plan: ["読者からの質問と回答"] }
    ]},
    { part: "付録", title: "", lv: "", ch: [
      { id: "glossary", n: "A", t: "用語集（日英対照）", plan: [] },
      { id: "formulas", n: "B", t: "指標・公式集", plan: [] },
      { id: "checklist", n: "C", t: "分析チェックリスト集", plan: [] },
      { id: "kpi", n: "D", t: "業種別KPI早見表", plan: [] },
      { id: "refs", n: "E", t: "参考資料・データソース", plan: [] }
    ]}
  ];
  // Chapters whose files are published. Kept as one list so a release is a one-line change.
  var READY = "ch00 ch01 ch02 ch03 ch04 ch05 ch06 ch07 ch08 ch09 ch10 ch11 ch12 ch13".split(" ");

  var FLAT = [];
  PARTS.forEach(function (p) { p.ch.forEach(function (c) { c.partRef = p; c.ready = READY.indexOf(c.id) >= 0; FLAT.push(c); }); });
  function findCh(id) { for (var i = 0; i < FLAT.length; i++) if (FLAT[i].id === id) return i; return -1; }

  // ----- per-viewer progress (convenience only) ----------------------------
  var DONE_KEY = "fundbook-done-v1";
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
    return '<section class="hero"><p class="eyebrow">企業分析から価値評価・応用戦略まで</p><h1>ファンダメンタルズ投資完全読本</h1>' +
      '<p class="hero-sub">決算書の読み方から、財務分析、競争優位、DCF・残余利益モデル、業種別の分析、粉飾の見抜き方、日本株固有のテーマ、決算イベント、ポートフォリオ運用まで。数値例はすべて実際に計算し、試算ツールで前提を動かして確かめられます。</p>' +
      '<div class="bar" aria-hidden="true"><span style="width:' + Math.round(100 * doneCount / FLAT.length) + '%"></span></div>' +
      '<p class="eyebrow" style="margin-top:6px">読了 ' + doneCount + " 章　／　公開済み " + readyCount + " 章　／　全 " + FLAT.length + " 章</p></section>" +
      "<h2>学習の4段階</h2>" +
      '<div class="levels"><div><b>Lv.1 基礎</b>決算書と基本の投資指標が読める</div><div><b>Lv.2 中級</b>財務分析と基本的な価値評価ができる</div><div><b>Lv.3 応用</b>業種別の分析・利益の質・特殊な状況に対応できる</div><div><b>Lv.4 上級</b>高度な価値評価を組み立て、ポートフォリオとして運用できる</div></div>' +
      '<h2>全体の流れ</h2><ol class="roadmap">' + rows + "</ol>" +
      '<p><a href="#ch00">第0部「本書の使い方とファンダメンタルズ投資の全体像」から読み始める →</a></p>' +
      '<p class="eyebrow" style="margin-top:24px">本書は投資判断の参考となる知識を解説するもので、特定の銘柄の売買を勧めるものではありません。</p>';
  }

  function soonPage(c) {
    var plan = (c.plan || []).map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("");
    return '<div class="soon-page"><p class="eyebrow">' + esc(c.partRef.part + (c.partRef.title ? "　" + c.partRef.title : "")) + "</p><h1>" + esc(c.t) + "</h1>" +
      "<p>この章は執筆中です。扱う予定の内容は次のとおりです。</p>" + (plan ? '<ul class="plan">' + plan + "</ul>" : "") + "</div>";
  }

  function pager(i) {
    var prev = FLAT[i - 1], next = FLAT[i + 1];
    return '<nav class="pager" aria-label="前後の章">' +
      (prev ? '<a class="prev" href="#' + prev.id + '">← ' + esc(prev.t) + "</a>" : "<span></span>") +
      (next ? '<a class="next" href="#' + next.id + '">' + esc(next.t) + " →</a>" : "") + "</nav>";
  }

  function doneToggle(id) {
    return '<label class="done-toggle"><input type="checkbox" id="done-' + id + '"' + (done[id] ? " checked" : "") + "> この章を読み終えた</label>";
  }

  var cache = {};
  function route() {
    var hash = decodeURIComponent((location.hash || "").replace(/^#/, ""));
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
      renderAll(main);
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

  // ----- finance helpers (usable inside data-expr / calc expressions) -------
  var F = {
    pv: function (r, n, fv) { return fv / Math.pow(1 + r, n); },
    fv: function (r, n, pv) { return pv * Math.pow(1 + r, n); },
    // cfs[0] arrives at t=1
    npv: function (r, cfs) { var s = 0; for (var i = 0; i < cfs.length; i++) s += cfs[i] / Math.pow(1 + r, i + 1); return s; },
    // cfs[0] at t=0 (usually negative)
    irr: function (cfs) {
      var lo = -0.99, hi = 10, f = function (r) { var s = 0; for (var i = 0; i < cfs.length; i++) s += cfs[i] / Math.pow(1 + r, i); return s; };
      var flo = f(lo), fhi = f(hi); if (flo * fhi > 0) return NaN;
      for (var k = 0; k < 200; k++) { var m = (lo + hi) / 2, fm = f(m); if (flo * fm <= 0) { hi = m; fhi = fm; } else { lo = m; flo = fm; } }
      return (lo + hi) / 2;
    },
    gordon: function (cf1, r, g) { return r > g ? cf1 / (r - g) : NaN; },
    annuity: function (r, n) { return r === 0 ? n : (1 - Math.pow(1 + r, -n)) / r; },
    cagr: function (a, b, n) { return a > 0 && b > 0 ? Math.pow(b / a, 1 / n) - 1 : NaN; },
    capm: function (rf, beta, mrp) { return rf + beta * mrp; },
    wacc: function (e, d, re, rd, t) { return (e * re + d * rd * (1 - t)) / (e + d); },
    // Two-stage DCF of a cash flow stream: fcf0 = last actual, grows at g1 for n years, then g2 forever; discounted at r.
    dcf: function (fcf0, g1, n, g2, r) {
      if (r <= g2) return NaN;
      var s = 0, cf = fcf0;
      for (var t = 1; t <= n; t++) { cf *= 1 + g1; s += cf / Math.pow(1 + r, t); }
      return s + cf * (1 + g2) / (r - g2) / Math.pow(1 + r, n);
    },
    // Terminal value share of a dcf() result
    tvshare: function (fcf0, g1, n, g2, r) {
      var total = F.dcf(fcf0, g1, n, g2, r); if (!isFinite(total)) return NaN;
      var cf = fcf0 * Math.pow(1 + g1, n);
      return cf * (1 + g2) / (r - g2) / Math.pow(1 + r, n) / total;
    },
    // Residual income, steady state: book b0 earning roe forever, book grows at g.
    rim: function (b0, roe, r, g) { return r > g ? b0 + b0 * (roe - r) / (r - g) : NaN; },
    // Theoretical multiples from ROE, cost of equity r and growth g (g = ROE × retention).
    pbr: function (roe, r, g) { return r > g ? (roe - g) / (r - g) : NaN; },
    per: function (roe, r, g) { return r > g ? (1 - g / roe) / (r - g) : NaN; },
    kelly: function (p, b) { return p - (1 - p) / b; },
    clamp: function (x, a, b) { return Math.max(a, Math.min(b, x)); },
    sum: function (a) { return a.reduce(function (s, x) { return s + x; }, 0); },
    range: function (n) { var a = []; for (var i = 0; i < n; i++) a.push(i); return a; }
  };
  var FN = Object.keys(F);
  // Variable names win over helper names (an input called "per" hides the per() helper).
  function compile(expr, names) {
    var keys = FN.filter(function (k) { return names.indexOf(k) < 0; });
    try { var fn = new Function(names.concat(keys, ["Math"]).join(","), '"use strict"; return (' + expr + ");"); fn._keys = keys; return fn; }
    catch (e) { return null; }
  }
  function evalWith(fn, names, vals) {
    if (!fn) return NaN;
    try { return fn.apply(null, vals.concat(fn._keys.map(function (k) { return F[k]; }), [Math])); } catch (e) { return NaN; }
  }

  // ----- number formats ------------------------------------------------------
  // f: pct | pct0 | pct1 | pct2 | x | x1 | x2 | yen | yen1 | oku | oku1 | man | num | num0 | num1 | num2 | yr | raw
  function fmtv(v, f, plus) {
    if (v == null || typeof v !== "number" || !isFinite(v)) return "—";
    f = f || "num";
    var m = /^([a-z]+)(\d)?$/.exec(f) || ["", "num", null];
    var kind = m[1], d = m[2] != null ? +m[2] : null;
    var sign = plus && v > 0 ? "+" : "";
    function n(x, dd) { return x.toLocaleString("ja-JP", { maximumFractionDigits: dd, minimumFractionDigits: dd }); }
    if (kind === "pct") return sign + n(v * 100, d == null ? 1 : d) + "%";
    if (kind === "x") return sign + n(v, d == null ? 1 : d) + "倍";
    if (kind === "yen") return sign + n(v, d == null ? 0 : d) + "円";
    if (kind === "oku") return sign + n(v, d == null ? 0 : d) + "億円";
    if (kind === "man") return sign + n(v, d == null ? 0 : d) + "万円";
    if (kind === "yr") return sign + n(v, d == null ? 1 : d) + "年";
    if (kind === "raw") return String(v);
    var a = Math.abs(v);
    return sign + n(v, d != null ? d : a >= 1000 ? 0 : a >= 10 ? 1 : 2);
  }
  function tickFmt(v, f) {
    if (!f) return fmtv(v, "num");
    if (/^pct/.test(f)) return fmtv(v, "pct" + (Math.abs(v * 100 - Math.round(v * 100)) > 1e-9 ? "1" : "0"));
    if (f === "year") return String(Math.round(v));
    var m = /^([a-z]+)/.exec(f);
    return fmtv(v, m ? m[1] + (Math.abs(v - Math.round(v)) > 1e-9 ? "1" : "0") : "num");
  }

  // ----- chart helpers -----------------------------------------------------
  var uid = 0;
  function niceTicks(lo, hi, n) {
    var span = hi - lo; if (span <= 0) return [lo];
    var step = Math.pow(10, Math.floor(Math.log10(span / n)));
    var err = (n * step) / span;
    if (err <= 0.15) step *= 10; else if (err <= 0.35) step *= 5; else if (err <= 0.75) step *= 2;
    var out = [], start = Math.ceil(lo / step - 1e-9) * step;
    for (var x = start; x <= hi + step * 1e-9; x += step) out.push(Math.abs(x) < step * 1e-9 ? 0 : +x.toPrecision(12));
    return out;
  }
  function attr(el, name, dflt) { var v = el.getAttribute("data-" + name); return v == null || v === "" ? dflt : v; }
  function num(el, name, dflt) { var v = el.getAttribute("data-" + name); return v == null || v === "" ? dflt : parseFloat(v); }
  function parseList(s) { return (s || "").split(",").map(function (x) { return parseFloat(x); }).filter(function (x) { return isFinite(x); }); }
  function parseLabels(s) { return (s || "").split(",").map(function (x) { return x.trim(); }); }
  function json(el, name, dflt) {
    var s = el.getAttribute("data-" + name); if (s == null || s === "") return dflt;
    try { return JSON.parse(s); } catch (e) { return undefined; }
  }
  function broken(el, what) { el.classList.add("chart"); el.innerHTML = '<p class="chart-caption">（図の設定に誤りがあります：' + esc(what) + "）</p>"; }

  var COLORS = ["var(--fg)", "var(--accent)", "var(--curve2)", "var(--curve3)", "var(--gain)", "var(--loss)", "var(--muted)"];
  var NAMED = { fg: "var(--fg)", accent: "var(--accent)", teal: "var(--curve2)", curve2: "var(--curve2)", orange: "var(--curve3)", curve3: "var(--curve3)", gain: "var(--gain)", loss: "var(--loss)", muted: "var(--muted)", gold: "var(--gold)" };
  function colorOf(s, i) { return s && s.color ? (NAMED[s.color] || COLORS[(+s.color || 0) % COLORS.length]) : COLORS[i % COLORS.length]; }

  var W = 640, H = 300, PL = 64, PR = 16, PT = 18, PB = 34;
  function sizeFor(el, hRatio) {
    var w = el.clientWidth || 640;
    W = Math.max(320, Math.min(640, Math.round(w - 24)));
    H = W < 480 ? Math.round(W * (hRatio || 0.7)) : 300;
    PL = W < 480 ? 50 : 64; PB = 34; PT = 18; PR = 16;
  }
  function textW(s) { var w = 0; for (var i = 0; i < s.length; i++) w += s.charCodeAt(i) > 255 ? 11 : 6.4; return w; }

  function frame(xlo, xhi, ylo, yhi, o) {
    o = o || {};
    var sx = function (x) { return PL + (x - xlo) / (xhi - xlo) * (W - PL - PR); };
    var sy = function (y) { return PT + (yhi - y) / (yhi - ylo) * (H - PT - PB); };
    var g = "";
    niceTicks(ylo, yhi, 5).forEach(function (t) {
      g += '<line x1="' + PL + '" x2="' + (W - PR) + '" y1="' + sy(t) + '" y2="' + sy(t) + '" stroke="var(--line)" stroke-width="1"/>' +
        '<text x="' + (PL - 6) + '" y="' + (sy(t) + 4) + '" text-anchor="end">' + esc(tickFmt(t, o.yfmt)) + "</text>";
    });
    if (o.xticks !== false) {
      niceTicks(xlo, xhi, W < 480 ? 4 : 6).forEach(function (t) {
        g += '<line x1="' + sx(t) + '" x2="' + sx(t) + '" y1="' + (H - PB) + '" y2="' + (H - PB + 4) + '" stroke="var(--muted)"/>' +
          '<text x="' + sx(t) + '" y="' + (H - PB + 16) + '" text-anchor="middle">' + esc(tickFmt(t, o.xfmt)) + "</text>";
      });
    }
    if (ylo < 0 && yhi > 0) g += '<line x1="' + PL + '" x2="' + (W - PR) + '" y1="' + sy(0) + '" y2="' + sy(0) + '" stroke="var(--fg)" stroke-width="1.1"/>';
    if (o.xlabel) g += '<text x="' + (W - PR) + '" y="' + (H - 2) + '" text-anchor="end">' + esc(o.xlabel) + "</text>";
    if (o.ylabel) g += '<text x="' + 4 + '" y="' + (PT - 6) + '" text-anchor="start">' + esc(o.ylabel) + "</text>";
    return { sx: sx, sy: sy, grid: g };
  }
  function pathOf(pts, sx, sy) {
    var d = "", pen = false;
    pts.forEach(function (p) { if (isFinite(p[1])) { d += (pen ? "L" : "M") + sx(p[0]).toFixed(1) + "," + sy(p[1]).toFixed(1); pen = true; } else pen = false; });
    return d;
  }
  function yBounds(vals, o) {
    var ys = vals.filter(function (v) { return isFinite(v); });
    if (!ys.length) ys = [0, 1];
    var lo = Math.min.apply(null, ys), hi = Math.max.apply(null, ys);
    if (o.zero !== false) { lo = Math.min(lo, 0); hi = Math.max(hi, 0); }
    if (o.ymin != null) lo = o.ymin; if (o.ymax != null) hi = o.ymax;
    var pad = (hi - lo) * 0.08 || Math.abs(hi) * 0.1 || 1;
    if (o.ymin == null && !(o.zero !== false && lo === 0)) lo -= pad;
    if (o.ymax == null) hi += pad;
    return [lo, hi];
  }
  function wrap(el, title, svg, extra) {
    el.classList.add("chart");
    el.innerHTML = (title ? '<p class="chart-title">' + esc(title) + "</p>" : "") + svg + (extra || "") +
      (el.getAttribute("data-caption") ? '<p class="chart-caption">' + esc(el.getAttribute("data-caption")) + "</p>" : "");
  }
  function legend(series) {
    if (series.length < 2 && !(series[0] && series[0].name)) return "";
    return '<div class="chart-key">' + series.map(function (s, i) {
      return '<span><i style="border-color:' + colorOf(s, i) + (s.dash ? ";border-top-style:dashed" : "") + '"></i>' + esc(s.name || "") + "</span>";
    }).join("") + "</div>";
  }

  // ----- line chart ----------------------------------------------------------
  // Categorical: <div class="linechart" data-x="2021,2022,2023" data-series='[{"name":"売上高","values":[1,2,3]}]'></div>
  // Function:    <div class="linechart" data-xrange="0,0.1" data-xfmt="pct" data-vars='{"r":0.08}'
  //                   data-series='[{"name":"理論PER","expr":"per(0.1, r, x)"}]'></div>
  // Options: data-yfmt, data-ylabel, data-xlabel, data-ymin, data-ymax, data-zero="0", data-points="1", data-title, data-caption
  // series: {name, values|expr, color, dash, labels:true (print values)}
  function renderLine(el) {
    sizeFor(el);
    var series = json(el, "series", []); if (!series || !series.length) return broken(el, "data-series");
    var vars = json(el, "vars", {}) || {}, vn = Object.keys(vars), vv = vn.map(function (k) { return vars[k]; });
    var xr = parseList(attr(el, "xrange", "")), cats = null, xs;
    if (xr.length === 2) {
      xs = []; for (var i = 0; i <= 160; i++) xs.push(xr[0] + (xr[1] - xr[0]) * i / 160);
      series.forEach(function (s) {
        if (s.expr) { var fn = compile(s.expr, ["x"].concat(vn)); s.pts = xs.map(function (x) { return [x, evalWith(fn, [], [x].concat(vv))]; }); }
        else if (s.xy) s.pts = s.xy;
      });
    } else {
      cats = parseLabels(attr(el, "x", "")); if (!cats.length) return broken(el, "data-x");
      series.forEach(function (s) { s.pts = (s.values || []).map(function (v, j) { return [j, v == null ? NaN : v]; }); });
      xr = [-0.35, cats.length - 0.65];
    }
    var all = []; series.forEach(function (s) { s.pts.forEach(function (p) { all.push(p[1]); }); });
    var yb = yBounds(all, { zero: attr(el, "zero", "1") !== "0", ymin: num(el, "ymin", null), ymax: num(el, "ymax", null) });
    var yfmt = attr(el, "yfmt", null);
    var f = frame(xr[0], xr[1], yb[0], yb[1], { yfmt: yfmt, xfmt: attr(el, "xfmt", null), xlabel: attr(el, "xlabel", ""), ylabel: attr(el, "ylabel", ""), xticks: !cats });
    var svg = '<svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="' + esc(attr(el, "title", "折れ線グラフ")) + '">' + f.grid;
    if (cats) {
      var step = Math.max(1, Math.ceil(cats.length * 46 / (W - PL - PR)));
      cats.forEach(function (c, j) {
        if (j % step && j !== cats.length - 1) return;
        svg += '<text x="' + f.sx(j) + '" y="' + (H - PB + 16) + '" text-anchor="middle">' + esc(c) + "</text>";
      });
    }
    var vlines = json(el, "vlines", []) || [];
    vlines.forEach(function (v) {
      var x = cats ? v.at : v.x; if (x == null) return;
      svg += '<line x1="' + f.sx(x) + '" x2="' + f.sx(x) + '" y1="' + PT + '" y2="' + (H - PB) + '" stroke="var(--muted)" stroke-dasharray="3 3"/>' +
        (v.label ? '<text x="' + (f.sx(x) + 3) + '" y="' + (PT + 10) + '">' + esc(v.label) + "</text>" : "");
    });
    var hlines = json(el, "hlines", []) || [];
    hlines.forEach(function (h) {
      svg += '<line x1="' + PL + '" x2="' + (W - PR) + '" y1="' + f.sy(h.y) + '" y2="' + f.sy(h.y) + '" stroke="var(--muted)" stroke-dasharray="3 3"/>' +
        (h.label ? '<text x="' + (W - PR - 2) + '" y="' + (f.sy(h.y) - 4) + '" text-anchor="end">' + esc(h.label) + "</text>" : "");
    });
    series.forEach(function (s, k) {
      var c = colorOf(s, k);
      svg += '<path d="' + pathOf(s.pts, f.sx, f.sy) + '" fill="none" stroke="' + c + '" stroke-width="' + (k === 0 ? 2.4 : 1.9) + '" stroke-linejoin="round"' + (s.dash ? ' stroke-dasharray="6 4"' : "") + "/>";
      if (cats && attr(el, "points", "1") !== "0") s.pts.forEach(function (p) { if (isFinite(p[1])) svg += '<circle cx="' + f.sx(p[0]).toFixed(1) + '" cy="' + f.sy(p[1]).toFixed(1) + '" r="2.8" fill="' + c + '"/>'; });
      if (s.labels) s.pts.forEach(function (p, j) {
        if (!isFinite(p[1]) || (cats && cats.length > 8 && j % 2 && j !== s.pts.length - 1)) return;
        svg += '<text class="bar-lbl" x="' + f.sx(p[0]).toFixed(1) + '" y="' + (f.sy(p[1]) - 7).toFixed(1) + '" text-anchor="middle">' + esc(fmtv(p[1], yfmt || "num")) + "</text>";
      });
    });
    svg += "</svg>";
    wrap(el, attr(el, "title", ""), svg, legend(series));
  }

  // ----- bar chart -----------------------------------------------------------
  // <div class="barchart" data-labels="A社,B社" data-series='[{"name":"営業利益率","values":[0.1,0.2]}]'
  //      data-yfmt="pct" data-stacked="1" data-values="1"></div>
  function renderBar(el) {
    sizeFor(el);
    var labels = parseLabels(attr(el, "labels", "")), series = json(el, "series", []);
    if (!labels.length || !series || !series.length) return broken(el, "data-labels / data-series");
    var stacked = attr(el, "stacked", "0") === "1", yfmt = attr(el, "yfmt", null), showV = attr(el, "values", "1") === "1";
    var n = labels.length, plotW = W - PL - PR, slot = plotW / n;
    var maxLbl = Math.max.apply(null, labels.map(textW));
    var rot = maxLbl > slot - 4;
    if (rot) PB = Math.min(110, 18 + maxLbl * 0.72);
    var vals = [];
    if (stacked) {
      for (var j = 0; j < n; j++) { var p = 0, q = 0; series.forEach(function (s) { var v = s.values[j] || 0; if (v >= 0) p += v; else q += v; }); vals.push(p, q); }
    } else series.forEach(function (s) { vals = vals.concat(s.values); });
    var yb = yBounds(vals, { ymin: num(el, "ymin", null), ymax: num(el, "ymax", null) });
    var f = frame(0, n, yb[0], yb[1], { yfmt: yfmt, ylabel: attr(el, "ylabel", ""), xticks: false });
    var svg = '<svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="' + esc(attr(el, "title", "棒グラフ")) + '">' + f.grid;
    var gw = slot * 0.72, bw = stacked ? gw : gw / series.length, y0 = f.sy(0);
    var hlIdx = parseList(attr(el, "highlight", ""));
    for (j = 0; j < n; j++) {
      var x0 = PL + slot * j + (slot - gw) / 2, posTop = 0, negBot = 0;
      series.forEach(function (s, k) {
        var v = s.values[j]; if (v == null || !isFinite(v)) return;
        var c = s.color ? colorOf(s, k) : series.length === 1 ? (hlIdx.indexOf(j) >= 0 ? "var(--curve3)" : v < 0 ? "var(--loss)" : "var(--accent)") : colorOf(s, k + 1);
        var x, ya, yb2;
        if (stacked) { x = x0; if (v >= 0) { ya = f.sy(posTop + v); yb2 = f.sy(posTop); posTop += v; } else { ya = f.sy(negBot); yb2 = f.sy(negBot + v); negBot += v; } }
        else { x = x0 + bw * k; ya = f.sy(Math.max(v, 0)); yb2 = f.sy(Math.min(v, 0)); }
        svg += '<rect x="' + x.toFixed(1) + '" y="' + ya.toFixed(1) + '" width="' + Math.max(1, bw - 1.5).toFixed(1) + '" height="' + Math.max(0.5, yb2 - ya).toFixed(1) + '" fill="' + c + '" rx="1.5"/>';
        if (showV && !stacked && bw > 18) svg += '<text class="bar-lbl" x="' + (x + bw / 2).toFixed(1) + '" y="' + (v >= 0 ? ya - 4 : yb2 + 12).toFixed(1) + '" text-anchor="middle">' + esc(fmtv(v, yfmt || "num")) + "</text>";
      });
      if (showV && stacked && bw > 18) svg += '<text class="bar-lbl" x="' + (x0 + gw / 2).toFixed(1) + '" y="' + (f.sy(posTop) - 4).toFixed(1) + '" text-anchor="middle">' + esc(fmtv(posTop + negBot, yfmt || "num")) + "</text>";
      var cx = PL + slot * (j + 0.5);
      svg += rot
        ? '<text x="' + cx + '" y="' + (H - PB + 12) + '" text-anchor="end" transform="rotate(-40 ' + cx + " " + (H - PB + 12) + ')">' + esc(labels[j]) + "</text>"
        : '<text x="' + cx + '" y="' + (H - PB + 16) + '" text-anchor="middle">' + esc(labels[j]) + "</text>";
    }
    svg += '<line x1="' + PL + '" x2="' + (W - PR) + '" y1="' + y0 + '" y2="' + y0 + '" stroke="var(--fg)" stroke-width="1.1"/></svg>';
    var key = series.length > 1 ? '<div class="chart-key">' + series.map(function (s, k) { return '<span><i style="border-color:' + (s.color ? colorOf(s, k) : colorOf(s, k + 1)) + ';border-top-width:8px"></i>' + esc(s.name || "") + "</span>"; }).join("") + "</div>" : "";
    wrap(el, attr(el, "title", ""), svg, key);
  }

  // ----- waterfall (horizontal, phone friendly) ------------------------------
  // <div class="waterfall" data-fmt="oku" data-steps='[{"label":"売上高","value":1000,"total":true},
  //      {"label":"売上原価","value":-680},{"label":"売上総利益","total":true}]'></div>
  // total:true without value = running subtotal. "sub":true draws a subtotal without resetting.
  function renderWaterfall(el) {
    var w = el.clientWidth || 640; W = Math.max(320, Math.min(640, Math.round(w - 24)));
    var steps = json(el, "steps", []); if (!steps || !steps.length) return broken(el, "data-steps");
    var fmt = attr(el, "fmt", "num"), run = 0, rows = [];
    steps.forEach(function (s) {
      if (s.total) { var v = s.value != null ? s.value : run; rows.push({ label: s.label, a: 0, b: v, v: v, kind: "total" }); run = v; }
      else { rows.push({ label: s.label, a: run, b: run + s.value, v: s.value, kind: s.value >= 0 ? "up" : "down" }); run += s.value; }
    });
    var lo = 0, hi = 0; rows.forEach(function (r) { lo = Math.min(lo, r.a, r.b); hi = Math.max(hi, r.a, r.b); });
    var LW = Math.min(W * 0.36, Math.max.apply(null, rows.map(function (r) { return textW(r.label); })) + 10);
    var VW = 74, rowH = 26, top = 6, h = top + rows.length * rowH + 8;
    var x0 = LW + 4, x1 = W - VW, sx = function (x) { return x0 + (x - lo) / ((hi - lo) || 1) * (x1 - x0); };
    var svg = '<svg viewBox="0 0 ' + W + " " + h + '" role="img" aria-label="' + esc(attr(el, "title", "ウォーターフォール図")) + '">';
    svg += '<line x1="' + sx(0) + '" x2="' + sx(0) + '" y1="' + top + '" y2="' + (h - 6) + '" stroke="var(--fg)" stroke-width="1"/>';
    rows.forEach(function (r, i) {
      var y = top + i * rowH, xa = sx(Math.min(r.a, r.b)), xb = sx(Math.max(r.a, r.b));
      var c = r.kind === "total" ? "var(--accent)" : r.kind === "up" ? "var(--gain)" : "var(--loss)";
      svg += '<text class="lbl" x="' + LW + '" y="' + (y + 17) + '" text-anchor="end"' + (r.kind === "total" ? ' font-weight="700"' : "") + ">" + esc(r.label) + "</text>" +
        '<rect x="' + xa.toFixed(1) + '" y="' + (y + 5) + '" width="' + Math.max(1.5, xb - xa).toFixed(1) + '" height="' + (rowH - 10) + '" fill="' + c + '" rx="1.5"/>' +
        '<text class="bar-lbl" x="' + (xb + 4).toFixed(1) + '" y="' + (y + 17) + '">' + esc(fmtv(r.v, fmt, r.kind !== "total")) + "</text>";
      if (i < rows.length - 1) { var nx = sx(r.b); svg += '<line x1="' + nx.toFixed(1) + '" x2="' + nx.toFixed(1) + '" y1="' + (y + rowH - 5) + '" y2="' + (y + rowH + 5) + '" stroke="var(--muted)" stroke-dasharray="2 2"/>'; }
    });
    svg += "</svg>";
    wrap(el, attr(el, "title", ""), svg, '<div class="chart-key"><span><i style="border-color:var(--accent);border-top-width:8px"></i>合計・小計</span><span><i style="border-color:var(--gain);border-top-width:8px"></i>増加</span><span><i style="border-color:var(--loss);border-top-width:8px"></i>減少</span></div>');
  }

  // ----- scatter -------------------------------------------------------------
  // <div class="scatter" data-points='[{"x":0.05,"y":0.8,"label":"A"}]' data-xfmt="pct" data-yfmt="x" data-fit="1"></div>
  function renderScatter(el) {
    sizeFor(el, 0.8);
    var pts = json(el, "points", []); if (!pts || !pts.length) return broken(el, "data-points");
    var xs = pts.map(function (p) { return p.x; }), ys = pts.map(function (p) { return p.y; });
    var xb = yBounds(xs, { zero: attr(el, "xzero", "0") === "1", ymin: num(el, "xmin", null), ymax: num(el, "xmax", null) });
    var yb = yBounds(ys, { zero: attr(el, "zero", "0") === "1", ymin: num(el, "ymin", null), ymax: num(el, "ymax", null) });
    var f = frame(xb[0], xb[1], yb[0], yb[1], { xfmt: attr(el, "xfmt", null), yfmt: attr(el, "yfmt", null), xlabel: attr(el, "xlabel", ""), ylabel: attr(el, "ylabel", "") });
    var svg = '<svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="' + esc(attr(el, "title", "散布図")) + '">' + f.grid, extra = "";
    if (attr(el, "fit", "0") === "1" && pts.length > 2) {
      var n = pts.length, mx = F.sum(xs) / n, my = F.sum(ys) / n, sxy = 0, sxx = 0, syy = 0;
      pts.forEach(function (p) { sxy += (p.x - mx) * (p.y - my); sxx += (p.x - mx) * (p.x - mx); syy += (p.y - my) * (p.y - my); });
      var b = sxy / sxx, a = my - b * mx, r2 = sxy * sxy / (sxx * syy);
      svg += '<path d="M' + f.sx(xb[0]).toFixed(1) + "," + f.sy(a + b * xb[0]).toFixed(1) + "L" + f.sx(xb[1]).toFixed(1) + "," + f.sy(a + b * xb[1]).toFixed(1) + '" stroke="var(--curve3)" stroke-width="1.6" stroke-dasharray="6 4" fill="none"/>';
      extra = '<p class="chart-note">回帰直線（破線）：y ＝ ' + esc(fmtv(a, "num2")) + " ＋ " + esc(fmtv(b, "num2")) + " × x　決定係数 R² ＝ " + esc(fmtv(r2, "num2")) + "</p>";
    }
    pts.forEach(function (p, i) {
      var c = p.color ? (NAMED[p.color] || "var(--accent)") : "var(--accent)";
      svg += '<circle cx="' + f.sx(p.x).toFixed(1) + '" cy="' + f.sy(p.y).toFixed(1) + '" r="4.2" fill="' + c + '" fill-opacity=".85" stroke="var(--surface)" stroke-width="1"/>';
      if (p.label) svg += '<text class="bar-lbl" x="' + (f.sx(p.x) + 6).toFixed(1) + '" y="' + (f.sy(p.y) - 5).toFixed(1) + '">' + esc(p.label) + "</text>";
    });
    svg += "</svg>";
    wrap(el, attr(el, "title", ""), svg, extra);
  }

  // ----- sensitivity table -----------------------------------------------------
  // <div class="sens" data-rowvar="r" data-rows="0.07,0.08,0.09" data-colvar="g" data-cols="0.01,0.015,0.02"
  //      data-vars='{"fcf":100,"net":-200,"sh":10}' data-expr="(dcf(fcf,0.05,5,g,r)-net)/sh" data-fmt="yen"
  //      data-rowfmt="pct" data-colfmt="pct" data-base="0.08,0.015" data-rowlabel="割引率" data-collabel="永久成長率"></div>
  function renderSens(el) {
    var rows = parseList(attr(el, "rows", "")), cols = parseList(attr(el, "cols", ""));
    var rv = attr(el, "rowvar", "r"), cv = attr(el, "colvar", "g");
    var vars = json(el, "vars", {}) || {}, vn = Object.keys(vars), vv = vn.map(function (k) { return vars[k]; });
    var fn = compile(attr(el, "expr", "NaN"), [rv, cv].concat(vn));
    if (!rows.length || !cols.length || !fn) return broken(el, "data-rows / data-cols / data-expr");
    var fmt = attr(el, "fmt", "num"), rf = attr(el, "rowfmt", "pct"), cf = attr(el, "colfmt", "pct");
    var base = parseList(attr(el, "base", "")), baseV = base.length === 2 ? evalWith(fn, [], [base[0], base[1]].concat(vv)) : NaN;
    var grid = rows.map(function (r) { return cols.map(function (c) { return evalWith(fn, [], [r, c].concat(vv)); }); });
    var flat = [].concat.apply([], grid).filter(isFinite), lo = Math.min.apply(null, flat), hi = Math.max.apply(null, flat);
    var ref = isFinite(baseV) ? baseV : (lo + hi) / 2;
    var cmp = parseFloat(attr(el, "compare", "")); if (isFinite(cmp)) ref = cmp;
    var h = '<div class="tbl"><table><tr><th class="corner">' + esc(attr(el, "rowlabel", rv)) + " ＼ " + esc(attr(el, "collabel", cv)) + "</th>" +
      cols.map(function (c) { return '<th class="r">' + esc(fmtv(c, cf)) + "</th>"; }).join("") + "</tr>";
    grid.forEach(function (row, i) {
      h += "<tr><th>" + esc(fmtv(rows[i], rf)) + "</th>";
      row.forEach(function (v, j) {
        var isBase = base.length === 2 && Math.abs(rows[i] - base[0]) < 1e-9 && Math.abs(cols[j] - base[1]) < 1e-9;
        var t = !isFinite(v) ? 0 : v >= ref ? (hi > ref ? (v - ref) / (hi - ref) : 0) : -(lo < ref ? (ref - v) / (ref - lo) : 0);
        var bg = t > 0 ? "rgba(23,128,90," + (0.06 + 0.22 * t).toFixed(3) + ")" : t < 0 ? "rgba(194,59,51," + (0.06 + 0.22 * -t).toFixed(3) + ")" : "transparent";
        h += '<td class="r' + (isBase ? " base" : "") + '" style="background:' + bg + '">' + esc(fmtv(v, fmt)) + "</td>";
      });
      h += "</tr>";
    });
    h += "</table></div>";
    el.classList.add("chart");
    el.innerHTML = (attr(el, "title", "") ? '<p class="chart-title">' + esc(attr(el, "title", "")) + "</p>" : "") + h +
      '<p class="chart-note">' + (base.length === 2 ? "太枠＝基本ケース。" : "") + (isFinite(cmp) ? "緑＝" + esc(fmtv(cmp, fmt)) + "より高い、赤＝低い。" : "緑＝基本ケースより高い、赤＝低い。") + "表の値はページ上で計算しています。</p>" +
      (el.getAttribute("data-caption") ? '<p class="chart-caption">' + esc(el.getAttribute("data-caption")) + "</p>" : "");
  }

  // ----- interactive calculator -------------------------------------------------
  // <div class="calc" data-title="理論PER" data-inputs='[{"id":"g","label":"成長率","min":0,"max":0.1,"step":0.005,"value":0.03,"fmt":"pct"}]'
  //      data-outputs='[{"label":"理論PER","expr":"per(roe,r,g)","fmt":"x","hl":true}]'></div>
  function renderCalc(el) {
    var ins = json(el, "inputs", []), outs = json(el, "outputs", []);
    if (!ins || !ins.length || !outs || !outs.length) return broken(el, "data-inputs / data-outputs");
    var vars = json(el, "vars", {}) || {}, vn = Object.keys(vars), vv = vn.map(function (k) { return vars[k]; });
    var names = ins.map(function (x) { return x.id; }).concat(vn);
    outs.forEach(function (o) { o.fn = compile(o.expr, names); });
    var id = "calc" + (++uid);
    var h = (attr(el, "title", "") ? '<p class="calc-title">' + esc(attr(el, "title", "")) + "</p>" : "") + '<div class="calc-inputs">';
    ins.forEach(function (x, i) {
      h += '<label for="' + id + "-" + i + '">' + esc(x.label) + '<span class="row"><input type="range" id="' + id + "-" + i + '" min="' + x.min + '" max="' + x.max + '" step="' + (x.step || (x.max - x.min) / 100) + '" value="' + x.value + '"><output></output></span></label>';
    });
    h += '</div><dl class="calc-out">' + outs.map(function (o) { return "<div" + (o.hl ? ' class="hl"' : "") + "><dt>" + esc(o.label) + "</dt><dd></dd></div>"; }).join("") + "</dl>" +
      (el.getAttribute("data-caption") ? '<p class="chart-caption">' + esc(el.getAttribute("data-caption")) + "</p>" : "");
    el.innerHTML = h;
    var ranges = el.querySelectorAll("input[type=range]"), outEls = el.querySelectorAll("output"), dds = el.querySelectorAll(".calc-out dd");
    function update() {
      var vals = Array.prototype.map.call(ranges, function (r) { return parseFloat(r.value); });
      vals.forEach(function (v, i) { outEls[i].textContent = fmtv(v, ins[i].fmt || "num"); });
      outs.forEach(function (o, i) { dds[i].textContent = fmtv(evalWith(o.fn, [], vals.concat(vv)), o.fmt || "num"); });
    }
    Array.prototype.forEach.call(ranges, function (r) { r.addEventListener("input", update); });
    update();
  }

  // ----- exam scoring (optional) -------------------------------------------------
  // <div class="quiz exam" data-key="B,A,D"> with radio groups name="q1".. inside each .q; a button.score-btn
  function wireExams(root) {
    Array.prototype.forEach.call(root.querySelectorAll(".quiz[data-key]"), function (qz) {
      var key = parseLabels(qz.getAttribute("data-key")), btn = qz.querySelector(".score-btn"), out = qz.querySelector(".score-out");
      if (!btn) return;
      btn.addEventListener("click", function () {
        var ok = 0;
        key.forEach(function (k, i) { var c = qz.querySelector('input[name="q' + (i + 1) + '"]:checked'); if (c && c.value === k) ok++; });
        if (out) out.textContent = key.length + "問中 " + ok + "問正解（" + Math.round(100 * ok / key.length) + "点）";
      });
    });
  }

  function each(root, sel, fn) {
    Array.prototype.forEach.call(root.querySelectorAll(sel), function (el) {
      try { fn(el); } catch (e) { broken(el, String(e && e.message || e)); }
    });
  }
  function renderAll(root) {
    each(root, ".linechart", renderLine);
    each(root, ".barchart", renderBar);
    each(root, ".waterfall", renderWaterfall);
    each(root, ".scatter", renderScatter);
    each(root, ".sens", renderSens);
    each(root, ".calc", renderCalc);
    wireExams(root);
  }
  var lastW = window.innerWidth;
  window.addEventListener("resize", function () {
    if (Math.abs(window.innerWidth - lastW) < 40) return; lastW = window.innerWidth;
    each(main, ".linechart", renderLine); each(main, ".barchart", renderBar); each(main, ".waterfall", renderWaterfall); each(main, ".scatter", renderScatter);
  });

  window.FundBook = { F: F, fmt: fmtv, renderAll: renderAll, parts: PARTS };
  route();
})();
