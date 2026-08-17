import Link from "next/link";
import { getPublicCreates } from "@/lib/content";

const FALLBACK_CREATES = [
  { title: "月下猫与纱", image: "/assets/img/create-mooncat.jpg" },
  { title: "蝴蝶少女", image: "/assets/img/create-butterfly-girl.jpg" },
  { title: "紫蓝流体", image: "/assets/img/create-fluid-butterfly.jpg" },
];

export const metadata = {
  title: "创作集",
  description: "Pinkie 的 AI 生图、AI 视频与热门帖子合集",
};

export default async function CreatesPage() {
  let creates = FALLBACK_CREATES;
  try {
    const db = await getPublicCreates();
    if (db && db.length > 0) {
      creates = db.map((c) => ({
        title: c.title,
        image: c.image ?? "/assets/img/create-fluid-butterfly.jpg",
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
            <span className="pulse"></span>边玩边造
          </span>
          <h1 className="display">
            不止写代码
            <br />
            <span className="gradient-text">也造画面</span>
          </h1>
          <p className="hero__sub lead muted">
            AI 生图、AI 视频，以及一些反响不错的小红书帖子。下面是部分作品。
          </p>
        </div>
      </section>

      <section className="section create-section" id="images">
        <div className="container">
          <div className="section-head reveal">
            <p className="eyebrow">AI 生图</p>
            <h2 className="section-title">用提示词造出来的图</h2>
            <p className="lead muted">
              从概念到成片，都是和模型来回磨出来的。
            </p>
          </div>
          <div className="create-grid">
            {creates.map((c) => (
              <a className="create-card reveal" href="#" key={c.title}>
                <div className="create-card__media">
                  <img src={c.image} alt={c.title} loading="lazy" />
                </div>
                <div className="create-card__body">
                  <h3 className="create-card__title">{c.title}</h3>
                  <div className="create-card__meta">
                    <span className="tag">AI 生图</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ textAlign: "center" }}>
          <div className="reveal">
            <h2 className="section-title">想看更多，或一起 vibe？</h2>
            <div className="hero__cta" style={{ justifyContent: "center" }}>
              <Link className="btn btn--primary btn--lg" href="/contact">
                发起对话 →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
