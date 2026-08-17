import Link from "next/link";
import { getFeaturedWorks } from "@/lib/content";

type CoverClass = "cover--cyan" | "cover--mixed" | "cover--gold" | "cover--purple";

const FALLBACK_COVER: Record<string, { cover: string; coverClass: CoverClass; alt: string }> = {
  paopao: {
    cover: "/assets/img/shot-paopao-1.png",
    coverClass: "cover--cyan",
    alt: "泡泡看市 截图",
  },
  pillowmist: {
    cover: "/assets/img/shot-pillowmist.png",
    coverClass: "cover--mixed",
    alt: "枕边雾 截图",
  },
  ideaboom: {
    cover: "/assets/img/shot-ideaboom-1.png",
    coverClass: "cover--gold",
    alt: "灵感炸了 截图",
  },
  cosmicbug: {
    cover: "/assets/img/shot-cosmicbug-1.jpg",
    coverClass: "cover--purple",
    alt: "宇宙草台班子大质检 截图",
  },
};

const FALLBACK_WORKS = [
  {
    slug: "paopao",
    title: "泡泡看市",
    summary: "AI 智能投研，用大白话把当天大盘讲给你听。",
    tags: ["多agent分析", "个股&板块分析", "热点事件拆解"],
  },
  {
    slug: "pillowmist",
    title: "枕边雾",
    summary: "深夜才打开的情绪容器，用「雾」收下难安放的情绪。",
    tags: ["失眠疗愈"],
  },
  {
    slug: "ideaboom",
    title: "灵感炸了",
    summary: "把想选题和跟爆款二创，变成有方法、有评分的确定性动作。",
    tags: ["选题神器"],
  },
  {
    slug: "cosmicbug",
    title: "宇宙草台班子大质检",
    summary: "输入授权码解锁的 AI 质检台，专治各种草台班子。",
    tags: ["人格测试"],
  },
];

function parseTags(raw: string): string[] {
  try {
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  let works = FALLBACK_WORKS;
  try {
    const db = await getFeaturedWorks();
    if (db && db.length > 0) {
      works = db.map((w) => ({
        slug: w.slug,
        title: w.title,
        summary: w.summary,
        tags: parseTags(w.tags),
      }));
    }
  } catch {
    // 数据库不可用时回退到静态数据
  }

  return (
    <main>
      <section className="hero">
        <div className="container hero__inner">
          <span className="status-pill">
            <span className="pulse"></span>正在 vibe · 接受新项目
          </span>
          <h1 className="display hero__name">
            <span>P</span>
            <span>i</span>
            <span>n</span>
            <span>k</span>
            <span>i</span>
            <span>e</span>
          </h1>
          <p className="hero__sub lead muted">
            喜欢通过 vibecoding 将产品构想转化为可运行的代码，
            用 AI 拓展创造力的边界，专注于构建有温度的交互体验。
            <br />
            联系邮箱：a273894731@gmail.com
          </p>
          <div className="kw-bar">
            <span className="kw-chip kw-chip--identity">Vibe Coder</span>
            <span className="kw-chip kw-chip--identity">多agent产品设计</span>
            <span className="kw-chip kw-chip--identity">
              从 0 到 1 的践行者
            </span>
          </div>
        </div>
      </section>

      <div className="marquee" aria-hidden="true">
        <div className="marquee__track">
          <span>✦ prompt engineering</span>
          <span>✦ rapid prototyping</span>
          <span>✦ design systems</span>
          <span>✦ AI agents</span>
          <span>✦ shipping fast</span>
          <span>✦ prompt engineering</span>
          <span>✦ rapid prototyping</span>
          <span>✦ design systems</span>
          <span>✦ AI agents</span>
          <span>✦ shipping fast</span>
        </div>
      </div>

      <section className="section" id="works">
        <div className="container">
          <div className="section-head reveal">
            <p className="eyebrow">精选作品</p>
            <h2 className="section-title">最近在 vibe 的东西</h2>
            <p className="lead muted">从工具到玩具，都是和 AI 边聊边做出来的。</p>
          </div>
          <div className="work-grid">
            {works.map((w) => {
              const cover = FALLBACK_COVER[w.slug];
              return (
                <Link
                  key={w.slug}
                  className="work-card reveal"
                  data-tilt
                  href={`/work/${w.slug}`}
                >
                  {cover ? (
                    <div className={`work-card__cover ${cover.coverClass}`}>
                      <img src={cover.cover} alt={cover.alt} loading="lazy" />
                    </div>
                  ) : (
                    <div className="work-card__cover">
                      <span className="work-card__emoji">✦</span>
                    </div>
                  )}
                  <div className="work-card__body">
                    <h3 className="work-card__title">{w.title}</h3>
                    <p className="work-card__desc">{w.summary}</p>
                    <div className="work-card__meta">
                      <span className="tag-row">
                        {w.tags.map((t) => (
                          <span className="tag" key={t}>
                            {t}
                          </span>
                        ))}
                      </span>
                      <span className="work-card__link">详情 →</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section" id="creates">
        <div className="container">
          <div className="section-head reveal">
            <p className="eyebrow">创作</p>
            <h2 className="section-title">不止写代码，也造画面</h2>
            <p className="lead muted">AI 生图，用提示词把脑中的画面磨成现实。</p>
          </div>
          <div className="teaser-grid">
            <Link className="teaser reveal" href="/creates#images">
              <div className="teaser__thumbs">
                <img
                  src="/assets/img/create-mooncat.jpg"
                  alt="AI 生图作品"
                  loading="lazy"
                />
                <img
                  src="/assets/img/create-butterfly-girl.jpg"
                  alt="AI 生图作品"
                  loading="lazy"
                />
                <img
                  src="/assets/img/create-fluid-butterfly.jpg"
                  alt="AI 生图作品"
                  loading="lazy"
                />
              </div>
              <div className="teaser__title">AI 生图</div>
              <p className="teaser__desc">
                用提示词生成的系列图像，从概念到成片。
              </p>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
