import Link from "next/link";
import { notFound } from "next/navigation";
import { getWorkBySlug } from "@/lib/content";

type WorkSlug = "paopao" | "pillowmist" | "ideaboom" | "cosmicbug";

interface StaticWork {
  title: string;
  slug: WorkSlug;
  description: string;
  tags: string[];
  links?: { label: string; href: string; primary?: boolean }[];
  images: { src: string; alt: string }[];
  body: {
    heading: string;
    content?: string;
    list?: { strong: string; desc: string }[];
  }[];
  codeBlock?: { eyebrow: string; code: string; hint: React.ReactNode };
  prev: { slug: WorkSlug; title: string } | null;
  next: { slug: WorkSlug; title: string } | null;
}

const staticWorks: Record<WorkSlug, StaticWork> = {
  paopao: {
    title: "泡泡看市",
    slug: "paopao",
    description: "AI 智能投研 · 用大白话 5 分钟讲懂大盘，小白也能看懂。",
    tags: ["多agent分析", "个股&板块分析", "热点事件拆解"],
    links: [
      { label: "前往体验 ↗", href: "https://paopao.pixiepoppy.com/", primary: true },
      { label: "查看源码 ↗", href: "https://github.com/Pinkie-Pie-Lucky/gupiao" },
    ],
    images: [
      { src: "/assets/img/shot-paopao-1.png", alt: "泡泡看市 — 首页概览" },
      { src: "/assets/img/shot-paopao-2.png", alt: "泡泡看市 — 事件驱动弹窗" },
      { src: "/assets/img/shot-paopao-3.png", alt: "泡泡看市 — 市场地图" },
    ],
    body: [
      {
        heading: "问题",
        content:
          "看盘软件对普通人太不友好——满屏术语、曲线和缩写，想搞清楚「今天市场怎么了」反而更晕。普通投资者不是不想看，是看不懂、也没时间看。",
      },
      {
        heading: "痛点",
        content:
          "要么被信息淹没，要么被「专家」带着节奏走。缺一个耐心、中立、用大白话把当天市场讲清楚的角色。泡泡看市就是想补上这个位置：把专业数据翻译成人话。",
      },
      {
        heading: "核心能力",
        list: [
          { strong: "市场温度", desc: "一句话告诉你今天是冷是热、情绪偏多还是偏空。" },
          { strong: "强势板块", desc: "今天哪些方向在吸金，用排行讲清楚，不堆术语。" },
          { strong: "今日发生", desc: "把关键事件整理成几分钟能读完的简报。" },
          { strong: "双模式", desc: "小白模式讲人话，专业模式给数据，按你需要切换。" },
        ],
      },
    ],
    prev: { slug: "cosmicbug", title: "宇宙草台班子大质检" },
    next: { slug: "pillowmist", title: "枕边雾" },
  },
  pillowmist: {
    title: "枕边雾",
    slug: "pillowmist",
    description:
      "一处只为深夜打开的情绪容器。不急着分析、解决或评判，先让难安放的情绪以「雾」的方式被收下。",
    tags: ["失眠疗愈"],
    links: [{ label: "前往体验 ↗", href: "https://pillowmist.pixiepoppy.com/", primary: true }],
    images: [{ src: "/assets/img/shot-pillowmist.png", alt: "枕边雾 截图" }],
    body: [
      {
        heading: "问题",
        content:
          "失眠时的念头往往强烈、零碎，也更私密。它们不一定适合在白天被反复翻看，更不该成为日常生活的负担。可大多数人手边并没有一个「专门收下这些话」的地方。",
      },
      {
        heading: "痛点",
        content:
          "现有情绪工具要么逼你在白天复盘，要么把内容直接摊开——缺少一点距离与缓冲，反而成了新的压力。枕边雾想做的，是先把情绪遮蔽起来，给用户留出靠近自己的节奏。",
      },
      {
        heading: "核心能力",
        list: [
          { strong: "夜间雾卡记录", desc: "写下一句或一段深夜思绪，生成一张雾卡，并选择当下情绪的浓淡。" },
          { strong: "时间雾团首页", desc: "每条记录成为一个雾团，按时间自然分布、由雾线串联；首页不直显文字，保护私密。" },
          { strong: "擦雾阅读", desc: "点开雾团后点击或擦拭渐显内容，雾会在一段时间后重新聚拢，让阅读保持克制。" },
          { strong: "雾的归处", desc: "按月份的档案页，完整展示文字，支持搜索与月份筛选，随时「拨雾」回望。" },
          { strong: "雾灵陪伴", desc: "向雾灵低语，获得偏陪伴与反射式的回应，不评判、不说教。" },
        ],
      },
    ],
    prev: { slug: "paopao", title: "泡泡看市" },
    next: { slug: "ideaboom", title: "灵感炸了" },
  },
  ideaboom: {
    title: "灵感炸了",
    slug: "ideaboom",
    description:
      "把「从 0 想选题」和「跟爆款二创」这两件最痛的事，变成有方法、有评分、有合规底线的确定性动作。",
    tags: ["选题神器"],
    links: [
      { label: "前往体验 ↗", href: "https://ideaboom.pixiepoppy.com/", primary: true },
      { label: "查看源码 ↗", href: "https://github.com/Pinkie-Pie-Lucky/IdeaBoom" },
    ],
    images: [
      { src: "/assets/img/shot-ideaboom-1.png", alt: "灵感炸了 — AI 智能选题" },
      { src: "/assets/img/shot-ideaboom-2.png", alt: "灵感炸了 — 爆款仿写二创" },
      { src: "/assets/img/shot-ideaboom-3.png", alt: "灵感炸了 — 同风二创方案" },
    ],
    body: [
      {
        heading: "问题",
        content:
          "做内容的人常卡在三件事上：选题靠拍脑袋、爆款命中率低；热点切入点想得慢，等想到早已凉了；看到爆款想跟，却只会照搬或抄形不抄神。",
      },
      {
        heading: "痛点",
        content:
          "「想清楚发什么」和「把爆款拆明白再进化」是内容生产里最痛的两环，却长期靠感觉、靠运气，缺少可复用的方法。灵感炸了想把它们变成确定性动作。",
      },
      {
        heading: "核心能力",
        list: [
          { strong: "AI 智能选题", desc: "输入一份热点 / 趋势报告 + 参数，按 5 步流水线产出结构化选题：痛点挖掘 → 角度嫁接 → 传播锚点设计 → 爆款基因植入 → 质量门自评。" },
          { strong: "爆款仿写二创", desc: "输入一个爆款笔记链接或 ID，先结构拆解，再产出进化形态，不止抄形、更抄神。" },
          { strong: "质量门自评 & 合规底线", desc: "每个选题自带评分与合规检查，让「灵感觉炸」建立在方法与底线之上。" },
        ],
      },
    ],
    prev: { slug: "pillowmist", title: "枕边雾" },
    next: { slug: "cosmicbug", title: "宇宙草台班子大质检" },
  },
  cosmicbug: {
    title: "宇宙草台班子大质检",
    slug: "cosmicbug",
    description:
      "COSMIC QUALITY INSPECTION SYSTEM —— 一个要输入授权码才解锁的 AI 质检台。",
    tags: ["人格测试"],
    links: [
      { label: "前往体验 ↗", href: "https://cosmicbug.pixiepoppy.com/", primary: true },
      { label: "查看源码 ↗", href: "https://github.com/Pinkie-Pie-Lucky/cosmic-bug" },
    ],
    images: [
      { src: "/assets/img/shot-cosmicbug-1.jpg", alt: "宇宙草台班子大质检 — 首页诊断结果" },
      { src: "/assets/img/shot-cosmicbug-2.png", alt: "宇宙草台班子大质检 — 动手审题" },
      { src: "/assets/img/shot-cosmicbug-3.jpg", alt: "宇宙草台班子大质检 — BUG 详情" },
    ],
    body: [],
    codeBlock: {
      eyebrow: "体验授权码",
      code: "zia55",
      hint: (
        <>
          在{" "}
          <a
            href="https://cosmicbug.pixiepoppy.com/"
            target="_blank"
            rel="noopener"
            style={{ color: "var(--aurora-cyan)" }}
          >
            cosmicbug.pixiepoppy.com
          </a>{" "}
          输入即可解锁质检系统。
        </>
      ),
    },
    prev: { slug: "ideaboom", title: "灵感炸了" },
    next: { slug: "paopao", title: "泡泡看市" },
  },
};

