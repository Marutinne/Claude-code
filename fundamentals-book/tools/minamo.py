# ミナモ精機（架空）: 5期分の整合した財務3表を生成する。単位：億円（株式数は百万株、1株指標は円）
import json
years = [2021, 2022, 2023, 2024, 2025]   # 3月決算。FY2025 = 2026年3月期
sales = [400.0, 432.0, 410.0, 452.0, 488.0]
gm    = [0.330, 0.335, 0.310, 0.338, 0.345]   # 売上総利益率
sga_r = [0.205, 0.200, 0.210, 0.202, 0.200]   # 販管費率（うち減価償却は原価・販管に含む）
da    = [16.0, 17.0, 18.0, 19.0, 20.0]        # 減価償却費
capex = [20.0, 24.0, 26.0, 22.0, 25.0]
nonop = [0.6, 0.8, 0.4, 1.0, 1.2]             # 営業外損益（純額：受取配当−支払利息など、利息以外）
interest_rate = 0.010
special = [0.0, 0.0, -6.0, 0.0, 1.5]          # 特別損益（2023年度：工場再編損、2025年度：投資有価証券売却益）
tax = 0.30
payout = 0.30
buyback = [0.0, 0.0, 0.0, 10.0, 15.0]
ar_d, inv_d, ap_d = 90, 75, 60                # 売掛金（売上比）、棚卸資産・買掛金（売上原価比）日数
inv_d_y = [75, 80, 92, 82, 78]                 # 2023年度は在庫が膨らむ
shares0 = 50.0                                 # 期首発行済（自己株除く）百万株
prices  = [1200, 1350, 1050, 1550, 1800]       # 期末株価（円）

# 期首（FY2020期末）B/S
cash, ar, inv, other_ca = 60.0, 98.0, 52.0, 10.0
ppe, intang, invsec = 150.0, 12.0, 30.0
ap, other_cl = 44.0, 30.0
debt = 80.0
equity = cash + ar + inv + other_ca + ppe + intang + invsec - ap - other_cl - debt
equity0 = equity
shares = shares0
rows = []
for i, y in enumerate(years):
    s = sales[i]; cogs = s * (1 - gm[i]); gp = s - cogs; sga = s * sga_r[i]; op = gp - sga
    int_exp = debt * interest_rate
    ordinary = op + nonop[i] - int_exp
    pretax = ordinary + special[i]
    ni = pretax * (1 - tax)
    bb_shares = buyback[i] * 100 / prices[i] if buyback[i] else 0.0
    shares_end = shares - bb_shares
    shares_avg = (shares + shares_end) / 2
    eps = ni * 100 / shares_avg      # 億円/百万株 → 円： 1億円/1百万株 = 100円
    dps = round(eps * payout / 5) * 5
    div = dps * shares_end / 100
    # working capital
    n_ar = s * ar_d / 365; n_inv = cogs * inv_d_y[i] / 365; n_ap = cogs * ap_d / 365
    d_wc = (n_ar - ar) + (n_inv - inv) - (n_ap - ap)
    cfo = ni + da[i] - d_wc - special[i] * (1 - 0) * (1 if special[i] > 0 else 0)  # 売却益は投資CFへ
    # 特別損失（工場再編損）は非資金の減損として扱う → 営業CFに足し戻す
    if special[i] < 0:
        cfo += -special[i]
        ppe -= -special[i]
    proceeds = 0.0
    if special[i] > 0:   # 投資有価証券売却：簿価6 → 売却額7.5
        proceeds = 6.0 + special[i]; invsec -= 6.0
    cfi = -capex[i] + proceeds
    fcf = cfo - capex[i]
    # financing: 2022年度 借入+10、2025年度 返済-15
    d_debt = {2022: 10.0, 2025: -15.0}.get(y, 0.0)
    cff = -div - buyback[i] + d_debt
    cash = cash + cfo + cfi + cff
    ppe = ppe + capex[i] - da[i]
    ar, inv, ap = n_ar, n_inv, n_ap
    debt += d_debt
    equity = equity + ni - div - buyback[i]
    assets = cash + ar + inv + other_ca + ppe + intang + invsec
    liab = ap + other_cl + debt
    chk = assets - liab - equity
    mcap = prices[i] * shares_end / 100
    ebitda = op + da[i]
    netdebt = debt - cash
    rows.append(dict(fy=y, label=f"{y+1}年3月期", sales=s, cogs=cogs, gp=gp, sga=sga, op=op, nonop=nonop[i], int_exp=int_exp,
        ordinary=ordinary, special=special[i], pretax=pretax, tax=pretax*tax, ni=ni, da=da[i], ebitda=ebitda,
        cash=cash, ar=ar, inv=inv, other_ca=other_ca, ppe=ppe, intang=intang, invsec=invsec, assets=assets,
        ap=ap, other_cl=other_cl, debt=debt, equity=equity, check=chk,
        cfo=cfo, capex=capex[i], cfi=cfi, cff=cff, fcf=fcf, div=div, buyback=buyback[i], d_wc=d_wc,
        shares_avg=shares_avg, shares_end=shares_end, eps=eps, dps=dps, bps=equity*100/shares_end, price=prices[i],
        mcap=mcap, netdebt=netdebt, ev=mcap+netdebt))
    shares = shares_end

