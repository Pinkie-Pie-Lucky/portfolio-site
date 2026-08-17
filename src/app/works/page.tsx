import Link from "next/link";
import { getPublicWorks } from "@/lib/content";

type CoverClass = "cover--cyan" | "cover--mixed" | "cover--gold" | "cover--purple";

const FALLBACK_COVER: Record<string, { emoji: string; coverClass: CoverClass }> = {
  paopao: { emoji: "🫧", coverClass: "cover--cyan" },
  cosmicbug: { emoji: "🐛", coverClass: "cover--purple" },
  pillowmist: { emoji: "🌫️", coverClass: "cover--mixed" },
  ideaboom: { emoji: "💡", coverClass: "cover--gold" },
};

const FALLBACK_WORKS = [
  {
    slug: "paopao",
    title: "泡泡看市",
    summary: "AI 智能投研 · 用大白话 5 分钟讲懂大盘，小白也能看懂。",
    tags: ["AI", "投研", "数据"],
  },
  {
    slug: "cosmicbug",
    title: "宇宙草台班子大质检",
    summary: "COSMIC QUALITY INSPECTION SYSTEM · 输入授权码解锁的 AI 质检台。",
    tags: ["AI", "质检", "Agents"],
  },
  {
    slug: "pillowmist",
    title: "枕边雾",
    summary: "深夜才打开的情绪容器 · 用昼夜做边界，让难安放的情绪先以「雾」收下。",
    tags: ["AI", "情绪", "陪伴"],
  },
  {
    slug: "ideaboom",
    title: "灵感炸了",
    summary: "把「想选题」和「跟爆款二创」变成有方法、有评分、有合规底线的确定性动作。",
    tags: ["AI", "选题", "内容"],
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

export const metadata = {
  title: "作品",
};

export default async function WorksPage() {
  let works = FALLBACK_WORKS;
  try {
    const db = await getPublicWorks();
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
      <section
        className="section"
        style={{ paddingTop: "calc(var(--nav-h) + var(--sp-10))" }}
      >
        <div className="container">
          <div className="section-head reveal">
            <p className="eyebrow">全部作品</p>
            <h1 className="section-title">边 vibe 边攒的东西</h1>
            <p className="lead muted">
              工具、玩具、实验 —— 每个都附一句话和我是怎么做出来的。
            </p>
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
                  <div className={`work-card__cover ${cover?.coverClass ?? "cover--cyan"}`}>
                    <span className="work-card__emoji">{cover?.emoji ?? "✦"}</span>
                  </div>
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

          <p className="muted" style={{ marginTop: "var(--sp-6)" }}>
            更多在 vibe 中 —— 这个列表会持续更新。
          </p>
        </div>
      </section>
    </main>
  );
}