function parseTags(raw: string): string[] {
  try {
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function generateStaticParams() {
  return Object.values(staticWorks).map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const staticWork = staticWorks[slug as WorkSlug];
  if (staticWork) return { title: staticWork.title };
  try {
    const dbWork = await getWorkBySlug(slug);
    if (dbWork) return { title: dbWork.title };
  } catch {
    // 数据库不可用时忽略
  }
  return { title: "作品" };
}

export default async function WorkDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const staticWork = staticWorks[slug as WorkSlug];

  let dbWork: Awaited<ReturnType<typeof getWorkBySlug>> | null = null;
  if (!staticWork) {
    try {
      dbWork = await getWorkBySlug(slug);
    } catch {
      dbWork = null;
    }
    if (!dbWork) notFound();
  }

  const work = staticWork ?? {
    title: dbWork!.title,
    slug,
    description: dbWork!.summary,
    tags: parseTags(dbWork!.tags),
    links: undefined,
    images: dbWork!.coverImage
      ? [{ src: dbWork!.coverImage, alt: dbWork!.title }]
      : [],
    body: dbWork!.body
      ? [
          {
            heading: "详情",
            content: dbWork!.body,
          },
        ]
      : [],
  };

  return (
    <main>
      <article className="section detail-hero">
        <div className="container">
          <Link className="back-link" href="/">
            ← 返回主页
          </Link>

          <div className="reveal" style={{ marginTop: "var(--sp-5)" }}>
            <p className="eyebrow">作品详情</p>
            <div className="detail-title-row">
              <h1 className="display" style={{ fontSize: "var(--fs-4xl)" }}>
                {work.title}
              </h1>
              {work.links?.map((l) => (
                <a
                  key={l.href}
                  className={`btn ${l.primary ? "btn--primary" : "btn--ghost"}`}
                  href={l.href}
                  target="_blank"
                  rel="noopener"
                >
                  {l.label}
                </a>
              ))}
            </div>
            <p className="lead muted" style={{ marginTop: "var(--sp-4)" }}>
              {work.description}
            </p>
            {work.tags.length > 0 && (
              <div className="tag-row" style={{ marginTop: "var(--sp-4)" }}>
                {work.tags.map((t) => (
                  <span className="tag" key={t}>
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>

          {work.images.length > 0 && (
            <div
              className="shot-gallery reveal"
              aria-label={`${work.title} 截图画廊`}
            >
              <div className="shot-gallery__track">
                {work.images.map((img) => (
                  <div className="shot-gallery__slide" key={img.src}>
                    <img src={img.src} alt={img.alt} loading="lazy" />
                  </div>
                ))}
              </div>
              <button
                className="shot-gallery__nav shot-gallery__nav--prev"
                type="button"
                aria-label="上一张"
              ></button>
              <button
                className="shot-gallery__nav shot-gallery__nav--next"
                type="button"
                aria-label="下一张"
              ></button>
              <div
                className="shot-gallery__dots"
                role="tablist"
                aria-label="截图导航"
              ></div>
            </div>
          )}

          {"codeBlock" in work && work.codeBlock && (
            <div
              className="reveal"
              style={{
                marginTop: "var(--sp-8)",
                padding: "var(--sp-5)",
                border: "1px dashed var(--border-med)",
                borderRadius: "var(--r-md)",
                background: "var(--bg-card)",
                maxWidth: 520,
              }}
            >
              <p className="eyebrow" style={{ margin: "0 0 var(--sp-2)" }}>
                {(work as StaticWork).codeBlock!.eyebrow}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--fs-2xl)",
                  color: "var(--text-strong)",
                  margin: 0,
                  letterSpacing: "0.1em",
                }}
              >
                {(work as StaticWork).codeBlock!.code}
              </p>
              <p className="muted" style={{ margin: "var(--sp-3) 0 0" }}>
                {(work as StaticWork).codeBlock!.hint}
              </p>
            </div>
          )}

          {work.body.map((section) => (
            <div className="prose reveal" key={section.heading}>
              <h3>{section.heading}</h3>
              {section.content && <p>{section.content}</p>}
              {section.list && (
                <ul className="feat-list">
                  {section.list.map((item) => (
                    <li key={item.strong}>
                      <strong>{item.strong}</strong> · {item.desc}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          {work.prev && (
            <nav className="detail-nav" aria-label="作品导航">
              <Link href={`/work/${work.prev.slug}`}>
                <div className="k">← 上一个</div>
                <div className="v">{work.prev.title}</div>
              </Link>
              {work.next && (
                <Link className="next" href={`/work/${work.next.slug}`}>
                  <div className="k">下一个 →</div>
                  <div className="v">{work.next.title}</div>
                </Link>
              )}
            </nav>
          )}
        </div>
      </article>
    </main>
  );
}