prev_eq = equity0
for r in rows:
    eq_avg = r['equity'] if prev_eq is None else (r['equity'] + prev_eq) / 2
    r['roe'] = r['ni'] / eq_avg; prev_eq = r['equity']
    r['opm'] = r['op'] / r['sales']; r['per'] = r['price'] / r['eps']; r['pbr'] = r['price'] / r['bps']
    r['eq_ratio'] = r['equity'] / r['assets']; r['ev_ebitda'] = r['ev'] / r['ebitda']; r['div_yield'] = r['dps'] / r['price']
    r['payout'] = r['dps'] / r['eps']

def f(x, d=1): return f"{x:,.{d}f}"
keys = [("売上高","sales"),("売上原価","cogs"),("売上総利益","gp"),("販売費及び一般管理費","sga"),("営業利益","op"),
        ("営業外損益（利息除く、純額）","nonop"),("支払利息","int_exp"),("経常利益","ordinary"),("特別損益","special"),
        ("税引前当期純利益","pretax"),("法人税等（30%）","tax"),("当期純利益","ni"),("減価償却費","da"),("EBITDA","ebitda"),
        ("現金及び預金","cash"),("売掛金","ar"),("棚卸資産","inv"),("その他流動資産","other_ca"),("有形固定資産","ppe"),
        ("無形固定資産","intang"),("投資有価証券","invsec"),("資産合計","assets"),("買掛金","ap"),("その他流動負債","other_cl"),
        ("有利子負債","debt"),("純資産","equity"),("（検算：資産−負債−純資産）","check"),
        ("営業CF","cfo"),("うち運転資本の増加（−は減少）","d_wc"),("設備投資","capex"),("投資CF","cfi"),("財務CF","cff"),("FCF（営業CF−設備投資）","fcf"),
        ("配当総額","div"),("自社株買い","buyback"),
        ("期中平均株式数（百万株）","shares_avg"),("期末株式数（百万株）","shares_end"),("EPS（円）","eps"),("1株配当（円）","dps"),("BPS（円）","bps"),
        ("期末株価（円）","price"),("時価総額","mcap"),("純有利子負債","netdebt"),("EV","ev"),
        ("営業利益率","opm"),("ROE（期中平均）","roe"),("自己資本比率","eq_ratio"),("PER","per"),("PBR","pbr"),("EV/EBITDA","ev_ebitda"),("配当利回り","div_yield"),("配当性向","payout")]
pct = {"opm","roe","eq_ratio","div_yield","payout"}
xs = {"per","pbr","ev_ebitda"}
lines = ["| 項目 | " + " | ".join(r['label'] for r in rows) + " |", "|---|" + "---:|"*len(rows)]
for name, k in keys:
    vals = []
    for r in rows:
        v = r[k]
        if k in pct: vals.append(f"{v*100:.1f}%")
        elif k in xs: vals.append(f"{v:.1f}倍")
        elif k in ("price","dps"): vals.append(f"{v:,.0f}")
        elif k in ("eps","bps"): vals.append(f"{v:,.1f}")
        elif k in ("shares_avg","shares_end"): vals.append(f"{v:.2f}")
        else: vals.append(f(v))
    lines.append(f"| {name} | " + " | ".join(vals) + " |")
open('/home/user/Claude-code/fundamentals-book/tools/minamo_table.md','w').write("\n".join(lines)+"\n")
json.dump(rows, open('/home/user/Claude-code/fundamentals-book/tools/minamo.json','w'), ensure_ascii=False, indent=1)
print("\n".join(lines))
